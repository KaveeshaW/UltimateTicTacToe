const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
  },
  winStreak: {
    type: Number,
  },
  winPercentage: {
    type: Number,
  },
  gamesPlayed: {
    type: Number,
  },
  highScore: {
    type: Number,
  },
  currentCurrency: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
