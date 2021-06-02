/**
 * ! WARNING: serv.listen(port) NEEDS to be commented out in serverGameBoard.js before trying to run this test file
 */

const { app } = require("./serverGameBoard");
const request = require("supertest"); // A library for testing Node.js HTTP servers. npm install supertest --save-dev
let testApp;
let server;

//toBe
//notToBe
//toBeNull
//toBeUndefined

beforeEach(() => {
  testApp = app;
});

afterEach(() => {
  server = testApp.listen();
  server.close();
  server = app.listen();
  server.close();
});

describe("Testing API", () => {
  // a different way to run the test, could use async await as well
  test("should return startScreen", () => {
    return request(testApp)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.header.custompage).toBe("startScreen");
      });
  });
  test("should return gameModeServer", async (done) => {
    await request(testApp)
      .get("/gameModeServer")
      .expect(200)
      .then((response) => {
        expect(response.header.custompage).toBe("gameModeServer");
      });
    done();
  });
  test("should return singleOrTeamServer", async (done) => {
    await request(testApp)
      .get("/singleOrTeamServer")
      .expect(200)
      .then((response) => {
        expect(response.header.custompage).toBe("singleOrTeamServer");
      });
    done();
  });
  test("should return boardSelectionServer_4Player", async (done) => {
    await request(testApp)
      .get("/boardSelectionServer_4Player")
      .expect(200)
      .then((response) => {
        expect(response.header.custompage).toBe("boardSelectionServer4player");
      });
    done();
  });
  test("should return boardSelectionServer_2v2", async (done) => {
    await request(testApp)
      .get("/boardSelectionServer_2v2")
      .expect(200)
      .then((response) => {
        expect(response.header.custompage).toBe("boardSelectionServer2v2");
      });
    done();
  });
  test("should return waitingScreen", async (done) => {
    await request(testApp)
      .get("/waitingScreen")
      .expect(200)
      .then((response) => {
        expect(response.header.custompage).toBe("waitingScreen");
      });
    done();
  });
  test("should return clientBoard", async (done) => {
    await request(testApp)
      .get("/clientBoard")
      .expect(200)
      .then((response) => {
        expect(response.header.custompage).toBe("clientBoard");
      });
    done();
  });
});
