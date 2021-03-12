const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const renderReset = (req, res) => {
  res.render("user/reset.ejs", { err: "" });
};

const submitReset = async (req,res) => {

    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) return res.redirect("/reset");
    const mailToken = await crypto.randomBytes(32).toString("hex");

    user.mailToken = mailToken;
    user.mailExpiration = Date.now() + 3600000;
    await user.save();


    const msg = await {
        to: user.email, 
        from: "eckedevelopments@gmail.com", 
        subject: "Daytell reset password link",
        text: "Instructions for creating a new password",
        html: `<h2> Click  <a href="http://localhost:8003/reset/${user.mailToken}"> <b>here</b></a> to create a new password </h2>`,
      };
      sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent to" + user.email);
      })
      .catch((error) => {
        console.error(error);
      });
  
    res.redirect("/login");
  };
  const paramsReset = async (req, res) => {

    const mailToken = req.params.mailToken;
  
    try {
      const user = await User.findOne({
        mailToken: mailToken,
        mailExpiration: { $gt: Date.now() },
      });
  
      if (!user) return res.send("no work");
  
      res.render("user/resetPassword.ejs", { err: "", email: user.email });
    } catch (err) {
      res.render("user/reset.ejs", { err: " Försök igen" });
    }
  };


  const submitFormReset = async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
  
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
  
  
    const user = await User.findOne({ email: email });
  
    user.password = hashedPassword;
    await user.save();
    res.redirect("/login");
  
  };


    

module.exports = {
  renderReset,
  submitReset,
  paramsReset,
  submitFormReset

};
