const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");

/*Data files*/
const colors = require("../../data/colors.json");

module.exports.run = async (bot, message, args) => 
{
    let now = new Date()

    let guild = message.channel.guild;

    let userCount = guild.memberCount;
    let name = guild.name;
    let owner = guild.owner;
    let roles = guild.roles.size;

    const embed = new Discord.RichEmbed()
    .setTitle(`Server information`)
    .setTimestamp(now)
    .setColor(colors.orange)
    .addField(`Usercount:`, `The usercount is: ${userCount}`)
    .addField(`Guild name:`, `The guild name is: ${name}`)
    .addField(`Guild owner`, `The guild owner is: ${owner}`)
    .addField(`Roles`, `There are ${roles} roles in this server`);

    message.channel.send(embed);

}

module.exports.config = 
{
    name: "serverinfo",
    aliases: ["servinfo", "servinf", "serverinf", "srvinf", "si"],
    usage: "-usage",
    description: "Play a game of Ping Pong with the bot",
    accessableby: "Members"
}