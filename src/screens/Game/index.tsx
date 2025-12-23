import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, Platform, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

// Inline HTML with embedded CSS and JavaScript
const getGameHTML = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Flappy Bird</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            touch-action: none;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            background-color: #70c5ce;
            font-family: Arial, sans-serif;
        }
        #game-container {
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #score-display {
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 42px;
            font-weight: bold;
            color: #fff;
            text-shadow: 
                3px 3px 0px rgba(0, 0, 0, 0.5),
                0px 0px 10px rgba(255, 215, 0, 0.5);
            z-index: 100;
            pointer-events: none;
            letter-spacing: 2px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.3));
            padding: 10px 25px;
            border-radius: 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
        }
        #game-over {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 200;
        }
        #game-over.hidden {
            display: none;
        }
        .game-over-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 3px solid rgba(255, 255, 255, 0.3);
            min-width: 280px;
        }
        .game-over-content h2 {
            font-size: 42px;
            margin-bottom: 20px;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            font-weight: bold;
        }
        .game-over-content p {
            font-size: 24px;
            margin-bottom: 25px;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        #final-score {
            font-weight: bold;
            color: #ffd700;
            font-size: 36px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            display: inline-block;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            margin: 10px 0;
        }
        #restart-btn {
            padding: 18px 40px;
            font-size: 22px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s;
            touch-action: manipulation;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        #restart-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        #restart-btn:active {
            transform: scale(0.98);
            background: linear-gradient(135deg, #e084e8 0%, #e04a5c 100%);
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <div id="score-display">Score: 0</div>
    <div id="game-over" class="hidden">
        <div class="game-over-content">
            <h2>Game Over!</h2>
            <p>Final Score: <span id="final-score">0</span></p>
            <button id="restart-btn">Tap to Restart</button>
        </div>
    </div>
    <script>
        // Beautiful Flappy Bird Game with enhanced graphics and animations
        class FlappyBirdGame {
            constructor() {
                this.canvas = null;
                this.ctx = null;
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.bird = {
                    x: 100,
                    y: this.height / 2,
                    width: 50,
                    height: 35,
                    velocity: 0,
                    gravity: 0.5,
                    jumpPower: -10,
                    wingAngle: 0,
                    wingSpeed: 0.3
                };
                this.pipes = [];
                this.clouds = [];
                this.particles = [];
                this.score = 0;
                this.gameOver = false;
                this.gameStarted = false;
                this.pipeGap = 200;
                this.pipeWidth = 70;
                this.pipeSpeed = 3;
                this.pipeSpawnInterval = 2000;
                this.lastPipeTime = 0;
                this.animationId = null;
                this.groundY = this.height - 80;
                this.groundOffset = 0;
                this.frameCount = 0;
                
                // Initialize clouds
                for (let i = 0; i < 5; i++) {
                    this.clouds.push({
                        x: Math.random() * this.width,
                        y: Math.random() * (this.height * 0.4),
                        size: 40 + Math.random() * 60,
                        speed: 0.2 + Math.random() * 0.3
                    });
                }
                
                window.gameInstance = this;
            }
            
            init() {
                this.canvas = document.createElement('canvas');
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.canvas.style.width = '100%';
                this.canvas.style.height = '100%';
                this.canvas.style.display = 'block';
                this.canvas.style.touchAction = 'none';
                
                const container = document.getElementById('game-container');
                container.innerHTML = '';
                container.appendChild(this.canvas);
                
                this.ctx = this.canvas.getContext('2d');
                
                // Handle resize
                window.addEventListener('resize', () => {
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.canvas.width = this.width;
                    this.canvas.height = this.height;
                });
                
                // Handle input
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleTap();
                });
                this.canvas.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.handleTap();
                });
                
                this.gameLoop();
            }
            
            handleTap() {
                    if (!this.gameStarted) {
                        this.gameStarted = true;
                    this.bird.velocity = 0;
                        this.spawnPipe();
                    this.lastPipeTime = Date.now();
                    }
                    if (!this.gameOver) {
                    this.bird.velocity = this.bird.jumpPower;
                    this.sendToReactNative({ type: 'BIRD_JUMP' });
                }
            }
            
            spawnPipe() {
                const minGap = this.pipeGap + 100;
                const maxGap = this.height - this.pipeGap - 100;
                const gapY = Math.random() * (maxGap - minGap) + minGap;
                
                this.pipes.push({
                    x: this.width,
                    gapY: gapY,
                    gapSize: this.pipeGap,
                    scored: false
                });
            }
            
            update() {
                this.frameCount++;
                
                // Update bird wing animation
                if (this.gameStarted && !this.gameOver) {
                    this.bird.wingAngle += this.bird.wingSpeed;
                }
                
                // Update clouds
                this.clouds.forEach(cloud => {
                    cloud.x -= cloud.speed;
                    if (cloud.x + cloud.size < 0) {
                        cloud.x = this.width + cloud.size;
                    }
                });
                
                // Update ground scrolling
                if (this.gameStarted && !this.gameOver) {
                    this.groundOffset = (this.groundOffset - this.pipeSpeed) % 50;
                }
                
                // Update particles
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const p = this.particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1; // gravity
                    p.life--;
                    if (p.life <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
                
                if (!this.gameStarted || this.gameOver) return;
                
                // Update bird
                this.bird.velocity += this.bird.gravity;
                this.bird.y += this.bird.velocity;
                
                // Spawn pipes
                const now = Date.now();
                if (now - this.lastPipeTime > this.pipeSpawnInterval) {
                    this.spawnPipe();
                    this.lastPipeTime = now;
                }
                
                // Update pipes
                for (let i = this.pipes.length - 1; i >= 0; i--) {
                    const pipe = this.pipes[i];
                    pipe.x -= this.pipeSpeed;
                    
                    // Check scoring
                    if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
                        pipe.scored = true;
                        this.addScore();
                        this.createScoreParticles(pipe.x + this.pipeWidth / 2, pipe.gapY);
                    }
                    
                    // Check collision
                    if (this.checkCollision(pipe)) {
                        this.createCrashParticles();
                        this.endGame();
                        return;
                    }
                    
                    // Remove off-screen pipes
                    if (pipe.x + this.pipeWidth < 0) {
                        this.pipes.splice(i, 1);
                    }
                }
                
                // Check boundaries
                if (this.bird.y < 0 || this.bird.y + this.bird.height > this.groundY) {
                    this.createCrashParticles();
                    this.endGame();
                }
            }
            
            checkCollision(pipe) {
                // More precise collision detection with bird's circular shape
                const birdCenterX = this.bird.x + this.bird.width / 2;
                const birdCenterY = this.bird.y + this.bird.height / 2;
                const birdRadius = Math.min(this.bird.width, this.bird.height) / 2;
                
                const pipeLeft = pipe.x;
                const pipeRight = pipe.x + this.pipeWidth;
                const gapTop = pipe.gapY - pipe.gapSize / 2;
                const gapBottom = pipe.gapY + pipe.gapSize / 2;
                
                // Check if bird center is within pipe's x range
                if (birdCenterX + birdRadius > pipeLeft && birdCenterX - birdRadius < pipeRight) {
                    // Check if bird is outside the gap (with radius consideration)
                    if (birdCenterY - birdRadius < gapTop || birdCenterY + birdRadius > gapBottom) {
                        return true;
                    }
                }
                return false;
            }
            
            drawBackground() {
                // Sky gradient
                const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
                gradient.addColorStop(0, '#87CEEB');
                gradient.addColorStop(0.7, '#70c5ce');
                gradient.addColorStop(1, '#5fb3c7');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.width, this.height);
            }
            
            drawClouds() {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.clouds.forEach(cloud => {
                    this.drawCloud(cloud.x, cloud.y, cloud.size);
                });
            }
            
            drawCloud(x, y, size) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
                this.ctx.arc(x + size * 0.4, y, size * 0.6, 0, Math.PI * 2);
                this.ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
                this.ctx.arc(x + size * 0.4, y - size * 0.3, size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            drawPipes() {
                this.pipes.forEach(pipe => {
                    const topHeight = pipe.gapY - pipe.gapSize / 2;
                    const bottomY = pipe.gapY + pipe.gapSize / 2;
                    const bottomHeight = this.groundY - bottomY;
                    
                    // Top pipe
                    this.drawPipe(pipe.x, 0, this.pipeWidth, topHeight, true);
                    
                    // Bottom pipe
                    this.drawPipe(pipe.x, bottomY, this.pipeWidth, bottomHeight, false);
                });
            }
            
            drawPipe(x, y, width, height, isTop) {
                // Pipe body gradient
                const gradient = this.ctx.createLinearGradient(x, y, x + width, y);
                gradient.addColorStop(0, '#2ecc71');
                gradient.addColorStop(0.5, '#27ae60');
                gradient.addColorStop(1, '#229954');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, y, width, height);
                
                // Pipe border
                this.ctx.strokeStyle = '#1e8449';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(x, y, width, height);
                
                // Pipe cap
                const capHeight = 30;
                const capY = isTop ? y + height - capHeight : y;
                
                // Cap gradient
                const capGradient = this.ctx.createLinearGradient(x, capY, x, capY + capHeight);
                capGradient.addColorStop(0, '#229954');
                capGradient.addColorStop(1, '#1e8449');
                this.ctx.fillStyle = capGradient;
                this.ctx.fillRect(x - 5, capY, width + 10, capHeight);
                
                // Cap border
                this.ctx.strokeStyle = '#145a32';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x - 5, capY, width + 10, capHeight);
                
                // Cap highlight
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.fillRect(x - 3, capY + 2, width + 6, 8);
            }
            
            drawGround() {
                // Ground gradient
                const groundGradient = this.ctx.createLinearGradient(0, this.groundY, 0, this.height);
                groundGradient.addColorStop(0, '#deb887');
                groundGradient.addColorStop(0.3, '#d2b48c');
                groundGradient.addColorStop(1, '#c19a6b');
                this.ctx.fillStyle = groundGradient;
                this.ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);
                
                // Ground texture (grass)
                this.ctx.fillStyle = '#8b7355';
                for (let x = this.groundOffset; x < this.width; x += 50) {
                    this.ctx.fillRect(x, this.groundY, 2, 5);
                }
                
                // Ground border
                this.ctx.strokeStyle = '#8b6f47';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.groundY);
                this.ctx.lineTo(this.width, this.groundY);
                this.ctx.stroke();
            }
            
            drawBird() {
                const centerX = this.bird.x + this.bird.width / 2;
                const centerY = this.bird.y + this.bird.height / 2;
                const birdAngle = Math.min(Math.max(this.bird.velocity * 2.5, -25), 70);
                
                this.ctx.save();
                this.ctx.translate(centerX, centerY);
                this.ctx.rotate(birdAngle * Math.PI / 180);
                
                // Bird body (ellipse)
                const bodyGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.bird.width / 2);
                bodyGradient.addColorStop(0, '#ffd700');
                bodyGradient.addColorStop(0.7, '#ffeb3b');
                bodyGradient.addColorStop(1, '#ffc107');
                this.ctx.fillStyle = bodyGradient;
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, this.bird.width / 2, this.bird.height / 2, 0, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Bird body border
                this.ctx.strokeStyle = '#ffa000';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Wing animation
                const wingOffset = Math.sin(this.bird.wingAngle) * 8;
                this.ctx.save();
                this.ctx.translate(-this.bird.width / 4, wingOffset);
                this.ctx.rotate(Math.sin(this.bird.wingAngle) * 0.5);
                
                // Wing
                const wingGradient = this.ctx.createLinearGradient(-10, 0, 10, 0);
                wingGradient.addColorStop(0, '#ff9800');
                wingGradient.addColorStop(1, '#ffc107');
                this.ctx.fillStyle = wingGradient;
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#ff6f00';
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
                this.ctx.restore();
                
                // Eye
                this.ctx.fillStyle = '#000';
                this.ctx.beginPath();
                this.ctx.arc(this.bird.width / 4, -this.bird.height / 6, 4, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Eye highlight
                this.ctx.fillStyle = '#fff';
                this.ctx.beginPath();
                this.ctx.arc(this.bird.width / 4 + 1, -this.bird.height / 6 - 1, 1.5, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Beak
                this.ctx.fillStyle = '#ff6f00';
                this.ctx.beginPath();
                this.ctx.moveTo(this.bird.width / 2 - 2, 0);
                this.ctx.lineTo(this.bird.width / 2 + 8, -3);
                this.ctx.lineTo(this.bird.width / 2 + 8, 3);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.restore();
            }
            
            drawParticles() {
                this.particles.forEach(p => {
                    this.ctx.save();
                    this.ctx.globalAlpha = p.life / 30;
                    this.ctx.fillStyle = p.color;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                });
            }
            
            createScoreParticles(x, y) {
                for (let i = 0; i < 10; i++) {
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4 - 2,
                        size: 3 + Math.random() * 3,
                        color: '#ffd700',
                        life: 30
                    });
                }
            }
            
            createCrashParticles() {
                const centerX = this.bird.x + this.bird.width / 2;
                const centerY = this.bird.y + this.bird.height / 2;
                for (let i = 0; i < 20; i++) {
                    this.particles.push({
                        x: centerX,
                        y: centerY,
                        vx: (Math.random() - 0.5) * 8,
                        vy: (Math.random() - 0.5) * 8 - 3,
                        size: 4 + Math.random() * 4,
                        color: ['#ffeb3b', '#ff9800', '#ff6f00'][Math.floor(Math.random() * 3)],
                        life: 40
                    });
                }
            }
            
            draw() {
                // Draw all layers
                this.drawBackground();
                this.drawClouds();
                this.drawPipes();
                this.drawGround();
                this.drawParticles();
                this.drawBird();
                
                // Draw instructions
                if (!this.gameStarted && !this.gameOver) {
                    const pulse = Math.sin(this.frameCount * 0.1) * 0.3 + 0.7;
                    this.ctx.globalAlpha = pulse;
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = 'bold 28px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeText('Tap to Start', this.width / 2, this.height / 2 - 30);
                    this.ctx.fillText('Tap to Start', this.width / 2, this.height / 2 - 30);
                    this.ctx.strokeText('Tap to Fly', this.width / 2, this.height / 2 + 10);
                    this.ctx.fillText('Tap to Fly', this.width / 2, this.height / 2 + 10);
                    this.ctx.globalAlpha = 1;
                }
            }
            
            gameLoop() {
                this.update();
                this.draw();
                this.animationId = requestAnimationFrame(() => this.gameLoop());
            }
            
            addScore() {
                this.score++;
                const scoreDisplay = document.getElementById('score-display');
                if (scoreDisplay) {
                    scoreDisplay.textContent = 'Score: ' + this.score;
                }
                this.sendToReactNative({ type: 'SCORE_UPDATE', score: this.score });
                
                // Send special event when score reaches 10
                if (this.score === 3) {
                    this.sendToReactNative({ type: 'SCORE_REACHED_10', score: this.score });
                }
            }
            
            endGame() {
                if (this.gameOver) return;
                this.gameOver = true;
                
                const gameOverDiv = document.getElementById('game-over');
                const finalScoreSpan = document.getElementById('final-score');
                if (gameOverDiv && finalScoreSpan) {
                    finalScoreSpan.textContent = this.score;
                    gameOverDiv.classList.remove('hidden');
                }
                
                this.sendToReactNative({ type: 'GAME_OVER', score: this.score });
                
                const restartBtn = document.getElementById('restart-btn');
                if (restartBtn) {
                    restartBtn.onclick = () => this.restart();
                }
            }
            
            restart() {
                const gameOverDiv = document.getElementById('game-over');
                if (gameOverDiv) {
                    gameOverDiv.classList.add('hidden');
                }
                
                this.score = 0;
                this.gameOver = false;
                this.gameStarted = false;
                this.lastPipeTime = 0;
                this.pipes = [];
                this.particles = [];
                this.bird.x = 100;
                this.bird.y = this.height / 2;
                this.bird.velocity = 0;
                this.bird.wingAngle = 0;
                this.groundOffset = 0;
                this.frameCount = 0;
                
                const scoreDisplay = document.getElementById('score-display');
                if (scoreDisplay) {
                    scoreDisplay.textContent = 'Score: 0';
                }
                
                this.sendToReactNative({ type: 'GAME_RESTART' });
            }
            
            sendToReactNative(data) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(data));
                }
            }
        }
        
        // Initialize game
        function initGame() {
            console.log('Initializing Flappy Bird game...');
            try {
                const game = new FlappyBirdGame();
                game.init();
                console.log('Game initialized successfully!');
            } catch (error) {
                console.error('Error initializing game:', error);
            }
        }
        
        // Start game when DOM is ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(initGame, 100);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initGame, 100);
            });
        }
    </script>
