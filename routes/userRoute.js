const express = require("express");

const router = express.Router();

const {renderRegister, submitRegister} = require("../controllers/registerController");


router.get("/register", renderRegister);
router.post("/register", submitRegister);


module.exports = router;