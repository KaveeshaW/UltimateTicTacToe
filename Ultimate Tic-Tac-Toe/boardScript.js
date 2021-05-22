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
    this.isAI = false;
    this.aiDifficulty = "Rookie";
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
  getIsAI() {
    return this.isAI;
  }

  setIsAI(AI) {
    this.isAI = AI;
  }

  getAIDifficulty() {
    return this.aiDifficulty;
  }

  setAIDifficulty(aiDiff) {
    this.aiDifficulty = aiDiff;
  }
}

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const SQUARE_CLASS = "square";
const TRIANGLE_CLASS = "triangle";
const FIRST_PLAYER = 0;
const LAST_PLAYER = 3;
let currentPlayer = 0;
let countDown = null;
let overallGameTimer = 0;
let firstClick = false;
let lastBoardClicked;
let lastClassLookedAt;

const DUMMY_X_CLASS = "dummy-x";
const DUMMY_CIRCLE_CLASS = "dummy-circle";
const DUMMY_SQUARE_CLASS = "dummy-square";
const DUMMY_TRIANGLE_CLASS = "dummytriangle";

//we need to create four players with set information about what team they are in and what color
let p1 = new player("Player 1");
let p2 = new player("Player 2");
let p3 = new player("Player 3");
let p4 = new player("Player 4");

//we need to arrange them in a array to have them take turns
let players = [p1, p2, p3, p4];

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
const gameTimer = document.getElementById("gameTimerResultPage");

//! overall game timer scripts

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

// ! this might be wrong but I just took out the else and changed it to just return draw
// ! assumes that there is at least one input
function winOrDraw(currentClass, boardId) {
  checkForASmallWin(currentClass, boardId);

  // check if the team won
  //mercy rule condition
  if (overallBigBoardWin(currentClass)) {
    //3 in a row
    showWinScreen(currentClass);
  }
  //no spaces left so count point totals
  else if (noOtherSmallBoardsAreAvailable()) {
    //check every win condition for each player, if there is a draw, call draw
    const xScore = getTeamScore(X_CLASS);
    const circleScore = getTeamScore(CIRCLE_CLASS);
    const squareScore = getTeamScore(SQUARE_CLASS);
    const triangleScore = getTeamScore(TRIANGLE_CLASS);

    //player x won
    if (
      xScore > circleScore &&
      xScore > squareScore &&
      xScore > triangleScore
    ) {
      showWinScreen(X_CLASS);
    }
    //player circle won
    else if (
      circleScore > xScore &&
      circleScore > squareScore &&
      circleScore > triangleScore
    ) {
      showWinScreen(CIRCLE_CLASS);
    }
    //player square won
    else if (
      squareScore > xScore &&
      squareScore > circleScore &&
      squareScore > triangleScore
    ) {
      showWinScreen(SQUARE_CLASS);
    }
    //player triangle won
    else if (
      triangleScore > xScore &&
      triangleScore > squareScore &&
      triangleScore > circleScore
    ) {
      showWinScreen(TRIANGLE_CLASS);
    } else {
      showDrawScreen();
    }
  } else if (
    smallBoardDraw(currentClass, boardId) &&
    noOtherSmallBoardsAreAvailable()
  ) {
    showDrawScreen();
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

//! END overall game timer scripts

// ! THIS IS THE START OF THE GAME ---------------------------------------------------------------------
let disabledBoardsList = getDisabledBoardsInput();
startGame();

// ! ---------------------------------------------------------------------------------------------------
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
      cell.classList.remove(SQUARE_CLASS);
      cell.classList.remove(TRIANGLE_CLASS);

      cell.classList.add("disable"); //Disable spot on board
      cell.removeEventListener("click", handleClick); //Remove listener on cell
    });
  });
}

function startGame() {
  // ! may have the values of "" or false if not specified on the previous page
  console.log(localStorage.getItem("shapeColor"));
  console.log(localStorage.getItem("turnTimerChoice"));
  console.log(localStorage.getItem("overallGameTimer"));
  console.log(localStorage.getItem("numAI"));
  console.log(localStorage.getItem("inputArr"));
  console.log(localStorage.getItem("aiDifficulty"));
  console.log(localStorage.getItem("customizedBoard"));
  var color = localStorage.getItem("shapeColor");
  restartButton.addEventListener("click", startGame);
  menuButton.addEventListener("click", goToStartScreen);
  forfeit.addEventListener("click", goToStartScreen);
  putBackgroundImage();
  setShapeColor(color);
  setPlayerTurnAndClass();
  setNumberofAIandDifficulty();
  cellElementsInitialization();
  setBoardHoverClass();
  aiCheck(0);
  resetGame();

  resultPage.classList.remove("show");
}

