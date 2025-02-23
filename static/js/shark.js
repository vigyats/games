class Shark {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 80;
        this.height = 40;
        this.x = 50;
        this.y = canvas.height / 2;
        this.velocity = 0;
        this.gravity = 0.5;
        this.baseJumpForce = -8; // Reduced force for smoother movement
        this.maxUpwardVelocity = -12;
        this.spacebarHeld = false;
        this.floatForce = -0.4; // Gentle upward force when floating
        this.isAlive = true;
    }

    jump() {
        if (!this.isAlive) return;

        if (!this.spacebarHeld) {
            // Initial jump
            this.velocity = this.baseJumpForce;
            this.spacebarHeld = true;
        }
    }

    stopJump() {
        this.spacebarHeld = false;
    }

    update() {
        if (!this.isAlive) return;

        if (this.spacebarHeld) {
            // Apply continuous upward force while spacebar is held
            this.velocity += this.floatForce;
            // Limit maximum upward velocity
            this.velocity = Math.max(this.velocity, this.maxUpwardVelocity);
        } else {
            // Apply gravity when not holding spacebar
            this.velocity += this.gravity;
        }

        // Update position
        this.y += this.velocity;

        // Bottom boundary
        if (this.y + this.height > this.canvas.height) {
            this.y = this.canvas.height - this.height;
            this.velocity = 0;
        }

        // Top boundary - allow slight compression against top
        if (this.y < 0) {
            this.y = 0;
            this.velocity = Math.max(0, this.velocity); // Stop upward movement but allow falling
        }
    }

    draw(ctx) {
        const centerY = this.y + this.height / 2;

        ctx.save();
        ctx.fillStyle = '#00ACC1';

        // Main body
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, centerY);
        ctx.quadraticCurveTo(
            this.x + this.width * 0.4,
            centerY - this.height * 0.5,
            this.x,
            centerY
        );
        ctx.quadraticCurveTo(
            this.x + this.width * 0.4,
            centerY + this.height * 0.5,
            this.x + this.width,
            centerY
        );
        ctx.closePath();
        ctx.fill();

        // Dorsal fin
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, centerY - this.height * 0.1);
        ctx.lineTo(this.x + this.width * 0.5, centerY - this.height * 0.8);
        ctx.lineTo(this.x + this.width * 0.3, centerY);
        ctx.closePath();
        ctx.fill();

        // Tail fin
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.2, centerY - this.height * 0.3);
        ctx.lineTo(this.x, centerY - this.height * 0.5);
        ctx.lineTo(this.x, centerY + this.height * 0.5);
        ctx.lineTo(this.x + this.width * 0.2, centerY + this.height * 0.3);
        ctx.closePath();
        ctx.fill();

        // Gills
        ctx.strokeStyle = '#008B9E';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(
                this.x + this.width * 0.7,
                centerY - this.height * 0.2 + (i * this.height * 0.2)
            );
            ctx.lineTo(
                this.x + this.width * 0.6,
                centerY - this.height * 0.2 + (i * this.height * 0.2)
            );
            ctx.stroke();
        }

        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width * 0.85,
            centerY - this.height * 0.15,
            this.height * 0.1,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Pupil
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width * 0.85,
            centerY - this.height * 0.15,
            this.height * 0.05,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }
}