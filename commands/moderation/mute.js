const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");
const config = require("../../data/config.json");

/*Data files*/
const colors = require("../../data/colors.json");
const roles = require("../../data/roles.json");

module.exports.run = async (bot, message, args) => 
{

    if(!message.member.roles.find(r => r.id === roles.moderator))
    {
        return;
    }

    var userMute = message.guild.members.get(args[0]);

    if (!userMute)
    {
        message.channel.send(`Please give a valid user input in the form of a user id.`);
        return;
    }
    if (!args[1])
    {
        message.channel.send(`Please give a reason to mute`);
        return;
    }
    if (!args[0] == message.mentions.first)
    {
        message.channel.send(`The user you want to mute should be your first argument`);
        return;
    }

    let modLogs = bot.channels.get(config.modLogs);
    let serverLogs = bot.channels.get(config.serverLogs);
    let messageArray = message.content.split(" ") //split the message that has been send into parts
    let reason = messageArray.slice(2);
    let muteRole = message.channel.guild.roles.find(role => role.id === roles.muted);

    userMute.addRole(muteRole);

    message.channel.send(`User ${userMute} has been muted.`);

    const embedLog = new Discord.RichEmbed()
    .setTitle(`A user has been muted`)
    .setColor(colors.gray)
    .setTimestamp(new Date())
    .setDescription(`The user ${userMute} has been muted by ${message.author}.\n\nMute reason: ${reason}`);

    modLogs.send(embedLog);

    const roleLog = new Discord.RichEmbed()
    .setTitle(`Mute role added`)
    .setColor(colors.gray)
    .setTimestamp(new Date())
    .setDescription(`${muteRole} has been given to ${userMute}`);

    serverLogs.send(roleLog);

}

module.exports.config = 
{
    name: "mute",
    aliases: [],
    usage: "-usage",
    description: "Mute someone",
    accessableby: "Moderators"
}