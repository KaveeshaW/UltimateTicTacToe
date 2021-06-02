//!use npm run dev to run nodemon
var express = require("express"); // go get express
var router = express.Router();
var app = express(); // it's an express application
var serv = require("http").Server(app);
var genuuid = require("uuid");
var cookieParser = require("cookie-parser");
const logger = require("./middleware/logger");
//var genuuid=require('uuid/v4');

//var cookieSession = require("cookie-session"); //this is for the client side cookie
// var cookieParser = require('cookie-parser'); might not need this as express session might have some conflicts
var expressSession = require("express-session"); //this is the server side session id | this can read and write cookies
var currentPlayerIndex = 0;
var existingPlayer = false;
let nextFile;

// set port
// process.env means it will find a port that is unused if 8080 is being used
var port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
// allows us to serve static files (images, CSS, etc)
app.use(express.static(__dirname));
//app.use(cookieParser());
//app.use(logger);

//!session ids for the users
app.use(
  expressSession({
    secret: "secret-key", // protect session data from being used maliciously
    resave: false, // don't save for persistnent storage in a power outage
    saveUninitialized: false, // don't save for persistnent storage in a power outage
    //cookie: { secure: true, maxAge: 60000, genid: -1 }, //60,000 = ONE MINUTE
  })
);

var players = [];
var numberOfPlayers = 0;
var fourplayer = false;

// routes - go to the homepage with / (default is probably just index.html)

// TODO if the user is online, start hosting the different files
// TODO: if a player is served a new file, does it start a new connection ?
// TODO ->    (remove any socket,io connections and will the client be able to send anythign )

// ? MAYBE sotre the socket.io as a header, and client.js is looking at the header for the socket.io

app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/startScreen.html");
});

//function to get the player index or object based on session id? return -1 not in,
//req - user information, res - what the server sends it back
// this is the first page the player will connect to
app.get("/gameModeServer", function (req, res) {
  res.sendFile(__dirname + "/gameModeServer.html");
});

app.get(
  "/singleOrTeamServer",
  function (req, res) {
    res.sendFile(__dirname + "/singleOrTeamServer.html");
  }

  //player does not exist
  // if (existingPlayer == false) {
  //   res
  //     .status(404)
  //     .send("You are a new player so you are not found in our storage");
  // }
  //}
);

app.get("/clientBoard", function (req, res) {
  // p.socket.emit("fourPlayers", {
  //   file: "/clientBoard.html",
  // });
});

app.get("/waitingScreen", function (req, res) {
  //this will check when a player connects
  if (players.length == 4) {
    //This should be called when the forth player connects
    console.log("players.length: " + players.length);
    for (p of players) {
      p.socket.allConnected = true;
      p.socket.emit("fourPlayers", {
        file: "/board.html",
      });
    }
  } else {
    console.log("inside else statement players.length: " + players.length);
    res.sendFile(__dirname + "/waitingScreen.html");
  }
});

// TODO: server game board

// server needs to listen to request
serv.listen(port);

var io = require("socket.io")(serv, {});

const player = require("./player.js");

//! will need something like number of players connected to keep track of the number of people on the wait screen
let numPlayers = 0;
io.sockets.on("connection", function (socket) {
  players.push(
    new player("Player " + (numPlayers + 1), socket, numPlayers + 1)
  );
  console.log(players);
  numPlayers++;

  socket.on("disconnect", () => {
    //!may need to change this
    players.splice(currentPlayerIndex, 1); // delete the current player from the array
  });
});

//?used to be inside gamemodeserver
// currentPlayerIndex = 0;
// existingPlayer = false; //reset global variable for different player connections

// console.log(req.headers);
// for (let i = 0; i < players.length; i++) {
//   //check for the session id from our player list
//   //
//   // if (req.header("Custom-Cookie") == players[i].sessionID) {
//   // if (req.cookie("Custom-Cookie") == players[i].sessionID) {
//   // if (req.session.cookie.genid == players[i].sessionID) {
//   if (req.get("customCookie") == players[i].sessionID) {
//     console.log("I am in the if statement for returning player");
//     existingPlayer = true;
//     currentPlayerIndex = i;
//     break;
//   }
// }
// //}
// //first time they connect we must assign them a (in a cookie?)
// //player does not exist - CREATE THE PLAYER HERE - only we creating the players so save their sockets
// if (existingPlayer == false) {
//   //create the player
//   console.log("creating new player");
//   //console.log("before the sessionID is: " + req.session.sessionID);
//   //! the session cookie may not be unique
//   //let pSessionID = req.session.cookie.genid;
//   let pSessionID = genuuid();

//   let tempIndex = players.length;
//   players.push(new player("Player " + tempIndex.toString(), -1, pSessionID)); ///give player a dummy socket until the scoket connection function

//   currentPlayerIndex = players.length - 1;
// console.log(
//   players[currentPlayerIndex].userName +
//     ": " +
//     players[currentPlayerIndex].id
// );

// Storing the unique session id for each player
//res.session.cookie.genid = pSessionID;

//   res.header("customCookie", pSessionID);
// }
// //res.json(players);
// res.header("Cache-Control", "public, max-age=60000"); // ! MIGHT HAVE TO SEND THIS AT EVERY RES - function
// res.sendFile(__dirname + "/gameModeServer.html");
// console.log("after send file" + "\n--------------------------------");

//?after gamemode server

//? used to be in singleOrTeam
// console.log(req.session.cookie.genid);
// existingPlayer = false;
// //if existing player
// for (let i = 0; i < players.length; i++) {
//   //check for the session id from our player list
//   if (req.session.cookie.customCookie == players[i].sessionID) {
//     //nextFile = "./singleOrTeamServer.html";
//     existingPlayer = true;
//     currentPlayerIndex = i;

//   break;
// }

// ? singleOrTeam

// this will give the client a session id in the header
// if the user refreshes the game, their progress is not lost - server can map them back to the pplayer array
// and update their new socket id (on connection)

// noPlayerHasAMatchingSessionID() {
//   return !players.some((p) => {
//     return req.session.sessionID == p.sessionID;
//   });
// }

//console.log(req.cookie);
// existingPlayer = players.find(p => p.sessionID == req.sessionID);

//console.log(players);
//if (!existingPlayer) {
//}
//existingPlayer = true;

// if (players[currentPlayerIndex].getSocket() == -1) {
//   players[currentPlayerIndex].setSocket(socket);
// }
// console.log("socketid " + socket.id);
// console.log("server: socket connected");
// console.log("player index " + currentPlayerIndex);
// console.log(players);