function putBackgroundImage() {
  let result = localStorage.getItem("backgroundImage");
  $("#bigBoard").css("background-image", 'url("' + result + '")');
  // only want to see the pic once
  // $("#bigBoard").css("background-attachment", "fixed");
  // $("#bigBoard").css("background-size", "cover");
}

function aiCheck(player) {
  if (players[player].getIsAI()) {
    removeBoardHoverClass();
    removeAllEmptyCellListener();
    if (players[player].getAIDifficulty == "Rookie") {
      setTimeout(() => {
        randomlyPlaceMarker();
      }, 2 * 1000);
    } else {
      setTimeout(() => {
        optimalPlaceMarker();
      }, 2 * 1000);
    }
  } else {
    addAllEmptyCellListener();
    setBoardHoverClass();
  }
}

function goToStartScreen() {
  localStorage.clear();
  window.location.href = "startScreen.html";
}

function setPlayerTurnAndClass() {
  //set information for each player 1
  p1.setIsTurn(true);
  p1.setShape(X_CLASS);
  p1.setTeam(X_CLASS);

  p2.setIsTurn(false);
  p2.setShape(CIRCLE_CLASS);
  p2.setTeam(CIRCLE_CLASS);

  p3.setIsTurn(false);
  p3.setShape(SQUARE_CLASS);
  p3.setTeam(SQUARE_CLASS);

  p4.setIsTurn(false);
  p4.setShape(TRIANGLE_CLASS);
  p4.setTeam(TRIANGLE_CLASS);
}

function setNumberofAIandDifficulty() {
  let numAI = localStorage.getItem("numAI");
  let aiDiff = localStorage.getItem("aiDifficulty");

  if (numAI > 0) {
    p4.setIsAI(true);
    p4.setAIDifficulty(aiDiff);
    if (numAI > 1) {
      p2.setIsAI(true);
      p2.setAIDifficulty(aiDiff);
      if (numAI > 2) {
        p3.setIsAI(true);
        p3.setAIDifficulty(aiDiff);
        if (numAI > 3) {
          p1.setIsAI(true);
          p1.setAIDifficulty(aiDiff);
        }
      }
    }
  }
}

function setShapeColor(shapeColor) {
  let color = shapeColor;
  var rootColor = document.querySelector(":root");
  rootColor.style.setProperty("--background-color", color);
}

//use string "X_CLASS", "CIRCLE_CLASS", SQUARE_CLASS, TRIANGLE_CLASS
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
  //localStorage.clear(); may want to do this
  for (player of players) {
    player.setScore(0);
  }
  currentPlayer = 0;
  overallGameTimer = 0;
  countDown = null;
  firstClick = false;
  setPlayerTurnAndClass();
  bigBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  disableBoards(disabledBoardsList);
  document.querySelector("#turn_timer").innerHTML =
    localStorage.getItem("turnTimerChoice");
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
  document.getElementById("current_player_turn").innerHTML =
    players[currentPlayer].getUserName();
  document.getElementById("player_name").innerHTML =
    players[currentPlayer].getUserName();
  document.getElementById("player_symbol").innerHTML =
    players[currentPlayer].getShape();
  document.getElementById("player_score").innerHTML =
    players[currentPlayer].getScore();
  //document.getElementById("player_teammate").innerHTML = getTeammate();
  restartTimer(); //Restart timer for next player
  aiCheck(currentPlayer);
}

function cellElementsInitialization() {
  allCellElements.forEach((cellArray) => {
    cellArray.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.classList.remove(SQUARE_CLASS);
      cell.classList.remove(TRIANGLE_CLASS);
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
    board.classList.remove(SQUARE_CLASS);
    board.classList.remove(TRIANGLE_CLASS);
    board.classList.add(players[currentPlayer].getShape());
  });
}

function removeBoardHoverClass() {
  boardArray.forEach((board) => {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    board.classList.remove(SQUARE_CLASS);
    board.classList.remove(TRIANGLE_CLASS);
    //board.classList.add(players[currentPlayer].getShape());
  });
}

function removeAllEmptyCellListener() {
  allCellElements.forEach((cellArray) => {
    cellArray.forEach((cell) => {
      if (cell.className == "cell" && !cell.classList.contains("disable")) {
        cell.removeEventListener("click", handleClick);
      }
    });
  });
}

