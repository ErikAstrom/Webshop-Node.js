const express = require("express");

const router = express.Router();

const {renderRegister, submitRegister} = require("../controllers/registerController");
const {renderLogin, submitLogin} = require("../controllers/loginController");

// Register routes
router.get("/register", renderRegister);
router.post("/register", submitRegister);

// Login routes
router.get("/login", renderLogin);
router.post("/login", submitLogin);

module.exports = router;