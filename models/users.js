const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
