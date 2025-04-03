// Set up canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Load images for the game
const sailorMoonImage = new Image();
sailorMoonImage.src = "sailormoon.png"; // Path to the Sailor Moon image for the player (Kirby)

const kirbyImage = new Image();
kirbyImage.src = "kirby.png"; // Path to the Kirby image for enemies

// Game settings for the player (Sailor Moon)
const player = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  width: 100, // Increase the width for Sailor Moon
  height: 120, // Increase the height for Sailor Moon
  speed: 4,
  dx: 0,
  dy: 0,
};

// Ball properties
let balls = [];
const ballRadius = 10;
let ballCount = 10; // Start with 10 balls

// Enemy properties
let enemies = [];
const enemyCount = 3; // Start with 3 enemies
const enemySize = 80; // Increase the size of the enemies (Kirby)
const enemySpeed = 2;

// Score and level tracking
let score = 0;
let level = 1;

// Generate balls in random positions
function generateBalls() {
  balls = []; // Clear existing balls
  for (let i = 0; i < ballCount; i++) {
    balls.push({
      x: Math.random() * (canvasWidth - ballRadius * 2) + ballRadius,
      y: Math.random() * (canvasHeight - ballRadius * 2) + ballRadius,
      color: "#FFD700", // Ball color (yellow)
    });
  }
}

// Generate enemies in random positions
function generateEnemies() {
  enemies = []; // Clear existing enemies
  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: Math.random() * (canvasWidth - enemySize),
      y: Math.random() * (canvasHeight - enemySize),
      dx: Math.random() > 0.5 ? enemySpeed : -enemySpeed,
      dy: Math.random() > 0.5 ? enemySpeed : -enemySpeed,
    });
  }
}

// Draw the player (Sailor Moon) image
function drawPlayer() {
  ctx.drawImage(sailorMoonImage, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

// Draw all balls
function drawBalls() {
  balls.forEach((ball, index) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });
}

// Draw all enemies (Kirby image for enemies)
function drawEnemies() {
  enemies.forEach((enemy, index) => {
    ctx.drawImage(kirbyImage, enemy.x - enemySize / 2, enemy.y - enemySize / 2, enemySize, enemySize);
  });
}

// Move the player (Sailor Moon)
function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Prevent the player from going off the canvas
  if (player.x - player.width / 2 < 0) player.x = player.width / 2;
  if (player.x + player.width / 2 > canvasWidth) player.x = canvasWidth - player.width / 2;
  if (player.y - player.height / 2 < 0) player.y = player.height / 2;
  if (player.y + player.height / 2 > canvasHeight) player.y = canvasHeight - player.height / 2;
}

// Handle keyboard input for controlling the player (Sailor Moon)
function keyDownHandler(e) {
  if (e.key === "ArrowUp" || e.key === "w") {
    player.dy = -player.speed;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    player.dy = player.speed;
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    player.dx = -player.speed;
  } else if (e.key === "ArrowRight" || e.key === "d") {
    player.dx = player.speed;
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "ArrowDown" || e.key === "s") {
    player.dy = 0;
  }
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ArrowRight" || e.key === "d") {
    player.dx = 0;
  }
}

// Check for collision with balls
function checkCollisions() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    const distance = Math.sqrt(Math.pow(player.x - ball.x, 2) + Math.pow(player.y - ball.y, 2));

    if (distance < player.width / 2 + ballRadius) {
      balls.splice(i, 1); // Remove ball from the array
      score++; // Increase score
    }
  }
}

// Check for collision with enemies
function checkEnemyCollisions() {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));

    if (distance < player.width / 2 + enemySize / 2) {
      // Game Over logic if player collides with an enemy
      alert("Game Over! You were caught by an enemy!");
      resetGame();
    }
  }
}

// Move enemies randomly
function moveEnemies() {
  enemies.forEach((enemy) => {
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;

    // Bounce off the walls
    if (enemy.x - enemySize / 2 < 0 || enemy.x + enemySize / 2 > canvasWidth) {
      enemy.dx = -enemy.dx;
    }
    if (enemy.y - enemySize / 2 < 0 || enemy.y + enemySize / 2 > canvasHeight) {
      enemy.dy = -enemy.dy;
    }
  });
}

// Draw the score and level
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("Level: " + level, 20, 50);
}

// Update the level when the score reaches certain thresholds
function updateLevel() {
  if (score >= level * 10) {
    level++;
    ballCount += 5; // Increase number of balls per level
    generateBalls(); // Generate new balls for the new level
    player.speed += 1; // Increase player's speed as the level goes up
    generateEnemies(); // Generate new enemies
  }
}

// Reset the game when player is caught by an enemy
function resetGame() {
  score = 0;
  level = 1;
  player.speed = 4;
  ballCount = 10;
  generateBalls();
  generateEnemies();
}

// Game loop to update the game state
function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas

  movePlayer();
  moveEnemies(); // Move enemies
  drawPlayer(); // Draw the player (Sailor Moon)
  drawBalls();
  drawEnemies(); // Draw the enemies (Kirby)
  checkCollisions();
  checkEnemyCollisions(); // Check for enemy collisions
  drawScore();
  updateLevel();

  requestAnimationFrame(gameLoop); // Loop the game
}

// Event listeners for key input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Initialize the game
generateBalls();
generateEnemies();
gameLoop();
