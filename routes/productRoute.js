const express = require("express");
const router = express.Router();

const { userStart } = require("../controllers/productController");

// Startpage
router.get("/userStart", userStart);

module.exports = router;