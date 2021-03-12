const User = require("../models/user");
const { logout } = require("./homeController");

const userStart = async (req, res) => {

    try {
      res.render('user/userStart.ejs', {user:req.user.user})
      
    } catch (err) {
      console.log(err);
    }
  };

  module.exports = {
      userStart
  };