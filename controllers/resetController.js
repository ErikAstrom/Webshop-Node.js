const {User} = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const renderReset = (req, res) => {
  try {
  res.render("user/reset.ejs");
  } catch (err) {
    console.log(err)
  }
};

const submitReset = async (req,res) => {

    const email = req.body.email;
    const user = await User.findOne({ email: email });

    try {
    if (!user) {
      req.flash("warning_msg", "This email is not registered. Please try again or go to register for a new account."),
      res.redirect("/reset")
    }
    
    const mailToken = await crypto.randomBytes(32).toString("hex");
    user.mailToken = mailToken;
    user.mailExpiration = Date.now() + 3600000;
    await user.save();


    const msg = await {
        to: user.email, 
        from: "eckedevelopments@gmail.com", 
        subject: "Daytell reset password link",
        text: "Instructions for creating a new password",
        html: `<h2> Click  <a href="http://localhost:${process.env.PORT}/reset/${user.mailToken}"> <b>here</b></a> to create a new password </h2>`,
      };
      sgMail
      .send(msg)
      
      req.flash("success_msg", "An email has been sent to your adress, please check your inbox.")
      res.redirect("/reset");
    } catch (err) {
      console.log(err)
      req.flash("warning_msg", "An error has occured. Please try sending the email again.")
      res.redirect("/reset");
    }
  };

  const paramsReset = async (req, res) => {

    const mailToken = req.params.mailToken;
  
    try {
      const user = await User.findOne({
        mailToken: mailToken,
        mailExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        req.flash("warning_msg", "You are not a registered user, please register");
        res.redirect("register");   
      }
  
      res.render("user/resetPassword.ejs", { email: user.email });
    } catch (err) {
      console.log(err)
    }
  };


  const submitFormReset = async (req, res) => {
   
    const { email, password, password2 } = req.body;
    try {
    const user = await User.findOne({ email: email });
    if (password !== password2) {
      req.flash( "warning_msg", "Passwords do not match"),
      res.redirect('back');
    }
    if (password.length < 3) {
      req.flash( "warning_msg", "Password must be atleast 3 characters long."),
      res.redirect('back');
    }
    
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    user.password = hashedPassword;
    await user.save();
    req.flash("success_msg", "Your password has been reset and you can now log in with your new password.")
    res.redirect("/login");
    } catch (err) {
      console.log(err.message)
      res.status(500).send("Something went wrong, please reload page and try again.")
    }
  };

module.exports = {
  renderReset,
  submitReset,
  paramsReset,
  submitFormReset

};
