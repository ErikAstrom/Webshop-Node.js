const {User} = require("../models/user");
const Cart = require("../models/cart");

const adminRender = async (req, res) => {
  try {
    const userCart = await Cart.findOne({ userId: req.user.user._id });
    const userList = await User.find();
    const adminProduct = await User.findOne({ _id: req.user.user._id}).populate(
        "adminProducts"
    );
    
    res.render('admin/admin.ejs', {
      userList: userList,
      user: req.user.user,
      products: adminProduct.adminProducts, 
      userCart: userCart
    })
    
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    req.flash("success_msg", "User has been deleted");
    res.redirect("/admin");
  } catch (err) {
      console.log(err);
  }
};

module.exports = {
    adminRender,
    deleteUser
}