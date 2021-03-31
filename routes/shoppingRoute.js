const express = require("express");
const router = express.Router();
const verifyPurchase = require("../middleware/thankYouMiddleWare");
const verifyUser = require("../middleware/verifyUser");
const {
  addToCart,
  showShoppingCart,
  removeFromCart,
  clearCartTotal,
  increaseInCart,
  decreaseInCart,
} = require("../controllers/shoppingController");
const {
  customerCheckout,
  thankYou,
} = require("../controllers/checkoutController");

router.get("/myShoppingCart", verifyUser, showShoppingCart);

router.post("/addToCart", verifyUser, addToCart);

router.get("/removeFromCart/:id", verifyUser, removeFromCart);
router.get("/clearCartTotal", verifyUser, clearCartTotal);

router.get("/increaseInCart/:id", verifyUser, increaseInCart);
router.get("/decreaseInCart/:id", verifyUser, decreaseInCart);

router.get("/customerCheckout", verifyUser, customerCheckout);
router.get("/thankyou", verifyPurchase, thankYou);

module.exports = router;
