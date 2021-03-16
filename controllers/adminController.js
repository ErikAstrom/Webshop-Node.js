const {User} = require("../models/user");
const Product = require("../models/product");

const adminRender = async (req, res) => {
  try {
    const userList = await User.find();
    const adminProduct = await User.findOne({ _id: req.user.user._id}).populate(
        "adminProducts"
    );
    res.render('admin/admin.ejs', {
      userList: userList,
      user: req.user.user,
      products: adminProduct.adminProducts, 
    })
    
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/admin");
  } catch (err) {
      console.log(err);
  }
};

module.exports = {
    adminRender,
    deleteUser
}