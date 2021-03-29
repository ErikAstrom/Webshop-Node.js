const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const Product = require("../models/product");

require("dotenv").config();

const verifyPurchase = async (req, res, next) => {
  const products = await Product.find();

  const token = req.cookies.jwtToken;

  if (!token) {
    return res.render("index.ejs", {
      products,
    });
  }

  const validUser = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({ _id: validUser.user._id });

  if (user.purchased !== true) {
    return res.redirect("/");
  }

  req.user = validUser;

  next();
};

module.exports = verifyPurchase;
