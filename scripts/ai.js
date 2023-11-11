class AI {
    constructor(props) {
        // ensure diff is proper
        if (typeof props.diff === 'number' && props.diff >= 0 && props.diff <= 4) {
            this.diff = props.diff;
        } else {
            return null;
        }

        this.diff_prob = [0, 0.4, 0.7, 1];

        this.symbol = props.symbol;
        this.opponent = this.symbol == 'O' ? 'X' : 'O';
    }

    /**
     * makeMove() -- method which determines which move should be made
     * @param arr    array of 9 square values
     * 
     * @return  new array with the move made on it
     */
    makeMove(arr) {
        const diff_idx = this.diff - 1;  // get which diff prob to use

        var rng = Math.random() > this.diff_prob[diff_idx];
        if (rng) {      // AI makes RNG move
            return this.randomMove(arr);
        } else {        // AI makes best move
            return this.bestMove(arr);
        }
    }

    /**
     * randomMove() -- randomly chooses an available square
     * @param arr      array of 9 square values
     * 
     * @return rng      index of which square was chosen.
     */
    randomMove(arr) {
        const n = arr.length;
        let rng;
        do {
            rng = Math.floor(Math.random() * n);
        } while (arr[rng]);
        
        return rng;
    }

    /**
     * bestMove() -- chooses the best available move
     * @param arr       array of 9 square values
     * 
     * @return best     index of the best available move in arr
     */
    bestMove(arr) {
        const c = Math.sqrt(arr.length);
        let best_score = -1000;     // highest move score
        let best = -1;              // best idx to choose

        // convert to grid
        let grid = gridify(arr, c, c);

        // evaluate minimax for each cell, looking for the optimal move
        for (let i = 0; i < c; i++) {
            for (let j = 0; j < c; j++) {
                if (grid[i][j] == null) {       // empty cell
                    grid[i][j] = this.symbol    // make move

                    // determine if it was a good move
                    let move_score = this.minimax({
                        grid: grid, depth: 0, isMax: false
                    })
                    grid[i][j] = null;      // undo that move

                    if (move_score > best_score) {
                        best = i * c + j;           // save flattened idx
                        best_score = move_score;    // save score
                    }
                }
            }
        }

        return best;        
    }

    /**
     * minimax() -- determines how the game of tic-tac-toe can go
     * @param grid      3x3 grid of the game board
     * @param depth		how deep to search
     * @param isMax		is it the maximizer's turn?
     * @return			the value of the board
     */
    minimax(props) {
        // extract properties
        let grid = props.grid;
        let depth = props.depth;
        let isMax = props.isMax;
    
        // evaluate score
        let score = this.evaluate(grid);
    
        //
        // use this score to determine what happened
        //
    
        if (score == 10)    // ai won
            return score;
        if (score == -10)   // opponent won
            return score;
        if (isMovesLeft(flatten(grid)) == false) // cat's game
            return 0;
        
        // If this maximizer's move
        if (isMax) {
            let best = -1000;
    
            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (grid[i][j] == null) {
                        grid[i][j] = this.symbol;    // perform move
    
                        // choose next best value
                        props = {grid: grid, depth: depth + 1, isMax: !isMax};
                        best = Math.max(
                            best, this.minimax(props)
                        );
    
                        grid[i][j] = null;      // undo move
                    }
                }
            }
            return best;
        }
    
        // If this minimizer's move
        else {
            let best = 1000;
    
            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (grid[i][j] == null) {
                        grid[i][j] = this.opponent;   // perform move

                        // choose min value
                        props = {grid: grid, depth: depth + 1, isMax: !isMax};
                        best = Math.min(
                            best, this.minimax(props)
                        );

                        grid[i][j] = null;			// undo move
                    }
                }
            }
            return best;
        }
    }

    /**
     * evaluate() -- calculates the "score" of a move
     * @param grid  3x3 game board
     * @return      10 for AI win
     *              -10 for opponent win
     *              0 otherwise.
     */
    evaluate(grid) {
        // check for AI win or opponent win
        var outcome = calculateWinner(flatten(grid));
        if (outcome == this.symbol) {
            return 10;  // AI wins
        } else if (outcome == this.opponent) {
            return -10; // opponent wins
        }
        
        return 0;			// no winner
    }
}

/**
 * gridify() -- helper function to turn an array into a 2d array
 * @param flat      the flat array
 * @param rows      # of rows
 * @param cols      # of cols
 */
function gridify(flat, rows, cols) {
    let out = [];
    for (let row = 0; row < rows; row++) {
        out.push([]);
        for (let col = 0; col < cols; col++) {
            out[row].push(flat[row*cols + col]);
        }
    }
    return out;
}

/**
 * flatten() -- helper function that converts a 2d array into a flat array
 * @param grid      the 2d array to flatten
 * 
 * @return flat     the flattened array
 */
function flatten(grid) {
    let rows = grid.length;
    let cols = grid[0].length;
    let flat = Array(rows*cols).fill(null);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            flat[row*cols + col] = grid[row][col];
        }
    }
    return flat;
}

/**
 * isMovesLeft() -- helper function to see if a move is left
 * @param arr  
 * @return      true if a move can be made, false otherwise.
 */
function isMovesLeft(arr) {
    return arr.includes(null);
}

/**
 * printGrid() -- helper function to print the grid
 * @param grid      3x3 grid to print
 */
function printGrid(grid) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            console.log(grid[i][j]);
        }
        console.log('\n');
    }
}