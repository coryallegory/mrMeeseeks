const Discord = require("discord.js")

//configuration files
const botconfig = require("../../botconfig.json");

//data files
const colors = require("../../data/colors.json");
const channels = require("../../data/channels.json");
const roles = require("../../data/roles.json");

module.exports.run = async (bot, message, args) => 
{
    //check if the user has the right permissions to use the command
    if(!message.member.roles.find(r => r.id === roles.moderator))
	{ 
		return;
    }
    
    if (!args[0])
    {
        message.channel.send(`> Please provide a action and a channel number.`);
        return;
    }



    if (args[0] === "open" || args[0] === "o" || args[0] === "unlock" || args[0] === "ul")
    {
        if (!args[1])
        {
            message.channel.send(`> Please provide a channel number.`);
            return;
        }
        if (args[1] === "1")
        {
            var voiceChat = bot.channels.get(channels.raiding1);
            var permissions = voiceChat.permissionsFor(roles.rotmg);

            if (permissions.has('CONNECT'))
            {
                return message.channel.send(`> The channel is already unlocked`)
            }

            await voiceChat.overwritePermissions(roles.rotmg, { CONNECT: true });
            await voiceChat.setName(`${voiceChat.name} >> Opened`);

            var channel = message.guild.channels.get(channels.raiding1).toString();
            message.channel.send(`> "${channel}" is now unlocked.`);
            return;
        }

        else
        {
            try
            {
                var voiceChat = bot.channels.get(args[1]);
                var permissions = voiceChat.permissionsFor(roles.rotmg);

                if (permissions.has('CONNECT'))
                {
                    return message.channel.send(`> The channel is already unlocked`)
                }

                voiceChat.overwritePermissions(roles.rotmg, { CONNECT: true });

                var channel = message.guild.channels.get(channels.raiding1).toString();
                message.channel.send(`> "${channel}" is now unlocked.`);

            } catch(err)
            {
                console.log(err);
                message.channel.send("> I could not find that channel, make sure you coppied the right id.")
            }

        }

    }

    if (args[0] === "close" || args[0] === "lock" || args[0] === "l" || args[0] === "c")
    {
        if (!args[1])
        {
            message.channel.send(`> Please provide a channel number.`);
            return;
        }
        if (args[1] === "1")
        {
            var voiceChat = bot.channels.get(channels.raiding1);
            var permissions = voiceChat.permissionsFor(roles.rotmg);

            if (!permissions.has('CONNECT'))
            {
                return message.channel.send(`> The channel is already locked`)
            }

            await voiceChat.overwritePermissions(roles.rotmg, { CONNECT: false });
            await voiceChat.setName("Raiding-1");

            var channel = message.guild.channels.get(channels.raiding1).toString();
            message.channel.send(`> "${channel}" is now locked.`);
            return;
        }

        else
        {
            try
            {
                var voiceChat = bot.channels.get(args[1]);
                var permissions = voiceChat.permissionsFor(roles.rotmg);

                if (!permissions.has('CONNECT'))
                {
                    return message.channel.send(`> The channel is already locked`)
                }

                await voiceChat.overwritePermissions(roles.rotmg, { CONNECT: false }); //check if await solves the name does not get changed problem
                await voiceChat.setName(`${voiceChat.name.split(` `).first}`);

                var channel = message.guild.channels.get(channels.raiding1).toString();
                message.channel.send(`> "${channel}" is now locked.`);

            } catch(err)
            {
                console.log(err);
                message.channel.send("> I could not find that channel, make sure you coppied the right id.")
            }

        }

    }
    //channel.overwritePermissions(channel.guild.defaultRole, { VIEW_CHANNEL: false });

}

module.exports.config = 
{
    name: "vc",
    aliases: [],
    usage: "-usage",
    description: "Play a game of Ping Pong with the bot",
    accessableby: "Members"
}