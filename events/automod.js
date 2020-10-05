const Discord = require("discord.js")

/*Configuration files*/
const config = require("../data/config.json");

/*Data files*/
const colors = require("../data/colors.json");

module.exports = {
    automod: (bot, member, message) => {

        // This list should be filled with bad words that a automod should pick up and 
        const forbiddenWords = require("../data/forbiddenwords").default

        // If the message contains a forbiden word this code gets triggered
        if (forbiddenWords.indexOf(message.content) != -1){
            message.delete();

            const embed = new Discord.RichEmbed()
                .setTitle("Warning")
                .setColor(colors.red)
                .setTimestamp(new Date())
                .setDescription(`The message that you tried to send contained a forbiden word.\nPlease make sure to mind your language`);
            member.send(embed);

            console.log(`${member.name} has been warned for posting a forbidden word`);
       }

    }

};