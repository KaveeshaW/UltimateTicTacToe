const { game, _4PlayerGame, _2v2Game } = require("./game.js");
const player = require("./player.js");

class NoSocketGame extends game {
  notifyOfPlacedMarker(playerShape, boardNum, positionOnBoard) {}

  notifyOfTurn(whoseTurnItIs) {}

  notifyPlayerOfScoreUpdate(scoringPlayer, updatedScore) {}

  notifyOfWinner(winner) {}

  notifyOfDraw() {}

  notifyOfRestart() {}
}

let mockGame;
let testGame;
let _4PlayerTest;
let _2v2Test;

beforeEach(() => {
  mockGame = new NoSocketGame();
  testGame = new game();
  _4PlayerTest = new _4PlayerGame();
  _4PlayerTest.notifyPlayerOfScoreUpdate = () => {};
  _2v2Test = new _2v2Game();
  _2v2Test.notifyPlayerOfScoreUpdate = () => {};

  for (let i = 0; i < 4; i++) {
    //testGame.players[i] = new player("Player " + (i + 1), -1, i + 1);
    mockGame.players[i] = new player("Player " + (i + 1), -1, i + 1);
    _4PlayerTest.players[i] = new player("Player " + (i + 1), -1, i + 1);
    _2v2Test.players[i] = new player("Player " + (i + 1), -1, i + 1);
  }
});

// ! GAME TESTS -------
describe("game tests: constructor", () => {
  test("big board has empty strings", () => {
    testGame.bigBoard.forEach((element) => {
      expect(element).toEqual(" ");
    });
  });

  test("big board is of length 9", () => {
    expect(testGame.bigBoard.length).toEqual(9);
  });

  test("boardsArray is of length 9", () => {
    expect(testGame.boardsArray.length).toEqual(9);
  });

  test("the first smallBoard in the boardsArray is of length 9", () => {
    expect(testGame.boardsArray[0].board.length).toEqual(9);
  });

  test("the first smallBoard in the boardsArray has 9 empty strings", () => {
    testGame.boardsArray[0].board.forEach((element) => {
      expect(element).toEqual(" ");
    });
  });

  test("empty array of players", () => {
    //let testGame = new game();
    expect(testGame.players).toEqual([]);
  });

  test("it is the first player's turn", () => {
    expect(testGame.turns[0]).toBe(true);
  });

  test("current player is 0", () => {
    expect(testGame.currentPlayer).toBe(0);
  });
});

