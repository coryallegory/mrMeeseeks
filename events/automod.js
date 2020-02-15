const Discord = require("discord.js")

/*Configuration files*/
const config = require("../data/config.json");

/*Data files*/
const colors = require("../data/colors.json");

module.exports = {
    automod: (bot, member, message) => {

        const forbidenWords = ['fuck', 'fck', 'fock', 'feck',
        'kanker', 'kk', 'knker', 'kankr', 'kkr', 'cancer',
        'idiot', 'shithead', 'shit', 'kakhoofd'];

        if (forbidenWords.indexOf(message.content) != -1){
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