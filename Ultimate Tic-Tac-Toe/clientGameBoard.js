/* 
    TODO Notes:
    ! BUG: a player clicking on the board before all players have joined causes a crash on server end!
        ? This is because the server expects all sockets to be connected before anyone makes a move.
        ? Pehaps this can be fixed by adding a flag to the client handleClick method 
        ?   to prevent moves until server informs of game starting.

*/

const restartButton = document.getElementById("restartButton");
const resultPage = document.getElementById("resultPage");
const resultText = document.querySelector("[data-result-page-text]");
const menuButton = document.getElementById("menu");
const forfeit = document.getElementById("forfeit");
const gameTimer = document.getElementById("gameTimerResultPage");

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

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const SQUARE_CLASS = "square";
const TRIANGLE_CLASS = "triangle";

//Used to get index of small board from html board id
let boardIdToIndex = [
    "board",
    "board2",
    "board3",
    "board4",
    "board5",
    "board6",
    "board7",
    "board8",
    "board9",
];

//Storing the client's info in global vars
let clientShape;
let clientName;
let clientTeammate;
let myTurn;
var socket = io(); //? does let vs var make a difference here?
// ! socket.on is RECEIVING information
// ! socket.emit is SENDING information
let countDown = null;
let overallGameTimer = 0;
initializeCellElements();
initializeEndScreenButtons();

//Place given marker on small board at position specified
socket.on("placeMark", function (data) {
    placeMark(data.shape, data.boardNumber, data.position);
});

//Get the shape and name of client from server
socket.on("shapeAndName", function (data) {
    clientShape = data.shape;
    clientName = data.name;
    clientTeammate = data.teammate;
    myTurn = data.turn;
    if (myTurn) {
        countDown = startCountDown();
        setBoardHoverClass();
    }
    //Set hover for boards
    initializeGameInfo(); //Set game status info

    console.log("Client Shape: " + clientShape);
    console.log("Client Name: " + clientName);
});

socket.on("updateScore", function (newScore) {
    updatePlayerScore(newScore);
});

socket.on("turnInform", function (turn) {
    myTurn = turn;
    if (myTurn) {
        countDown = startCountDown();
        setBoardHoverClass();
    } else {
        document.getElementById("turn_timer").innerHTML = "EXPIRED";
        clearTurnTimer(countDown);
        removeBoardHoverClass();
    }
});

socket.on("updateWhoseTurn", function (nextPlayer) {
    updateTurnDisplay(nextPlayer);
});

socket.on("someoneWon", function (gameStatus) {
    showWinScreen(gameStatus);
});

socket.on("draw", function (gameStatus) {
    showDrawScreen(gameStatus);
});

socket.on("restart", function (turn) {
    myTurn = turn;
    if (myTurn) {
        countDown = startCountDown();
        setBoardHoverClass();
    } else {
        document.getElementById("turn_timer").innerHTML = "EXPIRED";
        clearTurnTimer(countDown);
        removeBoardHoverClass();
    }
    restartGame();
});

socket.on("inGameTimer", () => {
    overallGameTimer = 0;
    let x = setInterval(function () {
        overallGameTimer++;
        updateGameTimer(overallGameTimer);
    }, 1000);
});

function restartGame() {
    initializeCellElements(); //Resets the game board
    initializeGameInfo(); //Reset game status info displaying
    resultPage.classList.remove("show"); //Hide the end screen
}

function restartGameButton() {
    socket.emit("restart");
}

function notImplementedAlert() {
    window.alert("Will be implemented later");
}

function initializeEndScreenButtons() {
    restartButton.addEventListener("click", restartGameButton);
    menuButton.addEventListener("click", notImplementedAlert);
    forfeit.addEventListener("click", notImplementedAlert);
}

function initializeCellElements() {
    allCellElements.forEach((cellArray) => {
        let index = 0;
        cellArray.forEach((cell) => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(CIRCLE_CLASS);
            cell.classList.remove(SQUARE_CLASS);
            cell.classList.remove(TRIANGLE_CLASS);
            // extra precaution for when the game is restarted
            cell.removeEventListener("click", handleClick);

            // you can only click a cell once, afterwords the handler will not fire
            cell.addEventListener("click", handleClick, { once: true });

            cell.id = index; //Assign each cell an index as their id
            index++;
        });
    });
}

function initializeGameInfo() {
    document.getElementById("game_code").innerHTML = "404"; //Unused atm
    document.getElementById("player_name").innerHTML = clientName;
    document.getElementById("player_symbol").innerHTML = clientShape;
    document.getElementById("player_score").innerHTML = 0;
    document.getElementById("player_teammate").innerHTML = clientTeammate; //Atm only thinking about 4Player mode
    document.getElementById("current_player_turn").innerHTML = "Player 1"; //Player 1 goes first always
    overallGameTimer = 0;
    document.getElementById("game_timer").innerHTML = overallGameTimer;
}

