const {User} = require("../models/user");
const Cart = require("../models/cart");

const customerCheckout = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    const cart = await Cart.findOne({ userId });
    try {
      if (cart.products.length <= 0 || !cart.products) {
          req.flash("warning_msg", "You must have atleast 1 product to go to payment.")
          res.redirect("/myShoppingCart")
      }
      // Add everything Stripe here!

      res.render("user/cartCheckout.ejs", {
        cartitems: cart.products,
        user: req.user.user,
        totalAmount: cart.totalAmount,
          
      })
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    customerCheckout
}