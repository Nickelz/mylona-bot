const { Client } = require("discord.js")
const Secret = require("./Objects/Auth.json")

const client = new Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.login(Secret.token)

module.exports = {
	client,
}

require("./Services/ServerStatus")