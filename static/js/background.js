class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    update() {
        // Static background, no updates needed
    }

    draw(ctx) {
        // Draw a solid deep blue background
        ctx.fillStyle = '#003366';
        ctx.fillRect(0, 0, this.width, this.height);
    }
}