// constants/responseConstants.js

module.exports = {
	STATUS: {
		OK: 200,
		CREATED: 201,
		BAD_REQUEST: 400,
		NOT_FOUND: 404,
		INTERNAL_SERVER_ERROR: 500,
		UNAUTHORIZED: 401,
	},
	MESSAGES: {
		USERS_RETRIEVED: "Users retrieved successfully",
		USER_RETRIEVED: "User retrieved successfully",
		USER_CREATED: "User created successfully",
		USER_UPDATED: "User updated successfully",
		USER_DELETED: "User deleted successfully",
		USER_NOT_FOUND: "User not found",
		USER_ALREADY_EXISTS: "User already exists",
		ALL_FIELDS_REQUIRED: "All fields are required",
		USER_LOGGED_IN: "Successful Login",
		INCORRECT_PASSWORDS: "Password do not match",
		PASSWORD_UPDATED: "Password has been updated successfully",
		NOT_TOKEN_PROVIDED: "Token was not provided in the request",
		INVALID_TOKEN: "Invalid Token",
		INVALID_ROLE: "Forbidden: Insufficient role",
	},
};
