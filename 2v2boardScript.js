/*
    TODO:
    done 1. use the player as the main source of current player information: symbol, hover, points, teammate, who you are, timer (func)
    done 2. game flow has to move/play in the order of an player array: function for get to the next person
    done 3. game logic two teams
    
    
    ! timer at end of game needs to be cleared
    ! draw function needs to be fixed
    ! incorporate additions from this file into 4 player version
        ? add the bottom part of the screen to the other file
*/

// class gameStats {
//     constructor() {
//         this.circleTeamScore = 0;
//         this.xTeamScore = 0;
//         this.winner = "";
//     }

//     incrementTeamScore(whichShape) {
//         if (whichShape == "x") {
//             this.xTeamScore++;
//         }
//         if (whichShape == "circle") {
//             this.circleTeamScore++;
//         }
//     }

//     reset() {
//         this.circleTeamScore = 0;
//         this.xTeamScore = 0;
//         this.winner = "";
//     }

//     getCircleTeamScore(){
//         return this.circleTeamScore;
//     }

//     getXTeamScore() {
//         return this.xTeamScore;
//     }

//     getWinner(){
//         return this.winner;
//     }

//     setWinner(winner){
//         this.winner = winner;
//     }
// }

//player class
class player {
  constructor(userName) {
    this.userName = userName;
    this.team = "";
    this.isTurn = false;
    this.socket = -1;
    this.shape = "";
    this.color = "";
    this.id = -1;
    this.score = 0;
  }

  getUserName() {
    return this.userName;
  }

  setUserName(userName) {
    this.userName = userName;
  }

  getTeam() {
    return this.team;
  }

  setTeam(team) {
    this.team = team;
  }

  getIsTurn() {
    return this.isTurn;
  }

  setIsTurn(isTurn) {
    this.isTurn = isTurn;
  }

  getSocket() {
    return this.socket;
  }

  getShape() {
    return this.shape;
  }

  setShape(shape) {
    this.shape = shape;
  }

  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getScore() {
    return this.score;
  }

  setScore(score) {
    this.score = score;
  }
}

//use string "X_CLASS" or "CIRCLE_CLASS"
function getTeamScore(team) {
  let score = 0;
  for (player of players) {
    if (team == player.getTeam()) {
      score += player.getScore();
    }
  }
  return score;
}

function resetGame() {
  for (player of players) {
    player.setScore(0);
  }
  currentPlayer = 0;
  overallGameTimer = 0;
  countDown = null;
  setPlayerTurnAndClass();
  bigBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  disableBoards(disabledBoardsList);
  firstClick = false;
  document.querySelector("#turn_timer").innerHTML = localStorage.getItem("turnTimerChoice");
}

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";

const FIRST_PLAYER = 0;
const LAST_PLAYER = 3;
//we need to create four players with set information about what team they are in and what color
let p1 = new player("Player 1");
let p2 = new player("Player 2");
let p3 = new player("Player 3");
let p4 = new player("Player 4");

let currentPlayer = 0;
let overallGameTimer = 0;
let countDown = null;
let firstClick = false;
let lastBoardClicked;
let lastClassLookedAt;

//we need to arrange them in a array to have them take turns
let players = [p1, p2, p3, p4];

function setPlayerTurnAndClass() {
  //set information for each player 1
  p1.setIsTurn(true);
  p1.setShape(X_CLASS);
  p1.setTeam(X_CLASS);

  p2.setIsTurn(false);
  p2.setShape(CIRCLE_CLASS);
  p2.setTeam(CIRCLE_CLASS);

  p3.setIsTurn(false);
  p3.setShape(X_CLASS);
  p3.setTeam(X_CLASS);

  p4.setIsTurn(false);
  p4.setShape(CIRCLE_CLASS);
  p4.setTeam(CIRCLE_CLASS);
}

function getTeammate() {
  // the + 2 is there because the teammate of the current player goes in 2 turns
  let teammateIndex = (currentPlayer + 2) % 4;
  return players[teammateIndex].getUserName();
}

//plan: update the html information from the 'current' player in the array
function nextPlayer() {
  players[currentPlayer].setIsTurn(false); //previous player

  //end of the array, reset to the first player in the array
  if (currentPlayer == LAST_PLAYER) {
    currentPlayer = FIRST_PLAYER;
  } else {
    currentPlayer++;
  }
  //update html with the current player
  players[currentPlayer].setIsTurn(true); //next player

  document.getElementById("game_code").innerHTML = "404";
  document.getElementById("current_player_turn").innerHTML = players[
    currentPlayer
  ].getUserName();
  document.getElementById("player_name").innerHTML = players[
    currentPlayer
  ].getUserName();
  document.getElementById("player_symbol").innerHTML = players[
    currentPlayer
  ].getShape();
  document.getElementById("player_teamscore").innerHTML = getTeamScore(
    players[currentPlayer].getTeam()
  );
  document.getElementById("player_teammate").innerHTML = getTeammate();
  restartTimer(); //Restart timer for next player

  setBoardHoverClass(); //Set next player's hover
}

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