function addAllEmptyCellListener() {
  allCellElements.forEach((cellArray) => {
    cellArray.forEach((cell) => {
      if (cell.className == "cell" && !cell.classList.contains("disable")) {
        cell.addEventListener("click", handleClick, { once: true });
      }
    });
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
  if (!players[currentPlayer].getIsAI()) {
    const cell = e.target;
    const boardId = e.target.parentElement.id;
    let currentClass = players[currentPlayer].getShape();
    placeMark(cell, currentClass);
    if (firstClick == false) {
      startOverallTimer();
      firstClick = true;
    }
    lastBoardClicked = boardId;
    lastClassLookedAt = currentClass;
    winDrawOrNextPlayer(currentClass, boardId);
  }
}

function winDrawOrNextPlayer(currentClass, boardId) {
  checkForASmallWin(currentClass, boardId);

  // check if the team won
  //mercy rule condition
  if (overallBigBoardWin(currentClass)) {
    //3 in a row
    showWinScreen(currentClass);
  }
  //no spaces left so count point totals
  else if (noOtherSmallBoardsAreAvailable()) {
    //check every win condition for each player, if there is a draw, call draw
    const xScore = getTeamScore(X_CLASS);
    const circleScore = getTeamScore(CIRCLE_CLASS);
    const squareScore = getTeamScore(SQUARE_CLASS);
    const triangleScore = getTeamScore(TRIANGLE_CLASS);

    //player x won
    if (
      xScore > circleScore &&
      xScore > squareScore &&
      xScore > triangleScore
    ) {
      showWinScreen(X_CLASS);
    }
    //player circle won
    else if (
      circleScore > xScore &&
      circleScore > squareScore &&
      circleScore > triangleScore
    ) {
      showWinScreen(CIRCLE_CLASS);
    }
    //player square won
    else if (
      squareScore > xScore &&
      squareScore > circleScore &&
      squareScore > triangleScore
    ) {
      showWinScreen(SQUARE_CLASS);
    }
    //player triangle won
    else if (
      triangleScore > xScore &&
      triangleScore > squareScore &&
      triangleScore > circleScore
    ) {
      showWinScreen(TRIANGLE_CLASS);
    } else {
      showDrawScreen();
    }
  } else if (
    smallBoardDraw(currentClass, boardId) &&
    noOtherSmallBoardsAreAvailable()
  ) {
    showDrawScreen();
  } else {
    nextPlayer();
  }
}

function smallBoardDraw(currentClass, boardId) {
  for (
    smallBoardIndex = 0;
    smallBoardIndex < boardArray.length;
    smallBoardIndex++
  ) {
    if (boardArray[smallBoardIndex].id == boardId) {
      if (!someoneHasWonCurrentSmallBoard(smallBoardIndex, currentClass)) {
        // every cell either needs to have an x, an o, a square, or a triangle to classify as a draw
        // destructure cellElements at a particular baord into an array with [...allCellElements[i]]
        return [...allCellElements[smallBoardIndex]].every((cell) => {
          return (
            cell.classList.contains(X_CLASS) ||
            cell.classList.contains(CIRCLE_CLASS) ||
            cell.classList.contains(SQUARE_CLASS) ||
            cell.classList.contains(TRIANGLE_CLASS)
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

function removeMark(cell, currentClass) {
  cell.classList.remove(currentClass);
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNextPlayerClass() {
  switch (currentPlayer) {
    case 0:
      return CIRCLE_CLASS;
      break;
    case 1:
      return SQUARE_CLASS;
      break;
    case 2:
      return TRIANGLE_CLASS;
      break;
    case 3:
      return X_CLASS;
      break;
  }
}

function getDummyNextPlayerClass() {
  switch (currentPlayer) {
    case 0:
      return DUMMY_CIRCLE_CLASS;
      break;
    case 1:
      return DUMMY_SQUARE_CLASS;
      break;
    case 2:
      return DUMMY_TRIANGLE_CLASS;
      break;
    case 3:
      return DUMMY_X_CLASS;
      break;
  }
}

function getDummyCurrentPlayerClass() {
  switch (currentPlayer) {
    case 0:
      return DUMMY_X_CLASS;
      break;
    case 1:
      return DUMMY_CIRCLE_CLASS;
      break;
    case 2:
      return DUMMY_SQUARE_CLASS;
      break;
    case 3:
      return DUMMY_TRIANGLE_CLASS;
      break;
  }
}

function predictPlayerMoveSmallWin(dummyNextClass, nextClass, cellElem) {
  let smallWin = WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      if (
        cellElem[index].classList.contains(nextClass) ||
        cellElem[index].classList.contains(dummyNextClass)
      ) {
        return true;
      } else {
        return false;
      }
    });
  });
  return smallWin;
}

var optimalSmallBoard = -1;
var optimalCell = -1;

function dummyCheck(dummy, current) {
  for (var i = 0; i < 9; i++) {
    if (bigBoard[i] != "disable") {
      var cellElem = allCellElements[i];
      for (var j = 0; j < 9; j++) {
        if (cellElem[j].className == "cell") {
          var dCell = cellElem[j];
          placeMark(dCell, dummy);
          if (predictPlayerMoveSmallWin(dummy, current, cellElem)) {
            optimalCell = j;
            optimalSmallBoard = i;
            removeMark(dCell, dummy);
            break;
          }
          removeMark(dCell, dummy);
        }
      }
    }
  }
}

function optimalPlaceMarker() {
  var nextClass = getNextPlayerClass();
  var dummyNext = getDummyNextPlayerClass();
  var currentClass = players[currentPlayer].getShape();
  var dummyCurrent = getDummyCurrentPlayerClass();

  optimalSmallBoard = -1;
  optimalCell = -1;

  dummyCheck(dummyCurrent, currentClass);
  if (optimalCell != -1 && optimalSmallBoard != -1) {
    optimalCellElement = allCellElements[optimalSmallBoard];
    optimalCellPlace = optimalCellElement[optimalCell];
    placeMark(optimalCellPlace, players[currentPlayer].getShape());
    winDrawOrNextPlayer(
      players[currentPlayer].getShape(),
      optimalCellPlace.parentElement.id
    );
  } else {
    dummyCheck(dummyNext, nextClass);
    if (optimalCell != -1 && optimalSmallBoard != -1) {
      optimalCellElement = allCellElements[optimalSmallBoard];
      optimalCellPlace = optimalCellElement[optimalCell];
      placeMark(optimalCellPlace, players[currentPlayer].getShape());
      winDrawOrNextPlayer(
        players[currentPlayer].getShape(),
        optimalCellPlace.parentElement.id
      );
    } else {
      randomlyPlaceMarker();
    }
  }
}

function randomlyPlaceMarker() {
  let changedCell = false;
  let currentClass = players[currentPlayer].getShape();

  while (true) {
    var randomNumber = randomIntFromInterval(0, 8);
    var randomCellElem = allCellElements[randomNumber];
    randomNumber = randomIntFromInterval(0, 8);
    randomCell = randomCellElem[randomNumber];
    //console.log(randomNumber);

    if (!changedCell) {
      //randomCellElem.forEach((cell) => {
      //debugger;
      if (
        randomCell.className == "cell" &&
        !changedCell &&
        !randomCell.classList.contains("disable")
      ) {
        placeMark(randomCell, currentClass);
        winDrawOrNextPlayer(currentClass, randomCell.parentElement.id);
        changedCell = true;
        //break;
      }
      //});
    } else {
      break;
    }
  }
}

function overallBigBoardWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return bigBoard[index] == currentClass;
    });
  });
}

//Check for a single small board win
//If there is a win, it is logged for future use for overall big board win
function checkForASmallWin(currentClass, boardId) {
  for (
    smallBoardIndex = 0;
    smallBoardIndex < boardArray.length;
    smallBoardIndex++
  ) {
    //debugger;
    if (boardArray[smallBoardIndex].id == boardId) {
      smallBoardWinCombination(
        currentClass,
        allCellElements[smallBoardIndex],
        smallBoardIndex
      );
      break;
    }
  }
}

function smallBoardWinCombination(currentClass, cellElem, boardIndex) {
  // look at each the individual array and see if all three spots have the same mark
  let smallWin = WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElem[index].classList.contains(currentClass);
    });
  });

  //If there is a win, it is logged for future use for overall big board win
  if (smallWin) {
    bigBoard[boardIndex] = currentClass;
    removeListener(cellElem, currentClass);
    let playerScore = players[currentPlayer].getScore();
    players[currentPlayer].setScore(playerScore + 1);
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

// you can only click a cell once, afterwords the handler will not fire
function removeListener(cellElem, currentClass) {
  cellElem.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.classList.remove(SQUARE_CLASS);
    cell.classList.remove(TRIANGLE_CLASS);
    cell.classList.add(currentClass);
  });
}

