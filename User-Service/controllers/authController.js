const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendResponse = require("../utils/responseHelper");
const { STATUS, MESSAGES } = require("../utils/responseConstants");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

function generateNewToken(user, JWT_SECRET, expireTime) {
	const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
		expiresIn: expireTime,
	});
	return token;
}

const register = async (req, res) => {
	const { name, email, password, role } = req.body;

	if (!name || !email || !password) {
		return sendResponse(
			res,
			STATUS.BAD_REQUEST,
			null,
			MESSAGES.ALL_FIELDS_REQUIRED
		);
	}

	try {
		const user = new User({ name, email, password, role });
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return sendResponse(
				res,
				STATUS.BAD_REQUEST,
				null,
				MESSAGES.USER_ALREADY_EXISTS
			);
		}

		await user.save();
		// generate a new token for registered user
		const token = generateNewToken(user, JWT_SECRET, "1h");

		sendResponse(
			res,
			STATUS.OK,
			{ user: user, token: token },
			MESSAGES.USER_CREATED
		);
	} catch (error) {
		sendResponse(res, STATUS.INTERNAL_SERVER_ERROR, null, error.message);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user || !(await user.comparePassword(password))) {
			return sendResponse(res, STATUS.NOT_FOUND, null, MESSAGES.USER_NOT_FOUND);
		}

		const token = generateNewToken(user, JWT_SECRET, "1h");

		sendResponse(res, STATUS.OK, { token: token }, MESSAGES.USER_LOGGED_IN);
	} catch (error) {
		sendResponse(res, STATUS.INTERNAL_SERVER_ERROR, null, error.message);
	}
};

const updatePassword = async (req, res) => {
	const { userId, currentPassword, newPassword } = req.body;
	try {
		const user = await User.findById(userId);
		if (!user) {
			sendResponse(res, STATUS.NOT_FOUND, null, MESSAGES.USER_NOT_FOUND);
		}

		const isMatch = await user.comparePassword(currentPassword);

		if (!isMatch) {
			sendResponse(
				res,
				STATUS.UNAUTHORIZED,
				null,
				MESSAGES.INCORRECT_PASSWORDS
			);
		}

		// Update the password
		user.password = newPassword;
		await user.save();

		sendResponse(res, STATUS.OK, null, MESSAGES.PASSWORD_UPDATED);
	} catch (error) {
		sendResponse(res, STATUS.INTERNAL_SERVER_ERROR, null, error.message);
	}
};

const authMiddleware = async (req, res, next) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");
		console.log(token);

		if (!token) {
			return sendResponse(
				res,
				STATUS.BAD_REQUEST,
				null,
				MESSAGES.NOT_TOKEN_PROVIDED
			);
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		console.log(decoded);

		// Find the user associated with the token
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return sendResponse(
				res,
				STATUS.UNAUTHORIZED,
				null,
				MESSAGES.INVALID_TOKEN
			);
		}

		// Attach user to the request object
		req.user = user;
		next();
	} catch (error) {
		console.error("Error in authentication middleware:", error.message);
		sendResponse(res, STATUS.UNAUTHORIZED, null, MESSAGES.INVALID_TOKEN);
	}
};

const checkRole = (requiredRole) => {
	return (req, res, next) => {
		const { user } = req;
		if (user && user.role === requiredRole) {
			next();
		} else {
			sendResponse(res, STATUS.UNAUTHORIZED, null, MESSAGES.INVALID_ROLE);
		}
	};
};

module.exports = { register, login, updatePassword, authMiddleware, checkRole };
