const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      username: req.body.username,
      password: hashedPass,
      email: req.body.email,
    });

    user
      .save()
      .then((user) => {
        res.json({
          message: "User added succesfully",
        });
      })
      .catch((error) => {
        res.json({
          message: "An error occurred " + error,
        });
      });
  });
};

let refreshTokens = [];
const login = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ $or: [{ email: username }] }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          });
        }
        if (result) {
          const user = { name: username };
          const accessToken = generateAccessToken(user);
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
          refreshTokens.push(refreshToken);
          res.json({
            message: "Login Successful",
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          res.json({
            message: "Password does not match",
          });
        }
      });
    } else {
      res.json({
        message: "No user found",
      });
    }
  });
};

const token = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
};

const logout = (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
}

module.exports = {
  register,
  login,
  token,
  logout,
};
