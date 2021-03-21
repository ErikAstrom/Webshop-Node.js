const express = require("express");
const router = express.Router();

const verifyUser = require("../middleware/verifyUser");
const { addToCart, showShoppingCart, removeFromCart, increaseInCart, decreaseInCart } = require("../controllers/shoppingController");
const { customerCheckout } = require("../controllers/checkoutController");

// Show shopping cart
router.get("/myShoppingCart", verifyUser, showShoppingCart);

// Add to shoppingcart
router.post("/addToCart", verifyUser, addToCart); 

// Remove item from cart
router.get("/removeFromCart/:id", verifyUser, removeFromCart);

// Increase / Decrease amount in Cart
router.get("/increaseInCart/:id", verifyUser, increaseInCart);
router.get("/decreaseInCart/:id", verifyUser, decreaseInCart);

// Checkout pages (Go to payment and Thank you page)
router.get("/customerCheckout", verifyUser, customerCheckout);

module.exports = router;