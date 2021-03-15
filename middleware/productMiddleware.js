const Product = require("../models/product");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const productMiddleware = async (req,res,next)=>  {

    const token = req.cookies.jwtToken;
    const products = await Product.find();
    if(!token) { 
        return res.render("productPage.ejs", {products} );
    }

    const validUser = jwt.verify(token, process.env.SECRET_KEY)

if (validUser) {
    req.user = validUser;
    product = products;
}
next();
}

module.exports = productMiddleware;