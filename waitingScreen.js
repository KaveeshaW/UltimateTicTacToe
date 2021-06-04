let waitingText = document.querySelector("#waitingText");
let startGameButton = document.querySelector("#start-game");
let socket = io();

socket.on("waiting", function (data) {
  //update the screen to display number of clients need to start a game
  console.log("in client side");
  console.log(data);
  let numberPlayersNeededToPlay = data;
  waitingText.innerHTML =
    "The number of players left to start the game is: " +
    numberPlayersNeededToPlay;

  //start game - required number of players is met
  if (numberPlayersNeededToPlay == 0) {
    startGameButton.disabled = false;
  }
});

startGameButton.addEventListener("click", () => {
  location.href = "./clientBoard.html";
});

// socket.on("playerLeft", function(data) {
//   //update the screen to display number of clients need to start a game
//   console.log("in client side");
//   console.log(data);
//   let numberPlayersNeededToPlay = data;
//   waitingText.innerHTML =
//     "The number of players left to start the game is: " +
//     numberPlayersNeededToPlay;
// });

// //client has recieved message to redirct to the board
// socket.on("startGame", () => {
//   window.location = "http://localhost:8080/clientBoard.html";
// });
