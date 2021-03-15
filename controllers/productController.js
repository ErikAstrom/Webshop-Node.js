const { User } = require("../models/user");
const Product = require("../models/product");

const userStart = async (req, res) => {

    try {
      const products = await Product.find();
      res.render('user/userStart.ejs', {
        user:req.user.user,
        products,
      })
      
    } catch (err) {
      console.log(err);
    }
  };

  const createProduct = async (req, res) => {
    const { title, description, price, origin, blend } = req.body;
    try {
      const product = await new Product({
        title: title,
        description: description,
        price: price,
        origin: origin, 
        blend: blend
      }).save();

      const user = await User.findOne({ _id: req.user.user._id });

      user.addProduct(product._id);

      res.redirect("/admin")

    } catch (err) {
      console.log(err)
    }
  }

  module.exports = {
    userStart,
    createProduct
};