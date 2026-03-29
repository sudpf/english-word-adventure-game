class Camera {
    constructor(canvasWidth, canvasHeight, worldWidth) {
        this.x = 0;
        this.y = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.worldWidth = worldWidth;
        
        this.smoothing = 0.1;
        this.targetX = 0;
        this.targetY = 0;
    }

    follow(player) {
        this.targetX = player.x - this.canvasWidth / 2 + player.width / 2;
        
        this.targetX = Utils.clamp(this.targetX, 0, this.worldWidth - this.canvasWidth);
        
        this.x = Utils.lerp(this.x, this.targetX, this.smoothing);
    }

    applyTransform(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    }

    resetTransform(ctx) {
        ctx.restore();
    }

    isVisible(obj) {
        return obj.x + obj.width > this.x &&
               obj.x < this.x + this.canvasWidth &&
               obj.y + obj.height > this.y &&
               obj.y < this.y + this.canvasHeight;
    }

    getVisibleBounds() {
        return {
            left: this.x,
            right: this.x + this.canvasWidth,
            top: this.y,
            bottom: this.y + this.canvasHeight
        };
    }
}
