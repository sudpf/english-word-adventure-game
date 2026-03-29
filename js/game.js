class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1000;
        this.canvas.height = 600;
        
        this.state = 'menu';
        this.score = 0;
        this.coinsCollected = 0;
        this.wordsLearned = 0;
        this.currentLevel = 1;
        
        this.player = null;
        this.level = null;
        this.camera = null;
        this.currentWordDisplay = null;
        this.wordDisplayTimer = 0;
        
        this.keys = {
            left: false,
            right: false,
            up: false,
            jump: false
        };
        
        this.lastTime = 0;
        this.deltaTime = 0;
        
        this.particles = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAssets();
        this.gameLoop(0);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('resume-button').addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
        document.getElementById('play-again-button').addEventListener('click', () => this.restartGame());
    }

    handleKeyDown(e) {
        if (this.state !== 'playing') return;
        
        switch(e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = true;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.keys.up = true;
                break;
            case 'Space':
                this.keys.jump = true;
                e.preventDefault();
                break;
            case 'Escape':
                this.pauseGame();
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = false;
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.keys.up = false;
                break;
            case 'Space':
                this.keys.jump = false;
                break;
        }
    }

    async loadAssets() {
        try {
            await Promise.all([
                audioManager.loadSound('jump', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQkAO4TO9vJmGgA2fNn59WkYADuB2fz0aRgAO4HZ/PRpGAA7gdn89GkYADuB2fz0aRgAO4HZ/PRpGAA7gdn89GkYADuB2fz0aRgA=').catch(() => {}),
                audioManager.loadSound('coin', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQkAO4TO9vJmGgA2fNn59WkYADuB2fz0aRgA=').catch(() => {}),
                audioManager.loadSound('wordComplete', 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQkAO4TO9vJmGgA=').catch(() => {})
            ]);
        } catch (error) {
            console.log('Some audio assets failed to load, using fallback');
        }
    }

    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.coinsCollected = 0;
        this.wordsLearned = 0;
        this.currentLevel = 1;
        
        this.level = new Level(this.currentLevel);
        this.player = new Player(this.level.startPoint.x, this.level.startPoint.y, this.level.worldWidth);
        this.camera = new Camera(this.canvas.width, this.canvas.height, this.level.worldWidth);
        this.particles = [];
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('ui-overlay').classList.remove('hidden');
        
        this.updateUI();
        this.updateProgressBar();
    }

    pauseGame() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pause-screen').classList.remove('hidden');
        }
    }

    resumeGame() {
        if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }

    restartGame() {
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        this.startGame();
    }

    gameLoop(currentTime) {
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        if (this.deltaTime > 0.1) {
            this.deltaTime = 0.1;
        }
        
        this.update();
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update() {
        if (this.state !== 'playing') return;
        
        this.player.update(this.keys, this.level.platforms, this.deltaTime);
        this.camera.follow(this.player);
        this.level.update(this.deltaTime);
        
        this.checkCollisions();
        this.checkEnemyCollisions();
        this.checkFlagPole();
        this.updateParticles();
        this.updateWordDisplay();
        this.updateProgressBar();
        
        this.checkLevelComplete();
        this.checkReachSchool();
    }

    checkEnemyCollisions() {
        for (const enemy of this.level.enemies) {
            if (enemy.collidesWith(this.player)) {
                this.gameOver();
                return;
            }
        }
    }

    checkFlagPole() {
        if (this.level.flagPole && this.level.flagPole.checkPlayerReach(this.player)) {
            if (!this.level.flagPole.isRaising && !this.level.flagPole.isComplete) {
                this.level.flagPole.startRaising();
            }
            
            if (this.level.flagPole.isComplete) {
                this.levelComplete();
            }
        }
    }

    levelComplete() {
        this.currentLevel++;
        this.score += 200;
        
        this.showLevelCompleteScreen();
    }

    showLevelCompleteScreen() {
        this.state = 'levelComplete';
        
        const levelCompleteDiv = document.createElement('div');
        levelCompleteDiv.id = 'level-complete-screen';
        levelCompleteDiv.className = 'screen';
        levelCompleteDiv.innerHTML = `
            <h2>🎉 关卡 ${this.currentLevel - 1} 完成！</h2>
            <div id="level-stats">
                <p>分数: <span>${this.score}</span></p>
                <p>学习单词: <span>${this.wordsLearned}</span> 个</p>
                <p>收集金币: <span>${this.coinsCollected}</span> 个</p>
            </div>
            <button id="next-level-button" class="game-button">🎒 进入下一关</button>
        `;
        
        document.getElementById('game-container').appendChild(levelCompleteDiv);
        
        document.getElementById('next-level-button').addEventListener('click', () => {
            this.nextLevel();
        });
    }

    nextLevel() {
        const levelCompleteScreen = document.getElementById('level-complete-screen');
        if (levelCompleteScreen) {
            levelCompleteScreen.remove();
        }
        
        this.state = 'playing';
        this.level = new Level(this.currentLevel);
        this.player = new Player(this.level.startPoint.x, this.level.startPoint.y, this.level.worldWidth);
        this.camera = new Camera(this.canvas.width, this.canvas.height, this.level.worldWidth);
        this.particles = [];
        
        this.updateUI();
        this.updateProgressBar();
    }

    gameOver() {
        this.state = 'gameover';
        
        document.getElementById('game-result-title').textContent = '💀 游戏结束！';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('words-learned').textContent = this.wordsLearned;
        document.getElementById('coins-collected').textContent = this.coinsCollected;
        
        document.getElementById('game-over-screen').classList.remove('hidden');
        
        audioManager.play('gameOver');
    }

    checkCollisions() {
        const collisions = this.level.checkCoinCollisions(this.player);
        
        collisions.forEach(collision => {
            this.coinsCollected++;
            this.score += 10;
            
            this.createCoinParticles(collision.group.coins[collision.wordIndex]);
            
            if (collision.group.isCompleted()) {
                const word = collision.group.getCollectedWord();
                const meaning = wordManager.getWordMeaning(word);
                
                this.showWordDisplay(word, meaning);
                this.wordsLearned++;
                this.score += 50;
                
                wordManager.markWordLearned(word);
                audioManager.speakWord(word);
            }
            
            this.updateUI();
        });
    }

    createCoinParticles(coin) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: coin.x + coin.width / 2,
                y: coin.y + coin.height / 2,
                velocityX: Utils.randomFloat(-100, 100),
                velocityY: Utils.randomFloat(-150, -50),
                size: Utils.randomFloat(3, 6),
                color: '#FFD700',
                alpha: 1,
                life: 1
            });
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.velocityX * this.deltaTime;
            particle.y += particle.velocityY * this.deltaTime;
            particle.velocityY += 300 * this.deltaTime;
            particle.life -= this.deltaTime * 2;
            particle.alpha = particle.life;
            
            return particle.life > 0;
        });
    }

    showWordDisplay(word, meaning) {
        this.currentWordDisplay = { word, meaning };
        this.wordDisplayTimer = 3;
        
        const wordDisplay = document.getElementById('word-display');
        document.getElementById('current-word').textContent = word;
        document.getElementById('word-meaning').textContent = meaning;
        wordDisplay.classList.remove('hidden');
    }

    updateWordDisplay() {
        if (this.wordDisplayTimer > 0) {
            this.wordDisplayTimer -= this.deltaTime;
            if (this.wordDisplayTimer <= 0) {
                document.getElementById('word-display').classList.add('hidden');
                this.currentWordDisplay = null;
            }
        }
    }

    checkLevelComplete() {
        // Level is now completed by reaching the flag pole
        // See checkFlagPole method
    }

    checkReachSchool() {
        // Replaced by checkFlagPole
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('coins').textContent = this.coinsCollected;
        document.getElementById('words').textContent = this.wordsLearned;
        
        const levelDisplay = document.getElementById('level-display');
        if (levelDisplay) {
            levelDisplay.textContent = this.currentLevel;
        }
    }

    updateProgressBar() {
        if (!this.player || !this.level) return;
        
        const startX = this.level.startPoint.x;
        const endX = this.level.endPoint.x;
        const playerX = this.player.x;
        
        const progress = Utils.clamp((playerX - startX) / (endX - startX) * 100, 0, 100);
        
        const progressFill = document.getElementById('progress-fill');
        const playerMarker = document.getElementById('player-marker');
        
        if (progressFill && playerMarker) {
            progressFill.style.width = progress + '%';
            playerMarker.style.left = progress + '%';
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === 'menu') {
            this.renderMenuBackground();
        } else {
            this.camera.applyTransform(this.ctx);
            
            this.level.render(this.ctx, this.camera);
            this.player.render(this.ctx);
            this.renderParticles();
            
            this.camera.resetTransform(this.ctx);
        }
    }

    renderMenuBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 1000, 600);
    }

    renderParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
}
