class Obstacle {
    constructor(canvas, gameSpeed) {
        this.canvas = canvas;
        this.width = 100; // Increased width
        this.height = Math.random() * 250 + 150; // Increased height range
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.baseSpeed = 6; // Increased base speed
        this.speed = this.baseSpeed * gameSpeed;
        this.type = Math.random() < 0.5 ? 'ship' : 'iceberg';

        // Make sure Titanic appears regularly
        if (Math.random() < 0.3) {
            this.type = 'titanic';
            this.width = 200;
            this.height = 300;
            this.y = this.canvas.height - this.height * 0.7; // Always at bottom
        }

        if (this.type === 'iceberg') {
            this.y = 0; // Icebergs float at the top
        }
    }

    update() {
        this.x -= this.speed;
    }

    draw(ctx) {
        if (this.type === 'titanic') {
            this.drawTitanic(ctx);
        } else if (this.type === 'ship') {
            this.drawShip(ctx);
        } else {
            this.drawIceberg(ctx);
        }
    }

    drawShip(ctx) {
        ctx.save();

        // Sunken ship effect
        ctx.fillStyle = '#4A4A4A';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.1, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Ship cabin
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(
            this.x + this.width * 0.3,
            this.y + this.height * 0.4,
            this.width * 0.4,
            this.height * 0.3
        );

        // Windows
        ctx.fillStyle = '#FDD835';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(
                this.x + this.width * (0.4 + i * 0.1),
                this.y + this.height * 0.5,
                5,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        ctx.restore();
    }

    drawTitanic(ctx) {
        ctx.save();

        // Tilted sinking effect
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(Math.PI * 0.15); // Tilt by 27 degrees
        ctx.translate(-(this.x + this.width/2), -(this.y + this.height/2));

        // Main hull
        ctx.fillStyle = '#2B2B2B';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height * 0.6);
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.6);
        ctx.lineTo(this.x + this.width * 0.9, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.1, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Chimneys
        const chimneyColors = ['#8B4513', '#8B4513', '#8B4513', '#8B4513'];
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = chimneyColors[i];
            ctx.fillRect(
                this.x + this.width * (0.3 + i * 0.15),
                this.y + this.height * 0.2,
                20,
                60
            );
        }

        // Deck structures
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
            this.x + this.width * 0.2,
            this.y + this.height * 0.4,
            this.width * 0.6,
            this.height * 0.2
        );

        // Windows
        ctx.fillStyle = '#FDD835';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 3; j++) {
                ctx.beginPath();
                ctx.arc(
                    this.x + this.width * (0.25 + i * 0.1),
                    this.y + this.height * (0.45 + j * 0.1),
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }

        ctx.restore();
    }

    drawIceberg(ctx) {
        ctx.save();

        // Main iceberg body
        ctx.fillStyle = '#E3F2FD';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);

        // Create jagged peaks
        let currentX = this.x;
        const peakCount = 4;
        const segmentWidth = this.width / peakCount;

        for (let i = 0; i <= peakCount; i++) {
            const peakHeight = this.y + (Math.random() * this.height * 0.6);
            ctx.lineTo(currentX, peakHeight);
            currentX += segmentWidth;
        }

        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Add shading
        ctx.fillStyle = '#BBDEFB';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.2, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.8, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    isOffscreen() {
        return this.x + this.width < 0;
    }

    collidesWith(shark) {
        // Check if shark is above the obstacle (successful escape)
        if (shark.y < this.y - shark.height) {
            return false;
        }

        return !(this.x > shark.x + shark.width ||
                this.x + this.width < shark.x ||
                this.y > shark.y + shark.height ||
                this.y + this.height < shark.y);
    }
}