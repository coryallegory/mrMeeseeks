const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");

/*Data files*/
const colors = require("../../data/colors.json");
const roles = require("../../data/roles.json");

module.exports.run = async (bot, message, args) => 
{
    const minecraft = bot.emojis.get(`661299075978756126`);
    const fortnite = bot.emojis.get(`661299134539628594`);
    const dst = bot.emojis.get(`661299199224053770`);
    const brawl = bot.emojis.get(`661297789182935065`);
    const rotmg = bot.emojis.get(`672721473294565377`);

    var minecraftRole = message.guild.roles.find(role => role.id === roles.minecraft);
    var fortniteRole = message.guild.roles.find(role => role.id === roles.fortnite);
    var dstRole = message.guild.roles.find(role => role.id === roles.dst);
    var brawlRole = message.guild.roles.find(role => role.id === roles.brawl);
    var rotmgRole = message.guild.roles.find(role => role.id === roles.rotmg);

    const now = new Date();

    const embed = new Discord.RichEmbed()
    .setTitle(`Get your roles here`)
    .setTimestamp(now)
    .setColor(colors.orange)
    .setDescription(`React with ${minecraft} to obtain the ${minecraftRole} role\n\nReact with ${fortnite} to obtain the ${fortniteRole} role\n\nReact with ${dst} to obtain the ${dstRole} role\n\nReact with ${brawl} to obtain the ${brawlRole} role\n\nReat with ${rotmg} to obtain the ${rotmgRole} role`)

    var embedMessage = message.channel.send(embed).then(embedMessage => {
        embedMessage.react(minecraft)
        .then(() => embedMessage.react(fortnite))
        .then(() => embedMessage.react(dst))
        .then(() => embedMessage.react(brawl))
        .then(() => embedMessage.react(rotmg))
        .catch(() => console.error('One of the emojis failed to react to the Battle embed.'));

    });

}

module.exports.config = 
{
    name: "setupemoji",
    aliases: ["sue"],
    usage: "-usage",
    description: "Play a game of Ping Pong with the bot",
    accessableby: "Members"
}