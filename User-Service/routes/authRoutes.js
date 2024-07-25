const express = require("express");
const router = express.Router();
const {
	register,
	login,
	updatePassword,
	authMiddleware,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.patch("/updatePassword", authMiddleware, updatePassword);

module.exports = router;
