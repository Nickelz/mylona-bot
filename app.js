const {
	Client
} = require("discord.js")
// const Secret = require("./Objects/Auth.json")

const client = new Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.login("NjE0MzUzNjA2ODc0ODkwMjUw.XWPVIg.KggMRZm8MDCVoNId3SgAUi50gR8")

module.exports = {
	client,
}

require("./Services/ServerStatus")
require("./Services/Music")
require("./Services/Ticket")