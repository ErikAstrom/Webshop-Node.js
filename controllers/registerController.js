const User = require("../models/user");
const bcrypt = require("bcrypt");

const renderRegister = (req, res) => {
    res.render("user/register.ejs");
};

const submitRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        await new User({ username: username, email: email, password: password }).save();
        res.send("Hej");
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    renderRegister,
    submitRegister
  };