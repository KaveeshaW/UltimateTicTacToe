//player class
module.exports = class player {
  constructor(userName, sock, id) {
    this.userName = userName;
    this.team = "";
    this.isTurn = false;
    this.shape = "";
    this.color = "";
    this.id = id;
    this.score = 0;
    this.socket = sock;
  }

  // constructor(userName, id) {
  //   this.userName = userName;
  //   this.team = "";
  //   this.isTurn = false;
  //   this.shape = "";
  //   this.color = "";
  //   this.id = id;
  //   this.score = 0;
  // }

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

  getSocket() {
    return this.socket;
  }

  setSocket(socket) {
    this.socket = socket;
  }
};
