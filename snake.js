const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreDisplay = document.getElementById("score");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box,
};
let direction = null;
let score = 0;
let game;

document.addEventListener("keydown", directionControl);

function directionControl(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function collision(head, array) {
  return array.some((segment) => head.x === segment.x && head.y === segment.y);
}

function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, 400, 400);

  // Gambar ular
  for (let i = 0; i < snake.length; i++) {
    const gradient = ctx.createLinearGradient(
      snake[i].x,
      snake[i].y,
      snake[i].x + box,
      snake[i].y + box
    );

    if (i === 0) {
      gradient.addColorStop(0, "#0ea5e9"); // kepala
      gradient.addColorStop(1, "#38bdf8");
    } else {
      gradient.addColorStop(0, "#67e8f9");
      gradient.addColorStop(1, "#22d3ee");
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(snake[i].x + 2, snake[i].y + 2, box - 4, box - 4, 8);
    ctx.shadowColor = "#06b6d4";
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Gambar makanan (lingkaran)
  ctx.beginPath();
  ctx.fillStyle = "#facc15";
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Pergerakan
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Makan makanan
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // Cek tabrakan
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= 400 ||
    snakeY >= 400 ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("Game Over! Skor kamu: " + score);
  }

  snake.unshift(newHead);
}

startBtn.addEventListener("click", () => {
  clearInterval(game);
  game = setInterval(draw, 200);
});

resetBtn.addEventListener("click", () => {
  clearInterval(game);
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  score = 0;
  scoreDisplay.textContent = score;
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };
  ctx.clearRect(0, 0, 400, 400);
});