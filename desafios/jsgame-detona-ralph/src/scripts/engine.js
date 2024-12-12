let body = document.querySelector(".panel");

const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        gameOverModal: document.getElementById("game-over-modal"),
        gameOverScore: document.getElementById("game-over-score"),
        restartButton: document.getElementById("restart-button")
    },
    values: {
        gameSpeed: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
        hitBoxListeners: [] // New array to track listeners
    }
};

function showGameOverModal() {
    state.view.gameOverScore.textContent = `Your Results: ${state.values.result}`;
    state.view.gameOverModal.style.display = 'flex';
}

function hideGameOverModal() {
    state.view.gameOverModal.style.display = 'none';
}

function resetSquaresColor() {
    state.view.squares.forEach((square) => {
        square.style.backgroundColor = '#1AEAA5';
    });
}

function resetGame() {
    // Clear existing intervals
    if (state.actions.timerId) {
        clearInterval(state.actions.timerId);
    }
    if (state.actions.countDownTimerId) {
        clearInterval(state.actions.countDownTimerId);
    }

    // Remove previous event listeners
    state.actions.hitBoxListeners.forEach(({square, listener}) => {
        square.removeEventListener('mousedown', listener);
    });
    state.actions.hitBoxListeners = []; // Reset listener tracking array

    // Reset all game state values
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 3;

    // Reset view elements
    state.view.score.textContent = '0';
    state.view.timeLeft.textContent = '60';
    state.view.lives.textContent = '3';
    resetSquaresColor();

    // Hide game over modal
    hideGameOverModal();

    // Restart the game
    main();
}

function countDown() {    
    state.view.timeLeft.textContent = state.values.currentTime;
    state.values.currentTime--;    

    if (state.values.currentTime < 0 || state.values.lives <= 0) {
        endGame();
    }
}

function playSound(soundPath) {
    try {
        let audio = new Audio(soundPath);
        audio.volume = 0.2;
        audio.play();
    } catch (error) {
        console.error("Error playing sound:", error);
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    state.actions.timerId = setInterval(randomSquare, state.values.gameSpeed);
}

function endGame() {
    // Stop all game intervals
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);

    // Show game over modal
    showGameOverModal();
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        const listener = () => {
            if (state.values.lives <= 0) return;

            // Check if the clicked square is the enemy's current position
            if (square.id === state.values.hitPosition && square.classList.contains('enemy')) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("./src/sounds/hit.m4a");
                setTimeout(resetSquaresColor, 200);
            } else if (!square.classList.contains('enemy')) {
                // Reduce lives only when clicking a non-enemy square
                state.values.lives--;
                state.view.lives.textContent = state.values.lives;
                square.style.backgroundColor = 'red';
                setTimeout(resetSquaresColor, 200);
                
                if (state.values.lives <= 0) {
                    endGame();
                }
            }
        };

        // Add listener and track it
        square.addEventListener('mousedown', listener);
        state.actions.hitBoxListeners.push({square, listener});
    });
}

function main() {
    moveEnemy();
    addListenerHitBox();
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

// Add event listener for restart button
state.view.restartButton.addEventListener('click', resetGame);

main();