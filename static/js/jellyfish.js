class Jellyfish {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 20;
        this.color = `hsla(${Math.random() * 60 + 180}, 70%, 70%, 0.3)`; // Lighter and more transparent
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.tentacleLength = this.size * 1.5;
        this.tentaclePhase = Math.random() * Math.PI * 2;
        this.pulsePhase = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < -this.size) this.x = this.canvas.width + this.size;
        if (this.x > this.canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = this.canvas.height + this.size;
        if (this.y > this.canvas.height + this.size) this.y = -this.size;

        // Update animation phases
        this.tentaclePhase += 0.03;
        this.pulsePhase += 0.02;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Pulsing effect
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.1;
        ctx.scale(pulseScale, pulseScale);

        // Draw bell (body)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();

        // Add some transparency variation to the bell
        ctx.fillStyle = `hsla(${parseInt(this.color.split(',')[0].split('(')[1])}, 70%, 85%, 0.2)`;
        ctx.beginPath();
        ctx.arc(0, -this.size/4, this.size/3, 0, Math.PI * 2);
        ctx.fill();

        // Draw tentacles with higher transparency
        ctx.strokeStyle = `hsla(${parseInt(this.color.split(',')[0].split('(')[1])}, 70%, 80%, 0.2)`;
        ctx.lineWidth = 1;

        for (let i = 0; i < 6; i++) { // Reduced number of tentacles
            const angle = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(
                Math.cos(angle) * this.size/3,
                Math.sin(angle) * this.size/3
            );

            // Create wavy tentacles
            for (let j = 0; j < 3; j++) {
                const t = j / 2;
                const xOff = Math.cos(angle + Math.sin(this.tentaclePhase + i) * 0.5) * 3;
                ctx.quadraticCurveTo(
                    Math.cos(angle) * this.size/2 + xOff,
                    Math.sin(angle) * this.size/2 + this.tentacleLength * t,
                    Math.cos(angle) * this.size/3 + xOff,
                    Math.sin(angle) * this.size/3 + this.tentacleLength * (t + 0.5)
                );
            }
            ctx.stroke();
        }

        ctx.restore();
    }
}