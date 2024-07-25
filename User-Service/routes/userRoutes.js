const express = require("express");
const router = express.Router();
const {
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
} = require("../controllers/userController");

const { authMiddleware, checkRole } = require("../controllers/authController");

router.get("/users", authMiddleware, checkRole("admin"), getUsers);

router.get("/users/:id", authMiddleware, getUserById);

router.patch("/users/:id", authMiddleware, updateUser);

router.delete("/users/:id", authMiddleware, deleteUser);

module.exports = router;
