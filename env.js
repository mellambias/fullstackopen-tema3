require("dotenv").config();

const config = {
	dataBase: {
		uri: process.env.MONGODB_URI,
		username: process.env.MONGODB_USERNAME,
		password: process.env.MONGODB_PASSWORD,
	},
	server: {
		PORT: process.env.PORT,
	},
	getMongoURI() {
		return this.dataBase.uri
			.replace("<username>", this.dataBase.username)
			.replace("<password>", this.dataBase.password);
	},
	getServerPort() {
		return this.server.PORT;
	},
};

module.exports = config;
