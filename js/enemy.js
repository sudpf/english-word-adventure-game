class Enemy {
    constructor(x, y, patrolRange, speed = 2) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 40;
        this.startX = x;
        this.patrolRange = patrolRange;
        this.speed = speed;
        this.direction = 1;
        this.velocityX = speed;
        
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.15;
        
        // 更新为更卡通的颜色
        this.colors = {
            body: '#424242',
            belly: '#E0E0E0',
            ear: '#212121',
            eye: '#FFF',
            pupil: '#000',
            nose: '#000',
            collar: '#F44336', // 红项圈
            tag: '#FFD700'     // 金色狗牌
        };
    }

    update(deltaTime) {
        this.x += this.velocityX * this.direction * deltaTime * 60;
        
        if (this.x >= this.startX + this.patrolRange) {
            this.direction = -1;
            this.velocityX = -this.speed;
        } else if (this.x <= this.startX) {
            this.direction = 1;
            this.velocityX = this.speed;
        }
        
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            // 4帧步行循环
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    collidesWith(player) {
        const playerBounds = player.getBounds();
        // 稍微缩小碰撞盒以获得更好的体验
        const hitbox = {
            x: this.x + 5,
            y: this.y + 10,
            width: this.width - 10,
            height: this.height - 10
        };
        return Utils.checkCollision(playerBounds, hitbox);
    }

    render(ctx) {
        ctx.save();
        
        const centerX = this.x + this.width / 2;
        const scale = this.direction;
        
        ctx.translate(centerX, this.y + this.height / 2);
        ctx.scale(scale, 1);
        
        // 动画变量
        const walkCycle = this.animationFrame / 4;
        const legSwing = Math.sin(walkCycle * Math.PI * 2);
        const tailWag = Math.cos(walkCycle * Math.PI * 2 * 2) * 0.3; // 尾巴摇得更快
        const headBob = Math.sin(walkCycle * Math.PI * 2 * 2) * 2;
        
        // 1. 绘制后腿 (更远的一侧)
        this.drawLeg(ctx, -10, 5, -legSwing * 0.5, this.colors.body); // 后侧后腿
        this.drawLeg(ctx, 10, 5, legSwing * 0.5, this.colors.body);  // 后侧前腿

        // 2. 尾巴
        ctx.save();
        ctx.translate(-18, -5);
        ctx.rotate(tailWag - 0.5);
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.roundRect(-4, -15, 8, 20, 4);
        ctx.fill();
        ctx.restore();

        // 3. 身体 (像豆子一样的形状)
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.roundRect(-22, -10, 40, 22, 12);
        ctx.fill();
        
        // 肚皮
        ctx.fillStyle = this.colors.belly;
        ctx.beginPath();
        ctx.roundRect(-15, 2, 30, 10, 5);
        ctx.fill();

        // 4. 绘制前腿 (更近的一侧)
        this.drawLeg(ctx, -10, 5, legSwing * 0.5, this.colors.body); // 前侧后腿
        this.drawLeg(ctx, 10, 5, -legSwing * 0.5, this.colors.body);  // 前侧前腿

        // 5. 头部
        ctx.save();
        ctx.translate(15, -12 + headBob); // 头部会有轻微上下浮动
        
        // 耳朵 (后)
        ctx.fillStyle = this.colors.ear;
        ctx.beginPath();
        ctx.moveTo(-5, -5);
        ctx.lineTo(-12, -15);
        ctx.lineTo(2, -8);
        ctx.fill();
        
        // 头主体
        ctx.fillStyle = this.colors.body;
        ctx.beginPath();
        ctx.roundRect(-12, -12, 24, 22, 10);
        ctx.fill();
        
        // 嘴套/口鼻部
        ctx.fillStyle = this.colors.belly;
        ctx.beginPath();
        ctx.roundRect(0, 0, 15, 10, 5);
        ctx.fill();
        
        // 鼻子
        ctx.fillStyle = this.colors.nose;
        ctx.beginPath();
        ctx.arc(14, 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = this.colors.eye;
        ctx.beginPath();
        ctx.arc(2, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.colors.pupil;
        ctx.beginPath();
        ctx.arc(3, -4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 耳朵 (前)
        ctx.fillStyle = this.colors.ear;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(5, -20);
        ctx.lineTo(10, -8);
        ctx.fill();
        
        ctx.restore();

        // 6. 项圈
        ctx.fillStyle = this.colors.collar;
        ctx.beginPath();
        ctx.roundRect(8, -8 + headBob, 6, 16, 2);
        ctx.fill();
        // 狗牌
        ctx.fillStyle = this.colors.tag;
        ctx.beginPath();
        ctx.arc(11, 8 + headBob, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawLeg(ctx, x, y, angle, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 15, 4);
        ctx.fill();
        // 爪子底部
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.roundRect(-4, 12, 10, 4, 2);
        ctx.fill();
        ctx.restore();
    }
}
