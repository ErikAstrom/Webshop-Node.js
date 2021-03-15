const { User } = require("../models/user");
const Product = require("../models/product");




const startPage = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index.ejs', {
            user:req.user.user, 
            products
          })
    } catch (err) {
        console.log(err)
    };
}

const logout = (req, res) => {
    res.clearCookie("jwtToken");
    // req.flash("success_msg", "You are now logged out!");
    res.redirect("/");
  }

  module.exports = {
      startPage,
      logout
  }
  