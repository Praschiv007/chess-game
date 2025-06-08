from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Game state - can be expanded to a database later
# Dictionary to store games with unique identifiers
games = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def make_move():
    # Get move data from request
    data = request.get_json()
    
    # Process move (this will be expanded later)
    # For now, just echo the move back
    return jsonify({
        'status': 'success',
        'move': data.get('move'),
        'message': 'Move received'
    })

@app.route('/new_game', methods=['POST'])
def new_game():
    # Initialize a new game (this will be expanded later)
    return jsonify({
        'status': 'success',
        'message': 'New game started'
    })

if __name__ == '__main__':
    app.run(debug=True)

