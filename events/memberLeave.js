const Discord = require("discord.js")

/*Configuration files*/
const config = require("../data/config.json");

/*Data files*/
const colors = require("../data/colors.json");

module.exports = {
    logLeave: (bot, member) => {

        var now = new Date();   
        serverLogs = bot.channels.get(config.serverLogs);

        const embed = new Discord.RichEmbed()
        .setTitle("Member left")
        .setTimestamp(now)
        .setColor(colors.red)
        .setDescription(`${member} has left the server or has been kicked`);

        serverLogs.send(embed);
    }

};