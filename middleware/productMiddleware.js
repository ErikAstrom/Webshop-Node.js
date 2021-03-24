const Product = require("../models/product");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const productMiddleware = async (req, res, next) => {
    try {
      const spain = await Product.find({"origin": 'spain'}).collation({locale: "en", strength: 2});
      const italy = await Product.find({"origin": 'italy'}).collation({locale: "en", strength: 2});
      const france = await Product.find({"origin": 'france'}).collation({locale: "en", strength: 2});
      let origin;
    
      if (req.query.origin == "spain") {
        origin = spain;
      } 
      else if (req.query.origin == "italy") {
        origin = italy;
      } 
      else if (req.query.origin == "france") {
        origin = france;
      }
  
      const page = +req.query.page || 1;
  
      const sortPrice = +req.query.price;
  
      const token = req.cookies.jwtToken;
  
      const totalProducts = await Product.countDocuments();
      const limitPerPage = 3;
      const totalPages = Math.ceil(totalProducts / limitPerPage);
      const productsToShow = limitPerPage * page;
      const products = await Product.find().sort({price: sortPrice}).limit(productsToShow);
      
      if (!token) {
          return res.render("productPage.ejs", {
              products,
              page, 
              totalProducts,
              totalPages,
              limitPerPage,
              productsToShow,
              sortPrice,
              origin,
          });
      }
  
      const validUser = jwt.verify(token, process.env.SECRET_KEY)
  
      if (validUser) {
          req.user = validUser;
          product = products;
      }
      next();
    } catch (err) { 
        console.log(err);
    }
}

module.exports = productMiddleware;