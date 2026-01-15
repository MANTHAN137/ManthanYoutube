/**
 * SPACE RUNNER - Asteroid Dodger Game
 * Similar to Chrome's Dino but with sci-fi theme
 * Press SPACE or CLICK to jump/boost
 */

(function () {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;

    const ctx = gameCanvas.getContext('2d');
    let gameLoop;
    let isPlaying = false;
    let score = 0;
    let highScore = localStorage.getItem('spaceRunnerHigh') || 0;
    let gameSpeed = 5;

    // Game elements
    const ship = {
        x: 80,
        y: 0,
        width: 40,
        height: 20,
        velocity: 0,
        gravity: 0.6,
        jumpForce: -12,
        grounded: true
    };

    let obstacles = [];
    let particles = [];
    let stars = [];

    // Initialize
    function init() {
        resize();
        ship.y = gameCanvas.height - 60;

        // Create stars
        stars = [];
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * gameCanvas.width,
                y: Math.random() * gameCanvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 1
            });
        }

        drawStartScreen();
    }

    function resize() {
        gameCanvas.width = gameCanvas.offsetWidth;
        gameCanvas.height = gameCanvas.offsetHeight;
    }

    // Draw spaceship
    function drawShip() {
        ctx.save();
        ctx.translate(ship.x + ship.width / 2, ship.y + ship.height / 2);

        // Ship body
        ctx.fillStyle = '#00d4ff';
        ctx.beginPath();
        ctx.moveTo(ship.width / 2, 0);
        ctx.lineTo(-ship.width / 2, -ship.height / 2);
        ctx.lineTo(-ship.width / 3, 0);
        ctx.lineTo(-ship.width / 2, ship.height / 2);
        ctx.closePath();
        ctx.fill();

        // Engine glow
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        ctx.moveTo(-ship.width / 3, -5);
        ctx.lineTo(-ship.width / 2 - 10 - Math.random() * 10, 0);
        ctx.lineTo(-ship.width / 3, 5);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#9d4edd';
        ctx.beginPath();
        ctx.arc(5, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Draw asteroid
    function drawAsteroid(obs) {
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Crater details
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 3, obs.y + obs.height / 3, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(obs.x + obs.width * 0.6, obs.y + obs.height * 0.6, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw energy core (collectible)
    function drawEnergyCore(obs) {
        const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.01);

        // Glow
        ctx.fillStyle = `rgba(157, 78, 221, ${0.3 * pulse})`;
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#9d4edd';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Spawn obstacle
    function spawnObstacle() {
        const isCore = Math.random() < 0.2; // 20% chance of energy core
        const size = isCore ? 20 : 30 + Math.random() * 20;

        obstacles.push({
            x: gameCanvas.width,
            y: gameCanvas.height - 40 - size - (isCore ? Math.random() * 60 : 0),
            width: size,
            height: size,
            type: isCore ? 'core' : 'asteroid'
        });
    }

    // Create particle explosion
    function createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                color: color
            });
        }
    }

    // Update game state
    function update() {
        // Update ship
        ship.velocity += ship.gravity;
        ship.y += ship.velocity;

        // Ground collision
        if (ship.y > gameCanvas.height - 60) {
            ship.y = gameCanvas.height - 60;
            ship.velocity = 0;
            ship.grounded = true;
        } else {
            ship.grounded = false;
        }

        // Ceiling
        if (ship.y < 0) {
            ship.y = 0;
            ship.velocity = 0;
        }

        // Update obstacles
        obstacles.forEach((obs, index) => {
            obs.x -= gameSpeed;

            // Check collision
            if (ship.x < obs.x + obs.width &&
                ship.x + ship.width > obs.x &&
                ship.y < obs.y + obs.height &&
                ship.y + ship.height > obs.y) {

                if (obs.type === 'core') {
                    // Collect core
                    score += 50;
                    createParticles(obs.x, obs.y, '#9d4edd', 10);
                    obstacles.splice(index, 1);
                } else {
                    // Hit asteroid - game over
                    createParticles(ship.x, ship.y, '#ff6b35', 20);
                    gameOver();
                }
            }

            // Remove off-screen
            if (obs.x + obs.width < 0) {
                obstacles.splice(index, 1);
                if (obs.type === 'asteroid') score += 10;
            }
        });

        // Update particles
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) particles.splice(index, 1);
        });

        // Update stars
        stars.forEach(star => {
            star.x -= star.speed;
            if (star.x < 0) star.x = gameCanvas.width;
        });

        // Increase difficulty
        if (score > 0 && score % 200 === 0) {
            gameSpeed = Math.min(gameSpeed + 0.1, 15);
        }
    }

    // Draw frame
    function draw() {
        // Clear
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Stars
        stars.forEach(star => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Ground line
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, gameCanvas.height - 20);
        ctx.lineTo(gameCanvas.width, gameCanvas.height - 20);
        ctx.stroke();

        // Grid lines on ground
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
        for (let x = (Date.now() * 0.1) % 50; x < gameCanvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, gameCanvas.height - 20);
            ctx.lineTo(x, gameCanvas.height);
            ctx.stroke();
        }

        // Obstacles
        obstacles.forEach(obs => {
            if (obs.type === 'core') {
                drawEnergyCore(obs);
            } else {
                drawAsteroid(obs);
            }
        });

        // Particles
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 30;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // Ship
        drawShip();

        // Score
        ctx.fillStyle = '#fff';
        ctx.font = '20px Orbitron, sans-serif';
        ctx.fillText(`SCORE: ${score}`, 20, 40);
        ctx.fillStyle = '#9d4edd';
        ctx.fillText(`HIGH: ${highScore}`, 20, 65);
    }

    // Draw start screen
    function drawStartScreen() {
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Stars
        stars.forEach(star => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 28px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SPACE RUNNER', gameCanvas.width / 2, gameCanvas.height / 2 - 40);

        ctx.fillStyle = '#fff';
        ctx.font = '16px Orbitron, sans-serif';
        ctx.fillText('Press SPACE or CLICK to Start', gameCanvas.width / 2, gameCanvas.height / 2 + 10);

        ctx.fillStyle = '#9d4edd';
        ctx.font = '14px Orbitron, sans-serif';
        ctx.fillText(`High Score: ${highScore}`, gameCanvas.width / 2, gameCanvas.height / 2 + 50);

        ctx.textAlign = 'left';
    }

    // Game over
    function gameOver() {
        isPlaying = false;
        cancelAnimationFrame(gameLoop);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('spaceRunnerHigh', highScore);
        }

        // Game over overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        ctx.fillStyle = '#ff0844';
        ctx.font = 'bold 32px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', gameCanvas.width / 2, gameCanvas.height / 2 - 30);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Orbitron, sans-serif';
        ctx.fillText(`Score: ${score}`, gameCanvas.width / 2, gameCanvas.height / 2 + 10);

        ctx.fillStyle = '#00d4ff';
        ctx.font = '14px Orbitron, sans-serif';
        ctx.fillText('Press SPACE to Restart', gameCanvas.width / 2, gameCanvas.height / 2 + 50);

        ctx.textAlign = 'left';
    }

    // Start game
    function startGame() {
        if (isPlaying) return;

        isPlaying = true;
        score = 0;
        gameSpeed = 5;
        obstacles = [];
        particles = [];
        ship.y = gameCanvas.height - 60;
        ship.velocity = 0;

        // Spawn timer
        let lastSpawn = 0;

        function loop(timestamp) {
            if (!isPlaying) return;

            // Spawn obstacles
            if (timestamp - lastSpawn > 1500 - gameSpeed * 50) {
                spawnObstacle();
                lastSpawn = timestamp;
            }

            update();
            draw();
            gameLoop = requestAnimationFrame(loop);
        }

        gameLoop = requestAnimationFrame(loop);
    }

    // Jump
    function jump() {
        if (!isPlaying) {
            startGame();
            return;
        }

        if (ship.grounded) {
            ship.velocity = ship.jumpForce;
            ship.grounded = false;
        }
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            jump();
        }
    });

    gameCanvas.addEventListener('click', jump);
    gameCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    });

    window.addEventListener('resize', resize);

    // Initialize
    init();
})();