const cellElements = document.querySelectorAll("[data-cell1]"); // could create 9 of these
const cellElements2 = document.querySelectorAll("[data-cell2]");
const cellElements3 = document.querySelectorAll("[data-cell3]");
const cellElements4 = document.querySelectorAll("[data-cell4]");
const cellElements5 = document.querySelectorAll("[data-cell5]");
const cellElements6 = document.querySelectorAll("[data-cell6]");
const cellElements7 = document.querySelectorAll("[data-cell7]");
const cellElements8 = document.querySelectorAll("[data-cell8]");
const cellElements9 = document.querySelectorAll("[data-cell9]");

let allCellElements = [
  cellElements,
  cellElements2,
  cellElements3,
  cellElements4,
  cellElements5,
  cellElements6,
  cellElements7,
  cellElements8,
  cellElements9,
];

const board = document.getElementById("board"); // will need to change to big board
const board2 = document.getElementById("board2");
const board3 = document.getElementById("board3");
const board4 = document.getElementById("board4");
const board5 = document.getElementById("board5");
const board6 = document.getElementById("board6");
const board7 = document.getElementById("board7");
const board8 = document.getElementById("board8");
const board9 = document.getElementById("board9");

let bigBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
let boardArray = [
  board,
  board2,
  board3,
  board4,
  board5,
  board6,
  board7,
  board8,
  board9,
];

const restartButton = document.getElementById("restartButton");
const resultPage = document.getElementById("resultPage");
const resultText = document.querySelector("[data-result-page-text]");
const menuButton = document.getElementById("menu");
const forfeit = document.getElementById("forfeit");
// let circleWin;
// let xWin;
// let squareWin;
// let triangleWin;
//let gameStats = new gameStats();

// ! THIS IS THE START OF THE GAME ---------------------------------------------------------------------
let disabledBoardsList = getDisabledBoardsInput();
startGame();

function startOverallTimer() {
  overallGameTimer = 0;
  let x = setInterval(function () {
    overallGameTimer++;
    if (
      localStorage.getItem("overallGameTimer") != "" &&
      overallGameTimer == localStorage.getItem("overallGameTimer")
    ) {
      clearInterval(x);
      winOrDraw(lastClassLookedAt, lastBoardClicked);
    }
    updateGameTimer(overallGameTimer);
  }, 1000);
}

function winOrDraw(currentClass, boardId) {
  checkForASmallWin(currentClass, boardId);

  // check if the team won
  if (metWinCriteria(currentClass, boardId)) {
    //3 in a row
    showWinScreen(currentClass);
    //return true;
  }
  //no spaces left so count point totals
  else if (noOtherSmallBoardsAreAvailable()) {
    if (getTeamScore(X_CLASS) > getTeamScore(CIRCLE_CLASS)) {
      showWinScreen(X_CLASS);
    } else if (getTeamScore(X_CLASS) < getTeamScore(CIRCLE_CLASS)) {
      showWinScreen(CIRCLE_CLASS);
    } else {
      showDrawScreen();
    }
  } else if (
    smallBoardDraw(currentClass, boardId) &&
    noOtherSmallBoardsAreAvailable()
  ) {
    showDrawScreen();
    //return true;
  } else {
    showDrawScreen();
  }
}

function updateGameTimer(overallGameTimer) {
  let seconds = convertSecFormat(overallGameTimer);
  document.getElementById("game_timer").innerHTML = seconds;
}

function convertSecFormat(seconds) {
  dateObj = new Date(seconds * 1000);
  hours = dateObj.getUTCHours();
  minutes = dateObj.getUTCMinutes();
  seconds = dateObj.getSeconds();

  timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return timeString;
}

function clearOverallTimer(overallGameTimer) {
  clearInterval(overallGameTimer);
}

function getDisabledBoardsInput() {
  let input = localStorage.getItem("inputArr");
  if (input == null) {
    //Empty if null input
    return [];
  } else {
    let splitStrings = input.split(",");
    let disabledBoardIndexes = [];

    //Parse input strings for integers
    splitStrings.forEach((subString) => {
      let integer = parseInt(subString, 10);
      //Boundaries on index size and how many can be disabled at once
      if (disabledBoardIndexes.length < 8 && integer >= 0 && integer < 9) {
        disabledBoardIndexes.push(integer);
      }
    });
    return disabledBoardIndexes;
  }
}

