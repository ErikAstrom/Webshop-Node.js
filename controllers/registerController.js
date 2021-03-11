const User = require("../models/user");
const bcrypt = require("bcrypt");

const renderRegister = (req, res) => {
    res.render("user/register.ejs");
};

const submitRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await new User({ username: username, email: email, password: hashedPassword }).save();
        res.send("Hej");
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    renderRegister,
    submitRegister
  };