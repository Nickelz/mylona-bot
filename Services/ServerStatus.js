const { RichEmbed } = require("discord.js")
const moment = require("moment")
const request = require("request-promise")
const _ = require("lodash")

const { client } = require("./../app.js")
const embedInfo = require("./../Objects/EmbedInfo.json")

var embed = null


var options = {
	"url": `https://mcapi.us/server/status?ip=${embedInfo.serverIP}`,
	"json": true
}

client.on('ready', () => {
	console.info(`Server IP: ${options.url}`)

	getDataFromAPI(_.noop)
})

client.on('message', (message) => {
	if (message.content === "!mg") {
		if (message.member.roles.some(role => role.name === "Mylona Staff")) {

			if (embed == null) {
				embed = new RichEmbed()
					.setTitle("Vanilla Server Status")
					.setColor('GREEN')
					.addField("Status", embedInfo.onlineStatus ? ":white_check_mark: Online" : ":red_circle: Offline", true)
					.addField("Player Count", `${embedInfo.playerCount}/${embedInfo.playerMax}`, true)
					.addField("Server IP", embedInfo.serverIP)
					.setFooter(`${embedInfo.motd} — ${moment().format('DD/MM/YY LT')}`, embedInfo.favicon)
			}

			message.channel.send(embed).then((message) => {
				updateEmbed(message)
			}).catch((error) => {
				console.log(`Nope 3 -> ${error}`)
			})

			message.delete()
		}
	}

})

var getDataFromAPI = (callback) => {
	request(options).then((body) => {
		var data = _.pick(body, ["status", "online", "players.now", "players.max", "motd"]);

		embedInfo.onlineStatus = data.online;
		embedInfo.playerMax =  data.players.max
		embedInfo.playerCount = data.players.now
		embedInfo.motd = data.motd

		callback()
	}).catch((error) => {
		console.log("Nope 4")
	})
}

var updateEmbed = (message) => {
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
				.fields[2]
				.value = `${embedInfo.serverIP}`
	
			message
				.embeds[0]
				.footer
				.text = `${embedInfo.motd} — ${moment().format('DD/MM/YY LT')}`
				
			message
				.embeds[0]
				.footer
				.iconURL = embedInfo.favicon
	
			message.edit(new RichEmbed(message.embeds[0]))
		})
	}, 4 * 60 * 1000)
}