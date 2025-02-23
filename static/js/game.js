class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.gameOver = false;
        this.particles = [];
        this.obstacles = [];
        this.lastObstacleSpawn = 0;
        this.difficulty = 'normal'; // default difficulty
        this.lives = 2; // default lives for normal mode
        this.isInvulnerable = false;
        this.invulnerabilityTime = 1500; // 1.5 seconds of invulnerability after hit
        this.chasingShark = {
            x: -200,
            y: 0,
            width: 160,
            height: 80,
            speed: 2
        };

        // Add girlfriend shark storyline
        this.girlfriendShark = {
            x: this.canvas.width + 200,
            y: this.canvas.height / 2,
            width: 100,
            height: 50,
            isVisible: false
        };

        this.otherShark = {
            x: this.canvas.width + 300,
            y: this.canvas.height / 2,
            width: 120,
            height: 60,
            isVisible: false
        };

        // Death animation properties
        this.deathAnimation = {
            isPlaying: false,
            frame: 0,
            maxFrames: 60,
            blackSharkX: 0,
            blackSharkY: 0
        };

        this.jumpSound = new Audio('/static/sounds/splash.mp3');

        this.difficultySettings = {
            easy: { lives: 3, speed: 0.5, spawnInterval: 2000 },
            normal: { lives: 2, speed: 0.7, spawnInterval: 1500 },
            hard: { lives: 1, speed: 0.9, spawnInterval: 1200 }
        };

        // Add intro text
        this.introText = {
            main: "UNDERWATER",
            sub: "by vigyat",
            alpha: 1,
            showing: true
        };

        this.jellyfish = [];
        this.numJellyfish = 2; // Reduced to 2 jellyfish

        // Initialize jellyfish
        for (let i = 0; i < this.numJellyfish; i++) {
            this.jellyfish.push(new Jellyfish(this.canvas));
        }


        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.setupDifficultySelection();
        this.shark = new Shark(this.canvas);
        this.background = new Background(this.canvas);

        this.setupControls();
        this.setupGameOver();
        this.updateLivesDisplay(); // Add this line at the end of the constructor
    }

    updateLivesDisplay() {
        const heartsDisplay = document.getElementById('hearts-display');
        heartsDisplay.innerHTML = Array(this.lives).fill('<i class="fas fa-heart heart-icon"></i>').join('');
    }

    setupDifficultySelection() {
        const difficultyScreen = document.getElementById('difficultySelect');
        difficultyScreen.classList.remove('hidden');

        ['easy', 'normal', 'hard'].forEach(diff => {
            document.getElementById(`${diff}Button`).addEventListener('click', () => {
                this.setDifficulty(diff);
                difficultyScreen.classList.add('hidden');
                this.startGame();
            });
        });
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        const settings = this.difficultySettings[difficulty];
        this.lives = settings.lives;
        this.gameSpeed = settings.speed;
        this.obstacleSpawnInterval = settings.spawnInterval;
    }

    startGame() {
        this.resetGame();
        this.gameLoop();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.8;
    }

    setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameOver) {
                e.preventDefault(); // Prevent page scrolling
                this.shark.jump();
                this.createJumpEffect();
                this.jumpSound.play().catch(e => console.log('Audio play failed:', e));
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.shark.stopJump();
            }
        });

        // Enhanced touch controls
        let touchActive = false;

        const handleTouch = (e) => {
            e.preventDefault();
            if (!this.gameOver && !touchActive) {
                touchActive = true;
                this.shark.jump();
                this.createJumpEffect();
                this.jumpSound.play().catch(e => console.log('Audio play failed:', e));
            }
        };

        const handleTouchEnd = () => {
            touchActive = false;
            this.shark.stopJump();
        };

        // Add touch events with improved handling
        this.canvas.addEventListener('touchstart', handleTouch, { passive: false });
        this.canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
        this.canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

        // Show/hide touch hint on mobile devices
        const touchControls = document.getElementById('touchControls');
        if ('ontouchstart' in window) {
            touchControls.style.display = 'block';
            // Hide hint after first touch
            this.canvas.addEventListener('touchstart', () => {
                touchControls.style.opacity = '0';
                setTimeout(() => touchControls.style.display = 'none', 1000);
            }, { once: true });
        } else {
            touchControls.style.display = 'none';
        }
    }

    createJumpEffect() {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(
                this.shark.x + this.shark.width / 2,
                this.shark.y + this.shark.height,
                this.canvas,
                'jump'
            ));
        }
    }

    setupGameOver() {
        const gameOverScreen = document.getElementById('gameOver');
        const restartButton = document.getElementById('restartButton');

        restartButton.addEventListener('click', () => {
            gameOverScreen.classList.add('hidden');

            // Show water conservation message
            const messageScreen = document.createElement('div');
            messageScreen.className = 'conservation-message';
            messageScreen.innerHTML = `
                <div class="message-content">
                    <h2>🌊 Save Our Oceans 🐋</h2>
                    <p>"Protect Marine Life, Save Our Waters"</p>
                    <p class="sub-message">Every drop counts in preserving our ocean's precious ecosystems</p>
                </div>
            `;
            document.body.appendChild(messageScreen);

            // Reload after showing message
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        });
    }

    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.obstacles = [];
        this.particles = [];
        this.chasingShark.x = -200;
        this.girlfriendShark.isVisible = false;
        this.otherShark.isVisible = false;
        this.deathAnimation.isPlaying = false;
        this.deathAnimation.frame = 0;
        this.introText.showing = true;
        this.introText.alpha = 1;
        this.lives = this.difficultySettings[this.difficulty].lives;
        this.gameSpeed = this.difficultySettings[this.difficulty].speed;
        this.obstacleSpawnInterval = this.difficultySettings[this.difficulty].spawnInterval;
        this.shark = new Shark(this.canvas);
        this.isInvulnerable = false;
        document.getElementById('score').textContent = `Score: ${this.score}`;
        this.updateLivesDisplay();
    }

    spawnObstacle() {
        const now = Date.now();
        if (now - this.lastObstacleSpawn > this.obstacleSpawnInterval) {
            this.obstacles.push(new Obstacle(this.canvas, this.gameSpeed));
            this.lastObstacleSpawn = now;
            // Make game progressively harder but maintain difficulty differences
            this.obstacleSpawnInterval = Math.max(
                this.difficultySettings[this.difficulty].spawnInterval - this.score * 10,
                600
            );
        }
    }

    createBubbles() {
        if (Math.random() < 0.3) { // Increased bubble frequency
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                this.canvas.height,
                this.canvas,
                'bubble'
            ));
        }
    }

    handleCollision() {
        if (!this.isInvulnerable) {
            this.lives--;
            this.updateLivesDisplay();

            if (this.lives <= 0) {
                this.endGame();
            } else {
                this.isInvulnerable = true;
                setTimeout(() => {
                    this.isInvulnerable = false;
                }, this.invulnerabilityTime);
            }
        }
    }

    update() {
        if (this.gameOver) {
            if (this.deathAnimation.isPlaying) {
                this.updateDeathAnimation();
            }
            return;
        }

        // Update intro text
        if (this.introText.showing) {
            this.introText.alpha -= 0.005;
            if (this.introText.alpha <= 0) {
                this.introText.showing = false;
            }
        }

        this.shark.update();
        this.spawnObstacle();
        this.createBubbles();

        // Update chasing shark
        if (this.score > 10) {
            this.chasingShark.x += (this.shark.x - 300 - this.chasingShark.x) * 0.02;
            this.chasingShark.y = this.shark.y;
        }

        // Girlfriend shark storyline
        if (this.score === 20 && !this.girlfriendShark.isVisible) {
            this.girlfriendShark.isVisible = true;
            this.otherShark.isVisible = true;
            // Create crying bubbles
            for (let i = 0; i < 20; i++) {
                this.particles.push(new Particle(
                    this.shark.x + this.shark.width / 2,
                    this.shark.y + this.shark.height / 2,
                    this.canvas,
                    'tear'
                ));
            }
        }

        if (this.girlfriendShark.isVisible) {
            // Move girlfriend and other shark
            this.girlfriendShark.x = Math.max(this.canvas.width * 0.7, this.girlfriendShark.x - 2);
            this.otherShark.x = Math.max(this.canvas.width * 0.8, this.otherShark.x - 2);
            this.girlfriendShark.y = this.canvas.height * 0.4;
            this.otherShark.y = this.canvas.height * 0.4;
        }

        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.update();
            if (obstacle.collidesWith(this.shark)) {
                this.handleCollision();
                return false;
            }
            if (obstacle.isOffscreen()) {
                this.score++;
                document.getElementById('score').textContent = `Score: ${this.score}`;
                return false;
            }
            return true;
        });

        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.isAlive();
        });
        this.jellyfish.forEach(jelly => jelly.update());
    }

    updateDeathAnimation() {
        if (this.deathAnimation.frame < this.deathAnimation.maxFrames) {
            this.deathAnimation.frame++;
            // Move black shark to eat the player shark
            const progress = this.deathAnimation.frame / this.deathAnimation.maxFrames;
            if (progress < 0.5) {
                this.deathAnimation.blackSharkX = this.canvas.width * (1 - progress * 2);
            }
        }
    }

    drawChasingShark(ctx) {
        if (this.score <= 10) return;

        ctx.save();
        ctx.fillStyle = '#1A1A1A';

        // Draw giant shark silhouette
        const x = this.chasingShark.x;
        const y = this.chasingShark.y;
        const width = this.chasingShark.width;
        const height = this.chasingShark.height;

        ctx.beginPath();
        ctx.moveTo(x + width, y + height / 2);
        ctx.quadraticCurveTo(x + width * 0.7, y, x, y + height / 2);
        ctx.quadraticCurveTo(x + width * 0.7, y + height, x + width, y + height / 2);
        ctx.fill();

        // Red eye
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x + width * 0.8, y + height * 0.3, height * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawGirlfriendScene(ctx) {
        if (!this.girlfriendShark.isVisible) return;

        // Draw girlfriend shark (pink)
        ctx.save();
        ctx.fillStyle = '#FF69B4';

        // Draw main body
        const gf = this.girlfriendShark;
        const centerY = gf.y + gf.height / 2;

        // Main body
        ctx.beginPath();
        ctx.moveTo(gf.x + gf.width, centerY);
        ctx.quadraticCurveTo(
            gf.x + gf.width * 0.4,
            gf.y,
            gf.x,
            centerY
        );
        ctx.quadraticCurveTo(
            gf.x + gf.width * 0.4,
            gf.y + gf.height,
            gf.x + gf.width,
            centerY
        );
        ctx.closePath();
        ctx.fill();

        // Dorsal fin
        ctx.beginPath();
        ctx.moveTo(gf.x + gf.width * 0.5, centerY - gf.height * 0.1);
        ctx.lineTo(gf.x + gf.width * 0.5, centerY - gf.height * 0.8);
        ctx.lineTo(gf.x + gf.width * 0.3, centerY);
        ctx.closePath();
        ctx.fill();

        // Tail fin
        ctx.beginPath();
        ctx.moveTo(gf.x + gf.width * 0.2, centerY - gf.height * 0.3);
        ctx.lineTo(gf.x, centerY - gf.height * 0.5);
        ctx.lineTo(gf.x, centerY + gf.height * 0.5);
        ctx.lineTo(gf.x + gf.width * 0.2, centerY + gf.height * 0.3);
        ctx.closePath();
        ctx.fill();

        // Eye with eyelash
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
            gf.x + gf.width * 0.85,
            centerY - gf.height * 0.15,
            gf.height * 0.1,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Eyelashes
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(
                gf.x + gf.width * 0.85,
                centerY - gf.height * 0.25
            );
            ctx.lineTo(
                gf.x + gf.width * 0.85 + Math.cos(i * Math.PI / 3) * gf.height * 0.15,
                centerY - gf.height * 0.25 - Math.sin(i * Math.PI / 3) * gf.height * 0.15
            );
            ctx.stroke();
        }

        // Pupil
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(
            gf.x + gf.width * 0.85,
            centerY - gf.height * 0.15,
            gf.height * 0.05,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw other shark (purple) with similar shark-like features
        ctx.fillStyle = '#9C27B0';
        const other = this.otherShark;
        const otherCenterY = other.y + other.height / 2;

        // Main body
        ctx.beginPath();
        ctx.moveTo(other.x + other.width, otherCenterY);
        ctx.quadraticCurveTo(
            other.x + other.width * 0.4,
            other.y,
            other.x,
            otherCenterY
        );
        ctx.quadraticCurveTo(
            other.x + other.width * 0.4,
            other.y + other.height,
            other.x + other.width,
            otherCenterY
        );
        ctx.closePath();
        ctx.fill();

        // Dorsal fin
        ctx.beginPath();
        ctx.moveTo(other.x + other.width * 0.5, otherCenterY - other.height * 0.1);
        ctx.lineTo(other.x + other.width * 0.5, otherCenterY - other.height * 0.8);
        ctx.lineTo(other.x + other.width * 0.3, otherCenterY);
        ctx.closePath();
        ctx.fill();

        // Tail fin
        ctx.beginPath();
        ctx.moveTo(other.x + other.width * 0.2, otherCenterY - other.height * 0.3);
        ctx.lineTo(other.x, otherCenterY - other.height * 0.5);
        ctx.lineTo(other.x, otherCenterY + other.height * 0.5);
        ctx.lineTo(other.x + other.width * 0.2, otherCenterY + other.height * 0.3);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(
            other.x + other.width * 0.85,
            otherCenterY - other.height * 0.15,
            other.height * 0.1,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Pupil
        ctx.fillStyle = '#4A148C';
        ctx.beginPath();
        ctx.arc(
            other.x + other.width * 0.85,
            otherCenterY - other.height * 0.15,
            other.height * 0.05,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }

    drawSharkSilhouette(ctx, shark) {
        ctx.beginPath();
        ctx.moveTo(shark.x + shark.width, shark.y + shark.height / 2);
        ctx.quadraticCurveTo(shark.x + shark.width * 0.7, shark.y, shark.x, shark.y + shark.height / 2);
        ctx.quadraticCurveTo(shark.x + shark.width * 0.7, shark.y + shark.height, shark.x + shark.width, shark.y + shark.height / 2);
        ctx.fill();
    }

    drawDeathAnimation(ctx) {
        if (!this.deathAnimation.isPlaying) return;

        // Draw giant black shark eating the player
        ctx.save();
        ctx.fillStyle = '#000000';

        const width = this.canvas.width * 0.4;
        const height = this.canvas.height * 0.4;
        const x = this.deathAnimation.blackSharkX;
        const y = this.shark.y - height * 0.2;

        // Draw open mouth
        ctx.beginPath();
        ctx.moveTo(x + width, y + height * 0.3);
        ctx.quadraticCurveTo(x + width * 0.6, y - height * 0.2, x, y + height * 0.5);
        ctx.quadraticCurveTo(x + width * 0.6, y + height * 1.2, x + width, y + height * 0.7);
        ctx.fill();

        // Draw teeth
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(x + width * 0.3 + i * width * 0.1, y + height * 0.3);
            ctx.lineTo(x + width * 0.35 + i * width * 0.1, y + height * 0.4);
            ctx.lineTo(x + width * 0.4 + i * width * 0.1, y + height * 0.3);
            ctx.fill();
        }

        // Draw menacing red eye
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(
            x + width * 0.7,
            y + height * 0.2,
            height * 0.15,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Add eye shine
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
            x + width * 0.73,
            y + height * 0.17,
            height * 0.05,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.background.draw(this.ctx);
        this.drawChasingShark(this.ctx);
        this.drawGirlfriendScene(this.ctx);
        this.jellyfish.forEach(jelly => jelly.draw(this.ctx)); //draw jellyfish
        this.particles.forEach(particle => particle.draw(this.ctx));
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));

        // Draw intro text with better mobile scaling
        if (this.introText.showing) {
            this.ctx.save();
            this.ctx.globalAlpha = this.introText.alpha;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.textAlign = 'center';

            // Main title - responsive font size
            const titleSize = Math.min(48, this.canvas.width / 12);
            this.ctx.font = `${titleSize}px "Press Start 2P"`;
            this.ctx.fillText(this.introText.main, this.canvas.width / 2, this.canvas.height / 2);

            // Subtitle - responsive font size
            const subtitleSize = Math.min(16, this.canvas.width / 25);
            this.ctx.font = `${subtitleSize}px "Press Start 2P"`;
            this.ctx.fillText(this.introText.sub, this.canvas.width / 2, this.canvas.height / 2 + titleSize);
            this.ctx.restore();
        }

        if (!this.gameOver || this.deathAnimation.frame < this.deathAnimation.maxFrames * 0.4) {
            if (this.isInvulnerable) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.5;
                this.shark.draw(this.ctx);
                this.ctx.restore();
            } else {
                this.shark.draw(this.ctx);
            }
        }

        if (this.gameOver) {
            this.drawDeathAnimation(this.ctx);
        }
    }

    endGame() {
        this.gameOver = true;
        this.deathAnimation.isPlaying = true;
        this.deathAnimation.blackSharkX = this.canvas.width;

        // Death animation - create many particles
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(
                this.shark.x + this.shark.width / 2,
                this.shark.y + this.shark.height / 2,
                this.canvas,
                'death'
            ));
        }

        // Show game over screen and reload after animation
        setTimeout(() => {
            document.getElementById('gameOver').classList.remove('hidden');
            document.getElementById('finalScore').textContent = this.score;

            // Reload the entire page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }, 2000);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the window loads
window.addEventListener('load', () => {
    new Game();
});