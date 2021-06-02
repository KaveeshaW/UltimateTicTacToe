const { smallBoard, SHAPE_TYPES, WINNING_COMBINATIONS } = require("./smallBoard.js");

beforeEach(() => {
    smallBoardTest = new smallBoard();
    x = SHAPE_TYPES[0];
    circle = SHAPE_TYPES[1];
    square = SHAPE_TYPES[2];
    triangle = SHAPE_TYPES[3];
});

// ! SHAPE_TYPES -------

test("SHAPE_TYPES Tests: 0 is x", () => {
    expect(SHAPE_TYPES[0]).toBe("x");
});

test("1 is circle", () => {
    expect(SHAPE_TYPES[1]).toBe("circle");
});

test("2 is square", () => {
    expect(SHAPE_TYPES[2]).toBe("square");
});

test("3 is triangle", () => {
    expect(SHAPE_TYPES[3]).toBe("triangle");
});

// ! SMALL BOARD TESTS -------
//---positons in array---
// 0 1 2
// 3 4 5
// 6 7 8

test("Small Board Tests: draw for 2v2", () => {
    // x o x
    // o o x
    // x x o
    smallBoardTest.placeMarker(x, 0);
    smallBoardTest.placeMarker(circle, 1);
    smallBoardTest.placeMarker(x, 2);

    smallBoardTest.placeMarker(circle, 3);
    smallBoardTest.placeMarker(circle, 4);
    smallBoardTest.placeMarker(x, 5);

    smallBoardTest.placeMarker(x, 6);
    smallBoardTest.placeMarker(x, 7);
    smallBoardTest.placeMarker(circle, 8);

    expect(smallBoardTest.checkForDraw()).toEqual(true);
});

test("Small Board Tests: checking if draw function gives win for 2v2", () => {
    // board when created
    // x o x
    // o o o
    for (let i = 0; i < 3; i++) {
        if (i <= 2) {
            smallBoardTest.placeMarker(x, i);
        } else {
            smallBoardTest.placeMarker(o, i);
        }
    }
    smallBoardTest.placeMarker(circle, 3);
    smallBoardTest.placeMarker(circle, 4);
    smallBoardTest.placeMarker(circle, 5);
    expect(smallBoardTest.checkForDraw()).toEqual(false);
});

test("draw for 4player", () => {
    // board when created
    // x o s
    // t
    smallBoardTest.placeMarker(x, 0);
    smallBoardTest.placeMarker(circle, 1);
    smallBoardTest.placeMarker(square, 2);
    smallBoardTest.placeMarker(triangle, 3);
    expect(smallBoardTest.checkForDraw()).toEqual(true);
});

test("draw function gives win for 4player", () => {
    // board when created
    // x o s
    // t x o
    // s t x
    smallBoardTest.placeMarker(x, 0);
    smallBoardTest.placeMarker(circle, 1);
    smallBoardTest.placeMarker(square, 2);
    smallBoardTest.placeMarker(triangle, 3);
    smallBoardTest.placeMarker(x, 4);
    smallBoardTest.placeMarker(circle, 5);
    smallBoardTest.placeMarker(square, 6);
    smallBoardTest.placeMarker(triangle, 7);
    smallBoardTest.placeMarker(x, 8);
    expect(smallBoardTest.checkForDraw()).toEqual(false);
});

test("Small Board Tests: x in top left corner of small board", () => {
    smallBoardTest.placeMarker(x, 0); //place in the upper left corner of board
    expect(smallBoardTest.board[0]).toEqual("x");
});

test("x in top middle corner of small board", () => {
    smallBoardTest.placeMarker(x, 1); //place in the upper left corner of board
    expect(smallBoardTest.board[1]).toEqual("x");
});

test("x in top right corner of small board", () => {
    smallBoardTest.placeMarker(x, 2); //place in the upper left corner of board
    expect(smallBoardTest.board[2]).toEqual("x");
});

test("x in middle left corner of small board", () => {
    smallBoardTest.placeMarker(x, 3); //place in the upper left corner of board
    expect(smallBoardTest.board[3]).toEqual("x");
});

test("x in middle middle corner of small board", () => {
    smallBoardTest.placeMarker(x, 4); //place in the upper left corner of board
    expect(smallBoardTest.board[4]).toEqual("x");
});

test("x in middle right corner of small board", () => {
    smallBoardTest.placeMarker(x, 5); //place in the upper left corner of board
    expect(smallBoardTest.board[5]).toEqual("x");
});

test("x in bottom left corner of small board", () => {
    smallBoardTest.placeMarker(x, 6); //place in the upper left corner of board
    expect(smallBoardTest.board[6]).toEqual("x");
});

test("x in bottom middle corner of small board", () => {
    smallBoardTest.placeMarker(x, 7); //place in the upper left corner of board
    expect(smallBoardTest.board[7]).toEqual("x");
});

test("x in bottom right corner of small board", () => {
    smallBoardTest.placeMarker(x, 8); //place in the upper left corner of board
    expect(smallBoardTest.board[8]).toEqual("x");
});

// space is available tests

test("space is available with no elements on the board", () => {
    expect(smallBoardTest.hasSpaceAvailable()).toEqual(true);
});

test("space is not available", () => {
    for (let i = 0; i < smallBoardTest.board.length; i++) {
        smallBoardTest.board[i] = "x";
    }
    expect(smallBoardTest.hasSpaceAvailable()).toEqual(false);
});

test("space is available with some spaces being occupied", () => {
    for (let i = 0; i < 2; i++) {
        smallBoardTest.board[i] = "x";
    }
    expect(smallBoardTest.hasSpaceAvailable()).toEqual(true);
});

// WIN CONDITION CHECKS

test("Small board win conidtions: 3 in a row, horizontal top row", () => {
    smallBoardTest.board[0] = "x";
    smallBoardTest.board[1] = "x";
    smallBoardTest.board[2] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});

test("horizontal middle row", () => {
    smallBoardTest.board[3] = "x";
    smallBoardTest.board[4] = "x";
    smallBoardTest.board[5] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});

test("horizontal bottom row", () => {
    smallBoardTest.board[6] = "x";
    smallBoardTest.board[7] = "x";
    smallBoardTest.board[8] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});

test("vertical left column", () => {
    smallBoardTest.board[0] = "x";
    smallBoardTest.board[3] = "x";
    smallBoardTest.board[6] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});

test("vertical middle column", () => {
    smallBoardTest.board[1] = "x";
    smallBoardTest.board[4] = "x";
    smallBoardTest.board[7] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});

test("verticle right column", () => {
    smallBoardTest.board[2] = "x";
    smallBoardTest.board[5] = "x";
    smallBoardTest.board[8] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});

test("first diagonal", () => {
    smallBoardTest.board[0] = "x";
    smallBoardTest.board[4] = "x";
    smallBoardTest.board[8] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});

test("second diagonal", () => {
    smallBoardTest.board[2] = "x";
    smallBoardTest.board[4] = "x";
    smallBoardTest.board[6] = "x";
    expect(smallBoardTest.checkForSmallWin("x")).toEqual(true);
});
