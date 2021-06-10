const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  console.log(req.body);
  let user = new User({
    username: req.body.username,
    password: req.body.password,
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
};
// bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
//   if (err) {
//     res.json({
//       error: err,
//     });
//   }

// });

module.exports = {
  register,
};
