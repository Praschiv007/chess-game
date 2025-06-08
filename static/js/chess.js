document.addEventListener('DOMContentLoaded', function() {
    // Chess pieces using Unicode characters
    const PIECES = {
        'white': {
            'pawn': '♙',
            'rook': '♖',
            'knight': '♘',
            'bishop': '♗',
            'queen': '♕',
            'king': '♔'
        },
        'black': {
            'pawn': '♟',
            'rook': '♜',
            'knight': '♞',
            'bishop': '♝',
            'queen': '♛',
            'king': '♚'
        }
    };

    // Game state
    let gameState = {
        board: Array(8).fill().map(() => Array(8).fill(null)),
        currentPlayer: 'white',
        selectedPiece: null,
        selectedSquare: null,
        validMoves: [],
        gameActive: true,
        moveHistory: []
    };

    // DOM elements
    const chessboard = document.getElementById('chessboard');
    const gameStatus = document.getElementById('game-status');
    const newGameBtn = document.getElementById('new-game-btn');
    const movesList = document.getElementById('moves-list');

    // Initialize the board
    function initializeBoard() {
        // Clear the chessboard
        chessboard.innerHTML = '';
        
        // Create chess squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
                square.dataset.row = row;
                square.dataset.col = col;
                
                square.addEventListener('click', handleSquareClick);
                chessboard.appendChild(square);
            }
        }
        
        // Reset game state
        resetGameState();
        
        // Update the board with pieces
        updateBoard();
    }

    // Reset game state to initial position
    function resetGameState() {
        // Initialize empty board
        gameState.board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Set up pawns
        for (let col = 0; col < 8; col++) {
            gameState.board[1][col] = { type: 'pawn', color: 'black' };
            gameState.board[6][col] = { type: 'pawn', color: 'white' };
        }
        
        // Set up black pieces
        gameState.board[0][0] = { type: 'rook', color: 'black' };
        gameState.board[0][1] = { type: 'knight', color: 'black' };
        gameState.board[0][2] = { type: 'bishop', color: 'black' };
        gameState.board[0][3] = { type: 'queen', color: 'black' };
        gameState.board[0][4] = { type: 'king', color: 'black' };
        gameState.board[0][5] = { type: 'bishop', color: 'black' };
        gameState.board[0][6] = { type: 'knight', color: 'black' };
        gameState.board[0][7] = { type: 'rook', color: 'black' };
        
        // Set up white pieces
        gameState.board[7][0] = { type: 'rook', color: 'white' };
        gameState.board[7][1] = { type: 'knight', color: 'white' };
        gameState.board[7][2] = { type: 'bishop', color: 'white' };
        gameState.board[7][3] = { type: 'queen', color: 'white' };
        gameState.board[7][4] = { type: 'king', color: 'white' };
        gameState.board[7][5] = { type: 'bishop', color: 'white' };
        gameState.board[7][6] = { type: 'knight', color: 'white' };
        gameState.board[7][7] = { type: 'rook', color: 'white' };
        
        // Reset game state variables
        gameState.currentPlayer = 'white';
        gameState.selectedPiece = null;
        gameState.selectedSquare = null;
        gameState.validMoves = [];
        gameState.gameActive = true;
        gameState.moveHistory = [];
        
        // Update status
        updateStatus();
        
        // Clear move history
        movesList.innerHTML = '';
    }

    // Update the visual board with current gameState
    function updateBoard() {
        const squares = document.querySelectorAll('.square');
        
        squares.forEach(square => {
            // Clear any existing pieces
            square.innerHTML = '';
            square.classList.remove('selected', 'valid-move');
            
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const piece = gameState.board[row][col];
            
            // If there's a piece on this square, add it
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece');
                pieceElement.classList.add(`${piece.color}-piece`);
                pieceElement.textContent = PIECES[piece.color][piece.type];
                square.appendChild(pieceElement);
            }
            
            // Highlight selected square
            if (gameState.selectedSquare && 
                gameState.selectedSquare.row === row && 
                gameState.selectedSquare.col === col) {
                square.classList.add('selected');
            }
            
            // Highlight valid moves
            if (gameState.validMoves.some(move => move.row === row && move.col === col)) {
                square.classList.add('valid-move');
            }
        });
    }

    // Handle square click
    function handleSquareClick(event) {
        if (!gameState.gameActive) return;
        
        const square = event.currentTarget;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = gameState.board[row][col];
        
        // If no piece is selected and the clicked square has a piece of the current player's color
        if (!gameState.selectedPiece && piece && piece.color === gameState.currentPlayer) {
            // Select the piece
            gameState.selectedPiece = piece;
            gameState.selectedSquare = { row, col };
            gameState.validMoves = getValidMoves(row, col, piece);
            updateBoard();
        } 
        // If a piece is already selected
        else if (gameState.selectedPiece) {
            // If the clicked square is a valid move
            if (gameState.validMoves.some(move => move.row === row && move.col === col)) {
                // Move the piece
                const fromRow = gameState.selectedSquare.row;
                const fromCol = gameState.selectedSquare.col;
                
                // Record the move
                const movedPiece = gameState.board[fromRow][fromCol];
                const capturedPiece = gameState.board[row][col];
                
                // Move notation (very basic for now)
                const notation = `${movedPiece.type.charAt(0).toUpperCase()}${String.fromCharCode(97 + fromCol)}${8 - fromRow} to ${String.fromCharCode(97 + col)}${8 - row}`;
                gameState.moveHistory.push(notation);
                
                // Update move history display
                const moveEntry = document.createElement('div');
                moveEntry.textContent = `${gameState.moveHistory.length}. ${notation}`;
                movesList.appendChild(moveEntry);
                movesList.scrollTop = movesList.scrollHeight;
                
                // Execute the move
                gameState.board[row][col] = gameState.board[fromRow][fromCol];
                gameState.board[fromRow][fromCol] = null;
                
                // Send the move to the server
                sendMove({
                    from: { row: fromRow, col: fromCol },
                    to: { row, col },
                    piece: movedPiece.type,
                    color: movedPiece.color
                });
                
                // Switch turns
                gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
                
                // Reset selection
                gameState.selectedPiece = null;
                gameState.selectedSquare = null;
                gameState.validMoves = [];
                
                // Update the board and status
                updateBoard();
                updateStatus();
            } 
            // If the clicked square is not a valid move, deselect the piece
            else {
                gameState.selectedPiece = null;
                gameState.selectedSquare = null;
                gameState.validMoves = [];
                updateBoard();
            }
        }
    }

    // Get valid moves for a piece
    function getValidMoves(row, col, piece) {
        const moves = [];
        
        switch(piece.type) {
            case 'pawn':
                getPawnMoves(row, col, piece.color, moves);
                break;
            case 'rook':
                getRookMoves(row, col, piece.color, moves);
                break;
            case 'knight':
                getKnightMoves(row, col, piece.color, moves);
                break;
            case 'bishop':
                getBishopMoves(row, col, piece.color, moves);
                break;
            case 'queen':
                getQueenMoves(row, col, piece.color, moves);
                break;
            case 'king':
                getKingMoves(row, col, piece.color, moves);
                break;
        }
        
        return moves;
    }

    // Get valid moves for a pawn
    function getPawnMoves(row, col, color, moves) {
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        
        // Move forward one square
        if (isInBounds(row + direction, col) && !gameState.board[row + direction][col]) {
            moves.push({ row: row + direction, col: col });
            
            // Move forward two squares from starting position
            if (row === startRow && !gameState.board[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col: col });
            }
        }
        
        // Capture diagonally
        for (let offset of [-1, 1]) {
            if (isInBounds(row + direction, col + offset) && 
                gameState.board[row + direction][col + offset] && 
                gameState.board[row + direction][col + offset].color !== color) {
                moves.push({ row: row + direction, col: col + offset });
            }
        }
    }

    // Get valid moves for a rook
    function getRookMoves(row, col, color, moves) {
        // Check in all four directions (up, right, down, left)
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        
        for (let [dx, dy] of directions) {
            let x = row + dx;
            let y = col + dy;
            
            while (isInBounds(x, y)) {
                const targetPiece = gameState.board[x][y];
                
                if (!targetPiece) {
                    // Empty square, add as valid move
                    moves.push({ row: x, col: y });
                } else if (targetPiece.color !== color) {
                    // Enemy piece, add as valid move and stop in this direction
                    moves.push({ row: x, col: y });
                    break;
                } else {
                    // Friendly piece, stop in this direction
                    break;
                }
                
                x += dx;
                y += dy;
            }
        }
    }

    // Get valid moves for a knight
    function getKnightMoves(row, col, color, moves) {
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        for (let [dx, dy] of knightMoves) {
            const newRow = row + dx;
            const newCol = col + dy;
            
            if (isInBounds(newRow, newCol)) {
                const targetPiece = gameState.board[newRow][newCol];
                
                if (!targetPiece || targetPiece.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
    }

    // Get valid moves for a bishop
    function getBishopMoves(row, col, color, moves) {
        // Check in all four diagonal directions
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        
        for (let [dx, dy] of directions) {
            let x = row + dx;
            let y = col + dy;
            
            while (isInBounds(x, y)) {
                const targetPiece = gameState.board[x][y];
                
                if (!targetPiece) {
                    // Empty square, add as valid move
                    moves.push({ row: x, col: y });
                } else if (targetPiece.color !== color) {
                    // Enemy piece, add as valid move and stop in this direction
                    moves.push({ row: x, col: y });
                    break;
                } else {
                    // Friendly piece, stop in this direction
                    break;
                }
                
                x += dx;
                y += dy;
            }
        }
    }

    // Get valid moves for a queen (combination of rook and bishop)
    function getQueenMoves(row, col, color, moves) {
        getRookMoves(row, col, color, moves);
        getBishopMoves(row, col, color, moves);
    }

    // Get valid moves for a king
    function getKingMoves(row, col, color, moves) {
        // Check all 8 surrounding squares
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                // Skip the current square
                if (dx === 0 && dy === 0) continue;
                
                const newRow = row + dx;
                const newCol = col + dy;
                
                if (isInBounds(newRow, newCol)) {
                    const targetPiece = gameState.board[newRow][newCol];
                    
                    if (!targetPiece || targetPiece.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
        }
    }

    // Check if coordinates are within the board
    function isInBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    // Update game status display
    function updateStatus() {
        gameStatus.textContent = `${gameState.currentPlayer.charAt(0).toUpperCase() + gameState.currentPlayer.slice(1)} to move`;
    }

    // Send move to server
    function sendMove(moveData) {
        fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moveData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Move response:', data);
        })
        .catch(error => {
            console.error('Error sending move:', error);
        });
    }

    // Start a new game
    function startNewGame() {
        fetch('/new_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {
            console.log('New game response:', data);
            resetGameState();
            updateBoard();
        })
        .catch(error => {
            console.error('Error starting new game:', error);
        });
    }

    // Event listener for new game button
    newGameBtn.addEventListener('click', startNewGame);

    // Initialize the board when the page loads
    initializeBoard();
});

