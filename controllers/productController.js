const { User } = require("../models/user");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");

const renderProducts = async (req, res) => {
  const page = +req.query.page || 1;

  let sortPrice = +req.query.price;
  let sort = {};

  if (sortPrice) {
    sort.price = sortPrice;
  }

    try {
      const totalProducts = await Product.countDocuments();
      const limitPerPage = 3;
      const totalPages = Math.ceil(totalProducts / limitPerPage);
      const productsToShow = limitPerPage * page;
      const products = await Product.find().sort(sort).limit(productsToShow);

      res.render('productPage.ejs', {
        user:req.user.user, 
        page, 
        totalProducts,
        totalPages,
        limitPerPage,
        productsToShow,
        products
      })
    } catch (err) {
        console.log(err)
    };
}

  const createProduct = async (req, res) => {
    const { title, description, price, origin, blend } = req.body;
    try {
      const product = await new Product({
        title: title,
        img: {
          data: fs.readFileSync(path.join("uploads/" + req.file.filename)),
          contentType: "image",
        },
        description: description,
        price: price,
        origin: origin, 
        blend: blend
      }).save();

    const user = await User.findOne({ _id: req.user.user._id });

    user.addProduct(product._id);
    
    req.flash("success_msg", "Producted added successfully!")
    res.redirect("/admin")

  } catch (err) {
    console.log(err.message)
    req.flash("warning_msg", "Something went wrong, please try again")
    res.redirect("/admin")
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
      await Product.updateOne({ _id: req.body.id }, 
        { 
          title: req.body.title,
          img: {
            data: fs.readFileSync(path.join("uploads/" + req.file.filename)),
            contentType: "image",
          },
          description: req.body.description,
          price: req.body.price,
          origin: req.body.origin, 
          blend: req.body.blend,
        });
  
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

    req.flash("warning_msg", "Product Removed.")
    res.redirect("/admin");
  } catch (err) {
    console.log(err);
  }
}
  
  module.exports = {
    renderProducts,
    createProduct,
    editProduct,
    submitEdit,
    deleteProduct,
};