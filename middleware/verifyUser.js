const jwt = require("jsonwebtoken");
const Product = require("../models/product");

require("dotenv").config();

const verifyUser = async (req, res, next) => {
  const products = await Product.find();

  const token = req.cookies.jwtToken;

  if (!token) {
    return res.render("index.ejs", {
      products,
    });
  }

  const validUser = jwt.verify(token, process.env.SECRET_KEY);

  if (validUser) {
    req.user = validUser;
  }
  next();
};

module.exports = verifyUser;
