const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const renderLogin = (req, res) => {
    if (req.cookies.jwtToken) return res.redirect("/userStart");
    try {
      res.render("user/login.ejs");
    } catch (err) {
      console.log(err)
    }  
  };
  
  const submitLogin = async (req, res) => {
    
    const { email, password } = req.body;
    let errors = [];
  
    try {
      if (!email || !password) {
        return errors.push({ msg: "All fields need to be filled in." }),
        res.render('user/login.ejs', {
            errors,
            email, 
            password 
        })
      }
    
      const user = await User.findOne({ email: email });
      if (!user) {
        return errors.push({msg: "This email is not registered. Please register before log in."}),
        res.render("user/login.ejs", {
            errors,
            user,
        });
      }
      
      const validUser = await bcrypt.compare(password, user.password);
      if (!validUser) {
        return errors.push({ msg: "Password is incorrect." }),
        res.render('user/login.ejs', {
          errors,
          validUser
        });
      }

      const jwtToken = await jwt.sign({ user: user }, process.env.SECRET_KEY);
      if (jwtToken) {
        const cookie = req.cookies.jwtToken;
        if (!cookie) {
          res.cookie("jwtToken", jwtToken, { maxAge: 10000000, httpOnly: true });
        }
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  module.exports = {
    renderLogin,
    submitLogin
  };