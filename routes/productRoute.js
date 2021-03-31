const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

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

const {
  createProduct,
  editProduct,
  submitEdit,
  deleteProduct,
  renderProducts,
} = require("../controllers/productController");
const verifyAdmin = require("../middleware/verifyAdmin");
const productMiddleware = require("../middleware/productMiddleware");
const { adminRender } = require("../controllers/adminController");

router.get("/productPage", productMiddleware, renderProducts);

router.get("/admin", verifyAdmin, adminRender);
router.post("/admin", verifyAdmin, upload.single("image"), createProduct);
router.get("/adminEdit/:id", verifyAdmin, editProduct);
router.post("/adminEdit", upload.single("image"), verifyAdmin, submitEdit);
router.get("/adminDelete/:id", verifyAdmin, deleteProduct);

module.exports = router;
