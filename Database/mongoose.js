const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose
	.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SupportTicket', {
		useCreateIndex: true,
		useNewUrlParser: true,
	})
	.then(() => console.log("* MylonaBot is now connected to MongoDB!"))
	.catch((error) => console.error(`* Unable to to connect to MongoDB server ...\n ${error}`))

module.exports = {
	mongoose
}