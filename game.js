//Used for both large board and small boards
const TEAM_SHAPE_TYPES = ["x", "circle"];
const FIRST_PLAYER = 0;
const LAST_PLAYER = 3;
let timer = 0;

const {
  smallBoard,
  WINNING_COMBINATIONS,
  SHAPE_TYPES,
} = require("./smallBoard.js");

class game {
  constructor(whichGame) {
    //clearInterval(timer)
    this.bigBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    this.boardsArray = [
      new smallBoard(), //0
      new smallBoard(), //1
      new smallBoard(), //2
      new smallBoard(), //3
      new smallBoard(), //4
      new smallBoard(), //5
      new smallBoard(), //6
      new smallBoard(), //7
      new smallBoard(), //8
    ];
    this.players = [];
    this.turns = [true, false, false, false];
    this.currentPlayer = FIRST_PLAYER; //needs to be first connecting player
    this.whichGame = whichGame;
  }

  restartGame() {
    clearInterval(timer);
    //Reset big board and small boards
    this.bigBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    this.boardsArray.forEach((small_board) => {
      small_board.clearBoard();
    });

    //Reset player scores on server end
    this.players.forEach((p) => {
      p.setScore(0);
    });

    this.turns = [true, false, false, false];
    this.currentPlayer = FIRST_PLAYER; //reset current player to first player

    //Inform clients that they need to reset their game information and board
    this.notifyOfRestart();
  }

  //Used to relay selection made to all players
  notifyOfPlacedMarker(playerShape, boardNum, positionOnBoard) {
    //shape is a string, boardNum & Position are Numbers
    for (var i = 0; i < 4; i++) {
      this.players[i].socket.emit("placeMark", {
        shape: playerShape,
        boardNumber: boardNum,
        position: positionOnBoard,
      });
    }
  }

  //Inform other players of whose turn it is now
  notifyOfTurn(whoseTurnItIs) {
    for (var i = 0; i < 4; i++) {
      this.players[i].socket.emit("turnInform", this.turns[i]);
      this.players[i].socket.emit("updateWhoseTurn", whoseTurnItIs);
    }
  }

  //Informs player that their score needs to update on their UI
  notifyPlayerOfScoreUpdate(scoringPlayer, updatedScore) {
    scoringPlayer.socket.emit("updateScore", updatedScore);
  }

  //Used to notify players that someone won the game
  notifyOfWinner(winner) {
    for (var i = 0; i < 4; i++) {
      this.players[i].socket.emit("someoneWon", {
        winner: winner,
        // gameTimer: timer,
      });
    }
  }

  //Used to notify players that the game ended in a draw
  notifyOfDraw() {
    for (var i = 0; i < 4; i++) {
      this.players[i].socket.emit("draw", timer);
    }
  }

  //Inform clients that they need to reset their game information and board
  notifyOfRestart() {
    for (var i = 0; i < 4; i++) {
      this.players[i].socket.emit("restart", {
        turn: this.turns[i],
      });
    }
  }

  //Add marker on js representation of game board
  addMarkToBoard(shape, boardNum, position) {
    //shape is a string, boardNum & Position are Numbers
    let small_board = this.boardsArray[boardNum];
    small_board.placeMarker(shape, position);
    //Relay selection to all players
    this.notifyOfPlacedMarker(shape, boardNum, position);

    //Check for small and big board win conditions
    if (small_board.checkForSmallWin(shape)) {
      this.bigBoard[boardNum] = shape; //Update big board array with winner shape

      //Update data structure and client UIs to reflect who won that small board
      for (let pos = 0; pos < 9; pos++) {
        small_board.placeMarker(shape, pos);

        //Make sure all clients also match the server state
        this.notifyOfPlacedMarker(shape, boardNum, pos);
      }

      //Update and inform of new score
      this.calculateAndUpdateScore();

      //Check for large board win
      if (this.checkForThreeInARow(shape)) {
        this.notifyOfWinner(shape); //Notify all players of who won
      }
    }

    //Check if there are no moves left
    if (!this.areThereMovesLeft()) {
      //If no player has the highest score then game ends in a draw
      if (this.checkForDraw()) {
        this.notifyOfDraw();
      } else {
        let winner = this.whoHasHighestScore(); //Find the highest scoring player/team
        this.notifyOfWinner(winner); //Notify all players of who won
      }
    }

    this.goToNextPlayer(); //Move onto next player's turn
  }

  //Move to next player's turn
  goToNextPlayer() {
    //Move to next player in list
    if (this.currentPlayer == LAST_PLAYER) {
      this.turns[this.currentPlayer] = false;
      this.currentPlayer = FIRST_PLAYER;
      this.turns[this.currentPlayer] = true;
    } else {
      this.turns[this.currentPlayer] = false;
      this.currentPlayer = this.currentPlayer + 1;
      this.turns[this.currentPlayer] = true;
    }

    //Inform other players of whose turn it is now
    let nextPlayer = this.players[this.currentPlayer].getUserName();
    this.notifyOfTurn(nextPlayer);

    // for (var i = 0; i < 4; i++) {
    //     this.players[i].socket.emit("turnInform", this.turns[i]);
    //     this.players[i].socket.emit("updateWhoseTurn", nextPlayer);
    // }
  }

