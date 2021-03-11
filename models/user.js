const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, default: "customer" },
  date: { type: Date, default: Date.now } 
});

const User = mongoose.model("user", userSchema);

module.exports = User;