const {User} = require("../models/user");

const adminRender = async (req, res) => {

    try {
      const adminProduct = await User.findOne({ _id: req.user.user._id}).populate(
          "adminProducts"
      );
      res.render('admin/admin.ejs', {
        user: req.user.user,
        items: adminProduct.adminProducts, 
      })
      
    } catch (err) {
      console.log(err);
    }
  };




module.exports = {
    adminRender
}