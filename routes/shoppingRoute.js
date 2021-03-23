const express = require("express");
const router = express.Router();

const verifyUser = require("../middleware/verifyUser");
const { addToCart, showShoppingCart, removeFromCart, clearCartTotal, increaseInCart, decreaseInCart } = require("../controllers/shoppingController");
const { customerCheckout, thankYou } = require("../controllers/checkoutController");

// Show shopping cart
router.get("/myShoppingCart", verifyUser, showShoppingCart);

// Add to shoppingcart
router.post("/addToCart", verifyUser, addToCart); 

// Remove item from cart & clear cart totally
router.get("/removeFromCart/:id", verifyUser, removeFromCart);
router.get("/clearCartTotal", verifyUser, clearCartTotal);

// Increase / Decrease amount in Cart
router.get("/increaseInCart/:id", verifyUser, increaseInCart);
router.get("/decreaseInCart/:id", verifyUser, decreaseInCart);

// Checkout pages (Go to payment and Thank you page)
router.get("/customerCheckout", verifyUser, customerCheckout);
router.get("/thankyou", verifyUser, thankYou);

module.exports = router;