describe("game methods: no notify (socket) implementation", () => {
  describe("restart", () => {
    test("bigBoard is empty", () => {
      mockGame.restartGame();
      mockGame.bigBoard.forEach((element) => {
        expect(element).toEqual(" ");
      });
    });
    test("each smallBoard in boardsArray is empty", () => {
      mockGame.restartGame();
      mockGame.boardsArray.forEach((smallBoard) => {
        smallBoard.board.forEach((cell) => {
          expect(cell).toEqual(" ");
        });
      });
    });
    test("each player has a score of 0", () => {
      mockGame.restartGame();
      mockGame.players.forEach((player) => {
        expect(player.getScore()).toEqual(0);
      });
    });
    test("first player has the turn, everyone else does not", () => {
      mockGame.restartGame();
      expect(mockGame.turns[0]).toBe(true);
      for (let i = 1; i < mockGame.turns.length; i++) {
        expect(mockGame.turns[i]).toBe(false);
      }
    });
    test("current player is first player", () => {
      mockGame.restartGame();
      expect(mockGame.currentPlayer).toEqual(0);
    });
  });

  describe("goToNextPlayer", () => {
    test("switch to the second player", () => {
      mockGame.currentPlayer = 0;
      mockGame.goToNextPlayer();
      expect(mockGame.turns[0]).toBe(false);
      expect(mockGame.currentPlayer).toEqual(1);
      expect(mockGame.turns[mockGame.currentPlayer]).toBe(true);
      expect(mockGame.players[mockGame.currentPlayer].getUserName()).toBe(
        "Player 2"
      );
    });
    test("switch to the third player", () => {
      mockGame.currentPlayer = 1;
      mockGame.goToNextPlayer();
      expect(mockGame.turns[1]).toBe(false);
      expect(mockGame.currentPlayer).toEqual(2);
      expect(mockGame.turns[mockGame.currentPlayer]).toBe(true);
      expect(mockGame.players[mockGame.currentPlayer].getUserName()).toBe(
        "Player 3"
      );
    });
    test("switch to the fourth player", () => {
      mockGame.currentPlayer = 2;
      mockGame.goToNextPlayer();
      expect(mockGame.turns[2]).toBe(false);
      expect(mockGame.currentPlayer).toEqual(3);
      expect(mockGame.turns[mockGame.currentPlayer]).toBe(true);
      expect(mockGame.players[mockGame.currentPlayer].getUserName()).toBe(
        "Player 4"
      );
    });
    test("switch to the first player", () => {
      mockGame.currentPlayer = 3;
      mockGame.goToNextPlayer();
      expect(mockGame.turns[3]).toBe(false);
      expect(mockGame.currentPlayer).toEqual(0);
      expect(mockGame.turns[mockGame.currentPlayer]).toBe(true);
      expect(mockGame.players[mockGame.currentPlayer].getUserName()).toBe(
        "Player 1"
      );
    });
  });

  describe("areThereMovesLeft", () => {
    test("no moves have been made, so there are moves left", () => {
      expect(mockGame.areThereMovesLeft()).toBe(true);
    });
    test("some moves have been made, but there are moves left", () => {
      // x x x  x x x  - - -
      // x x x  x x x  - - -
      // x x x  x x x  - - -
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < mockGame.boardsArray[i].board.length; j++) {
          mockGame.boardsArray[i].board[j] = "x";
        }
      }
      expect(mockGame.areThereMovesLeft()).toBe(true);
    });
    test("no room left", () => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < mockGame.boardsArray[i].board.length; j++) {
          mockGame.boardsArray[i].board[j] = "x";
        }
      }
      expect(mockGame.areThereMovesLeft()).toBe(false);
    });
  });
});

describe("Big board win conditions", () => {
  test("3 in a row, horizontal top row", () => {
    testGame.bigBoard[0] = "x";
    testGame.bigBoard[1] = "x";
    testGame.bigBoard[2] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });

  test("horizontal middle row", () => {
    testGame.bigBoard[3] = "x";
    testGame.bigBoard[4] = "x";
    testGame.bigBoard[5] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });

  test("horizontal bottom row", () => {
    testGame.bigBoard[6] = "x";
    testGame.bigBoard[7] = "x";
    testGame.bigBoard[8] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });

  test("vertical left column", () => {
    testGame.bigBoard[0] = "x";
    testGame.bigBoard[3] = "x";
    testGame.bigBoard[6] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });

  test("vertical middle column", () => {
    testGame.bigBoard[1] = "x";
    testGame.bigBoard[4] = "x";
    testGame.bigBoard[7] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });

  test("verticle right column", () => {
    testGame.bigBoard[2] = "x";
    testGame.bigBoard[5] = "x";
    testGame.bigBoard[8] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });

  test("first diagonal", () => {
    testGame.bigBoard[0] = "x";
    testGame.bigBoard[4] = "x";
    testGame.bigBoard[8] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });

  test("second diagonal", () => {
    testGame.bigBoard[2] = "x";
    testGame.bigBoard[4] = "x";
    testGame.bigBoard[6] = "x";
    expect(testGame.checkForThreeInARow("x")).toEqual(true);
  });
});

