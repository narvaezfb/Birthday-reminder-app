const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		const uri = process.env.DB_URI;

		await mongoose.connect(uri, {
			serverApi: {
				version: "1",
				strict: true,
				deprecationErrors: true,
			},
		});

		console.log("MongoDB connected");
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
