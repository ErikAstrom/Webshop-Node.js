const express = require("express");
const router = express.Router();

const { userStart } = require("../controllers/productController");
const verifyUser = require("../middleware/verifyUser");

// Startpage
router.get("/userStart", verifyUser, userStart);

module.exports = router;