describe("2v2Game", () => {
  describe("getTeammateIndex", () => {
    test("teammate for first player", () => {
      expect(_2v2Test.getTeammateIndex(0)).toEqual(2);
    });
    test("teammate for second player", () => {
      expect(_2v2Test.getTeammateIndex(1)).toEqual(3);
    });
    test("teammate for third player", () => {
      expect(_2v2Test.getTeammateIndex(2)).toEqual(0);
    });
    test("teammate for fourth player", () => {
      expect(_2v2Test.getTeammateIndex(3)).toEqual(1);
    });
  });

  describe("whoHasHighestScore", () => {
    test("team circle has highest score", () => {
      _2v2Test.players[0].setScore(1);
      _2v2Test.players[0].setShape("x");

      _2v2Test.players[1].setScore(2);
      _2v2Test.players[1].setShape("circle");

      _2v2Test.players[2].setScore(1);
      _2v2Test.players[2].setShape("x");

      _2v2Test.players[3].setScore(1);
      _2v2Test.players[3].setShape("circle");

      expect(_2v2Test.whoHasHighestScore()).toEqual("circle");
    });
  });

  describe("calculateAndUpdateScore", () => {
    test("current player and teammate get an overall team score of 3", () => {
      _2v2Test.players[0].setScore(2);
      _2v2Test.players[2].setScore(0);
      _2v2Test.currentPlayer = 0;
      _2v2Test.calculateAndUpdateScore();
      expect(_2v2Test.players[0].getScore()).toEqual(3);
      expect(_2v2Test.players[2].getScore()).toEqual(3);
    });
  });

  describe("checkForDraw", () => {
    test("2v2 to be a draw", () => {
      _2v2Test.players[0].setScore(1);
      _2v2Test.players[1].setScore(1);
      expect(_2v2Test.checkForDraw()).toEqual(true);
    });

    test("2v2 to NOT be a draw", () => {
      _2v2Test.players[0].setScore(1);
      _2v2Test.players[1].setScore(3);
      expect(_2v2Test.checkForDraw()).toEqual(false);
    });
  });
});

describe("4PlayerTest", () => {
  describe("whoHasHighestScore", () => {
    test("triangle has highest score", () => {
      _4PlayerTest.players[0].setScore(1);
      _4PlayerTest.players[0].setShape("x");

      _4PlayerTest.players[1].setScore(1);
      _4PlayerTest.players[1].setShape("circle");

      _4PlayerTest.players[2].setScore(1);
      _4PlayerTest.players[2].setShape("square");

      _4PlayerTest.players[3].setScore(2);
      _4PlayerTest.players[3].setShape("triangle");

      expect(_4PlayerTest.whoHasHighestScore()).toEqual("triangle");
    });
  });

  describe("calculateAndUpdateScore", () => {
    test("player three just won a board, score is now 2", () => {
      _4PlayerTest.currentPlayer = 2;
      _4PlayerTest.players[_4PlayerTest.currentPlayer].setScore(1);
      _4PlayerTest.calculateAndUpdateScore();
      expect(
        _4PlayerTest.players[_4PlayerTest.currentPlayer].getScore()
      ).toEqual(2);
    });
  });

  describe("checkForDraw", () => {
    // draw for 4 player - x, o, triangle, square
    test("4 player to be a draw", () => {
      _4PlayerTest.players[0].setScore(1);
      _4PlayerTest.players[1].setScore(1);
      _4PlayerTest.players[2].setScore(1);
      _4PlayerTest.players[3].setScore(1);

      expect(_4PlayerTest.checkForDraw()).toEqual(true);
    });

    // its a win after calling draw function - 4 player
    test("4 player to NOT be a draw", () => {
      _4PlayerTest.players[0].setScore(2);
      _4PlayerTest.players[1].setScore(1);
      _4PlayerTest.players[2].setScore(1);
      _4PlayerTest.players[3].setScore(1);

      expect(_4PlayerTest.checkForDraw()).toEqual(false);
    });
  });
});

//   testGame.boardsArray[0].board[0] = "x";
//   testGame.boardsArray[0].board[1] = "x";
//   testGame.boardsArray[0].board[2] = "x";

//win top middle board
//   testGame.boardsArray[1].board[0] = "x";
//   testGame.boardsArray[1].board[1] = "x";
//   testGame.boardsArray[1].board[2] = "x";

//win top middle board
//   testGame.boardsArray[2].board[0] = "x";
//   testGame.boardsArray[2].board[1] = "x";
//   testGame.boardsArray[2].board[2] = "x";

// restart game tests -- cant not be tested at the moment because the socket is undefined
// test("restart: check if array is 9", () => {
//   testGame.restartGame();
// });

//win top left board