function setBoardHoverClass() {
    boardIdToIndex.forEach((boardId) => {
        // board.classList.remove(X_CLASS);
        // board.classList.remove(CIRCLE_CLASS);
        // board.classList.remove(SQUARE_CLASS);
        // board.classList.remove(TRIANGLE_CLASS);

        let smallBoard = document.getElementById(boardId);
        smallBoard.classList.add(clientShape);
    });
}
function removeBoardHoverClass() {
    boardIdToIndex.forEach((boardId) => {
        // board.classList.remove(X_CLASS);
        // board.classList.remove(CIRCLE_CLASS);
        // board.classList.remove(SQUARE_CLASS);
        // board.classList.remove(TRIANGLE_CLASS);

        let smallBoard = document.getElementById(boardId);
        smallBoard.classList.remove(clientShape);
    });
}

function handleClick(e) {
    if (myTurn) {
        const cell = e.target;
        const boardId = e.target.parentElement.id; //This is string like 'board1'
        //! note ^ will have to have a mapping from a String 'board1' to a Number 0 to avoid issues on server end
        //! also will need to send server the position in that small board
        // 0 1 2
        // 3 4 5
        // 6 7 8
        //placeMark(cell, clientShape); //This will be called when an event is caught from server, telling client to place a shape

        let smallBoardIndex = boardIdToIndex.indexOf(boardId); //Index of small board
        let cellIndex = cell.id; //Index of cell within the small board

        console.log(
            "Clicked on boardNum: " + smallBoardIndex + " cell: " + cellIndex
        );

        //Emit player's selection to the server
        socket.emit("placeMark", {
            shape: clientShape,
            boardNumber: smallBoardIndex,
            position: cellIndex,
        });

        //Remove listener from selected cell
        cell.removeEventListener("click", handleClick);
    }

    //TODO add turn timer
}

function placeMark(shape, boardIndex, position) {
    allCellElements[boardIndex].forEach((cell) => {
        if (cell.id == position) {
            //Remove any previous marks
            cell.classList.remove(X_CLASS);
            cell.classList.remove(CIRCLE_CLASS);
            cell.classList.remove(SQUARE_CLASS);
            cell.classList.remove(TRIANGLE_CLASS);

            cell.classList.add(shape); //Place the shape on board
            cell.removeEventListener("click", handleClick); //Remove listener on cell
        }
    });
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

function updateGameTimer(overallGameTimer) {
    let seconds = convertSecFormat(overallGameTimer);
    document.getElementById("game_timer").innerHTML = seconds;
}

//Updates client/player's displayed score
function updatePlayerScore(score) {
    document.getElementById("player_score").innerHTML = score;
}
//Updates display to reflect whose turn it is, used for turn changes
function updateTurnDisplay(next_player) {
    document.getElementById("current_player_turn").innerHTML = next_player;
}

//? what data does the client need
/*  - score
    - player name
    - teammate?
    - team score
    - timer
    - shape
    - game code just 404 atm
    - current player turn
*/

function showDrawScreen(gameStatus) {
    let seconds = convertSecFormat(overallGameTimer);
    resultText.innerText = "Draw!";
    gameTimer.innerText = "Total Game Time: " + seconds;
    resultPage.classList.add("show");
    //! this might not be necessary
    //Kill turn timer if there is one active
    // if (countDown != null) {
    //     clearTurnTimer(countDown);
    // }
}

function showWinScreen(gameStatus) {
    let seconds = convertSecFormat(overallGameTimer);
    resultText.innerText = gameStatus.winner + "'s Team Wins";
    gameTimer.innerText = "Total Game Time: " + seconds;
    resultPage.classList.add("show");

    //! this might not be necessary
    //Kill turn timer if there is one active
    // if (countDown != null) {
    //     clearTurnTimer(countDown);
    // }
}

function startCountDown() {
    var timer = 10;
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

function randomlyPlaceMarker() {
    let changedCell = false;
    let cellIndex;
    let boardId;
    //let currentClass = players[currentPlayer].getShape();
    allCellElements.forEach((cellElem) => {
        if (!changedCell) {
            cellElem.forEach((cell) => {
                //debugger;
                if (cell.className == "cell" && !changedCell) {
                    cellIndex = cell.id;
                    boardId = cell.parentElement.id;
                    let smallBoardIndex = boardIdToIndex.indexOf(boardId);

                    console.log(
                        "Randomly placed on boardNum: " +
                            smallBoardIndex +
                            " cell: " +
                            cellIndex
                    );
                    socket.emit("placeMark", {
                        shape: clientShape,
                        boardNumber: smallBoardIndex,
                        position: cellIndex,
                    });
                    //placeMark(cell, clientShape);

                    //winDrawOrNextPlayer(currentClass, cell.parentElement.id);
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

function clearTurnTimer(turnTimer) {
    clearInterval(turnTimer);
}
