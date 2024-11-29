class Game2048 {
    constructor(size = 4) {
        this.size = size;
        this.board = Array(size * size).fill(0);
        this.score = 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.newGameBtn = document.getElementById('new-game-btn');

        this.initializeEventListeners();
        this.initializeBoard();
    }

    initializeEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.newGameBtn.addEventListener('click', this.resetGame.bind(this));
        
        // Touch event support
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.gameBoard.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.gameBoard.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                diffX > 0 ? this.moveRight() : this.moveLeft();
            } else {
                // Vertical swipe
                diffY > 0 ? this.moveDown() : this.moveUp();
            }
        });
    }

    initializeBoard() {
        // Clear existing board
        this.gameBoard.innerHTML = '';
        
        // Create grid cells
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('tile');
            this.gameBoard.appendChild(cell);
        }

        // Reset board and add initial tiles
        this.board = Array(this.size * this.size).fill(0);
        this.addRandomTile();
        this.addRandomTile();
        this.updateBoard();
    }

    addRandomTile() {
        const emptyCells = this.board.reduce((acc, val, idx) => 
            val === 0 ? [...acc, idx] : acc, []);
        
        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateBoard() {
        const tiles = this.gameBoard.querySelectorAll('.tile');
        tiles.forEach((tile, index) => {
            const value = this.board[index];
            tile.textContent = value || '';
            tile.className = 'tile'; // Reset classes
            if (value) {
                tile.classList.add(`tile-${value}`);
            }
        });
        
        this.scoreElement.textContent = this.score;
        
        // Update best score in local storage
        const bestScore = localStorage.getItem('bestScore') || 0;
        if (this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }
        this.bestScoreElement.textContent = localStorage.getItem('bestScore') || 0;
    }

    moveLeft() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const rowTiles = this.board.slice(row * this.size, (row + 1) * this.size)
                .filter(tile => tile !== 0);
            
            for (let i = 0; i < rowTiles.length - 1; i++) {
                if (rowTiles[i] === rowTiles[i + 1]) {
                    rowTiles[i] *= 2;
                    this.score += rowTiles[i];
                    rowTiles.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            while (rowTiles.length < this.size) {
                rowTiles.push(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.board[row * this.size + i] !== rowTiles[i]) {
                    moved = true;
                }
                this.board[row * this.size + i] = rowTiles[i];
            }
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateBoard();
            this.checkGameStatus();
        }
    }

    moveRight() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const rowTiles = this.board.slice(row * this.size, (row + 1) * this.size)
                .filter(tile => tile !== 0);
            
            for (let i = rowTiles.length - 1; i > 0; i--) {
                if (rowTiles[i] === rowTiles[i - 1]) {
                    rowTiles[i] *= 2;
                    this.score += rowTiles[i];
                    rowTiles.splice(i - 1, 1);
                    moved = true;
                }
            }
            
            while (rowTiles.length < this.size) {
                rowTiles.unshift(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.board[row * this.size + i] !== rowTiles[i]) {
                    moved = true;
                }
                this.board[row * this.size + i] = rowTiles[i];
            }
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateBoard();
            this.checkGameStatus();
        }
    }

    moveUp() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const colTiles = [];
            for (let row = 0; row < this.size; row++) {
                const value = this.board[row * this.size + col];
                if (value !== 0) colTiles.push(value);
            }
            
            for (let i = 0; i < colTiles.length - 1; i++) {
                if (colTiles[i] === colTiles[i + 1]) {
                    colTiles[i] *= 2;
                    this.score += colTiles[i];
                    colTiles.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            while (colTiles.length < this.size) {
                colTiles.push(0);
            }
            
            for (let row = 0; row < this.size; row++) {
                if (this.board[row * this.size + col] !== colTiles[row]) {
                    moved = true;
                }
                this.board[row * this.size + col] = colTiles[row];
            }
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateBoard();
            this.checkGameStatus();
        }
    }

    moveDown() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const colTiles = [];
            for (let row = 0; row < this.size; row++) {
                const value = this.board[row * this.size + col];
                if (value !== 0) colTiles.push(value);
            }
            
            for (let i = colTiles.length - 1; i > 0; i--) {
                if (colTiles[i] === colTiles[i - 1]) {
                    colTiles[i] *= 2;
                    this.score += colTiles[i];
                    colTiles.splice(i - 1, 1);
                    moved = true;
                }
            }
            
            while (colTiles.length < this.size) {
                colTiles.unshift(0);
            }
            
            for (let row = 0; row < this.size; row++) {
                if (this.board[row * this.size + col] !== colTiles[row]) {
                    moved = true;
                }
                this.board[row * this.size + col] = colTiles[row];
            }
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateBoard();
            this.checkGameStatus();
        }
    }

    handleKeyPress(event) {
        switch(event.key) {
            case 'ArrowLeft':
                this.moveLeft();
                break;
            case 'ArrowRight':
                this.moveRight();
                break;
            case 'ArrowUp':
                this.moveUp();
                break;
            case 'ArrowDown':
                this.moveDown();
                break;
        }
    }

    checkGameStatus() {
        // Check for 2048 tile (win condition)
        if (this.board.includes(2048)) {
            alert('Congratulations! You reached 2048!');
            this.resetGame();
            return;
        }

        // Check if game is over (no more moves possible)
        const isMovesPossible = this.checkMovePossibility();
        if (!isMovesPossible) {
            alert('Game Over! No more moves possible.');
            this.resetGame();
        }
    }

    checkMovePossibility() {
        // Check if any empty cells exist
        if (this.board.includes(0)) return true;

        // Check for possible merges horizontally
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size - 1; col++) {
                const currentIndex = row * this.size + col;
                const nextIndex = currentIndex + 1;
                if (this.board[currentIndex] === this.board[nextIndex]) {
                    return true;
                }
            }
        }

        // Check for possible merges vertically
        for (let col = 0; col < this.size; col++) {
            for (let row = 0; row < this.size - 1; row++) {
                const currentIndex = row * this.size + col;
                const nextIndex = currentIndex + this.size;
                if (this.board[currentIndex] === this.board[nextIndex]) {
                    return true;
                }
            }
        }

        return false;
    }

    resetGame() {
        this.score = 0;
        this.initializeBoard();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
