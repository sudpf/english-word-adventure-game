class Level {
    constructor(levelNumber = 1) {
        this.levelNumber = levelNumber;
        this.platforms = [];
        this.coinGroups = [];
        this.enemies = [];
        this.flagPole = null;
        this.background = null;
        this.completed = false;
        
        this.worldWidth = 12000;
        this.worldHeight = 600;
        
        this.startPoint = { x: 100, y: 500 };
        this.endPoint = { x: 11700, y: 500, width: 150, height: 100 };
        
        this.generateLevel();
    }

    generateLevel() {
        this.createGround();
        this.createPlatforms();
        this.createCoinGroups();
        this.createEnemies();
        this.createFlagPole();
    }

    createGround() {
        for (let x = 0; x < this.worldWidth; x += 500) {
            const width = Math.min(500, this.worldWidth - x);
            this.platforms.push(new Platform(x, 560, width, 40, 'grass'));
        }
    }

    createPlatforms() {
        const platformConfigs = [];
        
        const numSections = Math.floor(this.worldWidth / 1000);
        
        for (let section = 0; section < numSections; section++) {
            const baseX = section * 1000;
            
            platformConfigs.push(
                { x: baseX + 150, y: 450, width: 150, height: 20, type: 'grass' },
                { x: baseX + 350, y: 380, width: 120, height: 20, type: 'normal' },
                { x: baseX + 550, y: 320, width: 150, height: 20, type: 'grass' },
                { x: baseX + 750, y: 400, width: 120, height: 20, type: 'stone' }
            );
            
            if (section % 2 === 0) {
                platformConfigs.push(
                    { x: baseX + 200, y: 280, width: 100, height: 20, type: 'normal' },
                    { x: baseX + 450, y: 220, width: 180, height: 20, type: 'grass' },
                    { x: baseX + 700, y: 250, width: 120, height: 20, type: 'stone' }
                );
            }
            
            if (section % 3 === 0) {
                platformConfigs.push(
                    { x: baseX + 100, y: 180, width: 120, height: 20, type: 'grass' },
                    { x: baseX + 600, y: 150, width: 150, height: 20, type: 'normal' }
                );
            }
        }
        
        platformConfigs.forEach(config => {
            if (config.x + config.width <= this.worldWidth) {
                this.platforms.push(new Platform(
                    config.x, 
                    config.y, 
                    config.width, 
                    config.height, 
                    config.type
                ));
            }
        });
    }

    createCoinGroups() {
        const numWords = Math.floor(this.worldWidth / 1000) * 3;
        const words = wordManager.getWordsForLevel(numWords);
        
        const positions = [];
        const numSections = Math.floor(this.worldWidth / 1000);
        
        for (let section = 0; section < numSections; section++) {
            const baseX = section * 1000;
            
            positions.push(
                { x: baseX + 180, y: 400 },
                { x: baseX + 380, y: 330 },
                { x: baseX + 580, y: 270 }
            );
        }
        
        words.forEach((wordData, index) => {
            if (index < positions.length) {
                const pos = positions[index];
                const spacing = 50;
                const coinGroup = new CoinGroup(
                    wordData.word,
                    pos.x,
                    pos.y,
                    spacing
                );
                this.coinGroups.push(coinGroup);
            }
        });
    }

    update(deltaTime) {
        this.coinGroups.forEach(group => group.update(deltaTime));
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        if (this.flagPole) {
            this.flagPole.update(deltaTime);
        }
    }

    render(ctx, camera) {
        this.renderBackground(ctx, camera);
        this.platforms.forEach(platform => {
            if (camera.isVisible(platform)) {
                platform.render(ctx);
            }
        });
        this.coinGroups.forEach(group => {
            group.coins.forEach(coin => {
                if (!coin.collected && camera.isVisible(coin)) {
                    coin.render(ctx);
                }
            });
        });
        this.enemies.forEach(enemy => {
            if (camera.isVisible(enemy)) {
                enemy.render(ctx);
            }
        });
        if (this.flagPole && camera.isVisible(this.flagPole)) {
            this.flagPole.render(ctx);
        }
        this.renderHome(ctx, camera);
        this.renderSchool(ctx, camera);
    }

    renderHome(ctx, camera) {
        const x = 20;
        const y = 460;
        
        if (!camera.isVisible({ x, y: y - 80, width: 100, height: 130 })) return;
        
        ctx.save();
        ctx.translate(x, y);

        // 房子主体阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(5, 5, 70, 50);

        // 房子主体
        ctx.fillStyle = '#FFE0B2'; // 暖黄色墙壁
        ctx.fillRect(0, 0, 70, 50);
        
        // 墙壁底部装饰
        ctx.fillStyle = '#FFCC80';
        ctx.fillRect(0, 40, 70, 10);
        
        // 烟囱
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(45, -45, 12, 25);
        ctx.fillStyle = '#B71C1C'; // 烟囱阴影
        ctx.fillRect(52, -45, 5, 25);
        // 烟囱顶
        ctx.fillStyle = '#212121';
        ctx.fillRect(43, -48, 16, 5);

        // 屋顶
        ctx.fillStyle = '#E53935'; // 红色屋顶
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(35, -40);
        ctx.lineTo(80, 0);
        ctx.closePath();
        ctx.fill();
        
        // 屋顶高光/瓦片细节
        ctx.fillStyle = '#EF5350';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(35, -30);
        ctx.lineTo(70, 0);
        ctx.closePath();
        ctx.fill();

        // 窗户
        ctx.fillStyle = '#81D4FA'; // 蓝色玻璃
        ctx.fillRect(10, 15, 20, 20);
        // 窗户边框
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 15, 20, 20);
        // 窗户十字
        ctx.beginPath();
        ctx.moveTo(20, 15); ctx.lineTo(20, 35);
        ctx.moveTo(10, 25); ctx.lineTo(30, 25);
        ctx.stroke();
        
        // 门
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.roundRect(40, 15, 20, 35, [8, 8, 0, 0]);
        ctx.fill();
        // 门把手
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(55, 35, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 文字标签
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#FFF';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText('🏠 家', 35, 80);
        
        ctx.restore();
    }

    renderSchool(ctx, camera) {
        const x = this.endPoint.x;
        const y = this.endPoint.y;
        
        if (!camera.isVisible({ x, y: y - 100, width: 140, height: 160 })) return;
        
        ctx.save();
        ctx.translate(x, y - 40);

        // 教学楼阴影
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(5, 5, 100, 75);

        // 教学楼主体
        ctx.fillStyle = '#FFECB3'; 
        ctx.fillRect(0, 0, 100, 75);
        
        // 底部台阶
        ctx.fillStyle = '#BCAAA4';
        ctx.fillRect(-10, 70, 120, 5);
        ctx.fillRect(-5, 75, 110, 5);

        // 屋顶
        ctx.fillStyle = '#1976D2'; // 蓝色屋顶
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(50, -35);
        ctx.lineTo(110, 0);
        ctx.closePath();
        ctx.fill();
        
        // 屋顶条纹/瓦片
        ctx.strokeStyle = '#1565C0';
        ctx.lineWidth = 2;
        for (let i = 0; i < 100; i += 15) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(50, -35);
            ctx.stroke();
        }

        // 时钟/校徽
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(50, -10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FBC02D';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#212121';
        ctx.beginPath(); // 时针分针
        ctx.moveTo(50, -10); ctx.lineTo(50, -16);
        ctx.moveTo(50, -10); ctx.lineTo(55, -8);
        ctx.stroke();

        // 窗户列
        const drawSchoolWindow = (wx, wy) => {
            ctx.fillStyle = '#B3E5FC';
            ctx.fillRect(wx, wy, 15, 20);
            ctx.strokeStyle = '#455A64';
            ctx.lineWidth = 2;
            ctx.strokeRect(wx, wy, 15, 20);
            ctx.beginPath();
            ctx.moveTo(wx, wy + 10); ctx.lineTo(wx + 15, wy + 10);
            ctx.stroke();
        };

        drawSchoolWindow(15, 15);
        drawSchoolWindow(70, 15);
        drawSchoolWindow(15, 45);
        drawSchoolWindow(70, 45);
        
        // 大门
        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.roundRect(40, 35, 20, 35, [10, 10, 0, 0]);
        ctx.fill();
        // 双开门中间的线
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 35);
        ctx.lineTo(50, 70);
        ctx.stroke();
        // 门把手
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(47, 55, 2, 0, Math.PI * 2);
        ctx.arc(53, 55, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 文字标签
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#FFF';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText('🏫 学校', 50, 110);
        
        ctx.restore();
        
        // 终点检测区域虚线框
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        ctx.strokeRect(x - 10, y - 85, 120, 160);
        ctx.restore();
    }

    renderBackground(ctx, camera) {
        // 1. 固定背景色（天空渐变）
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#4facfe');
        gradient.addColorStop(1, '#00f2fe');
        ctx.fillStyle = gradient;
        ctx.fillRect(camera.x, 0, camera.canvasWidth, 600);
        
        // 2. 太阳 (固定在屏幕右上角)
        ctx.save();
        ctx.fillStyle = 'rgba(255, 235, 59, 0.9)';
        ctx.shadowColor = '#FBC02D';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(camera.x + camera.canvasWidth - 100, 100, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. 远山 (视差层 1：移动非常慢)
        const mountainParallax = 0.8; 
        ctx.fillStyle = '#90CAF9';
        ctx.beginPath();
        // 为了确保山脉连续，我们基于摄像机位置和视差因子计算绘制范围
        const startMountainX = camera.x - (camera.x * mountainParallax) % 800 - 800;
        ctx.moveTo(startMountainX, 600);
        for (let i = 0; i < 5; i++) {
            const baseX = startMountainX + i * 800;
            ctx.lineTo(baseX + 400, 250); // 山峰
            ctx.lineTo(baseX + 800, 600); // 山谷
        }
        ctx.fill();

        // 近山 (视差层 2)
        const nearMountainParallax = 0.6;
        ctx.fillStyle = '#64B5F6';
        ctx.beginPath();
        const startNearX = camera.x - (camera.x * nearMountainParallax) % 600 - 600;
        ctx.moveTo(startNearX, 600);
        for (let i = 0; i < 6; i++) {
            const baseX = startNearX + i * 600;
            ctx.lineTo(baseX + 300, 350);
            ctx.lineTo(baseX + 600, 600);
        }
        ctx.fill();
        
        // 4. 云朵 (视差层 3)
        const cloudParallax = 0.4;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        const startCloudX = camera.x - (camera.x * cloudParallax) % 400 - 400;
        for (let i = 0; i < 6; i++) {
            const baseX = startCloudX + i * 400;
            this.drawCloud(ctx, baseX + 100, 80 + (i % 3) * 30, 60);
            this.drawCloud(ctx, baseX + 300, 120 - (i % 2) * 40, 80);
        }
        
        // 5. 远处的树林 (视差层 4)
        const treeParallax = 0.2;
        const startTreeX = camera.x - (camera.x * treeParallax) % 300 - 300;
        for (let i = 0; i < 10; i++) {
            const baseX = startTreeX + i * 300;
            this.drawStylizedTree(ctx, baseX + 50, 520, 0.8);
            this.drawStylizedTree(ctx, baseX + 200, 530, 0.6);
        }
    }

    drawStylizedTree(ctx, x, y, scale = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        // 树干
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(-10, -60, 20, 60);
        
        // 树冠 (使用圆形叠加制造卡通效果)
        ctx.fillStyle = '#43A047';
        ctx.beginPath();
        ctx.arc(0, -90, 40, 0, Math.PI * 2);
        ctx.arc(-25, -65, 30, 0, Math.PI * 2);
        ctx.arc(25, -65, 30, 0, Math.PI * 2);
        ctx.arc(0, -50, 35, 0, Math.PI * 2);
        ctx.fill();

        // 树冠高光
        ctx.fillStyle = '#66BB6A';
        ctx.beginPath();
        ctx.arc(-10, -100, 15, 0, Math.PI * 2);
        ctx.arc(15, -75, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawCloud(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 60, size / 60);
        
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.arc(25, -15, 25, 0, Math.PI * 2);
        ctx.arc(50, 0, 30, 0, Math.PI * 2);
        ctx.arc(25, 10, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    checkCoinCollisions(player) {
        const results = [];
        this.coinGroups.forEach(group => {
            const collision = group.checkCollision(player);
            if (collision) {
                results.push({
                    group: group,
                    letter: collision.letter,
                    wordIndex: collision.wordIndex
                });
            }
        });
        return results;
    }

    getCompletedWords() {
        return this.coinGroups.filter(group => group.isCompleted());
    }

    getProgress() {
        const total = this.coinGroups.reduce((sum, group) => sum + group.getTotal(), 0);
        const collected = this.coinGroups.reduce((sum, group) => sum + group.getProgress(), 0);
        return { collected, total };
    }

    checkEndPoint(player) {
        const playerBounds = player.getBounds();
        return playerBounds.x + playerBounds.width >= this.endPoint.x &&
               playerBounds.x <= this.endPoint.x + this.endPoint.width &&
               playerBounds.y + playerBounds.height >= this.endPoint.y - 40 &&
               playerBounds.y <= this.endPoint.y + this.endPoint.height;
    }

    createEnemies() {
        const numSections = Math.floor(this.worldWidth / 1000);
        const numEnemies = Math.min(this.levelNumber + 2, numSections);
        
        for (let i = 0; i < numEnemies; i++) {
            const section = Utils.randomInt(1, numSections - 2);
            const baseX = section * 1000 + Utils.randomInt(200, 700);
            const patrolRange = Utils.randomInt(100, 200);
            const speed = 1.5 + this.levelNumber * 0.3;
            
            this.enemies.push(new Enemy(baseX, 520, patrolRange, speed));
        }
    }

    createFlagPole() {
        this.flagPole = new FlagPole(this.endPoint.x - 100, 560);
    }
}
