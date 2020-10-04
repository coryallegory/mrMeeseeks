const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");

/*Data files*/
const colors = require("../../data/colors.json");

const hasRoles = (roles) => roles.length;
const singleRole = roles => roles.length === 1;

const countUsers = (guild) => guild.members.filter((user) => !user.user.bot).size
const countBots = (guild) => guild.members.filter((user) => user.user.bot).size
const getRolesMessage = (guild) => {
    const rolesList = guild.roles
        .filter((role) => role.name !== '@everyone')
        .map(role => role.name);
        
    if(!hasRoles(rolesList)) return `This server don\`t have roles`;
    if(singleRole(rolesList)) return `The only one role is ${rolesList[0]}`;

    const lastRole = rolesList.pop();
    const rolesText = `${rolesList.join(", ")} and ${lastRole}`;
    return `There are ${rolesText} roles in this server`;
}

module.exports.run = async (bot, message, args) => 
{
    let now = new Date()

    let guild = message.channel.guild;

    let name = guild.name;
    let owner = guild.owner;
    let userCount = countUsers(guild);
    let botCount = countBots(guild);
    let rolesMessage = getRolesMessage(guild);

    const embed = new Discord.RichEmbed()
    .setTitle(`Server information`)
    .setTimestamp(now)
    .setColor(colors.orange)
    .addField(`Usercount:`, `The usercount is: ${userCount}`)
    .addField(`Botcount:`, `The botcount is: ${botCount}`)
    .addField(`Guild name:`, `The guild name is: ${name}`)
    .addField(`Guild owner`, `The guild owner is: ${owner}`)
    .addField(`Roles`, rolesMessage);

    message.channel.send(embed);

}

module.exports.config = 
{
    name: "serverinfo",
    aliases: ["servinfo", "servinf", "serverinf", "srvinf", "si"],
    usage: "-usage",
    description: "Get general information about the server",
    accessableby: "Members"
}