//var genuuid = require("uuid/v4");
//var cookieParser = require("cookie-parser");
const User = require("./models/user");
const player = require("./player.js");
const { game, _4PlayerGame, _2v2Game } = require("./game.js");

//Code that initially will run to start game
var the_game = null;
var game_setting = "ERROR";
var numberOfPlayers = 0;

var express = require("express"); // go get express
var app = express(); // it's an express application
var serv = require("http").Server(app);
var port = process.env.PORT || 8080;
let whichFile;

// connect to mongoDB

const mongoose = require("mongoose");
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require("constants");
const dbURI =
  "mongodb+srv://kweera2:aUserWasHere123@cluster0.nmzec.mongodb.net/game?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    // server needs to listen to request
    serv.listen(port)
  ) //!!! THIS NEEDS TO BE COMMENTED OUT WHEN RUNNING TESTS WITH JEST !!!)
  .catch((err) => console.log(err));

app.use(express.static(__dirname));
app.set("view engine", "ejs");
// app.use(cookieParser());

// mongoose and mongo sandbox routes
// app.get("/add-user", (req, res) => {
//   const user = new User({
//     userName: "test2",
//   });
//   user
//     .save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.get("/all-users", (req, res) => {
//   User.find()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.get("/single-user", (req, res) => {
//   User.findById("60c0f33f38b28080456b1233")
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.get("/", function (req, res) {
  res.append("customPage", "startScreen");
  res.sendFile(__dirname + "/startScreen.html");
});

app.get("/users", function (req, res) {
  console.log("in user express");
  User.find()
    .sort({ userName: -1 })
    .then((result) => {
      console.log(result);
      res.render("users", { users: result });
    })
    .catch((err) => {
      console.log(err);
    });
  // res.append("customPage", "users");
  // res.sendFile(__dirname + "users.html");
});

app.get("/gameModeServer", function (req, res) {
  res.append("customPage", "gameModeServer");
  res.sendFile(__dirname + "/gameModeServer.html");
});

app.get("/singleOrTeamServer", function (req, res) {
  res.append("customPage", "singleOrTeamServer");
  res.sendFile(__dirname + "/singleOrTeamServer.html");
});

app.get("/boardSelectionServer_4Player", function (req, res) {
  game_setting = "4Player";
  res.append("customPage", "boardSelectionServer4player");
  res.sendFile(__dirname + "/boardSelectionServer.html");
});
app.get("/boardSelectionServer_2v2", function (req, res) {
  game_setting = "2v2";
  res.append("customPage", "boardSelectionServer2v2");
  res.sendFile(__dirname + "/boardSelectionServer.html");
});

app.get("/waitingScreen", function (req, res) {
  whichFile = "waitingScreen";
  res.append("customPage", "waitingScreen");
  res.sendFile(__dirname + "/waitingScreen.html");
});

app.get("/clientBoard", function (req, res) {
  //whichFile = "clientBoard";
  //check for header
  //console.log(req.headers);
  // console.log(req.cookies);
  // // if (req.header("playerid") == null) {
  // if (req.cookies != null) {
  //   console.log("it is occupied");
  // } else {
  //   // console.log("new player");
  //   // res.append("playerid", genuuid());
  //   // res.cookie("playerid", genuuid()).send("cookie set"); //Sets name = express
  //   res
  //     .cookie("playerid", genuuid(), { expire: 360000 + Date.now() })
  //     .send("cookie set");
  // }

  res.append("custompage", "clientBoard");
  // res.header("cache-control", "public, max-age=60000");
  //console.log(res.headers);
  res.sendFile(__dirname + "/clientBoard.html");
});

var io = require("socket.io")(serv, {});
let numberWaitingToPlay = 0;
let PLAYERS_REQUIRED_FOR_GAME = 4;
let playerQueue = [];
let whichGame = 0;
let games = [];

//? socket.emit() - single client
//? socket.broadcast.emit() - everyone but the client connecting
//? io.emit() - everyone
//? need to have socket.on('disconnect') inside of io.socket.on("connection") - just convention

