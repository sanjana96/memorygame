document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const grid = document.getElementById('grid');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const messageDisplay = document.getElementById('message');

    // Game state
    let gameState = {
        level: 1,
        score: 0,
        sequence: [],
        userSequence: [],
        isPlaying: false,
        isShowingSequence: false,
        gridSize: 2 // Start with a 2x2 grid
    };

    // Initialize the game
    function initGame() {
        gameState = {
            level: 1,
            score: 0,
            sequence: [],
            userSequence: [],
            isPlaying: false,
            isShowingSequence: false,
            gridSize: 2
        };
        
        updateDisplay();
        createGrid();
        
        startBtn.disabled = false;
        resetBtn.disabled = false;
        messageDisplay.textContent = 'Press Start to begin!';
        messageDisplay.className = 'message';
    }

    // Create the grid based on current level
    function createGrid() {
        grid.innerHTML = '';
        grid.className = `grid grid-${gameState.gridSize}`;
        
        const totalCells = gameState.gridSize * gameState.gridSize;
        
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.id = i;
            cell.addEventListener('click', () => handleCellClick(i));
            grid.appendChild(cell);
        }
    }

    // Update level and score display
    function updateDisplay() {
        levelDisplay.textContent = gameState.level;
        scoreDisplay.textContent = gameState.score;
    }

    // Generate a random sequence
    function generateSequence() {
        const totalCells = gameState.gridSize * gameState.gridSize;
        const newStep = Math.floor(Math.random() * totalCells);
        gameState.sequence.push(newStep);
    }

    // Show the sequence to the player
    async function showSequence() {
        gameState.isShowingSequence = true;
        messageDisplay.textContent = 'Watch the sequence...';
        
        // Disable buttons during sequence display
        startBtn.disabled = true;
        resetBtn.disabled = true;
        
        const cells = document.querySelectorAll('.cell');
        
        // Clear any active cells
        cells.forEach(cell => cell.classList.remove('active'));
        
        // Show each step in the sequence with a delay
        for (let i = 0; i < gameState.sequence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay between steps
            
            const cellIndex = gameState.sequence[i];
            const cell = cells[cellIndex];
            
            // Highlight the cell
            cell.classList.add('active');
            
            // Wait and then remove highlight
            await new Promise(resolve => setTimeout(resolve, 500));
            cell.classList.remove('active');
        }
        
        // Enable user input after showing sequence
        gameState.isShowingSequence = false;
        messageDisplay.textContent = 'Your turn! Repeat the sequence.';
        
        // Re-enable reset button
        resetBtn.disabled = false;
    }

    // Handle cell click during user input
    function handleCellClick(cellIndex) {
        // Ignore clicks if game is not active or sequence is being shown
        if (!gameState.isPlaying || gameState.isShowingSequence) {
            return;
        }
        
        const cells = document.querySelectorAll('.cell');
        const cell = cells[cellIndex];
        
        // Visual feedback
        cell.classList.add('active');
        setTimeout(() => cell.classList.remove('active'), 300);
        
        // Add to user sequence
        gameState.userSequence.push(cellIndex);
        
        // Check if the step is correct
        const currentStep = gameState.userSequence.length - 1;
        if (gameState.userSequence[currentStep] !== gameState.sequence[currentStep]) {
            gameOver();
            return;
        }
        
        // Check if the sequence is complete
        if (gameState.userSequence.length === gameState.sequence.length) {
            // Sequence completed successfully
            gameState.score += gameState.level * 10;
            updateDisplay();
            
            // Show success message
            messageDisplay.textContent = 'Correct! Moving to next level...';
            messageDisplay.className = 'message success';
            
            // Move to next level
            setTimeout(() => {
                nextLevel();
            }, 1000);
        }
    }

    // Move to the next level
    function nextLevel() {
        gameState.level++;
        gameState.userSequence = [];
        
        // Increase grid size every 2 levels, max 5x5
        if (gameState.level % 2 === 0 && gameState.gridSize < 5) {
            gameState.gridSize++;
            createGrid();
        }
        
        updateDisplay();
        messageDisplay.textContent = `Level ${gameState.level}`;
        messageDisplay.className = 'message';
        
        // Generate and show new sequence
        generateSequence();
        setTimeout(() => {
            showSequence();
        }, 1000);
    }

    // Game over
    function gameOver() {
        gameState.isPlaying = false;
        messageDisplay.textContent = 'Game Over! Try again.';
        messageDisplay.className = 'message error';
        
        startBtn.disabled = false;
        
        // Flash the incorrect cell
        const cells = document.querySelectorAll('.cell');
        const lastIndex = gameState.userSequence.length - 1;
        const correctCell = gameState.sequence[lastIndex];
        
        // Show the correct sequence
        setTimeout(() => {
            messageDisplay.textContent = 'The correct sequence was:';
            showCorrectSequence();
        }, 1500);
    }

    // Show the correct sequence after game over
    async function showCorrectSequence() {
        const cells = document.querySelectorAll('.cell');
        
        // Clear any active cells
        cells.forEach(cell => cell.classList.remove('active'));
        
        // Show each step in the sequence with a delay
        for (let i = 0; i < gameState.sequence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const cellIndex = gameState.sequence[i];
            const cell = cells[cellIndex];
            
            cell.classList.add('active');
            
            await new Promise(resolve => setTimeout(resolve, 500));
            cell.classList.remove('active');
        }
    }

    // Start game button handler
    startBtn.addEventListener('click', () => {
        // Reset game state
        gameState.level = 1;
        gameState.score = 0;
        gameState.sequence = [];
        gameState.userSequence = [];
        gameState.isPlaying = true;
        gameState.gridSize = 2;
        
        updateDisplay();
        createGrid();
        
        messageDisplay.textContent = 'Starting game...';
        messageDisplay.className = 'message';
        
        startBtn.disabled = true;
        
        // Generate first sequence and show it
        generateSequence();
        setTimeout(() => {
            showSequence();
        }, 1000);
    });

    // Reset game button handler
    resetBtn.addEventListener('click', () => {
        initGame();
    });

    // Initialize the game on load
    initGame();
});
