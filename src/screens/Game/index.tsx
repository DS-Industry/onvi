import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, Platform, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { imagesBase64 } from './imageBase64'; 
import { dp } from '@utils/dp';
import ScreenHeader from '@components/ScreenHeader';

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
            top: 60px;
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
            white-space: nowrap;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
        }
        #coins-display {
            position: absolute;
            top: 140px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 32px;
            font-weight: bold;
            color: #ffd700;
            text-shadow:
                2px 2px 0px rgba(0, 0, 0, 0.5),
                0px 0px 8px rgba(255, 215, 0, 0.7);
            z-index: 100;
            pointer-events: none;
            letter-spacing: 1px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
            padding: 8px 20px;
            border-radius: 12px;
            white-space: nowrap;
            border: 2px solid rgba(255, 215, 0, 0.4);
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
            margin-bottom: 10px;
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
        #final-coins {
            font-weight: bold;
            color: #ffd700;
            font-size: 28px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            display: inline-block;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            margin: 5px 0 20px 0;
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
    <div id="score-display">Счет: 0</div>
    <div id="coins-display">Монеты: 0</div>
    <div id="game-over" class="hidden">
        <div class="game-over-content">
            <h2>Игра окончена!</h2>
            <p>Итого: <span id="final-score">0</span></p>
            <p>Монеты: <span id="final-coins">0</span></p>
            <button id="restart-btn">Переиграть</button>
        </div>
    </div>
    <img id="bird-sprite" src="${imagesBase64.bird}" style="display:none" />
    <img id="brush-img" src="${imagesBase64.brush}" style="display:none" />
    <img id="road-img"  src="${imagesBase64.road}"  style="display:none" />
    <img id="coin-img" src="${imagesBase64.coin}" style="display:none" />

    <img id="redCar" src="${imagesBase64.redCar}" style="display:none" />
    <img id="yellowCar" src="${imagesBase64.yellowCar}" style="display:none" />
    <img id="grayCar" src="${imagesBase64.grayCar}" style="display:none" />
    <img id="greenCar" src="${imagesBase64.greenCar}" style="display:none" />
    <img id="blueCar" src="${imagesBase64.blueCar}" style="display:none" />

    <script>
        class FlappyBirdGame {
            constructor() {
                this.canvas = null;
                this.ctx = null;
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.bird = {
                    x: 100,
                    y: this.height / 2,
                    width: 75,
                    height: 50,
                    velocity: 0,
                    gravity: 0.5,
                    jumpPower: -10,
                    wingAngle: 0,
                    wingSpeed: 0.3
                };
                this.pipes = [];
                this.coins = [];
                this.clouds = [];
                this.particles = [];
                this.score = 0;
                this.coinsCount = 0;
                this.gameOver = false;
                this.gameStarted = false;
                this.pipeGap = 200;
                this.brushWidth = 90;
                this.pipeWidth = this.brushWidth;
                this.pipeSpeed = 3;
                this.pipeSpawnInterval = 2000; // 2 секунды
                this.lastPipeTime = 0;
                this.animationId = null;
                this.groundY = this.height - 80;
                this.groundOffset = 0;
                this.frameCount = 0;
                this.roadSpeed = this.pipeSpeed;
                this.roadImg = null;
                
                // Параметры для синусоиды монет
                this.coinSize = 25;
                this.coinSpacing = 35;
                this.coinWaveAmplitude = 40;
                this.coinWaveFrequency = 0.02;
                this.coinPhase = 0;
                this.coinRotationSpeed = 0.05;
                this.coinFloatAmplitude = 3;
                this.coinFloatSpeed = 0.05;

                // Initialize clouds
                for (let i = 0; i < 5; i++) {
                    this.clouds.push({
                        x: Math.random() * this.width,
                        y: Math.random() * (this.height * 0.4),
                        size: 40 + Math.random() * 60,
                        speed: 0.2 + Math.random() * 0.3
                    });
                }

                // Initialize cars
                this.cars = [];
                const carSettings = [
                    { speed: -3, imageId: "redCar", yOffset: 20 },       
                    { speed: 2, imageId: "yellowCar", yOffset: 45 },    
                    { speed: 4, imageId: "grayCar", yOffset: 45 }, 
                    { speed: -2, imageId: "greenCar", yOffset: 20 },
                    { speed: -3.5, imageId: "blueCar", yOffset: 20 },
                ];

                carSettings.forEach((setting, index) => {
                    this.cars.push({
                        x: setting.speed > 0
                            ? -100 - Math.random() * 200
                            : this.width + 100 + Math.random() * 200,
                        y: this.groundY - 40 + setting.yOffset,
                        width: 60,
                        height: 30,
                        originalSpeed: setting.speed,
                        speed: setting.speed,
                        imageId: setting.imageId
                    });
                });

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

                this.roadImg = document.getElementById('road-img');

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
                    this.cars.forEach(car => {
                        car.speed = car.originalSpeed - this.roadSpeed;
                    });
                    this.bird.velocity = 0;
                    
                    // Создаем первые две трубы сразу
                    this.spawnInitialPipes();
                    this.lastPipeTime = Date.now();
                }
                if (!this.gameOver) {
                    this.bird.velocity = this.bird.jumpPower;
                    this.sendToReactNative({ type: 'BIRD_JUMP' });
                }
            }

            spawnInitialPipes() {
                // Создаем первую трубу
                const firstPipe = this.createPipe(this.width);
                this.pipes.push(firstPipe);
                
                // Создаем вторую трубу на расстоянии
                const distanceBetweenPipes = this.pipeSpeed * (this.pipeSpawnInterval / 1000 * 60);
                const secondPipe = this.createPipe(this.width + distanceBetweenPipes);
                this.pipes.push(secondPipe);
                
                // Создаем монеты для всего пути (от птицы до второй трубы)
                this.createCoinsForInitialPath();
            }
            
            createPipe(x) {
                const minGap = this.pipeGap + 100;
                const maxGap = this.height - this.pipeGap - 100;
                const gapY = Math.random() * (maxGap - minGap) + minGap;

                return {
                    x: x,
                    gapY: gapY,
                    gapSize: this.pipeGap,
                    scored: false,
                    coinsCreated: true
                };
            }
            
            createCoinsForInitialPath() {
                if (this.pipes.length < 2) return;
                
                const firstPipe = this.pipes[0];
                const secondPipe = this.pipes[1];
                
                // Начало пути - от птицы или немного впереди птицы
                let startX = Math.max(this.bird.x + 150, firstPipe.x - 400);
                const endX = secondPipe.x;
                
                // Не создаем монеты, если расстояние слишком маленькое
                if (endX - startX <= 0) return;
                
                const distance = endX - startX;
                const coinCount = Math.floor(distance / this.coinSpacing);
                
                // Создаем монеты между началом и второй трубой
                for (let i = 0; i < coinCount; i++) {
                    const x = startX + i * this.coinSpacing;
                    const progress = i / (coinCount - 1 || 1);
                    
                    // Интерполируем высоту между птицей и второй трубой
                    let targetY;
                    if (i < coinCount / 2) {
                        // Первая половина монет: интерполируем от птицы к первой трубе
                        const firstHalfProgress = (i / (coinCount / 2)) * 2;
                        targetY = this.bird.y + (firstPipe.gapY - this.bird.y) * Math.min(firstHalfProgress, 1);
                    } else {
                        // Вторая половина монет: интерполируем от первой трубы ко второй
                        const secondHalfProgress = ((i - coinCount / 2) / (coinCount / 2)) * 2;
                        targetY = firstPipe.gapY + (secondPipe.gapY - firstPipe.gapY) * Math.min(secondHalfProgress, 1);
                    }
                    
                    // Синусоидальное смещение
                    const sinOffset = this.coinWaveAmplitude * Math.sin(
                        this.coinWaveFrequency * x + this.coinPhase
                    );
                    
                    const y = targetY + sinOffset;
                    
                    // Проверяем границы
                    if (y < 50 || y > this.height - 150) continue;
                    
                    // Проверяем, нет ли уже монеты в этой позиции
                    const isOverlap = this.coins.some(coin => 
                        Math.abs(coin.x - x) < this.coinSpacing / 2 && 
                        Math.abs(coin.y - y) < this.coinSpacing / 2
                    );
                    
                    if (isOverlap) continue;
                    
                    this.coins.push({
                        x: x,
                        y: y,
                        originalY: y,
                        width: this.coinSize,
                        height: this.coinSize,
                        collected: false,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: 0.05 + Math.random() * 0.03,
                        floatOffset: Math.random() * Math.PI * 2,
                        amplitude: 2 + Math.random() * 3
                    });
                }
            }

            spawnPipe() {
                // Создаем новую трубу
                const minGap = this.pipeGap + 100;
                const maxGap = this.height - this.pipeGap - 100;
                const gapY = Math.random() * (maxGap - minGap) + minGap;

                // Позиция новой трубы - после последней существующей
                const lastPipe = this.pipes.length > 0 ? 
                    this.pipes[this.pipes.length - 1] : 
                    { x: this.width };
                
                // Дистанция между трубами
                const distanceBetweenPipes = this.pipeSpeed * (this.pipeSpawnInterval / 1000 * 60);
                
                const pipe = {
                    x: lastPipe.x + distanceBetweenPipes,
                    gapY: gapY,
                    gapSize: this.pipeGap,
                    scored: false,
                    coinsCreated: true
                };
                
                this.pipes.push(pipe);
                
                // Создаем монеты между предыдущей и новой трубой
                this.createCoinsBetweenPipes();
                
                return pipe;
            }
            
            createCoinsBetweenPipes() {
                if (this.pipes.length < 2) return;
                
                const prevPipe = this.pipes[this.pipes.length - 2];
                const currentPipe = this.pipes[this.pipes.length - 1];
                
                // Начинаем от предыдущей трубы, заканчиваем на текущей
                const startX = prevPipe.x + this.brushWidth;
                const endX = currentPipe.x;
                
                // Не создаем монеты, если расстояние слишком маленькое
                if (endX - startX <= 0) return;
                
                const distance = endX - startX;
                const coinCount = Math.floor(distance / this.coinSpacing);
                
                // Создаем монеты между трубами
                for (let i = 0; i < coinCount; i++) {
                    const x = startX + i * this.coinSpacing;
                    const progress = i / (coinCount - 1 || 1);
                    
                    // Интерполируем высоту между трубами
                    const targetY = prevPipe.gapY + (currentPipe.gapY - prevPipe.gapY) * progress;
                    
                    // Синусоидальное смещение
                    const sinOffset = this.coinWaveAmplitude * Math.sin(
                        this.coinWaveFrequency * x + this.coinPhase
                    );
                    
                    const y = targetY + sinOffset;
                    
                    // Проверяем границы
                    if (y < 50 || y > this.height - 150) continue;
                    
                    // Проверяем, нет ли уже монеты в этой позиции
                    const isOverlap = this.coins.some(coin => 
                        Math.abs(coin.x - x) < this.coinSpacing / 2 && 
                        Math.abs(coin.y - y) < this.coinSpacing / 2
                    );
                    
                    if (isOverlap) continue;
                    
                    this.coins.push({
                        x: x,
                        y: y,
                        originalY: y,
                        width: this.coinSize,
                        height: this.coinSize,
                        collected: false,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: 0.05 + Math.random() * 0.03,
                        floatOffset: Math.random() * Math.PI * 2,
                        amplitude: 2 + Math.random() * 3
                    });
                }
            }

            update() {
                this.frameCount++;
                
                // Обновляем фазу синусоиды для анимации волны
                this.coinPhase += 0.02;

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

                // Update cars
                this.cars.forEach(car => {
                    car.x += car.speed;
                    if (car.speed > 0 && car.x > this.width + 100) {
                        car.x = -100;
                    } else if (car.speed < 0 && car.x < -100) {
                        car.x = this.width + 100;
                    }
                });

                // Update ground scrolling
                if (this.gameStarted && !this.gameOver) {
                    this.groundOffset -= this.roadSpeed;
                    if (this.roadImg && this.groundOffset <= -this.roadImg.width) {
                        this.groundOffset = 0;
                    }
                }

                // Update particles
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const p = this.particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1;
                    p.life--;
                    if (p.life <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
                
                // Update coins
                this.coins.forEach(coin => {
                    if (!coin.collected) {
                        // Двигаем монетку вместе с миром
                        coin.x -= this.pipeSpeed;
                        
                        // Обновляем вращение
                        coin.rotation += coin.rotationSpeed;
                        
                        // Обновляем плавающую анимацию
                        coin.currentY = coin.originalY + 
                                      Math.sin(this.frameCount * this.coinFloatSpeed + coin.floatOffset) * coin.amplitude;
                    }
                });

                if (!this.gameStarted || this.gameOver) return;

                // Update bird
                this.bird.velocity += this.bird.gravity;
                this.bird.y += this.bird.velocity;

                // Spawn pipes каждые 2 секунды
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
                
                // Проверяем столкновение с монетками
                for (let i = this.coins.length - 1; i >= 0; i--) {
                    const coin = this.coins[i];
                    
                    if (!coin.collected && this.checkCoinCollision(coin)) {
                        coin.collected = true;
                        this.collectCoin(coin);
                        this.coins.splice(i, 1);
                    }
                    
                    // Удаляем монеты, которые вышли за экран
                    if (coin.x + coin.width < 0) {
                        this.coins.splice(i, 1);
                    }
                }

                // Check boundaries
                if (this.bird.y < 0 || this.bird.y + this.bird.height > this.groundY) {
                    this.createCrashParticles();
                    this.endGame();
                }
            }
            
            checkCoinCollision(coin) {
                const bird = this.bird;
                const coinY = coin.currentY || coin.y;
                
                return bird.x < coin.x + coin.width &&
                       bird.x + bird.width > coin.x &&
                       bird.y < coinY + coin.height &&
                       bird.y + bird.height > coinY;
            }
            
            collectCoin(coin) {
                this.coinsCount++;
                
                const coinsDisplay = document.getElementById('coins-display');
                if (coinsDisplay) {
                    coinsDisplay.textContent = 'Монеты: ' + this.coinsCount;
                }
                
                this.createCoinParticles(coin.x + coin.width / 2, coin.y + coin.height / 2);
                
                this.sendToReactNative({ 
                    type: 'COIN_COLLECTED', 
                    coins: this.coinsCount 
                });
            }
            
            createCoinParticles(x, y) {
                for (let i = 0; i < 15; i++) {
                    const angle = (i / 15) * Math.PI * 2;
                    const speed = 2 + Math.random() * 3;
                    
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: 2 + Math.random() * 3,
                        color: ['#FFD700', '#FFEC8B', '#FFFACD'][Math.floor(Math.random() * 3)],
                        life: 20 + Math.random() * 20,
                        gravity: 0.05
                    });
                }
            }

            checkCollision(pipe) {
                const birdCenterX = this.bird.x + this.bird.width / 2;
                const birdCenterY = this.bird.y + this.bird.height / 2;
                const birdRadius = Math.min(this.bird.width, this.bird.height) / 2;

                const pipeLeft = pipe.x;
                const pipeRight = pipe.x + this.pipeWidth;
                const gapTop = pipe.gapY - pipe.gapSize / 2;
                const gapBottom = pipe.gapY + pipe.gapSize / 2;

                if (birdCenterX + birdRadius > pipeLeft && birdCenterX - birdRadius < pipeRight) {
                    if (birdCenterY - birdRadius < gapTop || birdCenterY + birdRadius > gapBottom) {
                        return true;
                    }
                }
                return false;
            }

            drawBackground() {
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

            drawBrushImage(img, x, gapEdgeY, isTop) {
                const ctx = this.ctx;
                const scale = this.brushWidth / img.width;
                const drawHeight = img.height * scale;

                if (isTop) {
                    ctx.drawImage(
                        img,
                        x,
                        gapEdgeY - drawHeight,
                        this.brushWidth,
                        drawHeight
                    );
                } else {
                    ctx.drawImage(
                        img,
                        x,
                        gapEdgeY,
                        this.brushWidth,
                        drawHeight
                    );
                }
            }

            drawPipes() {
                const img = document.getElementById('brush-img');
                if (!img) return;

                this.pipes.forEach(pipe => {
                    const gapTop = pipe.gapY - pipe.gapSize / 2;
                    const gapBottom = pipe.gapY + pipe.gapSize / 2;

                    this.drawBrushImage(img, pipe.x, gapTop, true);
                    this.drawBrushImage(img, pipe.x, gapBottom, false);
                });
            }
            
            drawCoins() {
                const coinImg = document.getElementById('coin-img');
                if (!coinImg) return;

                this.coins.forEach(coin => {
                    if (!coin.collected) {
                        this.ctx.save();
                        
                        const drawX = coin.x + coin.width / 2;
                        const drawY = (coin.currentY || coin.y) + coin.height / 2;
                        
                        this.ctx.translate(drawX, drawY);
                        this.ctx.rotate(coin.rotation);
                        
                        this.ctx.drawImage(
                            coinImg,
                            -coin.width / 2,
                            -coin.height / 2,
                            coin.width,
                            coin.height
                        );
                        
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, coin.width / 2, 0, Math.PI * 2);
                        const gradient = this.ctx.createRadialGradient(
                            0, 0, 0,
                            0, 0, coin.width / 2
                        );
                        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                        this.ctx.fillStyle = gradient;
                        this.ctx.fill();
                        
                        this.ctx.restore();
                    }
                });
            }

            drawGround() {
                const ctx = this.ctx;
                const img = document.getElementById('road-img');
                if (!img || !img.complete) return;

                const ROAD_SRC_HEIGHT = 270;
                const ROAD_DST_HEIGHT = 120;
                const sy = img.height - ROAD_SRC_HEIGHT;
                const y = this.height - ROAD_DST_HEIGHT;

                ctx.drawImage(img, 0, sy, img.width, ROAD_SRC_HEIGHT, this.groundOffset, y, img.width, ROAD_DST_HEIGHT);
                ctx.drawImage(img, 0, sy, img.width, ROAD_SRC_HEIGHT, this.groundOffset + img.width, y, img.width, ROAD_DST_HEIGHT);
            }

            drawCars() {
                this.cars.forEach(car => {
                    const carImg = document.getElementById(car.imageId);
                    if (!carImg) return;
                    this.ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
                });
            }

            drawBird() {
                const birdImg = document.getElementById('bird-sprite');
                if (!birdImg) return;

                const birdAngle = Math.min(Math.max(this.bird.velocity * 2.5, -25), 70);

                this.ctx.save();
                this.ctx.translate(
                    this.bird.x + this.bird.width / 2,
                    this.bird.y + this.bird.height / 2
                );
                this.ctx.rotate(birdAngle * Math.PI / 180);

                this.ctx.drawImage(
                    birdImg,
                    -this.bird.width / 2,
                    -this.bird.height / 2,
                    this.bird.width,
                    this.bird.height
                );

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
                this.drawBackground();
                this.drawClouds();
                this.drawGround();
                this.drawCars();
                this.drawPipes();
                this.drawCoins();
                this.drawParticles();
                this.drawBird();

                if (!this.gameStarted && !this.gameOver) {
                    const pulse = Math.sin(this.frameCount * 0.1) * 0.3 + 0.7;
                    this.ctx.globalAlpha = pulse;
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.font = 'bold 28px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 4;
                    this.ctx.strokeText('Нажмите чтобы начать', this.width / 2, this.height / 2 - 30);
                    this.ctx.fillText('Нажмите чтобы начать', this.width / 2, this.height / 2 - 30);
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
                    scoreDisplay.textContent = 'Счет: ' + this.score;
                }
                this.sendToReactNative({ type: 'SCORE_UPDATE', score: this.score });

                if (this.score === 3) {
                    this.sendToReactNative({ type: 'SCORE_REACHED_10', score: this.score });
                }
            }

            endGame() {
                if (this.gameOver) return;
                this.gameOver = true;
                this.cars.forEach(car => {
                    car.speed = car.originalSpeed;
                });
                
                const gameOverDiv = document.getElementById('game-over');
                const finalScoreSpan = document.getElementById('final-score');
                const finalCoinsSpan = document.getElementById('final-coins');
                
                if (gameOverDiv && finalScoreSpan && finalCoinsSpan) {
                    finalScoreSpan.textContent = this.score;
                    finalCoinsSpan.textContent = this.coinsCount;
                    gameOverDiv.classList.remove('hidden');
                }

                this.sendToReactNative({ 
                    type: 'GAME_OVER', 
                    score: this.score,
                    coins: this.coinsCount 
                });

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
                this.coinsCount = 0;
                this.gameOver = false;
                this.gameStarted = false;
                this.lastPipeTime = 0;
                this.pipes = [];
                this.coins = [];
                this.particles = [];
                this.bird.x = 100;
                this.bird.y = this.height / 2;
                this.bird.velocity = 0;
                this.bird.wingAngle = 0;
                this.groundOffset = 0;
                this.frameCount = 0;
                this.coinPhase = 0;

                const scoreDisplay = document.getElementById('score-display');
                const coinsDisplay = document.getElementById('coins-display');
                if (scoreDisplay) {
                    scoreDisplay.textContent = 'Счет: 0';
                }
                if (coinsDisplay) {
                    coinsDisplay.textContent = 'Монеты: 0';
                }

                this.sendToReactNative({ type: 'GAME_RESTART' });
            }

            sendToReactNative(data) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(data));
                }
            }
        }

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
      <View style={styles.burger}>
        <ScreenHeader />
      </View>
      
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
    top: dp(0),
    left: dp(0),
    right: dp(0),
    bottom: dp(0),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#70c5ce',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: dp(10),
    fontSize: dp(16),
    color: '#fff',
  },
  burger: {
    position: 'absolute',
    top: dp(26),
    left: dp(10),
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        top: dp(50),
      },
    }),
  },
});

export { Game };
