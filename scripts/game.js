'use strict';

const e = React.createElement;
const r = ReactDOM.createRoot;

// square as a formal component
//class Square extends React.Component {
//    render() {
//        return e(
//            'button',
//            { 
//                className: 'btn btn-outline-primary square',
//                onClick: () => {
//                    this.props.onClick()
//                }
//            },
//            this.props.value)
//    }
//}

// square is easier to implement as a function component
function Square(props) {
    return e(
        'button',
        {
            className: 'btn btn-outline-primary square',
            onClick: () => {
                props.onClick()
            },
        },
        props.value
    )
}

class Board extends React.Component {
    /**
     * renderSquare() -- function that creates a square given its grid #
     * @i       this square's grid number
     * 
     * @return  React component
     */
    renderSquare(i) {
        return e(
            Square,
            {
                value: this.props.squares[i],
                onClick: () => {this.props.onClick(i)},
            }
        )
    }

    render() {
        return e("div", null,
            e(
                "div",
                { className: "board-row" },
                this.renderSquare(0),
                this.renderSquare(1),
                this.renderSquare(2)
            ),
            e(
                "div",
                { className: "board-row" },
                this.renderSquare(3),
                this.renderSquare(4),
                this.renderSquare(5)
            ),
            e(
                "div",
                { className: "board-row" },
                this.renderSquare(6),
                this.renderSquare(7),
                this.renderSquare(8)
            )
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.getInitialState();

        if (this.state.diff) {
            this.ai = new AI({diff: this.state.diff, symbol: 'O'});

            // make an initial move if turn == 'O'
            if (this.state.turn === this.ai.symbol) {
                var grid = this.state.squares.slice();
                var idx = this.ai.makeMove(grid);
                
                this.state.squares[idx] = this.ai.symbol;
                this.state.turn = 'X';
            }
        }
    }

    getInitialState() {
        return structuredClone({
            squares: Array(9).fill(null),
            turn: Math.random() < 0.5 ? 'X' : 'O',
            diff: +this.props.diff,
        });
    }

    /**
     * toggleTurn() -- toggle's user's turn
     */
    toggleTurn() {
        if (this.state.turn === 'X') {
            return 'O';
        } else {
            return 'X';
        }
    }

    /**
     * handleClick() -- handles a click on the board
     * Board controls Square, Square components are controlled components
     * @param i   the square that was clicked
     */
    handleClick(i) {
        // get a copy of the board state
        const squares = this.state.squares.slice();

        // do nothing if there's a winner, or that square is full
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.turn;
        
        // check if player won first
        if (calculateWinner(squares)) {
            this.setState({
                squares: squares,
                turn: this.state.turn,
            });
            return;
        }

        // determine if the computer should make a move
        let toggle = true;
        if (this.state.diff) {      // non-zero means it's player v ai
            toggle = false;
            var idx = this.ai.makeMove(squares.slice());
            squares[idx] = this.ai.symbol;
        }

        // handle 2-player mode
        this.setState({
            squares: squares,
            turn: toggle ? this.toggleTurn() : 'X',
        });
    }

    restartGame = () => {
        // create the board
        const domContainer = document.querySelector('#game-board');
        const root = r(domContainer);
        root.render(e(Game, {diff: this.state.diff}));
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;

        if (winner) {
            if (winner == 'C') {
                status = `Cat's Game! No Winner!`
            } else {
                status = `Winner: ${winner}`
            }
        } else {
            status = `Turn: ${this.state.turn}`;
        }

        return e(
            "div",
            { className: "game" },
            e(
                "div",
                { className: "game-status" },
                status
            ),
            e(
                "div",
                { className: "game-board" },
                e(
                    Board,
                    {
                        squares: this.state.squares,
                        onClick: (i) => this.handleClick(i),
                    },
                )
            ),
            e(
                "div",
                { className: "game-btns" },
                e(
                    "a",
                    {
                        className: 'btn btn-outline-light game-btn',
                        href: 'index.html',
                        title: 'Back to Menu',
                    },
                    e(
                        "img",
                        { 
                            className: 'game-svg',
                            src: 'resources/back.svg',
                            alt: 'Back to Menu',
                        },
                    )
                ),
                e(
                    "button",
                    {
                        className: 'btn btn-outline-light game-btn',
                        onClick: () => this.restartGame(),
                        title: 'Restart Game',
                    },
                    e(
                        "img",
                        { 
                            className: 'game-svg',
                            src: 'resources/restart.svg',
                            alt: 'Restart Game',
                        },
                    )
                ),
            )
        );
    }
}

// ------------------------
// build website
// ------------------------
document.addEventListener("DOMContentLoaded", function() {
    // determine difficulty from loc
    var s = window.location.search;
    let diff = +s[s.length - 1];     // get difficulty

    // filter difficulty
    console.log(diff);
    if (isNaN(diff) || diff < 0) {
        diff = 1
    } else if (diff > 4) {
        diff = 4;
    }

    // set the game difficulty
    let p = document.querySelector('#game-diff');
    let c = document.createElement('h2')
    c.innerHTML = `Difficulty: ${diff_list[diff]}`;
    c.className = 'subtitle text-center';
    p.append(c);

    // set the page title
    document.title = `Tic-Tac-Toe Game | ${diff_list[diff]}`;
    
    // create the board
    const domContainer = document.querySelector('#game-board');
    const root = r(domContainer);
    root.render(e(Game, {diff: diff}));
})
