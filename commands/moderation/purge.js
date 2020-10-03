const Discord = require("discord.js");
const ms = require("ms");
const date = require('date-and-time');

/*Configuration files*/
const botconfig = require("../../botconfig.json");
const config = require("../../data/config.json");

/*Data files*/
const rolesconfig = require("../../data/roles.json");
const colors = require("../../data/colors.json");
const roles = require("../../data/roles.json");

var error;

module.exports.run = async (bot, message, args) => 
{
    // Get the logging channel
    serverLogs = bot.channels.get(config.serverLogs);

    // If the member who used the command does not have the moderator role the code will not be ran
    if(!message.member.roles.find(r => r.id === roles.moderator)) return;



    if(!args[0]) return message.channel.send("Please provide a input.");

    var purgeAmount = parseInt(args[0]);
    if (purgeAmount === null || purgeAmount <= 0 || purgeAmount >= 100) return message.channel.send("Please provide a valid input that is higher than 0 but lower than 100.");

    message.delete();

    var fetched = await message.channel.fetchMessages({limit: purgeAmount});
    message.channel.bulkDelete(fetched)
    .catch(APIerror => error = APIerror)
    if (error) {
        console.log(error);

        const embed = new Discord.RichEmbed() //create a new embed builder
            .setColor(colors.red)
            .setTimestamp(message.createdAt)
            .setTitle(`WARNING! Purge failed in ${message.channel.name}`)
            .setDescription(`I failed to complete a purge in ${message.channel}...\n\nPlease check the console if you believe this is a bug.`)
            .addField("Purge requested by", `${message.member} | ${message.member.id}`)
            .setFooter(`Mr. Meeseeks did not know how to deal with the error...`);
        serverLogs.send(embed);
    } else {
        const embed = new Discord.RichEmbed() //create a new embed builder
            .setColor(colors.green)
            .setTimestamp(message.createdAt)
            .setTitle(`Purge completed in ${message.channel.name}`)
            .setDescription(`I purged ${purgeAmount} messages in ${message.channel}.`)
            .addField("Purge requested by", `${message.member} | ${message.member.id}`)
            .setFooter(`Mr. Meeseeks will now stop existing... **POOF**`);
        serverLogs.send(embed);
    }
        
    message.channel.send("Purge completed, deleted " + purgeAmount + " messages including the command.").then(m => m.delete(5000));
    let now = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
    console.log(`[${now}] A purge has been done in ${message.channel.name}, deleted ${purgeAmount} message(s).`)


}

module.exports.config = 
{
    name: "purge",
    aliases: [],
    usage: "-usage",
    description: "Purge a x amount of messages in a chat",
    accessableby: `${rolesconfig.mod}`
}