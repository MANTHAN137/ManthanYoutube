import { useState, useEffect, useRef, useCallback } from 'react';
import './Games.css';

const Games = () => {
    const [activeGame, setActiveGame] = useState(null);

    const games = [
        { id: 'snake', name: 'SNAKE', icon: '🐍', desc: 'Eat food, grow longer!', color: '#00d4ff' },
        { id: 'tictactoe', name: 'TIC-TAC-TOE', icon: '⭕', desc: 'Classic X vs O', color: '#9d4edd' },
        { id: 'runner', name: 'SPACE RUNNER', icon: '🚀', desc: 'Jump to dodge!', color: '#00d4ff' },
        { id: 'shooter', name: 'ASTEROID SHOOTER', icon: '🎯', desc: 'Click to destroy!', color: '#ff0844' },
    ];

    return (
        <div className="games-page">
            <div className="page-header">
                <h1 className="page-title">
                    PLAY <span className="gradient-text-red">GAMES</span>
                </h1>
                <p className="games-subtitle">Choose a game and have fun!</p>
                <div className="title-underline red"></div>
            </div>

            {/* Game Cards Grid */}
            <div className="games-grid">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className={`game-card ${activeGame === game.id ? 'active' : ''}`}
                        style={{ '--game-color': game.color }}
                        onClick={() => setActiveGame(activeGame === game.id ? null : game.id)}
                    >
                        <div className="game-card-glow"></div>
                        <div className="game-card-content">
                            <div className="game-icon">{game.icon}</div>
                            <h3 className="game-title">{game.name}</h3>
                            <p className="game-desc">{game.desc}</p>
                            <button className="play-game-btn">
                                {activeGame === game.id ? '✕ CLOSE' : '▶ PLAY'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Game Canvas Area */}
            {activeGame && (
                <div className="game-canvas-area">
                    <div className="game-header">
                        <h3>{games.find(g => g.id === activeGame)?.icon} {games.find(g => g.id === activeGame)?.name}</h3>
                        <button className="close-game-btn" onClick={() => setActiveGame(null)}>✕</button>
                    </div>
                    <div className="game-container">
                        {activeGame === 'snake' && <SnakeGame />}
                        {activeGame === 'tictactoe' && <TicTacToe />}
                        {activeGame === 'runner' && <SpaceRunner />}
                        {activeGame === 'shooter' && <AsteroidShooter />}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============ SNAKE GAME ============
const SnakeGame = () => {
    const canvasRef = useRef(null);
    const gameRef = useRef({
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 15 },
        dx: 1,
        dy: 0,
        score: 0,
        gameOver: false,
        started: false
    });
    const [displayScore, setDisplayScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [started, setStarted] = useState(false);

    const resetGame = useCallback(() => {
        gameRef.current = {
            snake: [{ x: 10, y: 10 }],
            food: { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) },
            dx: 1,
            dy: 0,
            score: 0,
            gameOver: false,
            started: true
        };
        setDisplayScore(0);
        setGameOver(false);
        setStarted(true);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const gridSize = 20;
        const tileCount = 20;
        canvas.width = gridSize * tileCount;
        canvas.height = gridSize * tileCount;

        const handleKeyDown = (e) => {
            const game = gameRef.current;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                if (!game.started) {
                    game.started = true;
                    setStarted(true);
                }
            }

            switch (e.key) {
                case 'ArrowUp': if (game.dy !== 1) { game.dx = 0; game.dy = -1; } break;
                case 'ArrowDown': if (game.dy !== -1) { game.dx = 0; game.dy = 1; } break;
                case 'ArrowLeft': if (game.dx !== 1) { game.dx = -1; game.dy = 0; } break;
                case 'ArrowRight': if (game.dx !== -1) { game.dx = 1; game.dy = 0; } break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const draw = () => {
            const game = gameRef.current;

            // Clear canvas
            ctx.fillStyle = '#0a0a12';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
            for (let i = 0; i <= tileCount; i++) {
                ctx.beginPath();
                ctx.moveTo(i * gridSize, 0);
                ctx.lineTo(i * gridSize, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * gridSize);
                ctx.lineTo(canvas.width, i * gridSize);
                ctx.stroke();
            }

            // Draw food as apple 🍎
            const foodX = game.food.x * gridSize + gridSize / 2;
            const foodY = game.food.y * gridSize + gridSize / 2;
            ctx.shadowColor = '#ff0844';
            ctx.shadowBlur = 15;
            // Apple body
            ctx.fillStyle = '#ff0844';
            ctx.beginPath();
            ctx.arc(foodX, foodY + 2, gridSize / 2 - 3, 0, Math.PI * 2);
            ctx.fill();
            // Apple highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(foodX - 3, foodY - 2, 4, 0, Math.PI * 2);
            ctx.fill();
            // Apple stem
            ctx.strokeStyle = '#4a2c00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(foodX, foodY - 6);
            ctx.lineTo(foodX + 2, foodY - 10);
            ctx.stroke();
            // Apple leaf
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.ellipse(foodX + 4, foodY - 8, 4, 2, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw snake with proper graphics
            game.snake.forEach((seg, i) => {
                const x = seg.x * gridSize;
                const y = seg.y * gridSize;
                const centerX = x + gridSize / 2;
                const centerY = y + gridSize / 2;

                ctx.shadowColor = '#00d4ff';
                ctx.shadowBlur = i === 0 ? 20 : 8;

                if (i === 0) {
                    // Snake head - rounded with eyes
                    ctx.fillStyle = '#00ffff';
                    ctx.beginPath();
                    ctx.roundRect(x + 1, y + 1, gridSize - 2, gridSize - 2, 6);
                    ctx.fill();

                    // Eyes based on direction
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 0;
                    const eyeOffset = 4;
                    let eye1X, eye1Y, eye2X, eye2Y;

                    if (game.dx === 1) { // Right
                        eye1X = centerX + 3; eye1Y = centerY - 4;
                        eye2X = centerX + 3; eye2Y = centerY + 4;
                    } else if (game.dx === -1) { // Left
                        eye1X = centerX - 3; eye1Y = centerY - 4;
                        eye2X = centerX - 3; eye2Y = centerY + 4;
                    } else if (game.dy === -1) { // Up
                        eye1X = centerX - 4; eye1Y = centerY - 3;
                        eye2X = centerX + 4; eye2Y = centerY - 3;
                    } else { // Down
                        eye1X = centerX - 4; eye1Y = centerY + 3;
                        eye2X = centerX + 4; eye2Y = centerY + 3;
                    }

                    ctx.beginPath();
                    ctx.arc(eye1X, eye1Y, 3, 0, Math.PI * 2);
                    ctx.arc(eye2X, eye2Y, 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Pupils
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(eye1X, eye1Y, 1.5, 0, Math.PI * 2);
                    ctx.arc(eye2X, eye2Y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Snake body segments - rounded rectangles
                    const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
                    gradient.addColorStop(0, '#00d4ff');
                    gradient.addColorStop(1, '#0099cc');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.roundRect(x + 2, y + 2, gridSize - 4, gridSize - 4, 4);
                    ctx.fill();

                    // Segment detail
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.roundRect(x + 3, y + 3, gridSize - 6, gridSize - 6, 3);
                    ctx.stroke();
                }
            });
            ctx.shadowBlur = 0;

            // Draw start message if not started
            if (!game.started) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#00d4ff';
                ctx.font = 'bold 24px Orbitron';
                ctx.textAlign = 'center';
                ctx.fillText('Press Arrow Keys to Start', canvas.width / 2, canvas.height / 2);
                ctx.textAlign = 'left';
            }
        };

        const update = () => {
            const game = gameRef.current;
            if (!game.started || game.gameOver) return;

            const head = { x: game.snake[0].x + game.dx, y: game.snake[0].y + game.dy };

            // Wall collision
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                game.gameOver = true;
                setGameOver(true);
                return;
            }

            // Self collision
            if (game.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
                game.gameOver = true;
                setGameOver(true);
                return;
            }

            game.snake.unshift(head);

            // Eat food
            if (head.x === game.food.x && head.y === game.food.y) {
                game.score += 10;
                setDisplayScore(game.score);
                game.food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
            } else {
                game.snake.pop();
            }
        };

        // Initial draw
        draw();

        const gameLoop = setInterval(() => {
            update();
            draw();
        }, 120);

        return () => {
            clearInterval(gameLoop);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="snake-game">
            <div className="game-score">Score: {displayScore}</div>
            <canvas ref={canvasRef}></canvas>
            {gameOver && (
                <div className="game-overlay game-over">
                    <h2>Game Over!</h2>
                    <p>Final Score: {displayScore}</p>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
        </div>
    );
};


// ============ TIC-TAC-TOE ============
const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const checkWinner = useCallback((squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.every(s => s) ? 'Draw' : null;
    }, []);

    const handleClick = (i) => {
        if (board[i] || winner) return;
        const newBoard = [...board];
        newBoard[i] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
        setWinner(checkWinner(newBoard));
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    return (
        <div className="tictactoe-game">
            <div className="ttt-status">
                {winner ? (winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`) : `Next: ${isXNext ? 'X' : 'O'}`}
            </div>
            <div className="ttt-board">
                {board.map((cell, i) => (
                    <button
                        key={i}
                        className={`ttt-cell ${cell}`}
                        onClick={() => handleClick(i)}
                    >
                        {cell}
                    </button>
                ))}
            </div>
            <button className="ttt-reset" onClick={resetGame}>Reset Game</button>
        </div>
    );
};

// ============ SPACE RUNNER ============
const SpaceRunner = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 300;

        let gameState = 'waiting';
        let score = 0;
        let highScore = localStorage.getItem('spaceRunnerHigh') || 0;

        const player = { x: 80, y: canvas.height - 60, width: 40, height: 40, velocityY: 0, grounded: true };
        const gravity = 0.6, jumpForce = -18; // Higher jump, less gravity
        const obstacles = [];
        let gameSpeed = 6;
        let lastObstacleX = 0; // Track last obstacle position
        const MIN_OBSTACLE_GAP = 250; // Minimum pixels between obstacles

        const stars = Array(50).fill(0).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 2 + 1
        }));

        const jump = () => {
            if (gameState === 'waiting') {
                gameState = 'playing';
                score = 0;
                obstacles.length = 0;
                lastObstacleX = 0;
            }
            if (player.grounded && gameState === 'playing') {
                player.velocityY = jumpForce;
                player.grounded = false;
            }
            if (gameState === 'gameover') {
                gameState = 'playing';
                score = 0;
                obstacles.length = 0;
                player.y = canvas.height - 60;
                player.velocityY = 0;
                gameSpeed = 6;
                lastObstacleX = 0;
            }
        };

        canvas.addEventListener('click', jump);
        const handleKey = (e) => { if (e.code === 'Space') { e.preventDefault(); jump(); } };
        document.addEventListener('keydown', handleKey);

        const gameLoop = () => {
            // Update
            if (gameState === 'playing') {
                player.velocityY += gravity;
                player.y += player.velocityY;
                if (player.y >= canvas.height - 60) {
                    player.y = canvas.height - 60;
                    player.velocityY = 0;
                    player.grounded = true;
                }

                // Update obstacles
                for (let i = obstacles.length - 1; i >= 0; i--) {
                    obstacles[i].x -= gameSpeed;
                    if (obstacles[i].x + 30 < 0) {
                        obstacles.splice(i, 1);
                        score++;
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('spaceRunnerHigh', highScore);
                        }
                    }
                    // Collision detection with smaller hitbox for fairness
                    if (player.x + 10 < obstacles[i].x + 25 &&
                        player.x + 35 > obstacles[i].x + 5 &&
                        player.y + 10 < obstacles[i].y + 45 &&
                        player.y + 35 > obstacles[i].y + 5) {
                        gameState = 'gameover';
                    }
                }

                // Spawn obstacles with minimum gap
                const lastObs = obstacles[obstacles.length - 1];
                const canSpawn = !lastObs || (canvas.width - lastObs.x) >= MIN_OBSTACLE_GAP;

                if (canSpawn && Math.random() < 0.015) { // Lower spawn rate
                    obstacles.push({
                        x: canvas.width,
                        y: canvas.height - 50,
                        width: 30,
                        height: 50
                    });
                }

                // Gradual speed increase, capped for playability
                gameSpeed = Math.min(10, 6 + Math.floor(score / 10) * 0.5);
            }

            // Draw
            ctx.fillStyle = '#0a0a12';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            stars.forEach(star => { ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill(); star.x -= star.speed; if (star.x < 0) star.x = canvas.width; });

            // Ground line with glow
            ctx.strokeStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 10;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 10);
            ctx.lineTo(canvas.width, canvas.height - 10);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw Spaceship/Jet 🚀
            const px = player.x;
            const py = player.y;
            ctx.save();

            // Rocket body
            ctx.fillStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(px + 40, py + 20); // Nose
            ctx.lineTo(px + 5, py + 5);   // Top
            ctx.lineTo(px, py + 20);      // Back top
            ctx.lineTo(px, py + 30);      // Back bottom
            ctx.lineTo(px + 5, py + 35);  // Bottom
            ctx.lineTo(px + 40, py + 20); // Back to nose
            ctx.fill();

            // Cockpit window
            ctx.fillStyle = '#0a0a12';
            ctx.beginPath();
            ctx.ellipse(px + 25, py + 20, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
            ctx.beginPath();
            ctx.ellipse(px + 25, py + 18, 5, 3, 0, 0, Math.PI * 2);
            ctx.fill();

            // Engine flames (animated)
            const flameLength = 10 + Math.random() * 10;
            ctx.fillStyle = '#ff6b00';
            ctx.beginPath();
            ctx.moveTo(px, py + 15);
            ctx.lineTo(px - flameLength, py + 20);
            ctx.lineTo(px, py + 25);
            ctx.fill();
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(px, py + 17);
            ctx.lineTo(px - flameLength * 0.6, py + 20);
            ctx.lineTo(px, py + 23);
            ctx.fill();

            // Wing details
            ctx.fillStyle = '#0099cc';
            ctx.beginPath();
            ctx.moveTo(px + 10, py + 5);
            ctx.lineTo(px + 5, py);
            ctx.lineTo(px + 15, py + 10);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(px + 10, py + 35);
            ctx.lineTo(px + 5, py + 40);
            ctx.lineTo(px + 15, py + 30);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.restore();

            // Draw Asteroids 🪨
            obstacles.forEach(obs => {
                ctx.save();
                const cx = obs.x + 15;
                const cy = obs.y + 25;

                // Main asteroid body
                ctx.fillStyle = '#666';
                ctx.shadowColor = '#ff0844';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                // Irregular shape
                ctx.moveTo(cx, cy - 20);
                ctx.lineTo(cx + 12, cy - 15);
                ctx.lineTo(cx + 15, cy - 5);
                ctx.lineTo(cx + 12, cy + 15);
                ctx.lineTo(cx + 5, cy + 20);
                ctx.lineTo(cx - 8, cy + 18);
                ctx.lineTo(cx - 12, cy + 5);
                ctx.lineTo(cx - 10, cy - 10);
                ctx.lineTo(cx - 5, cy - 18);
                ctx.closePath();
                ctx.fill();

                // Craters
                ctx.fillStyle = '#444';
                ctx.beginPath();
                ctx.arc(cx - 3, cy - 5, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(cx + 5, cy + 8, 3, 0, Math.PI * 2);
                ctx.fill();

                // Highlight
                ctx.fillStyle = '#888';
                ctx.beginPath();
                ctx.arc(cx - 5, cy - 10, 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;
                ctx.restore();
            });

            ctx.fillStyle = '#fff';
            ctx.font = '20px Orbitron';
            ctx.fillText(`Score: ${score}`, 20, 30);
            ctx.fillText(`High: ${highScore}`, 20, 55);

            if (gameState === 'waiting') { ctx.fillStyle = '#00d4ff'; ctx.font = '24px Orbitron'; ctx.textAlign = 'center'; ctx.fillText('Click or SPACE to Start', canvas.width / 2, canvas.height / 2); ctx.textAlign = 'left'; }
            if (gameState === 'gameover') { ctx.fillStyle = '#ff0844'; ctx.font = '32px Orbitron'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20); ctx.font = '18px Orbitron'; ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 20); ctx.textAlign = 'left'; }

            requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => { document.removeEventListener('keydown', handleKey); };
    }, []);

    return <canvas ref={canvasRef} className="game-canvas"></canvas>;
};

// ============ ASTEROID SHOOTER ============
const AsteroidShooter = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 350;

        let score = 0, lives = 3, gameState = 'playing';
        const asteroids = [], explosions = [];

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left, clickY = e.clientY - rect.top;
            for (let i = asteroids.length - 1; i >= 0; i--) {
                const dx = clickX - asteroids[i].x, dy = clickY - asteroids[i].y;
                if (Math.sqrt(dx * dx + dy * dy) < asteroids[i].radius) {
                    explosions.push({ x: asteroids[i].x, y: asteroids[i].y, radius: asteroids[i].radius, alpha: 1 });
                    asteroids.splice(i, 1);
                    score += 10;
                    break;
                }
            }
        });

        const gameLoop = () => {
            if (gameState === 'playing') {
                if (Math.random() < 0.03) asteroids.push({ x: Math.random() * (canvas.width - 60) + 30, y: -40, radius: Math.random() * 20 + 20, speed: Math.random() * 2 + 1 });

                for (let i = asteroids.length - 1; i >= 0; i--) {
                    asteroids[i].y += asteroids[i].speed;
                    if (asteroids[i].y > canvas.height + asteroids[i].radius) { asteroids.splice(i, 1); lives--; if (lives <= 0) gameState = 'gameover'; }
                }

                for (let i = explosions.length - 1; i >= 0; i--) { explosions[i].alpha -= 0.05; explosions[i].radius += 2; if (explosions[i].alpha <= 0) explosions.splice(i, 1); }
            }

            ctx.fillStyle = '#0a0a12';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw starfield background
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 30; i++) {
                ctx.beginPath();
                ctx.arc((i * 47 + Date.now() / 50) % canvas.width, (i * 31) % canvas.height, 1, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Asteroids with proper graphics 🪨
            asteroids.forEach(a => {
                ctx.save();
                ctx.translate(a.x, a.y);

                // Rotate slowly
                const rotation = Date.now() / 2000 + a.x;
                ctx.rotate(rotation);

                // Main asteroid body with gradient
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, a.radius);
                gradient.addColorStop(0, '#777');
                gradient.addColorStop(0.5, '#555');
                gradient.addColorStop(1, '#333');

                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 10;
                ctx.fillStyle = gradient;

                // Irregular polygon shape
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const r = a.radius * (0.7 + 0.3 * Math.sin(i * 3.7));
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();

                // Craters
                ctx.fillStyle = '#444';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(-a.radius * 0.3, -a.radius * 0.2, a.radius * 0.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(a.radius * 0.2, a.radius * 0.25, a.radius * 0.15, 0, Math.PI * 2);
                ctx.fill();

                // Highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(-a.radius * 0.3, -a.radius * 0.4, a.radius * 0.1, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            // Draw explosions with particles 💥
            explosions.forEach(e => {
                ctx.save();
                ctx.translate(e.x, e.y);

                // Outer explosion
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 20;
                ctx.fillStyle = `rgba(255, 150, 0, ${e.alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(0, 0, e.radius * 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Core explosion
                ctx.fillStyle = `rgba(255, 255, 100, ${e.alpha})`;
                ctx.beginPath();
                ctx.arc(0, 0, e.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();

                // Particles
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const dist = e.radius * (1 + Math.random() * 0.5);
                    ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, ${e.alpha})`;
                    ctx.beginPath();
                    ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            ctx.fillStyle = '#fff';
            ctx.font = '20px Orbitron';
            ctx.fillText(`Score: ${score}`, 20, 30);
            ctx.fillText(`Lives: ${'❤️'.repeat(lives)}`, 20, 55);

            if (gameState === 'gameover') { ctx.fillStyle = '#ff0844'; ctx.font = '32px Orbitron'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2); ctx.font = '18px Orbitron'; ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40); ctx.textAlign = 'left'; }

            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }, []);

    return <canvas ref={canvasRef} className="game-canvas"></canvas>;
};

export default Games;
