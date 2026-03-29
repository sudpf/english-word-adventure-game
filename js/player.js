class Player {
    constructor(x, y, worldWidth = 5000) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 6;
        this.jumpForce = -15;
        this.gravity = 0.6;
        this.maxFallSpeed = 15;
        this.isJumping = false;
        this.onGround = false;
        this.facingRight = true;
        this.worldWidth = worldWidth;
        
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.1;
        
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 2000;
        
        this.colors = {
            skin: '#FFDAB9',
            hair: '#2C1810',
            shirt: '#4169E1',
            pants: '#1E3A5F',
            shoes: '#8B4513',
            backpack: '#DC143C',
            eye: '#000000'
        };
    }

    update(keys, platforms, deltaTime) {
        this.handleInput(keys);
        this.applyPhysics();
        this.checkPlatformCollisions(platforms);
        this.updateAnimation(deltaTime);
        this.updateInvincibility(deltaTime);
    }

    handleInput(keys) {
        if (keys.left) {
            this.velocityX = -this.speed;
            this.facingRight = false;
        } else if (keys.right) {
            this.velocityX = this.speed;
            this.facingRight = true;
        } else {
            this.velocityX *= 0.8;
            if (Math.abs(this.velocityX) < 0.1) {
                this.velocityX = 0;
            }
        }

        if ((keys.up || keys.jump) && this.onGround) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            this.onGround = false;
            audioManager.play('jump');
        }
    }

    applyPhysics() {
        this.velocityY += this.gravity;
        this.velocityY = Utils.clamp(this.velocityY, -this.maxFallSpeed, this.maxFallSpeed);
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        this.x = Utils.clamp(this.x, 0, this.worldWidth - this.width);
    }

    checkPlatformCollisions(platforms) {
        this.onGround = false;
        
        for (const platform of platforms) {
            if (this.collidesWith(platform)) {
                if (this.velocityY > 0) {
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.onGround = true;
                    this.isJumping = false;
                } else if (this.velocityY < 0) {
                    this.y = platform.y + platform.height;
                    this.velocityY = 0;
                }
            }
        }
        
        if (this.y >= 550) {
            this.y = 550;
            this.velocityY = 0;
            this.onGround = true;
            this.isJumping = false;
        }
    }

    collidesWith(obj) {
        return Utils.checkCollision(this, obj);
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    updateInvincibility(deltaTime) {
        if (this.isInvincible) {
            this.invincibleTimer -= deltaTime * 1000;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }
    }

    makeInvincible() {
        this.isInvincible = true;
        this.invincibleTimer = this.invincibleDuration;
    }

    render(ctx) {
        ctx.save();
        
        if (this.isInvincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        const x = this.x;
        const y = this.y;
        const centerX = x + this.width / 2;
        const scale = this.facingRight ? 1 : -1;
        
        // 我们将所有绘制原点移动到玩家中心，方便进行水平翻转
        ctx.translate(centerX, y + this.height / 2);
        ctx.scale(scale, 1);
        
        // 现在玩家总是面向右侧(正方向)，我们基于原点(0, 0)来绘制
        // 原点(0,0)位于玩家矩形中心
        const drawY = -this.height / 2;
        const drawX = -this.width / 2;
        
        // 计算动画周期和摇摆角度
        const walkCycle = this.animationFrame / 4; // 0 to 1
        const legSwing = Math.abs(this.velocityX) > 0.5 ? Math.sin(walkCycle * Math.PI * 2) : 0;
        const armSwing = -legSwing; // 胳膊和腿摆动方向相反

        // 1. 绘制后手臂
        this.drawLimb(ctx, 0, -5, armSwing * 0.5, this.colors.skin, 6, 12);
        this.drawLimb(ctx, 0, -5, armSwing * 0.5, this.colors.shirt, 8, 8); // 袖子

        // 2. 绘制后腿
        this.drawLimb(ctx, -5, 10, -legSwing * 0.6, this.colors.pants, 8, 15);
        this.drawShoe(ctx, -5, 10, -legSwing * 0.6, 15);

        // 3. 绘制书包
        ctx.fillStyle = this.colors.backpack;
        ctx.beginPath();
        ctx.roundRect(-22, -10, 15, 22, 5);
        ctx.fill();
        ctx.fillStyle = '#B22222'; // 书包阴影/细节
        ctx.beginPath();
        ctx.roundRect(-22, -5, 15, 10, 2);
        ctx.fill();

        // 4. 绘制身体
        ctx.fillStyle = this.colors.shirt;
        ctx.beginPath();
        ctx.roundRect(-10, -10, 20, 22, 6);
        ctx.fill();
        
        // 领子/领带细节
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(-5, -10);
        ctx.lineTo(5, -10);
        ctx.lineTo(0, -2);
        ctx.fill();
        ctx.fillStyle = '#FF0000'; // 红领巾
        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(-2, 5);
        ctx.lineTo(2, 5);
        ctx.fill();

        // 5. 绘制前腿
        this.drawLimb(ctx, 5, 10, legSwing * 0.6, this.colors.pants, 8, 15);
        this.drawShoe(ctx, 5, 10, legSwing * 0.6, 15);

        // 6. 绘制头和脸
        // 头部基础
        ctx.fillStyle = this.colors.skin;
        ctx.beginPath();
        ctx.roundRect(-12, -30, 24, 22, 10);
        ctx.fill();

        // 头发
        ctx.fillStyle = this.colors.hair;
        ctx.beginPath();
        ctx.moveTo(-14, -20);
        ctx.quadraticCurveTo(-15, -35, 0, -32);
        ctx.quadraticCurveTo(15, -35, 14, -20);
        ctx.quadraticCurveTo(10, -25, 8, -22);
        ctx.quadraticCurveTo(5, -28, 0, -22);
        ctx.quadraticCurveTo(-5, -28, -8, -22);
        ctx.quadraticCurveTo(-10, -25, -14, -20);
        ctx.fill();

        // 眼睛
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(4, -18, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.colors.eye;
        ctx.beginPath();
        ctx.arc(5, -18, 2, 0, Math.PI * 2);
        ctx.fill();

        // 腮红
        ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
        ctx.beginPath();
        ctx.arc(0, -14, 3, 0, Math.PI * 2);
        ctx.fill();

        // 7. 绘制前手臂
        this.drawLimb(ctx, 0, -5, -armSwing * 0.5, this.colors.skin, 6, 12);
        this.drawLimb(ctx, 0, -5, -armSwing * 0.5, this.colors.shirt, 8, 8); // 袖子
        
        ctx.restore();
    }

    drawLimb(ctx, x, y, angle, color, width, length) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-width/2, 0, width, length, width/2);
        ctx.fill();
        ctx.restore();
    }

    drawShoe(ctx, x, y, angle, legLength) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(0, legLength - 2);
        ctx.fillStyle = this.colors.shoes;
        ctx.beginPath();
        ctx.roundRect(-4, 0, 12, 6, 3);
        ctx.fill();
        ctx.restore();
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
