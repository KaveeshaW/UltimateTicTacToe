//Calling this function starts the turn timer
function startCountDown() {
  var timer = localStorage.getItem("turnTimerChoice") || 10;
  var x = setInterval(function () {
    if (timer < 0) {
      //If timer has reached zero

      clearInterval(x);
      document.getElementById("turn_timer").innerHTML = "EXPIRED";

      // document.getElementById("game_code").innerHTML = "This";
      // document.getElementById("current_player_turn").innerHTML = "Is";
      // document.getElementById("player_name").innerHTML = "An";
      // document.getElementById("player_symbol").innerHTML = "Example";

      randomlyPlaceMarker(); //Force placement of marker before moving onto next player
      //winDrawOrNextPlayer();
      //checkForASmallWin(currentClass, boardId);

      // check if the team won
      // if (metWinCriteria(currentClass, boardId)) {
      //     showWinScreen();
      //     //return true;
      // } else if (isDraw(currentClass, boardId) && noOtherSmallBoardsAreAvailable()) {
      //     showDrawScreen();
      //     //return true;
      // } else {
      //     nextPlayer();
      //     //return false;
      // }
      //nextPlayer(); //atm this will just skip turn if no move is made
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
