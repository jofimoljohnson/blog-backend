const express = require("express");

const router = express.Router();
const userController = require("../controller/user-controller");

router.get("/", userController.getAllUsers);
router.post("/signup",userController.signupUser)
router.post("/login",userController.loginUser)

module.exports = router;
