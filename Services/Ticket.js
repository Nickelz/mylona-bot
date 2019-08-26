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

let mongoose = require("./../Database/mongoose")
let Ticket = require("./../Database/TicketModel")

client.on("message", (message) => {
	if (message.author.bot) return
	if (!message.content.startsWith("!")) return

	if (message.content.startsWith("!new")) {
		createNewTicket(message)
	}
})

function createNewTicket(message) {
	let args = message.content.split(" ")
	if (_.isEmpty(args[1])) return channel.send("Please use the correct syntax: !new [topic]")

	let messageWithoutPrefix = message.content.slice(5)
	let randomNumber = _.random(100, 999)

	let ticket = new Ticket({
		number: randomNumber,
		author: message.author.toString(),
		channel: message.channel.toString(),
		info: messageWithoutPrefix,
	})

	ticket.save().then((ticket) => {
		console.log(JSON.stringify(ticket, undefined, 2))
		message.channel.send("Ticket saved in the database :DD")
	}).catch((error) => {
		message.channel.send("Failed to save ticket in the database :((")
		console.error(`Failed to save ticket in the database: ${error}\n${JSON.stringify(ticket, undefined, 2)}`)
	})

	let embed = new RichEmbed()
		.setColor("RED")
		.setTitle("Support Ticket")
		.addField("Ticket Number", randomNumber, true)
		.addField("Author", message.author, true)
		.addField("Channel", message.channel, true)
		.addField("Info", messageWithoutPrefix)
		.setFooter("<@&613545261771522088>")

	message.channel.send("Code has been updated")
	message.channel.send(embed)
}