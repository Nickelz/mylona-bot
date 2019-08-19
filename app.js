const { Client, RichEmbed} = require("discord.js")
const moment = require("moment")
const request = require("request-promise")
const _ = require("lodash")

const Secret = require("./auth.json")

const client = new Client()

var embedInfo = {
	onlineStatus: false,
	playerCount: -1,
	playerMax: 60,
	serverIP: "vanilla.mylona.fun",
	serverFavicon: ""
}

var options = {
	"url": "https://eu.mc-api.net/v3/server/ping/us.mineplex.com",
	"json": true
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	

	request(options).then((body) => {
		var data = _.pick(body, ["online", "favicon", "players.online", "players.max"])
		embedInfo.onlineStatus = data.online
		embedInfo.serverFavicon = data.favicon

		embedInfo.playerMax = embedInfo.onlineStatus ? data.players.max : 0
		embedInfo.playerCount = embedInfo.onlineStatus ? data.players.online : 0

		const embed = new RichEmbed()
		.setTitle("Vanilla Server Status")
		.setColor('GREEN')
		.addField("Status", embedInfo.onlineStatus ? ":white_check_mark: Online" : ":red_circle: Offline")
		.addField("Player Count", `${embedInfo.playerCount}/${embedInfo.playerMax}`)
		.addField("Server IP", embedInfo.serverIP)
		.setFooter(`We're in Beta but would love to have you! — ${moment().format('DD/MM/YY LT')}`, embedInfo.serverFavicon)

		// client.channels.get("612823941941035046").send(embed)

		client.channels.get("612823941941035046").fetchMessage("612836104806334505").then((message) => {
			updateEmbed(message)
		})
	}).catch((error) => {
		console.error(error)
	})
})

function updateEmbed(message) {
	var x = 1
	setInterval(() => {
		message.embeds[0].fields[2].value = x
		message.edit(new RichEmbed(message.embeds[0]))
		x += 1
	}, 1 * 1000);
}

client.login(Secret.token)