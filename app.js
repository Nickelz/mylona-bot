const http = require("http")
const {
	Client
} = require("discord.js")
// const Secret = require("./Objects/Auth.json")

const client = new Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.login("NjE0MzUzNjA2ODc0ODkwMjUw.XV-Peg.msYPPe4vPwCI3KeeKbh8-JP1hRE")

module.exports = {
	client,
}

require("./Services/ServerStatus")
require("./Services/Music")
require("./Services/Ticket")

// http.createServer().listen(process.env.PORT || 3000)