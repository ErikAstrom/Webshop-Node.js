const express = require("express");

const router = express.Router();
const { renderReset, submitReset, paramsReset,submitFormReset } =require("../controllers/resetController");
const {renderRegister, submitRegister} = require("../controllers/registerController");
const {renderLogin, submitLogin} = require("../controllers/loginController");
const { startPage, logout } = require("../controllers/homeController");
const { deleteUser } = require("../controllers/adminController");
const verifyUser = require("../middleware/verifyUser");
const verifyAdmin = require("../middleware/verifyAdmin");

// Startpage for all non-logged in customers
router.get("/", verifyUser,  startPage)

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

// Admin
router.get("/userDelete/:id", verifyAdmin, deleteUser);









module.exports = router;