const { Client } = require("discord.js")
// const Secret = require("./Objects/Auth.json")

const client = new Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.TOKEN)

module.exports = {
	client,
}

require("./Services/ServerStatus")
require("./Services/Music")