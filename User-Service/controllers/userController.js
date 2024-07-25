const User = require("../models/user");
const sendResponse = require("../utils/responseHelper");
const { STATUS, MESSAGES } = require("../utils/responseConstants");
const bcrypt = require("bcryptjs");

module.exports.getUsers = async (req, res) => {
	try {
		const users = await User.find();
		sendResponse(res, STATUS.OK, users, MESSAGES.USERS_RETRIEVED);
	} catch (error) {
		sendResponse(res, STATUS.INTERNAL_SERVER_ERROR, null, error.message);
	}
};

module.exports.getUserById = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id).select("-password");
		if (!user) {
			return sendResponse(res, STATUS.NOT_FOUND, null, MESSAGES.USER_NOT_FOUND);
		}
		sendResponse(res, STATUS.OK, user, MESSAGES.USER_RETRIEVED);
	} catch (error) {
		sendResponse(res, STATUS.INTERNAL_SERVER_ERROR, null, error.message);
	}
};

module.exports.updateUser = async (req, res) => {
	const { id } = req.params;
	const { name, email, password } = req.body;

	try {
		const updates = {};
		if (name) updates.name = name;
		if (email) updates.email = email;
		if (password) {
			const salt = await bcrypt.genSalt(10);
			updates.password = await bcrypt.hash(password, salt);
		}

		const user = await User.findByIdAndUpdate(id, updates, { new: true });
		if (!user) {
			return sendResponse(res, STATUS.NOT_FOUND, null, MESSAGES.USER_NOT_FOUND);
		}
		sendResponse(res, STATUS.OK, user, MESSAGES.USER_UPDATED);
	} catch (error) {
		sendResponse(res, STATUS.INTERNAL_SERVER_ERROR, null, error.message);
	}
};

module.exports.deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return sendResponse(res, STATUS.NOT_FOUND, null, MESSAGES.USER_NOT_FOUND);
		}
		sendResponse(res, STATUS.OK, null, MESSAGES.USER_DELETED);
	} catch (error) {
		sendResponse(res, STATUS.INTERNAL_SERVER_ERROR, null, error.message);
	}
};
