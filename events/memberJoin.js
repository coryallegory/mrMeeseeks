const Discord = require("discord.js")

/*Configuration files*/
const config = require("../data/config.json");

/*Data files*/
const colors = require("../data/colors.json");

module.exports = {
    logJoin: (bot, member) => {

        let now = new Date();   
        let serverLogs = bot.channels.get(config.serverLogs);

        const embed = new Discord.RichEmbed()
        .setTitle("Member joined")
        .setTimestamp(now)
        .setColor(colors.green)
        .setDescription(`${member} has joined the server`);

        serverLogs.send(embed);
    }

};