/**
 * ASTEROID SHOOTER - Click to Destroy Game
 * Defend your space station from incoming asteroids!
 * Click on asteroids to destroy them
 */

(function () {
    const canvas = document.getElementById('shooterCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let isPlaying = false;
    let score = 0;
    let lives = 3;
    let level = 1;
    let highScore = localStorage.getItem('asteroidShooterHigh') || 0;

    // Game elements
    let asteroids = [];
    let explosions = [];
    let stars = [];

    const station = { x: 0, y: 0, radius: 40 };

    // Initialize
    function init() {
        resize();
        station.x = canvas.width / 2;
        station.y = canvas.height / 2;

        // Create stars
        stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5
            });
        }

        drawStartScreen();
    }

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        station.x = canvas.width / 2;
        station.y = canvas.height / 2;
    }

    // Draw space station
    function drawStation() {
        const pulse = 0.9 + 0.1 * Math.sin(Date.now() * 0.003);

        // Shield glow
        ctx.strokeStyle = lives > 1 ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 0, 100, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(station.x, station.y, station.radius + 15 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Station body
        const gradient = ctx.createRadialGradient(station.x, station.y, 0, station.x, station.y, station.radius);
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(0.5, '#0066aa');
        gradient.addColorStop(1, '#003366');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(station.x, station.y, station.radius, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(station.x, station.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Station arms
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 4;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + Date.now() * 0.001;
            ctx.beginPath();
            ctx.moveTo(station.x + Math.cos(angle) * 20, station.y + Math.sin(angle) * 20);
            ctx.lineTo(station.x + Math.cos(angle) * station.radius, station.y + Math.sin(angle) * station.radius);
            ctx.stroke();
        }
    }

    // Draw asteroid
    function drawAsteroid(ast) {
        // Glow based on proximity to center
        const dist = Math.hypot(ast.x - station.x, ast.y - station.y);
        const dangerLevel = 1 - (dist / (Math.max(canvas.width, canvas.height) / 2));

        ctx.fillStyle = `rgba(255, ${100 - dangerLevel * 100}, 50, ${0.3 + dangerLevel * 0.5})`;
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.size + 5, 0, Math.PI * 2);
        ctx.fill();

        // Asteroid body with irregular shape
        ctx.fillStyle = '#888';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = ast.size * (0.8 + ast.shape[i] * 0.4);
            const x = ast.x + Math.cos(angle + ast.rotation) * r;
            const y = ast.y + Math.sin(angle + ast.rotation) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // Darker spots
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(ast.x - ast.size / 4, ast.y - ast.size / 4, ast.size / 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Spawn asteroid
    function spawnAsteroid() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(canvas.width, canvas.height) / 2 + 50;
        const speed = 0.5 + level * 0.2 + Math.random() * 0.5;

        // Calculate direction toward station
        const x = station.x + Math.cos(angle) * distance;
        const y = station.y + Math.sin(angle) * distance;
        const dx = (station.x - x) / distance * speed;
        const dy = (station.y - y) / distance * speed;

        asteroids.push({
            x: x,
            y: y,
            dx: dx,
            dy: dy,
            size: 15 + Math.random() * 20,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            shape: Array.from({ length: 8 }, () => Math.random()),
            points: 10 + Math.floor(level * 5)
        });
    }

    // Create explosion
    function createExplosion(x, y, size) {
        for (let i = 0; i < 15; i++) {
            explosions.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                size: 2 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#ff6b35' : '#ffd700'
            });
        }
    }

    // Check click hit
    function checkHit(clickX, clickY) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const ast = asteroids[i];
            const dist = Math.hypot(clickX - ast.x, clickY - ast.y);

            if (dist < ast.size + 10) {
                createExplosion(ast.x, ast.y, ast.size);
                score += ast.points;
                asteroids.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    // Update game state
    function update() {
        // Update asteroids
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const ast = asteroids[i];
            ast.x += ast.dx;
            ast.y += ast.dy;
            ast.rotation += ast.rotationSpeed;

            // Check collision with station
            const dist = Math.hypot(ast.x - station.x, ast.y - station.y);
            if (dist < station.radius + ast.size) {
                createExplosion(ast.x, ast.y, ast.size);
                asteroids.splice(i, 1);
                lives--;

                if (lives <= 0) {
                    gameOver();
                    return;
                }
            }
        }

        // Update explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            const exp = explosions[i];
            exp.x += exp.vx;
            exp.y += exp.vy;
            exp.life--;
            if (exp.life <= 0) explosions.splice(i, 1);
        }

        // Level up
        if (score > level * 200) {
            level++;
        }
    }

    // Draw frame
    function draw() {
        // Clear
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Asteroids
        asteroids.forEach(ast => drawAsteroid(ast));

        // Explosions
        explosions.forEach(exp => {
            ctx.globalAlpha = exp.life / 30;
            ctx.fillStyle = exp.color;
            ctx.beginPath();
            ctx.arc(exp.x, exp.y, exp.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // Station
        drawStation();

        // HUD
        ctx.fillStyle = '#fff';
        ctx.font = '18px Orbitron, sans-serif';
        ctx.fillText(`SCORE: ${score}`, 20, 30);
        ctx.fillStyle = '#9d4edd';
        ctx.fillText(`LEVEL: ${level}`, 20, 55);

        // Lives
        ctx.fillStyle = '#ff0844';
        for (let i = 0; i < lives; i++) {
            ctx.beginPath();
            ctx.arc(canvas.width - 30 - i * 30, 30, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw start screen
    function drawStartScreen() {
        ctx.fillStyle = '#0a0a12';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#ff0844';
        ctx.font = 'bold 28px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ASTEROID SHOOTER', canvas.width / 2, canvas.height / 2 - 40);

        ctx.fillStyle = '#fff';
        ctx.font = '16px Orbitron, sans-serif';
        ctx.fillText('Click asteroids to destroy them!', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Protect your station', canvas.width / 2, canvas.height / 2 + 25);

        ctx.fillStyle = '#00d4ff';
        ctx.font = '14px Orbitron, sans-serif';
        ctx.fillText('Click anywhere to start', canvas.width / 2, canvas.height / 2 + 60);

        ctx.fillStyle = '#9d4edd';
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 90);

        ctx.textAlign = 'left';
    }

    // Game over
    function gameOver() {
        isPlaying = false;
        cancelAnimationFrame(animationId);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('asteroidShooterHigh', highScore);
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff0844';
        ctx.font = 'bold 32px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('STATION DESTROYED', canvas.width / 2, canvas.height / 2 - 30);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Orbitron, sans-serif';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText(`Level Reached: ${level}`, canvas.width / 2, canvas.height / 2 + 40);

        ctx.fillStyle = '#00d4ff';
        ctx.font = '14px Orbitron, sans-serif';
        ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 80);

        ctx.textAlign = 'left';
    }

    // Start game
    function startGame() {
        if (isPlaying) return;

        isPlaying = true;
        score = 0;
        lives = 3;
        level = 1;
        asteroids = [];
        explosions = [];

        let lastSpawn = 0;

        function loop(timestamp) {
            if (!isPlaying) return;

            // Spawn asteroids
            const spawnRate = Math.max(2000 - level * 200, 500);
            if (timestamp - lastSpawn > spawnRate) {
                spawnAsteroid();
                lastSpawn = timestamp;
            }

            update();
            draw();
            animationId = requestAnimationFrame(loop);
        }

        animationId = requestAnimationFrame(loop);
    }

    // Click handler
    function handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!isPlaying) {
            startGame();
            return;
        }

        checkHit(x, y);
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (!isPlaying) {
            startGame();
            return;
        }

        checkHit(x, y);
    });

    window.addEventListener('resize', resize);

    init();
})();
