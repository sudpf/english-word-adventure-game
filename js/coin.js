class Coin {
    constructor(x, y, letter, wordIndex = 0) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.letter = letter.toUpperCase();
        this.wordIndex = wordIndex;
        this.collected = false;
        
        this.baseY = y;
        this.floatOffset = 0;
        this.floatSpeed = 3;
        this.floatAmplitude = 8;
        
        this.rotation = 0;
        this.rotationSpeed = 2;
        
        this.scale = 1;
        this.pulseTimer = 0;
        this.pulseSpeed = 5;
        
        this.sparkles = [];
        this.sparkleTimer = 0;
    }

    update(deltaTime) {
        this.floatOffset = Math.sin(Date.now() / 1000 * this.floatSpeed) * this.floatAmplitude;
        this.y = this.baseY + this.floatOffset;
        
        this.rotation += this.rotationSpeed * deltaTime;
        
        this.pulseTimer += deltaTime * this.pulseSpeed;
        this.scale = 1 + Math.sin(this.pulseTimer) * 0.1;
        
        this.updateSparkles(deltaTime);
    }

    updateSparkles(deltaTime) {
        this.sparkleTimer += deltaTime;
        
        if (this.sparkleTimer >= 0.3) {
            this.sparkleTimer = 0;
            this.sparkles.push({
                x: this.x + Utils.randomFloat(0, this.width),
                y: this.y + Utils.randomFloat(0, this.height),
                size: Utils.randomFloat(2, 4),
                alpha: 1,
                velocityY: -Utils.randomFloat(20, 40)
            });
        }
        
        this.sparkles = this.sparkles.filter(sparkle => {
            sparkle.y += sparkle.velocityY * deltaTime;
            sparkle.alpha -= deltaTime * 2;
            return sparkle.alpha > 0;
        });
    }

    render(ctx) {
        if (this.collected) return;
        
        ctx.save();
        
        this.renderSparkles(ctx);
        
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        ctx.translate(centerX, centerY);
        
        // 增加3D翻转动画效果
        const flipScale = Math.cos(this.rotation);
        ctx.scale(this.scale * flipScale, this.scale);
        
        const radius = this.width / 2;

        // 1. 金币厚度/侧面 (3D效果)
        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.arc(0, 4, radius, 0, Math.PI * 2);
        ctx.fill();

        // 2. 金币正面
        const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
        gradient.addColorStop(0, '#FFF59D');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(0.7, '#FFA000');
        gradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 3. 内圈浮雕效果
        ctx.strokeStyle = '#FBC02D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
        ctx.stroke();
        
        // 高光效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-radius/3, -radius/3, radius/3, radius/6, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();

        // 4. 字母文字
        // 只有当硬币不是侧面时才显示字母（避免文字被压扁得太难看）
        if (Math.abs(flipScale) > 0.2) {
            // 文字朝向始终保持正向
            const textScale = flipScale > 0 ? 1 : -1;
            ctx.scale(textScale, 1);
            
            ctx.fillStyle = '#8B4513';
            ctx.font = '900 22px "Comic Sans MS", "Arial Rounded MT Bold", Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 文字内阴影/立体效果
            ctx.fillStyle = '#FFECB3';
            ctx.fillText(this.letter, -1, -1);
            ctx.fillStyle = '#D84315';
            ctx.fillText(this.letter, 1, 1);
            ctx.fillStyle = '#8B4513';
            ctx.fillText(this.letter, 0, 0);
        }
        
        ctx.restore();
    }

    renderSparkles(ctx) {
        this.sparkles.forEach(sparkle => {
            ctx.save();
            ctx.globalAlpha = sparkle.alpha;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    collect() {
        this.collected = true;
        audioManager.play('coin');
        audioManager.speakLetter(this.letter);
        
        return {
            letter: this.letter,
            wordIndex: this.wordIndex
        };
    }

    collidesWith(player) {
        if (this.collected) return false;
        return Utils.checkCollision(player, this);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class CoinGroup {
    constructor(word, startX, y, spacing = 60) {
        this.word = word.toUpperCase();
        this.coins = [];
        this.collectedLetters = [];
        this.isComplete = false;
        
        for (let i = 0; i < word.length; i++) {
            const coin = new Coin(startX + i * spacing, y, word[i], i);
            this.coins.push(coin);
        }
    }

    update(deltaTime) {
        this.coins.forEach(coin => coin.update(deltaTime));
    }

    render(ctx) {
        this.coins.forEach(coin => coin.render(ctx));
    }

    checkCollision(player) {
        for (const coin of this.coins) {
            if (!coin.collected && coin.collidesWith(player)) {
                const result = coin.collect();
                this.collectedLetters.push(result);
                
                if (this.collectedLetters.length === this.coins.length) {
                    this.isComplete = true;
                }
                
                return result;
            }
        }
        return null;
    }

    getProgress() {
        return this.collectedLetters.length;
    }

    getTotal() {
        return this.coins.length;
    }

    isCompleted() {
        return this.isComplete;
    }

    getCollectedWord() {
        return this.collectedLetters
            .sort((a, b) => a.wordIndex - b.wordIndex)
            .map(item => item.letter)
            .join('');
    }
}
