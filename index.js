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
const emojiAdd = require("./events/emojiAdd.js");
const automod = require("./events/automod.js");


const bot = new Discord.Client({disableEveryone: true}); //create a new client that is the bot

/* Log that the bot is online and set it's status */
bot.on("ready", async () => {
    let now = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
    console.log(`[${now}] ${bot.user.username} is online`)
    bot.user.setActivity("WUBBA LUBBA DUB DUB", {type: "WATCHING"});
})

bot.commands = new Discord.Collection(); // Collection for all commands
bot.aliases = new Discord.Collection(); // Collection for all aliases of every command


/* Create a list of all the subfolders that our commands will be in*/
const modules = ['misc', 'moderation', `setup`, `music`];

/* Command getter */
modules.forEach(c => {
    fs.readdir(`./commands/${c}`, (err, files) => { //get all files in the "commands" folder

        if (err) console.log(err) //if there is an error, log it in the console

        let jsfile = files.filter(f => f.split(".").pop() === "js") //filer all the files to only get the javascript files
        if(jsfile.length <= 0){ //if there are no files found log in the console that no files (containing commands) have been found
            return console.log("[LOG] Couldn't find commands!");
        }

        jsfile.forEach((f, i) => { //Get all the javascript files and load them in so that their commands can be used
            let pull = require(`./commands/${c}/${f}`);
            bot.commands.set(pull.config.name, pull);
            pull.config.aliases.forEach(alias => {
                bot.aliases.set(alias, pull.config.name)
            });

        });

    });

});

/* CommandFile excecutor */
bot.on("message", async message => //if the bot sees a message (this can be in any text channel the bot has access to) do...
{
    
    if(message.author.bot || message.channel.type === "dm") return; //if the message was send in a direct / private message or if the message was send by the bot, return.

    let prefix = botconfig.prefix; //create a variable called prefix and assign the bots prefix to it

    let messageArray = message.content.split(" ") //split the message that has been send into parts
    let cmd = messageArray[0]; //get the first part and name it "cmd"
    let args = messageArray.slice(1); //get the message array minus the first index to remove the command from it

    if(message.isMemberMentioned(bot.user))
    {
        const keys = Object.keys(meeseek.uncomfortable)

        const randIndex = Math.floor(Math.random() * keys.length)

        const randKey = keys[randIndex]

        const meeseekQuote = meeseek.uncomfortable[randKey]
        message.channel.send(`> ${meeseekQuote}`);
    }

    if(!message.content.startsWith(prefix))
    {
        automod.automod(bot, message.author, message);
        return; //if the message does not start with the predefined prefix, stop the code
    }
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length))) //check if there is a command with the name that comes after the prefix, if so the code below will run the code in the file that corresponds to that command
    if (commandfile) commandfile.run(bot, message, args)
    else if (!commandfile) message.channel.send(`I am not able to find that command. Use "${prefix}help" to get a list of all commands.`)

});

bot.on("guildMemberRemove", function(member) /* A member has been kicked or left the Discord server */
{
    memberLeave.logLeave(bot, member)
});

bot.on("guildMemberAdd", function(member) /* A member has joined the Discord server */
{ 
    memberJoin.logJoin(bot, member); 
});

bot.on('messageReactionAdd', (reaction, user) => {
    emojiAdd.autoEmojiRoles(bot, reaction, user);
});
 
// bot.on('messageReactionRemove', (reaction, user) => {
//     console.log('a reaction has been removed');
// });

bot.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = bot.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
        }

    });

});



/* Log the bot in by using its token */
bot.login(botconfig.token);