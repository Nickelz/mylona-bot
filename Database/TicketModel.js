const _ = require("lodash")
var {
	mongoose
} = require("./mongoose")

const Schema = mongoose.Schema

var ticketSchema = new Schema({
	number: {
		type: Number,
		default: 0,
		unique: true,
	},

	author: {
		type: String,
		required: "Author cannt be empty.",
	},

	channel: {
		type: String,
		required: "Channel cannot be empty.",
	},

	info: {
		type: String,
		required: "Info cannot be empty.",
	},

	closed: {
		type: String,
		default: ""
	},

	timestamp: {
		type: Date,
		default: Date.now
	}
})

let ticketModel = mongoose.model("Ticket", ticketSchema)

module.exports = ticketModel

ticketSchema.pre("save", function (next) {
	ticketModel.find({
		number: this.number
	}, function (error, docs) {
		if (!docs.length) {
			next()
		} else {
			let newRandomNumber = _.random(100, 999)
			this.number = newRandomNumber
			console.log(`* ${this.number} Support Ticket number already exists, creating a new one (${newRandomNumber})`)
		}
	})
})