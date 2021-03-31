const express = require("express");
const router = express.Router();

const verifyUser = require("../middleware/verifyUser");
const {
  renderWishlist,
  addToWishlist,
  removeFromWishlist,
  removeList,
} = require("../controllers/wishlistController");

router.get("/wishlist", verifyUser, renderWishlist);
router.get("/wishlist/:id", verifyUser, addToWishlist);

router.get("/wishlistDelete/:id", verifyUser, removeFromWishlist);
router.get("/wishlistRemoveAll", verifyUser, removeList);

module.exports = router;
