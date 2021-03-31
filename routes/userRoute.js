const express = require("express");

const router = express.Router();
const {
  renderReset,
  submitReset,
  paramsReset,
  submitFormReset,
} = require("../controllers/resetController");
const {
  renderRegister,
  submitRegister,
} = require("../controllers/registerController");
const { renderLogin, submitLogin } = require("../controllers/loginController");
const { startPage, logout } = require("../controllers/homeController");
const { deleteUser } = require("../controllers/adminController");
const verifyUser = require("../middleware/verifyUser");
const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/", verifyUser, startPage);

router.get("/logout", logout);

router.get("/register", renderRegister);
router.post("/register", submitRegister);

router.get("/login", renderLogin);
router.post("/login", submitLogin);

router.get("/reset", renderReset);
router.post("/reset", submitReset);

router.get("/reset/:mailToken", paramsReset);
router.post("/resetPassword", submitFormReset);

router.get("/userDelete/:id", verifyAdmin, deleteUser);

module.exports = router;
