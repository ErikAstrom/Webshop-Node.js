const User = require("../models/user");

const userStart = async (req, res) => {
    try {
      res.render('user/userStart.ejs', {
      });
      
    } catch (err) {
      console.log(err);
    }
  };

  module.exports = {
      userStart
  };