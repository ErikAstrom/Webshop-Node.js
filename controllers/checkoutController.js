const {User} = require("../models/user");
const Cart = require("../models/cart");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const customerCheckout = async (req, res) => {
    const userCart = await Cart.findOne({ userId: req.user.user._id });
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
      user.purchased = true;
      user.save();
      res.render("user/cartCheckout.ejs", {
        cartitems: cart.products,
        user: req.user.user,
        totalAmount: cart.totalAmount,
        sessionId: session.id, 
        userCart: userCart
      })
    } catch (err) {
        console.log(err.message)
    }
}

const thankYou = async (req, res) => {
  const user = await User.findOne({ _id: req.user.user._id });
  const userId = user;
  const cart = await Cart.findOne({ userId });

  try {
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();

    res.render("user/thankyou.ejs", {
      user: req.user.user,
    })
    
    const msg = await {
      to: user.email, 
      from: "bubblifyinfo@gmail.com", 
      subject: "Order confirmation",
      html: `<h2>Thank you<h2>`
    };
    sgMail
    .send(msg)

    user.purchased = false;
    user.save();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
    customerCheckout,
    thankYou
}