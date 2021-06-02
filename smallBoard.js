const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const SHAPE_TYPES = ["x", "circle", "square", "triangle"];

class smallBoard {
    constructor() {
        this.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    }

    clearBoard() {
        this.board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    }

    //Returns boolean signifying if the given shape won
    checkForSmallWin(shape) {
        return WINNING_COMBINATIONS.some((combination) => {
            return combination.every((index) => {
                return this.board[index] == shape;
            });
        });
    }

    //Returns boolean signifying if nobody won the board
    checkForDraw() {
        //! might need two modes because 2v2 has two shapes, and 4player has four
        //Check every shape for a win
        return !SHAPE_TYPES.some((shape) => {
            return this.checkForSmallWin(shape);
        });
    }

    //Places given shape on board in the specified position
    placeMarker(shape, position) {
        this.board[position] = shape;
    }

    //Checks if there are any open spots on the board
    hasSpaceAvailable() {
        return this.board.some((element) => {
            return element == " ";
        });
    }
}

module.exports.smallBoard = smallBoard;
module.exports.WINNING_COMBINATIONS = WINNING_COMBINATIONS;
module.exports.SHAPE_TYPES = SHAPE_TYPES;
