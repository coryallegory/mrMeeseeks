const Discord = require("discord.js")

//configuration files
const botconfig = require("../../botconfig.json");
const config = require("../../data/config.json");

//data files
const colors = require("../../data/colors.json");
const roles = require("../../data/roles.json");

module.exports.run = async (bot, message, args) => 
{

    if(!args[0] && message.member.roles.find(r => r.id === roles.moderator))
	{ 
        message.channel.send(`> For a list of all mod commands use ${botconfig.prefix}help staff.`);
    }

    if(!args[0])
    {

        var helpString = `Here are some commands that I know:\n> ${botconfig.prefix}plox [subreddit/random] **Mr.Meeseek will give you a random post from that subreddit**\n\n> ${botconfig.prefix}meeseek <quote> **I will quote my friends**\n\n> ${botconfig.prefix}song play [Youtube link] **Start playing music in the voice chat**\n\n> ${botconfig.prefix}song stop **Stop the music in the voice chat**\n\n> ${botconfig.prefix}song skip **Skip the song that you are currently listening to**\n\n> ${botconfig.prefix}song queue **Get the queue of songs**\n\n\> ${botconfig.prefix}battle **Battle against Mr. Meeseeks**`;
        if (config.story == "on")
        {
        helpString = helpString + `\n\n> ${botconfig.prefix}story **STORY TIME!!! Mr.Meeseek will tell you a nice little bedtime story**`;
        }
        const embed = new Discord.RichEmbed()
        .setColor(colors.cyan)
        .setTitle("Ooh, yeah! Can do!")
        .setDescription(helpString)
        .setFooter("Everything between <> is optional, everything between [] should be filled in by the user");
        message.channel.send(embed)
    }
    //help for each command

    if (args[0] == "song" || args[0] == "music")
    {
        const embed = new Discord.RichEmbed()
        .setColor(colors.cyan)
        .setTitle("Need help for music? Ooh, yeah! Can do!")
        .setDescription(`Here is how it works:\n> ${botconfig.prefix}song play [Youtube link] **[Youtube link] should be replaced with a link to a youtube video and I will start playing it in the voice chat!**\n\n> ${botconfig.prefix}song stop **I will stop playing music in the voice chat and I will clear the queue**\n\n> ${botconfig.prefix}song skip **Skip the song that you are currently listening to**\n\n> ${botconfig.prefix}song queue **Get the queue of songs**`)
        .setFooter("Everything between <> is optional, everything between [] should be filled in by the user");
        message.channel.send(embed)
    }

    if (args[0] == "reddit" || args[0] == "meme" || args[0] == "memes")
    {
        const embed = new Discord.RichEmbed()
        .setColor(colors.cyan)
        .setTitle("Need help to get memes? WUBBA LUBBA DAB DAB!")
        .setDescription(`Here is how it works:\n> ${botconfig.prefix}plox <subreddit> **<subreddit> could be replaced with a subreddit of your choice, or simply type "${botconfig.prefix}plox" to get a random post from a random subreddit**`)
        .setFooter("Everything between <> is optional, everything between [] should be filled in by the user");
        message.channel.send(embed)
    }


    //staff section
    if (args[0] === "staff")
    {
        if(!message.member.roles.find(r => r.id === roles.moderator))
	    { 
            return;
        }

        const embed = new Discord.RichEmbed()
        .setColor(colors.cyan)
        .setTitle("Want to know the staff commands?")
        .setDescription(`Here is a list of all staff commands:\n> ${botconfig.prefix}vc [lock/unlock] [channel number/channel id] **This will unlock the specified channel**\n\n> ${botconfig.prefix}purge [purge amount] **This will purge a x amount of messages in the chat**\n\n> ${botconfig.prefix}userinfo <id/mention>`)
        .setFooter("Everything between <> is optional, everything between [] should be filled in by the user");
        message.channel.send(embed)
    }

}

module.exports.config = 
{
    name: "help",
    aliases: ["h", "?"],
    usage: "-usage",
    description: "Get a list of all the commands",
    accessableby: "Members"
}