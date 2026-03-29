class FlagPole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 200;
        
        this.flagHeight = 0;
        this.maxFlagHeight = 150;
        this.risingSpeed = 100;
        
        this.isRaising = false;
        this.isComplete = false;
    }

    update(deltaTime) {
        if (this.isRaising && !this.isComplete) {
            this.flagHeight += this.risingSpeed * deltaTime;
            
            if (this.flagHeight >= this.maxFlagHeight) {
                this.flagHeight = this.maxFlagHeight;
                this.isComplete = true;
                this.isRaising = false;
            }
        }
    }

    startRaising() {
        if (!this.isRaising && !this.isComplete) {
            this.isRaising = true;
            audioManager.play('levelComplete');
        }
    }

    render(ctx) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
        
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 2, this.y - this.height + 10, this.width - 4, 5);
        ctx.fillRect(this.x + 2, this.y - this.height + 30, this.width - 4, 5);
        
        const flagY = this.y - this.height + 20 + (this.maxFlagHeight - this.flagHeight);
        
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y - this.height + 20);
        ctx.lineTo(this.x + this.width + 60, flagY + 20);
        ctx.lineTo(this.x + this.width, flagY + 40);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('★', this.x + this.width + 30, flagY + 28);
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y - this.height - 10, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    checkPlayerReach(player) {
        const playerBounds = player.getBounds();
        return playerBounds.x + playerBounds.width >= this.x &&
               playerBounds.x <= this.x + this.width + 60 &&
               playerBounds.y + playerBounds.height >= this.y - this.height &&
               playerBounds.y <= this.y;
    }
}
