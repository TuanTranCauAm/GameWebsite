const player = document.getElementById('player');
const object = document.getElementById('object');
const gameContainer = document.querySelector('.game-container');

let playerPosition = 275; // Initial horizontal position of the player
let objectPositionX = Math.floor(Math.random() * 570); // Initial horizontal position of the object
let objectPositionY = 0; // Initial vertical position of the object
let score = 0;

// Move the player with arrow keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 10;
    }
    if (e.key === 'ArrowRight' && playerPosition < 550) {
        playerPosition += 10;
    }
    player.style.left = playerPosition + 'px';
});

// Update the object's position
function updateObjectPosition() {
    objectPositionY += 5;
    if (objectPositionY > 780) {
        objectPositionY = 0;
        objectPositionX = Math.floor(Math.random() * 570);
        score++;
    }
    object.style.top = objectPositionY + 'px';
    object.style.left = objectPositionX + 'px';

    checkCollision();
}

// Check for collision
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    if (
        playerRect.x < objectRect.x + objectRect.width &&
        playerRect.x + playerRect.width > objectRect.x &&
        playerRect.y < objectRect.y + objectRect.height &&
        playerRect.y + playerRect.height > objectRect.y
    ) {
        alert('Game Over! Your score: ' + score);
        objectPositionY = 0;
        score = 0;
    }
}

// Game loop
function gameLoop() {
    updateObjectPosition();
    requestAnimationFrame(gameLoop);
}

gameLoop();