function showDrawScreen() {
  resultText.innerText = "Draw!";
  let seconds = convertSecFormat(overallGameTimer);
  // shows the next screen
  gameTimer.innerText = "Total Game Time: " + seconds;
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
  let seconds = convertSecFormat(overallGameTimer);
  resultText.innerText = winner + "'s Team Wins";
  gameTimer.innerText = "Total Game Time: " + seconds;
  resultPage.classList.add("show");
  overallGameTimer = overallGameTimer;
}

function restartTimer() {
  if (countDown != null) {
    clearTurnTimer(countDown);
  }
  //Clear previous turn timer
  countDown = startCountDown();
}

//Calling this function starts the turn timer
function startCountDown() {
  var timer = localStorage.getItem("turnTimerChoice") || 10;
  var x = setInterval(function () {
    if (timer < 0) {
      //If timer has reached zero
      clearInterval(x);
      document.getElementById("turn_timer").innerHTML = "EXPIRED";
      randomlyPlaceMarker(); //Force placement of marker before moving onto next player
    } else {
      //Continue counting down and updating UI with current timer
      document.getElementById("turn_timer").innerHTML = timer.toString();
      timer--;
    }
  }, 1000);

  return x;
}

function clearTurnTimer(turnTimer) {
  clearInterval(turnTimer);
}
