class Paddle{
    
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(newY) {
        this.y = newY;
    }
}

export default Paddle;