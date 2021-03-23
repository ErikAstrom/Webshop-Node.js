const {User} = require("../models/user");
const Cart = require("../models/cart");

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const customerCheckout = async (req, res) => {
    const user = await User.findOne({ _id: req.user.user._id });
    const userId = user;
    const cart = await Cart.findOne({ userId });
    try {
      if (cart.products.length <= 0 || !cart.products) {
          req.flash("warning_msg", "You must have atleast 1 product to go to payment.")
          res.redirect("/myShoppingCart")
      }
      
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:${process.env.PORT}/thankyou`,
        cancel_url: `http://localhost:${process.env.PORT}/customerCheckout`,
        payment_method_types: ["card"],
        line_items: cart.products.map((product) => {
          return {
            name: product.title,
            amount: product.price * 100,
            quantity: product.quantity,
            currency: "SEK"
          }
        }),
        mode: "payment"
      });

      res.render("user/cartCheckout.ejs", {
        cartitems: cart.products,
        user: req.user.user,
        totalAmount: cart.totalAmount,
        sessionId: session.id
      })
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    customerCheckout
}