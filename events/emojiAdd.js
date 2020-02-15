const Discord = require("discord.js")

/*Configuration files*/
const config = require("../data/config.json");

/*Data files*/
const colors = require("../data/colors.json");
const roles = require("../data/roles.json");

module.exports = {
    autoEmojiRoles: (bot ,messageReaction, user) => {

        let now = new Date();   
        let message = messageReaction.message;
        let userid = user.id;
        let member = message.guild.members.get(userid);

        const minecraft = bot.emojis.get(`661299075978756126`);
        const fortnite = bot.emojis.get(`661299134539628594`);
        const dst = bot.emojis.get(`661299199224053770`);
        const brawl = bot.emojis.get(`661297789182935065`);
        const rotmg = bot.emojis.get(`672721473294565377`);

        var minecraftRole = message.channel.guild.roles.find(role => role.id === roles.minecraft);
        var fortniteRole = message.channel.guild.roles.find(role => role.id === roles.fortnite);
        var dstRole = message.channel.guild.roles.find(role => role.id === roles.dst);
        var brawlRole = message.channel.guild.roles.find(role => role.id === roles.brawl);
        var rotmgRole = message.channel.guild.roles.find(role => role.id === roles.rotmg);

        /* If the channel id is equal to the channel we want the emoji menu to be in do... */
        if (messageReaction.message.channel.id == "527507103863275540" && user.id!= bot.id)
        {
            /* Minecraft role */
            if (messageReaction.emoji == minecraft)
            {
                addRole(bot, message, member, minecraftRole, user, roles.minecraft);
            }
            /* Fortnite role */
            else if (messageReaction.emoji == fortnite) 
            {
                addRole(bot, message, member, fortniteRole, user, roles.fortnite);
            }
            /* Don't starve together role */
            else if (messageReaction.emoji == dst) 
            {
                addRole(bot, message, member, dstRole, user, roles.dst);
            }
            /* Brawl role */
            else if (messageReaction.emoji == brawl) 
            {
                addRole(bot, message, member, brawlRole, user, roles.brawl);

            }
            /* ROTMG role */
            else if (messageReaction.emoji == rotmg) 
            {
                addRole(bot, message, member, rotmgRole, user, roles.rotmg);
            }
        }

    }

};

/* Function to add the role to the user */
function addRole(bot, message, member, role, user, roleId)
{

    let serverLogs = bot.channels.get(config.serverLogs);

    if (member.roles.has(roleId))
    {
        member.removeRole(roleId);

        //log message, tell user role has been added
        const embed = new Discord.RichEmbed()
        .setTitle("Role removed")
        .setTimestamp(new Date())
        .setColor(colors.red)
        .setDescription(`I removed the ${role} role from you!`);

        message.channel.send(embed).then(m => m.delete(10000));

        const logEmbed = new Discord.RichEmbed()
        .setTitle("Role removed")
        .setTimestamp(new Date())
        .setColor(colors.gray)
        .setDescription(`I removed ${role} from ${user} | ${user.id}`);

        serverLogs.send(logEmbed);
        
    }
    else
    {
        member.addRole(roleId);

        //log message, tell user role has been added
        const embed = new Discord.RichEmbed()
        .setTitle("Role added")
        .setTimestamp(new Date())
        .setColor(colors.green)
        .setDescription(`I added the ${role} role to you!`);

        message.channel.send(embed).then(m => m.delete(10000));

        const logEmbed = new Discord.RichEmbed()
        .setTitle("Role added")
        .setTimestamp(new Date())
        .setColor(colors.gray)
        .setDescription(`I added ${role} to ${user} | ${user.id}`);

        serverLogs.send(logEmbed);
    }

}