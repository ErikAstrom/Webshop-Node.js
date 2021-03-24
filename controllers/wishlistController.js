const {User} = require("../models/user");
const Cart = require("../models/cart");

const renderWishlist= async (req, res) => {
    let errors = [];
    try {
      const userCart = await Cart.findOne({ userId: req.user.user._id });

      const user = await User.findOne({ _id: req.user.user._id }).populate("wishList");
      if (user.wishList.length == 0) {
          return errors.push({msg: "Your wishlist is empty!"}),
            res.render("user/wishlist.ejs", {
            errors,
            wishes: user.wishList,
            user: req.user.user,
            userCart: userCart
          });
      } else {
            res.render("user/wishlist.ejs", {
            wishes: user.wishList,
            user: req.user.user,
            userCart: userCart
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

const addToWishlist = async (req, res) => {
    try {
        const productId = req.params.id;
        const user = await User.findOne({ _id: req.user.user._id });
        user.addWish(productId, user);

        res.redirect("back");
         
    } catch (err) {
        console.log(err);
    }
};

const removeFromWishlist = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.user._id });
      const wishId = req.params.id;
  
      user.wishList.pull({ _id: wishId });
  
      await user.save();

      if (user.wishList.length >= 1) {
      req.flash("warning_msg", "Product removed from your wishlist.")
      }
      res.redirect("/wishlist");
    } catch (err) {
      console.log(err);
    }
  };

  const removeList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.user._id });
        user.wishList = [];
        await user.save();

        res.redirect("/wishlist")
    } catch (err) {
        console.log(err)
    }
  };

  module.exports = {
    renderWishlist,
    addToWishlist,
    removeFromWishlist,
    removeList
  }