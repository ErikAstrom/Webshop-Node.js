const Product = require("../models/product");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const productMiddleware = async (req,res,next)=>  {
    
    const page = +req.query.page || 1;
    const token = req.cookies.jwtToken;
    const totalProducts = await Product.countDocuments();
    const limitPerPage = 3;
    const totalPages = Math.ceil(totalProducts / limitPerPage);
    const productsToShow = limitPerPage * page;
    const products = await Product.find().limit(productsToShow);
    if(!token) {
        
        return res.render("productPage.ejs", {
            products,
            page, 
            totalProducts,
            totalPages,
            limitPerPage,
            productsToShow
        } );
    }

    const validUser = jwt.verify(token, process.env.SECRET_KEY)

if (validUser) {
    req.user = validUser;
    product = products;
}
next();
}

module.exports = productMiddleware;