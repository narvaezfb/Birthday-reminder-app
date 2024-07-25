/**
 * Standardizes the structure of API responses.
 * @param {Object} res - The response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {Object} data - The response data.
 * @param {string} [message] - An optional message.
 */
const sendResponse = (res, statusCode, data, message = "") => {
	res.status(statusCode).json({
		status: statusCode,
		message: message,
		data: data,
	});
};

module.exports = sendResponse;
