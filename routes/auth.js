const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/token", AuthController.token);
router.delete("/logout", AuthController.logout);

module.exports = router;
