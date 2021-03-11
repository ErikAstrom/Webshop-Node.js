const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const renderLogin = (req, res) => {
    // if (req.cookies.jwtToken) return res.redirect("/");
    
    res.render("user/login.ejs");
    
  };
  
  const submitLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
    //   if (!user)
    //     return res.render("login.ejs", {
    //       message: "Usr name or pwd do not exist",
    //     });
  
      const validUser = await bcrypt.compare(password, user.password);
  
      if (!validUser) return res.redirect("/login")

  
      const jwtToken = await jwt.sign({ username: user }, process.env.SECRET_KEY);
  
      if (jwtToken) {
        const cookie = req.cookies.jwtToken;
        if (!cookie) {
          res.cookie("jwtToken", jwtToken, { maxAge: 10000000, httpOnly: true });
        }
        // req.flash("success_msg", "You are now logged in!");
        res.send("You are logged in!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  module.exports = {
    renderLogin,
    submitLogin
  };