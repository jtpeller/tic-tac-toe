const diff_list = ["Two-Player", "Easy", "Medium", "Hard", "Impossible"];

/**
 * calculateWinner() -- determines if a winner exists
 * @param squares     array of 9 squares
 * 
 * @return      winner ('X' or 'O'), cat's game ('C'), or null
 */
function calculateWinner(squares) {
    const paths = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // identify winner, if there is one
    for (let i = 0; i < paths.length; i++) {
        const [a, b, c] = paths[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];      // winner exists
        }
    }

    // check for cat's game
    if (squares.includes(null) == false) {
        // board is full, no more moves
        return 'C';
    }

    return null;        // no winner
}