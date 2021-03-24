const Product = require("../models/product");
const Cart = require("../models/cart");

const startPage = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user.user._id });
        const products = await Product.find();

        res.render('index.ejs', {
            user: req.user.user, 
            products,
            userCart: userCart
        })
    } catch (err) {
        console.log(err)
    };
}

const logout = (req, res) => {
    res.clearCookie("jwtToken");
    req.flash("success_msg", "You are now logged out!");
    res.redirect("/");
  }

  module.exports = {
      startPage,
      logout
  }
  