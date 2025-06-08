# Chess Game

A web-based chess game built with Python Flask and JavaScript. This application allows you to play chess in your browser with full implementation of chess rules.

## Features

- Interactive chess board with Unicode chess pieces
- Complete implementation of chess movement rules for all pieces
- Turn-based gameplay (alternating between white and black)
- Move history tracking with algebraic notation
- Visual highlighting of selected pieces and valid moves
- Responsive design that works on different screen sizes
- RESTful API for game state management

## Screenshots

[Add screenshots of your application here]

## Installation

1. Clone this repository:
```
git clone https://github.com/yourusername/chess-game.git
cd chess-game
```

2. Create a virtual environment and activate it:
```
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. Install the required dependencies:
```
pip install flask
```

## Usage

1. Start the Flask application:
```
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

3. Playing the game:
   - White moves first
   - Click on a piece to select it
   - Valid moves will be highlighted
   - Click on a highlighted square to make a move
   - Use the "New Game" button to start a new game

## How to Play

1. **Selecting Pieces**: Click on any piece of your color to select it
2. **Moving Pieces**: After selecting a piece, click on a valid destination square
3. **Turn System**: The game automatically alternates between white and black
4. **Move History**: All moves are recorded in the move history panel

## Technologies Used

- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript
- **Game Logic**: Pure JavaScript
- **Styling**: CSS Grid and Flexbox for responsive layout
- **Communication**: RESTful API with JSON

## Future Enhancements

- Add check and checkmate detection
- Implement castling, en passant, and pawn promotion
- Add computer opponent with different difficulty levels
- Implement multiplayer functionality with WebSockets
- Add user accounts and game saving
- Add a timer for timed games

## License

[MIT License](LICENSE)

## Author

[Your Name]