  //Check if a player has gotten 3-in-a-row on big board
  checkForThreeInARow(shape) {
    return WINNING_COMBINATIONS.some((combination) => {
      //console.log("combination: " + combination);
      return combination.every((index) => {
        // console.log("shape at pos: " + this.bigBoard[index]);
        // console.log(this.bigBoard[index] == shape);
        return this.bigBoard[index] == shape;
      });
    });
  }

  //Returns shape which has the highest score
  whoHasHighestScore() {}

  //Calculates the player/team's score and sends the updated score to player(s)
  calculateAndUpdateScore() {}

  //Check if the game has ended in draw by comparing points
  checkForDraw() {}

  //Checks if there are any available moves left in the game
  areThereMovesLeft() {
    return this.boardsArray.some((small_board) => {
      return small_board.hasSpaceAvailable();
    });
  }

  // startGameTimer() {
  //     timer = 0;
  //     let x = setInterval(function () {
  //         timer++;
  //     }, 1000);
  // }
}

//These two classes will extend the base class to sort out the details of their gamemode's behavior
class _2v2Game extends game {
  //Used to find the teammate of the given player
  getTeammateIndex(playerIndex) {
    return (playerIndex + 2) % 4;
  }

  //Emit each player's information to their client
  startGame() {
    console.log("2v2 game starting!");
    // startGameTimer();
    for (var i = 0; i < 4; i++) {
      this.players[i].socket.emit("inGameTimer");
      this.players[i].setShape(TEAM_SHAPE_TYPES[i % 2]); //Set player's shape
      this.players[i].socket.emit("shapeAndName", {
        shape: TEAM_SHAPE_TYPES[i % 2], //Ensure that i loops around the array
        name: this.players[i].getUserName(),
        teammate: this.players[this.getTeammateIndex(i)].getUserName(),
        turn: this.turns[i],
      });
    }
  }

  //Returns shape which has the highest score
  whoHasHighestScore() {
    //See who has the highest score
    let highestScore = 0;
    let winner = "";
    for (var i = 0; i < 2; i++) {
      let playerScore = this.players[i].getScore();
      let teammateScore = this.players[this.getTeammateIndex(i)].getScore();
      let teamScore = playerScore + teammateScore;

      if (teamScore > highestScore) {
        highestScore = teamScore;
        winner = this.players[i].getShape();
      }
    }
    return winner;
  }

  //Calculates the team's score and sends the updated score to players
  calculateAndUpdateScore() {
    //Add point to current player's team score
    let scoringPlayer = this.players[this.currentPlayer];
    let teammate = this.players[this.getTeammateIndex(this.currentPlayer)];
    let updatedScore = scoringPlayer.getScore() + 1;

    //console.log("team " + scoringPlayer.getShape() + ": " + updatedScore);

    //Update both players score
    scoringPlayer.setScore(updatedScore);
    teammate.setScore(updatedScore);

    //Notify players of their updated team score
    this.notifyPlayerOfScoreUpdate(scoringPlayer, updatedScore);
    this.notifyPlayerOfScoreUpdate(teammate, updatedScore);
    // scoringPlayer.socket.emit("updateScore", updatedScore);
    // teammate.socket.emit("updateScore", updatedScore);
  }

  //Check if the game has ended in draw by comparing points of teams
  checkForDraw() {
    //Get the score of both teams
    let xScore = this.players[0].getScore();
    let circleScore = this.players[1].getScore();
    //console.log("xScore: " + xScore);
    //console.log("circleScore: " + circleScore);
    //console.log("draw: " + !(xScore > circleScore || xScore < circleScore));

    //If one of the teams has a higher score return false, else return true
    return !(xScore > circleScore || xScore < circleScore);
  }
}

class _4PlayerGame extends game {
  //Emit each player's information to their client
  startGame() {
    console.log("4 Player game starting!");
    // startGameTimer();
    for (var i = 0; i < 4; i++) {
      this.players[i].socket.emit("inGameTimer");
      this.players[i].socket.emit("shapeAndName", {
        shape: SHAPE_TYPES[i],
        name: this.players[i].getUserName(),
        teammate: "None",
        turn: this.turns[i],
      });
    }
  }

  //Returns shape which has the highest score
  whoHasHighestScore() {
    //See who has the highest score
    let highestScore = 0;
    let winner = "";
    for (var i = 0; i < 4; i++) {
      let playerScore = this.players[i].getScore();
      if (playerScore > highestScore) {
        highestScore = playerScore;
        winner = this.players[i].getShape();
      }
    }
    return winner;
  }

  //Calculates the player/team's score and sends the updated score to player(s)
  calculateAndUpdateScore() {
    //Add point to current player
    let scoringPlayer = this.players[this.currentPlayer];
    let updatedScore = scoringPlayer.getScore() + 1;
    scoringPlayer.setScore(updatedScore);

    this.notifyPlayerOfScoreUpdate(scoringPlayer, updatedScore); //Notify player of their updated score
    //scoringPlayer.socket.emit("updateScore", updatedScore);
  }

  //Check if the game has ended in draw by comparing points of individual players
  checkForDraw() {
    //there does not exist some player
    return !this.players.some((p1) => {
      //such that every player
      return this.players.every((p2) => {
        //has score less than p1 or is p1
        return p1.getScore() > p2.getScore() || p1.getId() == p2.getId();
      });
    });
  }
}

module.exports.game = game;
module.exports._2v2Game = _2v2Game;
module.exports._4PlayerGame = _4PlayerGame;
