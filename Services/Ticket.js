const {
	RichEmbed
} = require("discord.js")
const {
	ObjectID
} = require("mongodb")
const moment = require("moment")
const _ = require("lodash")

const {
	client
} = require("./../app.js")

let Ticket = require("./../Database/TicketModel")

client.on("message", (message) => {
	if (message.author.bot) return
	if (!message.content.startsWith("!")) return

	let args = message.content.split(" ")

	if (message.content.startsWith("!new")) {
		createNewTicket(message, args)
	} else if (message.content.startsWith("!list")) {
		listSupportTickets(message, args)
	}
})

function createNewTicket(message, args) {
	if (_.isEmpty(args[1])) return channel.send("Please use the correct syntax: !new [topic]")

	let messageWithoutPrefix = message.content.slice(5)
	let randomNumber = _.random(100, 999)

	let ticket = new Ticket({
		number: randomNumber,
		author: message.author.toString(),
		channel: message.channel.toString(),
		info: messageWithoutPrefix,
	})

	ticket
		.save()
		.then((ticket) => {
			console.log(JSON.stringify(ticket, undefined, 2))
			message.channel.send("Ticket saved in the database :DD")
		})
		.catch((error) => {
			message.channel.send("Failed to save ticket in the database :((")
			console.error(`Failed to save ticket in the database: ${error}\n${JSON.stringify(ticket, undefined, 2)}`)
		})

	printSupportTicketEmbed(ticket, message.channel)
}

function listSupportTickets(message, args) {
	if (_.isEmpty(args[1]) || args[1] === "open") {
		Ticket
			.find()
			.then((tickets) => {
				tickets.length > 0 ? message.channel.send(`Listing (${tickets.length}) open support tickets`) : message.channel.send("Yay! There are 0 open tickets at the moment!")
				tickets.forEach((ticket) => printSupportTicketEmbed(ticket, message.channel))
			})
			.catch((error) => console.error(`* Failed to list all support tickets:\n${error}`))
	} else if (args[1] === "closed") {
		Ticket
			.find({
				closed: {
					$ne: ""
				}
			})
			.then((tickets) => {
				tickets.length > 0 ? message.channel.send(`Listing (${tickets.length}) closed support tickets`) : message.channel.send("There are no closed support tickets till this moment.")
				tickets.forEach((ticket) => printSupportTicketEmbed(ticket, message.channel))
			})
			.catch((error) => console.error(`* Failed to list closed support tickets\n${error}`))
	} else if (!isNaN(args[1])) {
		Ticket
			.findOne({
				number: args[1]
			})
			.then((ticket) => {
				!ticket ? message.channel.send(`Could not find ticket number ${args[1]}`) : printSupportTicketEmbed(ticket, message.channel)
			})
			.catch((error) => console.error(`* Failed to list support ticket number (${args[1]}):\n${error}`))
	}
}

function printSupportTicketEmbed(ticket, channel) {
	let embed = new RichEmbed()
		.setColor(ticket.closed ? "GREEN" : "RED")
		.setTitle("Support Ticket")
		.addField("Ticket Number", ticket.number, true)
		.addField("Author", ticket.author, true)
		.addField("Channel", ticket.channel, true)
		.addField("Info", ticket.info)

	channel.send(embed)
}