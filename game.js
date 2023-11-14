/*
MIT License

Copyright (c) 2023 Andrey S.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем начальные размеры canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const barHeight = 60; // Увеличиваем высоту бара
let score = 0;
let isGameOver = false;
let clickTimeLimit = 1000; // начальное время для клика (в миллисекундах)
let ballSpawnTime = 0;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Ball {
    constructor() {
        this.radius = 30;
        this.x = getRandomNumber(this.radius, canvas.width - this.radius);
        this.y = getRandomNumber(this.radius + barHeight, canvas.height - this.radius);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

let ball = new Ball();
const minClickTimeLimit = 200; // Минимальное время для клика

// Основной игровой цикл
function gameLoop() {
    if (!isGameOver) {
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем бар
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, barHeight);

        // Рисуем количество очков в левом верхнем углу
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, barHeight - 10);

        // Проверяем, истекло ли время для клика
        const currentTime = performance.now();
        if (currentTime - ballSpawnTime > clickTimeLimit) {
            isGameOver = true;
            alert('Game Over! Your score: ' + score);
            resetGame();
        }

        // Рисуем и обновляем шарик
        ball.draw();

        // Рисуем анимированную полоску
        const timeLeft = clickTimeLimit - (currentTime - ballSpawnTime);
        const progressBarWidth = (canvas.width * timeLeft) / clickTimeLimit;

        ctx.fillStyle = 'green';
        ctx.fillRect((canvas.width - progressBarWidth) / 2, barHeight, progressBarWidth, 10);

        // Вызываем gameLoop снова
        requestAnimationFrame(gameLoop);
    }
}

// Начинаем игровой цикл
gameLoop();

// Обработчик нажатия на экран
canvas.addEventListener('mousedown', handleMouseDown);

function handleMouseDown(event) {
    if (!isGameOver) {
        // Проверяем, попал ли игрок в шарик
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);

        if (distance < ball.radius) {
            // Игрок попал в шарик
            score++;
            ball = new Ball(); // Создаем новый шарик
            // Обновляем время появления шарика
            ballSpawnTime = performance.now();
            // Уменьшаем время для следующего клика в геометрической прогрессии
            clickTimeLimit *= 0.9;

            // Проверяем, не достигло ли время минимального значения
            if (clickTimeLimit < minClickTimeLimit) {
                clickTimeLimit = minClickTimeLimit;
            }
        } else {
            // Игрок не попал в шарик
            isGameOver = true;
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
    }
}

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // При изменении размера canvas также нужно обновить положение шарика
    ball.x = getRandomNumber(ball.radius, canvas.width - ball.radius);
    ball.y = getRandomNumber(ball.radius + barHeight, canvas.height - ball.radius);
});

// Сброс игры
function resetGame() {
    isGameOver = false;
    score = 0;
    clickTimeLimit = 1000; // сброс времени для клика
    ballSpawnTime = performance.now(); // сброс времени появления шарика
    ball = new Ball();
    gameLoop();
}
