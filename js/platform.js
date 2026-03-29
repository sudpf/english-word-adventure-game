class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        
        this.colors = {
            normal: {
                top: '#7CB342', // 草地颜色
                topHighlight: '#8BC34A',
                middle: '#795548', // 泥土颜色
                bottom: '#5D4037',
                outline: '#3E2723'
            },
            grass: {
                top: '#689F38',
                topHighlight: '#7CB342',
                middle: '#558B2F',
                bottom: '#33691E',
                outline: '#1B5E20'
            },
            stone: {
                top: '#9E9E9E',
                topHighlight: '#BDBDBD',
                middle: '#757575',
                bottom: '#424242',
                outline: '#212121'
            }
        };
    }

    // 辅助绘制圆角矩形
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    render(ctx) {
        const colors = this.colors[this.type] || this.colors.normal;
        const radius = Math.min(10, this.width / 2, this.height / 2);
        
        ctx.save();
        
        // 1. 绘制带有轮廓的整体底座（阴影和外边框）
        ctx.fillStyle = colors.outline;
        this.roundRect(ctx, this.x - 2, this.y - 2, this.width + 4, this.height + 6, radius + 2);
        ctx.fill();

        // 2. 绘制主体颜色
        ctx.fillStyle = colors.middle;
        this.roundRect(ctx, this.x, this.y, this.width, this.height, radius);
        ctx.fill();

        // 3. 绘制底部阴影
        ctx.fillStyle = colors.bottom;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height - radius * 2);
        ctx.lineTo(this.x, this.y + this.height - radius);
        ctx.quadraticCurveTo(this.x, this.y + this.height, this.x + radius, this.y + this.height);
        ctx.lineTo(this.x + this.width - radius, this.y + this.height);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - radius);
        ctx.lineTo(this.x + this.width, this.y + this.height - radius * 2);
        ctx.closePath();
        ctx.fill();

        // 4. 绘制泥土纹理细节
        this.renderDetails(ctx, colors);

        // 5. 绘制顶部的草地/平台覆盖层
        ctx.fillStyle = colors.top;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + radius);
        ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
        ctx.lineTo(this.x + this.width - radius, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
        
        // 绘制波浪形的底部边缘（草的下垂感）
        if (this.type !== 'stone') {
            const waveCount = Math.floor(this.width / 15);
            const waveWidth = this.width / waveCount;
            for (let i = waveCount - 1; i >= 0; i--) {
                const currentX = this.x + i * waveWidth;
                const nextX = currentX + waveWidth;
                ctx.quadraticCurveTo(currentX + waveWidth / 2, this.y + 15, currentX, this.y + 8);
            }
        } else {
            ctx.lineTo(this.x, this.y + 8);
        }
        ctx.fill();

        // 6. 顶部高光
        ctx.fillStyle = colors.topHighlight;
        ctx.beginPath();
        ctx.moveTo(this.x + radius, this.y);
        ctx.lineTo(this.x + this.width - radius, this.y);
        ctx.quadraticCurveTo(this.x + this.width - 2, this.y + 2, this.x + this.width - 4, this.y + 4);
        ctx.lineTo(this.x + 4, this.y + 4);
        ctx.quadraticCurveTo(this.x + 2, this.y + 2, this.x + radius, this.y);
        ctx.fill();

        ctx.restore();
    }

    renderDetails(ctx, colors) {
        ctx.fillStyle = colors.bottom;
        
        // 随机但固定的斑点，利用坐标作为种子生成伪随机以保持稳定
        for (let i = 0; i < this.width - 15; i += 25) {
            for (let j = 15; j < this.height - 15; j += 20) {
                // 伪随机决定是否绘制小斑点
                if ((this.x + i + j * 3) % 7 < 3) {
                    ctx.beginPath();
                    ctx.arc(this.x + i + 10, this.y + j + 5, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
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

class MovingPlatform extends Platform {
    constructor(x, y, width, height, type, moveRange, speed) {
        super(x, y, width, height, type);
        this.startX = x;
        this.moveRange = moveRange;
        this.speed = speed;
        this.direction = 1;
    }

    update(deltaTime) {
        this.x += this.speed * this.direction * deltaTime * 60;
        
        if (this.x >= this.startX + this.moveRange) {
            this.direction = -1;
        } else if (this.x <= this.startX - this.moveRange) {
            this.direction = 1;
        }
    }

    render(ctx) {
        super.render(ctx);
        
        ctx.save();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.startX - this.moveRange, this.y + this.height / 2);
        ctx.lineTo(this.startX + this.moveRange + this.width, this.y + this.height / 2);
        ctx.stroke();
        ctx.restore();
    }
}
