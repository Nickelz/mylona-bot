const { Client, RichEmbed} = require("discord.js")
const moment = require("moment")
const request = require("request-promise")
const _ = require("lodash")
const socket = require("socket.io-client")

const Secret = require("./auth.json")

const client = new Client()
var embed

var embedInfo = {
	onlineStatus: false,
	playerCount: -1,
	playerMax: 60,
	serverIP: "us.mineplex.com",
	serverFavicon: ""
}

var options = {
	"url": `https://eu.mc-api.net/v3/server/ping/${embedInfo.serverIP}`,
	"json": true
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)

	client
		.channels
		.get("612823941941035046")
		.fetchMessages({ limit: 10 })
		.then((messages) => {
			if (messages.size > 0) {
				// - EDIT MESSAGE
				updateEmbed(messages.first())
				
			} else {
				// - CREATE NEW MESSAGE
				embed = new RichEmbed()
					.setTitle("Vanilla Server Status")
					.setColor('GREEN')
					.addField("Status", embedInfo.onlineStatus ? ":white_check_mark: Online" : ":red_circle: Offline")
					.addField("Player Count", `${embedInfo.playerCount}/${embedInfo.playerMax}`)
					.addField("Server IP", embedInfo.serverIP)
					.setFooter(`We're in Beta but would love to have you! — ${moment().format('DD/MM/YY LT')}`, embedInfo.serverFavicon)
				
				client
					.channels
					.get("612823941941035046")
					.send(embed)
					.then((message) => {
						updateEmbed(message)
					})
			}
		})
		.catch((error) => {
			console.error(error)
		})
})

function getDataFromAPI(callback) {
	request(options).then((body) => {
		var data = _.pick(body, ["online", "favicon", "players.online", "players.max"]);

		embedInfo.onlineStatus = data.online;
		embedInfo.serverFavicon = data.favicon;
		embedInfo.playerMax = embedInfo.onlineStatus ? data.players.max : 0;
		embedInfo.playerCount = embedInfo.onlineStatus ? data.players.online : 0;

		callback()
	}).catch((error) => {
		console.error(error);
	});
}

function updateEmbed(message) {
	setInterval(() => {
		getDataFromAPI(() => {
			message
				.embeds[0]
				.fields[0]
				.value = embedInfo.onlineStatus ? ":white_check_mark: Online" : ":red_circle: Offline"
	
			message
				.embeds[0]
				.fields[1]
				.value = `${embedInfo.playerCount}/${embedInfo.playerMax}`
	
			message
				.embeds[0]
				.footer
				.text = `We're in Beta but would love to have you! — ${moment().format('DD/MM/YY LT')}`
				
			message
				.embeds[0]
				.footer
				.iconURL = embedInfo.serverFavicon
	
			message.edit(new RichEmbed(message.embeds[0]))
		})
	}, 3 * 1000)
}

client.login(Secret.token)