function disableBoards(integerList) {
  console.log("input: " + integerList);
  console.log("type: " + typeof integerList);

  //For each integer in the list
  integerList.forEach((num) => {
    //Place a mark in the cell
    bigBoard[num] = "disable";
    allCellElements[num].forEach((cell) => {
      //Remove any previous marks
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);

      cell.classList.add("disable"); //Disable spot on board
      cell.removeEventListener("click", handleClick); //Remove listener on cell
    });
  });
}

restartButton.addEventListener("click", startGame);
menuButton.addEventListener("click", goToSingleOrTeamPage);
forfeit.addEventListener("click", alertUserThatItDoesNothing);

function alertUserThatItDoesNothing() {
  window.alert("Will be implemented later");
}
function goToSingleOrTeamPage() {
  window.location.href = "singleOrTeam.html";
}

function startGame() {
  console.log(localStorage.getItem("shapeColor"));
  console.log(localStorage.getItem("turnTimerChoice"));
  console.log(localStorage.getItem("overallGameTimer"));
  console.log(localStorage.getItem("numAI"));
  console.log(localStorage.getItem("inputArr"));
  console.log(localStorage.getItem("aiDifficulty"));
  console.log(localStorage.getItem("customizedBoard"));

  setPlayerTurnAndClass();
  cellElementsInitialization();
  setBoardHoverClass();
  resetGame();
  resultPage.classList.remove("show");
}

function cellElementsInitialization() {
  allCellElements.forEach((cellArray) => {
    cellArray.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);

      // extra precaution for when the game is restarted
      cell.removeEventListener("click", handleClick);
      // you can only click a cell once, afterwords the handler will not fire
      cell.addEventListener("click", handleClick, { once: true });
    });
  });
}

function setBoardHoverClass() {
  boardArray.forEach((board) => {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    board.classList.add(players[currentPlayer].getShape());
  });
}

/*
    on click:
    - place the marker
    - check for a current player win - increment scores
    - check for game win or draws
    - update the player shape, hover and change text
    - 
*/

function handleClick(e) {
  const cell = e.target;
  const boardId = e.target.parentElement.id;
  let currentClass = players[currentPlayer].getShape();
  placeMark(cell, currentClass);
  if(firstClick == false) {
    startOverallTimer();
    firstClick = true;
  }
  lastBoardClicked = boardId;
  lastClassLookedAt = currentClass;

  // if(!checkWinOrDrawConditions()){
  //     nextPlayer();
  // }
  //winDrawOrNextPlayer();
  // checkForASmallWin(currentClass, boardId);
  // // check if the team won
  // if (metWinCriteria(currentClass, boardId)) {
  //     showWinScreen();
  // } else if (smallBoardDraw(currentClass, boardId) && noOtherSmallBoardsAreAvailable()) {
  //     showDrawScreen();
  // } else {
  //     nextPlayer();
  // }
  winDrawOrNextPlayer(currentClass, boardId);
}

function winDrawOrNextPlayer(currentClass, boardId) {
  checkForASmallWin(currentClass, boardId);

  // check if the team won
  if (metWinCriteria(currentClass, boardId)) {
    //3 in a row
    showWinScreen(currentClass);
    //return true;
  }
  //no spaces left so count point totals
  else if (noOtherSmallBoardsAreAvailable()) {
    if (getTeamScore(X_CLASS) > getTeamScore(CIRCLE_CLASS)) {
      showWinScreen(X_CLASS);
    } else if (getTeamScore(X_CLASS) < getTeamScore(CIRCLE_CLASS)) {
      showWinScreen(CIRCLE_CLASS);
    } else {
      showDrawScreen();
    }
  } else if (
    smallBoardDraw(currentClass, boardId) &&
    noOtherSmallBoardsAreAvailable()
  ) {
    showDrawScreen();
    //return true;
  } else {
    nextPlayer();
    //return false;
  }
}

function smallBoardDraw(currentClass, boardId) {
  for (i = 0; i < boardArray.length; i++) {
    if (boardArray[i].id == boardId) {
      if (!someoneHasWonCurrentSmallBoard(i, currentClass)) {
        // every cell either needs to have an x, an o, a square, or a triangle to classify as a draw
        // destructure cellElements at a particular baord into an array with [...allCellElements[i]]
        return [...allCellElements[i]].every((cell) => {
          return (
            cell.classList.contains(X_CLASS) ||
            cell.classList.contains(CIRCLE_CLASS)
          );
        });
      }
      break;
    }
  }
}

function someoneHasWonCurrentSmallBoard(index, currentClass) {
  return [...allCellElements[index]].every((cell) => {
    return cell.classList.contains(currentClass);
  });
}

