const express = require("express");
const router = express.Router();

const { createProduct, editProduct, submitEdit, deleteProduct, renderProducts } = require("../controllers/productController"); 
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyUser = require("../middleware/verifyUser");
const productMiddleware = require("../middleware/productMiddleware");
const {adminRender} = require("../controllers/adminController")


//Product
router.get("/productPage", productMiddleware, renderProducts)



// Admin
router.get("/admin", verifyAdmin, adminRender);
router.post("/admin", verifyAdmin, createProduct);
router.get("/adminEdit/:id", verifyAdmin, editProduct);
router.post("/adminEdit", verifyAdmin, submitEdit);
router.get("/adminDelete/:id", verifyAdmin, deleteProduct);

module.exports = router;