io.sockets.on("connection", function (socket) {
  if (whichFile == "waitingScreen") {
    console.log("the player queue length: " + playerQueue.length);
    console.log("client got to waiting screen");
    socket.uniqueID = numberWaitingToPlay;
    playerQueue.push(socket);
    numberWaitingToPlay++;

    //remove dead sockets (clients disconnected) from playersQueue
    let numberLeftBeforeGame = PLAYERS_REQUIRED_FOR_GAME - numberWaitingToPlay;
    if (numberLeftBeforeGame == 0) {
      //we know that there is four players connected
      // emit to all players
      whichFile = "clientBoard";
      playerQueue.forEach((socket) => {
        socket.emit("startGame"); // send each player a message to start the game
      });
    }
    //console.log("number left to play game: " + numberLeftBeforeGame);
    io.emit("waiting", numberLeftBeforeGame);
  } else {
    console.log("server: socket connected"); //Log that someone connected
    console.log("number waiting to play: " + numberWaitingToPlay);
    //Create the desired instance of a game
    if (numberWaitingToPlay == 4) {
      switch (game_setting) {
        case "4Player":
          games.push(new _4PlayerGame(whichGame));
          //the_game = new _4PlayerGame();
          break;
        case "2v2":
          games.push(new _2v2Game(whichGame));
          //the_game = new _2v2Game();
          break;
        default:
          throw Error("This should never happen!");
      }
    }
    numberWaitingToPlay--;

    games[whichGame].players[numberOfPlayers % 4] = new player(
      "Player " + (numberOfPlayers + 1),
      socket,
      numberOfPlayers + 1
    ); //Create player

    //server keeps track of players by adding to an array of players
    // the_game.players[numberOfPlayers] = new player(
    //   "Player " + (numberOfPlayers + 1),
    //   socket,
    //   numberOfPlayers + 1
    // ); //Create player
    console.log("This is whichGame: " + whichGame);
    console.log(games[whichGame].players[numberOfPlayers % 4].getUserName()); //Output player who connected
    // console.log(the_game.players[numberOfPlayers].getUserName()); //Output player who connected
    numberOfPlayers++; //Increment count of players

    //If we have reached 4 players start game
    if (numberOfPlayers % 4 == 0) {
      //the_game.startGame();
      games[whichGame].startGame();
      whichGame++;
      playerQueue.length = 0; // sets the queue to be empty
    }

    //Place given marker on small board at position specified
    socket.on("placeMark", function (data) {
      console.log(data);
      //console.log(games);
      let gameID = findGameID(data);

      // console.log(
      //   " Which Game: " +
      //     gameID +
      //     "Shape: " +
      //     data.shape +
      //     " Board Num: " +
      //     data.boardNumber +
      //     " Position: " +
      //     data.position
      // );
      games[gameID].addMarkToBoard(data.shape, data.boardNumber, data.position);
    });

    // socket.on("startGame", function () {});

    socket.on("restart", function (data) {
      console.log("Restart message received!");
      games[findGameID(data)].restartGame();
    });
  }

  socket.on("disconnect", (socket) => {
    //! this does not remove the player from playerQueue,
    //! when the game is started the dead socket is not used (we think)
    //! might have to remove the dead sockets - param socket was of no use
    if (whichFile == "waitingScreen") {
      numberWaitingToPlay--;
      let numberLeftBeforeGame =
        PLAYERS_REQUIRED_FOR_GAME - numberWaitingToPlay;
      console.log(numberLeftBeforeGame);
      console.log("Player has been disconnected!");
      io.emit("playerLeft", numberLeftBeforeGame);
    }
  });
});

let findGameID = (data) => {
  let gameID = 0;
  let foundPlayer = false;
  for (let game of games) {
    for (let player of game.players) {
      if (data.name === player.getUserName()) {
        foundPlayer = true;
        break;
      }
    }
    if (foundPlayer) break;
    gameID++;
  }
  return gameID;
};

//Exports for testing purposes
module.exports.app = app;
