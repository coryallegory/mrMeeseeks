const Discord = require("discord.js");
const fs = require('fs');
const date = require('date-and-time');

//configuration files
const botconfig = require("./botconfig.json");

//data files
const colors = require("./data/colors.json");
const meeseek = require("./data/meeseekquote.json");

//Event files
const memberLeave = require("./events/memberLeave.js");
const memberJoin = require("./events/memberJoin.js");
const automod = require("./events/automod.js");


const bot = new Discord.Client({disableEveryone: true}); //create a new client that is the bot

// Once the bot is online, log it and set its activity
bot.on("ready", async () => {
    let now = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
    console.log(`[${now}] ${bot.user.username} is online`)
    bot.user.setActivity("WUBBA LUBBA DUB DUB", {type: "WATCHING"});
})

bot.commands = new Discord.Collection(); // Collection for all commands
bot.aliases = new Discord.Collection(); // Collection for all aliases of every command


// These are all the folders in the 'commands' folder, these folders are the ones containing all the actual commands
const modules = ['misc', 'moderation'];

// This piece loops through every folder containing commands and loads registers them so that they will work when the command is used
modules.forEach(c => {
    fs.readdir(`./commands/${c}`, (err, files) => {

        if (err) console.log(err)

        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if(jsfile.length <= 0){
            return console.log("[LOG] Couldn't find commands!");
        }

        jsfile.forEach((f, i) => {
            let pull = require(`./commands/${c}/${f}`);
            bot.commands.set(pull.config.name, pull);
            pull.config.aliases.forEach(alias => {
                bot.aliases.set(alias, pull.config.name)
            });

        });

    });

});

// If a message is being send check if it was a command and if so run that command. Other things like a automod are also placed in here
bot.on("message", async message => {
    
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = botconfig.prefix;

    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) {
        automod.automod(bot, message.author, message);
        return;
    }
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if (commandfile) commandfile.run(bot, message, args)
    else if (!commandfile) message.channel.send(`I am not able to find that command. Use "${prefix}help" to get a list of all commands.`)

});

// Runs if a member gets kicked or left the server
bot.on("guildMemberRemove", function(member) {
    memberLeave.logLeave(bot, member)
});

// Runs if a member joins the server
bot.on("guildMemberAdd", function(member) {
    memberJoin.logJoin(bot, member); 
});

// Use the auth code to login the bot
bot.login(botconfig.token);