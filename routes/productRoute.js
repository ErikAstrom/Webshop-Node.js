const express = require("express");
const router = express.Router();

const { userStart, createProduct } = require("../controllers/productController");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyUser = require("../middleware/verifyUser");
const {adminRender} = require("../controllers/adminController")

// Startpage
router.get("/userStart", verifyUser, userStart);


// Admin
router.get("/admin", verifyAdmin, adminRender);
router.post("/admin", verifyAdmin, createProduct);

module.exports = router;