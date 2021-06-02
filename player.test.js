const player = require("./player");
let playerTest;

beforeEach(() => {
  playerTest = new player("test", -1, 0);
});

test("getUserName", () => {
  expect(playerTest.getUserName()).toEqual("test");
});

test("setUserName", () => {
  playerTest.setUserName("pablo");
  expect(playerTest.getUserName()).toEqual("pablo");
});

test("getTeam", () => {
  expect(playerTest.getTeam()).toEqual("");
});

test("setUserName", () => {
  playerTest.setTeam("x");
  expect(playerTest.getTeam()).toEqual("x");
});

test("getIsTurn", () => {
  expect(playerTest.getIsTurn()).toEqual(false);
});

test("setIsTurn", () => {
  playerTest.setIsTurn(true);
  expect(playerTest.getIsTurn()).toEqual(true);
});

test("getShape", () => {
  expect(playerTest.getShape()).toEqual("");
});

test("setShape", () => {
  playerTest.setShape("circle");
  expect(playerTest.getShape()).toEqual("circle");
});

test("getColor", () => {
  expect(playerTest.getColor()).toEqual("");
});

test("setColor", () => {
  playerTest.setColor("red");
  expect(playerTest.getColor()).toEqual("red");
});

test("getId", () => {
  expect(playerTest.getId()).toEqual(0);
});

test("setId", () => {
  playerTest.setId(12);
  expect(playerTest.getId()).toEqual(12);
});

test("getScore", () => {
  expect(playerTest.getScore()).toEqual(0);
});

test("setScore", () => {
  playerTest.setScore(3);
  expect(playerTest.getScore()).toEqual(3);
});

test("getSocket", () => {
  expect(playerTest.getSocket()).toEqual(-1);
});

test("setSocket", () => {
  playerTest.setSocket(5);
  expect(playerTest.getSocket()).toEqual(5);
});
