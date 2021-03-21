const express = require("express");
const router = express.Router();

const verifyUser = require("../middleware/verifyUser");
const { addtoCart, showShoppingCart, removeFromCart } = require("../controllers/shoppingController");

// Add to shoppingcart
router.post("/addToCart", verifyUser, addtoCart); 

// Show shopping cart
router.get("/myShoppingCart", verifyUser, showShoppingCart); 

// Remove item from cart
router.get("/removeFromCart/:id", verifyUser, removeFromCart);

module.exports = router;