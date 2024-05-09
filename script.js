// Get canvas element and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size based on window size
canvas.width = window.innerWidth * 0.8; // 80% of window width
canvas.height = window.innerHeight * 0.8; // 80% of window height

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'Background.jpg'; // Path to your background image (JPEG)

// Player character properties
let playerX = canvas.width / 2; // Initial X position (centered horizontally)
let playerY = canvas.height / 2; // Initial Y position (centered vertically)
const playerSize = 30; // Size of the player character (pixelated square)
const playerSpeed = 5; // Movement speed of the player character

// Countdown timer properties
let timerSeconds = 60; // Initial timer value in seconds
let timerInterval; // Interval ID for the timer

// Game score
let score = 0;

// Game state
let isGameRunning = false;
let isGamePaused = false;

// Selected game duration (default: 60 seconds)
let selectedTime = 60;

// Load background audio and game sounds
const backgroundAudio = new Audio('background.mp3'); // Path to your background audio file (MP3)
backgroundAudio.loop = true; // Loop background audio

const startSound = new Audio('Start.wav'); // Path to your start sound file (WAV)
const gameOverSound = new Audio('Gameover.wav'); // Path to your game over sound file (WAV)
const pauseSound = new Audio('Pause.mp3'); // Path to your pause sound file (MP3)

// Function to draw canvas contents (background image, player character, timer, and score)
function drawCanvas() {
    // Draw background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw player character (pixelated square)
    ctx.fillStyle = 'red'; // Color of the player character (red)
    ctx.fillRect(playerX, playerY, playerSize, playerSize); // Draw a pixelated square

    // Draw timer text
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Time Left: ${timerSeconds} seconds`, 20, 40);

    // Draw score display
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 40);
}

// Function to update timer display and check timer expiration
function updateTimer() {
    if (isGameRunning && !isGamePaused) {
        timerSeconds--;

        if (timerSeconds <= 0) {
            clearInterval(timerInterval); // Stop the timer interval
            backgroundAudio.pause(); // Pause background audio when timer expires
            gameOverSound.play(); // Play game over sound
            alert('Time\'s up! Final Score: ' + score); // Show final score in alert
            isGameRunning = false; // Update game state
            // Perform game over animation (e.g., shake screen, flash colors)
            gameOverAnimation();
        }

        drawCanvas(); // Redraw canvas with updated timer display
    }
}

// Function to start the game (timer and game sounds)
function startGame() {
    if (!isGameRunning) {
        timerSeconds = selectedTime; // Set timer based on selected time
        score = 0; // Reset score to zero
        isGameRunning = true; // Update game state
        document.getElementById('startButton').disabled = true; // Disable start button during game
        startSound.play(); // Play start sound
        timerInterval = setInterval(updateTimer, 1000); // Update timer every second (1000 milliseconds)
        backgroundAudio.play(); // Start playing or resume background audio
    }
}

// Function to pause or resume the game
function togglePauseGame() {
    if (isGameRunning) {
        isGamePaused = !isGamePaused; // Toggle pause state

        if (isGamePaused) {
            clearInterval(timerInterval); // Pause timer interval
            backgroundAudio.pause(); // Pause background audio
            pauseSound.play(); // Play pause sound
            document.getElementById('pauseButton').textContent = 'Resume'; // Change button text
        } else {
            timerInterval = setInterval(updateTimer, 1000); // Resume timer interval
            backgroundAudio.play(); // Resume background audio
            document.getElementById('pauseButton').textContent = 'Pause'; // Change button text
        }
    }
}

// Function to handle time selection button click
function handleTimeSelection(event) {
    if (!isGameRunning) {
        selectedTime = parseInt(event.target.dataset.time); // Get selected time from button data attribute
        document.querySelectorAll('.timeButton').forEach(button => {
            button.style.backgroundColor = 'blue'; // Reset all time selection buttons to blue
        });
        event.target.style.backgroundColor = 'green'; // Highlight selected time button in green
    }
}

// Function to perform game over animation (example: shake canvas)
function gameOverAnimation() {
    const originalX = canvas.offsetLeft;
    const originalY = canvas.offsetTop;
    const intensity = 20;
    const duration = 1000;

    let start = Date.now();
    function animate() {
        let timePassed = Date.now() - start;
        if (timePassed >= duration) {
            canvas.style.left = originalX + 'px';
            canvas.style.top = originalY + 'px';
            return;
        }
        let x = Math.sin(timePassed / duration * Math.PI * 2) * intensity;
        let y = Math.cos(timePassed / duration * Math.PI * 2) * intensity;
        canvas.style.left = originalX + x + 'px';
        canvas.style.top = originalY + y + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

// Load images and draw canvas when all assets are loaded
function loadImagesAndDraw() {
    backgroundImage.onload = function() {
        drawCanvas(); // Draw canvas with background and player character
    };
}

// Handle start button click event
document.getElementById('startButton').addEventListener('click', startGame);

// Handle pause button click event
document.getElementById('pauseButton').addEventListener('click', togglePauseGame);

// Handle time selection button click events
document.querySelectorAll('.timeButton').forEach(button => {
    button.addEventListener('click', handleTimeSelection);
});

// Handle keyboard input for player movement
document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    if (isGameRunning && !isGamePaused) {
        switch (event.key) {
            case 'w': // Move upward
                if (playerY > 0) {
                    playerY -= playerSpeed;
                }
                break;
            case 's': // Move downward
                if (playerY < canvas.height - playerSize) {
                    playerY += playerSpeed;
                }
                break;
            case 'a': // Move leftward
                if (playerX > 0) {
                    playerX -= playerSpeed;
                }
                break;
            case 'd': // Move rightward
                if (playerX < canvas.width - playerSize) {
                    playerX += playerSpeed;
                }
                break;
        }

        drawCanvas(); // Redraw canvas with updated player position
    }
}

// Optional: Redraw canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.8; // 80% of new window width
    canvas.height = window.innerHeight * 0.8; // 80% of new window height
    drawCanvas(); // Redraw canvas with updated size and elements
});

// Call function to load images and draw initial canvas
loadImagesAndDraw();
