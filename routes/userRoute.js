const express = require("express");

const router = express.Router();
const { renderReset, submitReset, paramsReset,submitFormReset } =require("../controllers/resetController");
const {renderRegister, submitRegister} = require("../controllers/registerController");
const {renderLogin, submitLogin} = require("../controllers/loginController");
const { startPage, logout } = require("../controllers/homeController");

// Startpage for all non-logged in customers
router.get("/", startPage)

// Logout
router.get("/logout", logout);

// Register routes
router.get("/register", renderRegister);
router.post("/register", submitRegister);

// Login routes
router.get("/login", renderLogin);
router.post("/login", submitLogin);

//Reset PW routes
router.get("/reset", renderReset);
router.post("/reset", submitReset)

router.get("/reset/:mailToken", paramsReset);
router.post("/resetPassword", submitFormReset);









module.exports = router;