class Particle {
    constructor(x, y, canvas, type = 'bubble') {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.type = type;

        switch(type) {
            case 'bubble':
                this.size = Math.random() * 4 + 2;
                this.speedY = -Math.random() * 2 - 1;
                this.speedX = Math.random() * 2 - 1;
                this.alpha = 1;
                break;
            case 'jump':
                this.size = Math.random() * 3 + 1;
                this.speedY = -Math.random() * 4 - 2;
                this.speedX = Math.random() * 4 - 2;
                this.alpha = 1;
                break;
            case 'death':
                this.size = Math.random() * 5 + 2;
                this.speedY = Math.random() * 8 - 4;
                this.speedX = Math.random() * 8 - 4;
                this.alpha = 1;
                break;
            case 'tear':
                this.size = Math.random() * 2 + 1;
                this.speedY = Math.random() * 2 + 1;
                this.speedX = -Math.random() * 2 - 1;
                this.alpha = 1;
                break;
        }
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        switch(this.type) {
            case 'bubble':
                this.alpha -= 0.005;
                break;
            case 'jump':
                this.alpha -= 0.05;
                this.speedY += 0.1; // Add gravity effect
                break;
            case 'death':
                this.alpha -= 0.02;
                this.size += 0.1;
                break;
            case 'tear':
                this.alpha -= 0.02;
                this.speedY += 0.1; // Add gravity to tears
                break;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        switch(this.type) {
            case 'bubble':
                ctx.fillStyle = '#B3E5FC';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                // Add shine to bubble
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(this.x - this.size/3, this.y - this.size/3, this.size/4, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'jump':
                ctx.fillStyle = '#81D4FA';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'death':
                ctx.fillStyle = '#FF5252';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'tear':
                ctx.fillStyle = '#81D4FA';
                // Draw teardrop shape
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size);
                ctx.quadraticCurveTo(
                    this.x + this.size,
                    this.y,
                    this.x,
                    this.y + this.size
                );
                ctx.quadraticCurveTo(
                    this.x - this.size,
                    this.y,
                    this.x,
                    this.y - this.size
                );
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    isAlive() {
        return this.alpha > 0;
    }
}