function noOtherSmallBoardsAreAvailable() {
  let countOfAvailableBoards = 0;
  let notWon = " ";
  for (let individualBoard of bigBoard) {
    if (individualBoard == notWon) {
      countOfAvailableBoards++;
    }
  }
  return countOfAvailableBoards == 0;
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function randomlyPlaceMarker() {
  let changedCell = false;
  let currentClass = players[currentPlayer].getShape();
  allCellElements.forEach((cellElem) => {
    if (!changedCell) {
      cellElem.forEach((cell) => {
        //debugger;
        if (cell.className == "cell" && !changedCell) {
          placeMark(cell, currentClass);

          winDrawOrNextPlayer(currentClass, cell.parentElement.id);
          // checkForASmallWin(currentClass, cell.parentElement.id); //cellElement id
          // // check if the team won
          // if (metWinCriteria(currentClass, cell.parentElement.id)) {
          //     //board id
          //     showWinScreen();
          // } else if (smallBoardDraw(currentClass, cell.parentElement.id) && noOtherSmallBoardsAreAvailable()) {
          //     showDrawScreen();
          // } else {
          //     nextPlayer();
          // }

          changedCell = true;
        }
      });
    }
  });
}
// -
// pass in a specific board as well for bigger board
function metWinCriteria(currentClass, boardID) {
  if (bigBoardWinCombination(currentClass)) {
    return true;
  }
  // else if ((noOtherSmallBoardsAreAvailable() && getTeamScore(X_CLASS) >= 3) || getTeamScore(CIRCLE_CLASS) >= 3) {
  //     return true;
  // }
  else {
    return false;
  }
}

//Check for a single small board win
//If there is a win, it is logged for future use for overall big board win
function checkForASmallWin(currentClass, boardId) {
  for (i = 0; i < boardArray.length; i++) {
    //debugger;
    console.log(boardId);
    if (boardArray[i].id == boardId) {
      console.log(boardId);
      smallBoardWinCombination(currentClass, allCellElements[i], i);
      break;
    }
  }
}

function smallBoardWinCombination(currentClass, cellElem, boardIndex) {
  // look at each the individual array and see if all three spots have the same mark
  let win = WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElem[index].classList.contains(currentClass);
    });
  });

  //If there is a win, it is logged for future use for overall big board win
  if (win) {
    bigBoard[boardIndex] = currentClass;
    removeListener(cellElem, currentClass);
    let playerScore = players[currentPlayer].getScore();
    players[currentPlayer].setScore(playerScore + 1);

    console.log(
      players[currentPlayer].getTeam() + ": " + getTeamScore(X_CLASS)
    );
  }
  //If there is not a win
  else {
    //checking if the small board is not avail
    if (!isSmallBoardAvailable(boardIndex)) {
      bigBoard[boardIndex] = "none";
    }
  }
}

function isSmallBoardAvailable(boardIndex) {
  let isAvailable = false;
  allCellElements[boardIndex].forEach((element) => {
    //if there is a spot that is empty
    if (element.classList.value == "cell") {
      isAvailable = true;
    }
  });
  return isAvailable;
}

function bigBoardWinCombination(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return bigBoard[index] == currentClass;
    });
  });
}

// you can only click a cell once, afterwords the handler will not fire
function removeListener(cellElem, currentClass) {
  cellElem.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.classList.add(currentClass);
  });
}

//2v2: score each player
// score teams

// function incrementClassWinnings(currentClass) {
//     if (currentClass == X_CLASS) {
//         getTeamScore(X_CLASS);
//     } else if (currentClass == CIRCLE_CLASS) {
//         getTeamScore(CIRCLE_CLASS);
//     }
// }

function showDrawScreen() {
  resultText.innerText = "Draw!";
  // shows the next screen
  resultPage.classList.add("show");

  if (countDown != null) {
    //Kill turn timer if there is one active
    clearTurnTimer(countDown);
  }
}

function showWinScreen(winner) {
  //debugger;

  if (countDown != null) {
    //Kill turn timer if there is one active
    clearTurnTimer(countDown);
  }

  // shows the next screen
  //resultText.innerText = players[currentPlayer].getTeam().toUpperCase() + "'s Team Wins";
  resultText.innerText = winner + "'s Team Wins";
  resultPage.classList.add("show");
}

// could have a switch statement here instead
// function swapTurns() {
//     if (circleTurn) {
//         circleTurn = false;
//         squareTurn = true;
//     } else if (squareTurn) {
//         squareTurn = false;
//         triangleTurn = true;
//     } else if (triangleTurn) {
//         triangleTurn = false;
//         xTurn = true;
//     } else if (xTurn) {
//         xTurn = false;
//         circleTurn = true;
//     }
// }

function restartTimer() {
  if (countDown != null) {
    clearTurnTimer(countDown);
  }
  //Clear previous turn timer
  countDown = startCountDown();
}
