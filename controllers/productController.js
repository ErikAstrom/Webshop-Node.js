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

  const editProduct = async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });
  
      res.render("admin/adminEdit.ejs", { product: product });
    } catch (err) {
      console.log(err);
    }
  }

  const submitEdit = async (req, res) => {

    try {
      await Product.updateOne({ _id: req.body.id }, { title: req.body.title });
  
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
    }
  }

  const deleteProduct = async (req, res) => {
    try {
      await Product.deleteOne({ _id: req.params.id });
  
      const user = await User.findOne({ _id: req.user.user._id });
      user.removeProduct(req.params.id);
  
      res.redirect("/admin");
    } catch (err) {
      console.log(err);
    }
  }
  

  module.exports = {
    userStart,
    createProduct,
    editProduct,
    submitEdit,
    deleteProduct
};