</body>
</html>
  `;
};

const Game = () => {
  const webViewRef = useRef(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'SCORE_UPDATE':
          setScore(data.score);
          console.log('Score updated:', data.score);
          break;
        case 'SCORE_REACHED_10':
          setScore(data.score);
          console.log('Score reached 10!', data.score);
          // Alert.alert(
          //   'Congratulations! 🎉',
          //   'You reached 10 points!',
          //   [{ text: 'Awesome!', style: 'default' }]
          // );
          // You can add any additional logic here, like navigation, etc.
          break;
        case 'GAME_OVER':
          setScore(data.score);
          // Alert.alert(
          //   'Game Over! 🎮',
          //   `Your final score: ${data.score}`,
          //   [
          //     {
          //       text: 'Play Again',
          //       onPress: () => {
          //         webViewRef.current?.injectJavaScript(`
          //           if (window.gameInstance) {
          //             window.gameInstance.restart();
          //           }
          //         `);
          //       }
          //     },
          //     { text: 'OK', style: 'cancel' }
          //   ]
          // );
          break;
        case 'BIRD_JUMP':
          console.log('Bird jumped');
          break;
        case 'GAME_RESTART':
          setScore(0);
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html: getGameHTML() }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={handleMessage}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => {
          setLoading(false);
          console.log('Game loaded successfully!');
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setLoading(false);
          Alert.alert('Error', 'Failed to load game. Please try again.');
        }}
        originWhitelist={['*']}
        mixedContentMode="always"
        allowFileAccess={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70c5ce',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#70c5ce',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
});

export {Game};

