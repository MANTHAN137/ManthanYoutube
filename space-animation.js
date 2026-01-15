/**
 * Space Animation - Planets, Black Holes, and Cosmic Patterns
 * 30-second cycle with smooth transitions
 */

(function () {
    const canvas = document.getElementById('spaceCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;
    const cycleDuration = 30000; // 30 seconds

    // Resize canvas
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 2 + 0.5,
            twinkle: Math.random() * Math.PI * 2
        });
    }

    // Planets
    const planets = [
        { orbitRadius: 0.15, size: 8, speed: 0.0003, color: '#ff6b35', angle: 0, rings: false },
        { orbitRadius: 0.25, size: 15, speed: 0.0002, color: '#00d4ff', angle: Math.PI, rings: false },
        { orbitRadius: 0.35, size: 20, speed: 0.0001, color: '#9d4edd', angle: Math.PI / 2, rings: true },
        { orbitRadius: 0.18, size: 5, speed: 0.0005, color: '#71b280', angle: Math.PI / 4, rings: false }
    ];

    // Draw black hole
    function drawBlackHole(centerX, centerY, time) {
        const size = 60 + Math.sin(time * 0.001) * 10;

        // Accretion disk
        for (let i = 5; i > 0; i--) {
            const diskRadius = size + i * 15;
            const gradient = ctx.createRadialGradient(centerX, centerY, size, centerX, centerY, diskRadius);
            gradient.addColorStop(0, 'rgba(255, 100, 50, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 150, 100, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 200, 150, 0)');

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(time * 0.0005 * i);
            ctx.scale(1, 0.3);
            ctx.translate(-centerX, -centerY);

            ctx.beginPath();
            ctx.arc(centerX, centerY, diskRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        }

        // Event horizon
        const holeGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);
        holeGradient.addColorStop(0, '#000000');
        holeGradient.addColorStop(0.7, '#000000');
        holeGradient.addColorStop(1, 'rgba(100, 50, 200, 0.5)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fillStyle = holeGradient;
        ctx.fill();

        // Gravitational lensing effect
        ctx.strokeStyle = 'rgba(200, 150, 255, 0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, size + 20 + i * 10, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Draw planet with optional rings
    function drawPlanet(x, y, size, color, hasRings, time) {
        // Planet glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        glow.addColorStop(0, color);
        glow.addColorStop(0.5, color + '40');
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Rings
        if (hasRings) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(0.3);
            ctx.scale(1, 0.3);
            ctx.strokeStyle = 'rgba(200, 180, 255, 0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, size * 1.8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(200, 180, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, size * 2.2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Planet body
        const planetGradient = ctx.createRadialGradient(x - size / 3, y - size / 3, 0, x, y, size);
        planetGradient.addColorStop(0, '#ffffff');
        planetGradient.addColorStop(0.3, color);
        planetGradient.addColorStop(1, '#000000');

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = planetGradient;
        ctx.fill();
    }

    // Draw cosmic patterns
    function drawPatterns(centerX, centerY, time) {
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
        ctx.lineWidth = 1;

        // Spiral pattern
        for (let j = 0; j < 2; j++) {
            ctx.beginPath();
            for (let i = 0; i < 360; i++) {
                const angle = (i * Math.PI / 180) + time * 0.0001 + j * Math.PI;
                const radius = i * 0.5;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Orbits
        ctx.strokeStyle = 'rgba(157, 78, 221, 0.15)';
        planets.forEach(planet => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, planet.orbitRadius * Math.min(canvas.width, canvas.height), 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    // Main animation loop
    function animate(timestamp) {
        time = timestamp || 0;
        const cycleProgress = (time % cycleDuration) / cycleDuration;

        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 18, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw stars
        stars.forEach(star => {
            const twinkle = 0.5 + 0.5 * Math.sin(time * 0.003 + star.twinkle);
            ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
            ctx.beginPath();
            ctx.arc(star.x * canvas.width, star.y * canvas.height, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw patterns
        drawPatterns(centerX, centerY, time);

        // Draw black hole
        drawBlackHole(centerX, centerY, time);

        // Draw planets orbiting
        planets.forEach(planet => {
            planet.angle += planet.speed * 16;
            const orbitSize = planet.orbitRadius * Math.min(canvas.width, canvas.height);
            const x = centerX + Math.cos(planet.angle) * orbitSize;
            const y = centerY + Math.sin(planet.angle) * orbitSize * 0.4; // Elliptical orbit
            drawPlanet(x, y, planet.size, planet.color, planet.rings, time);
        });

        animationId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // PERFORMANCE: Use Intersection Observer to pause when off-screen
    // This saves massive CPU/GPU when scrolling down to videos/games
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0 });

    observer.observe(canvas);
})();
