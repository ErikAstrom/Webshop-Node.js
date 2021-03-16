const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer - add file to uploads folder NEW
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });

  // Check the uploaded file type NEW
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
        return callback(console.log(new Error("Wrong file type")));
      }
      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024,
    },
  });

const { createProduct, editProduct, submitEdit, deleteProduct, renderProducts } = require("../controllers/productController"); 
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyUser = require("../middleware/verifyUser");
const productMiddleware = require("../middleware/productMiddleware");
const {adminRender} = require("../controllers/adminController")

//Product
router.get("/productPage", productMiddleware, renderProducts)

// Admin
router.get("/admin", verifyAdmin, adminRender);
router.post("/admin", verifyAdmin, upload.single("image"), createProduct);
router.get("/adminEdit/:id", verifyAdmin, editProduct);
router.post("/adminEdit", upload.single("image"), verifyAdmin, submitEdit);
router.get("/adminDelete/:id", verifyAdmin, deleteProduct);

module.exports = router;