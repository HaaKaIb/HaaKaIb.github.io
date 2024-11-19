class Ball{

    constructor(x, y, radius, factorX, factorY){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.factorX = factorX;
        this.factorY = factorY;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}

export default Ball;