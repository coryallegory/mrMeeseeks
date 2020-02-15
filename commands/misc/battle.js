const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");

/*Data files */
const colors = require("../../data/colors.json");

/*Emojis*/
const emojiOne = `1️⃣`; //create 4 variables containing the emojis that are used for the embed menu
const emojiTwo = `2️⃣`;
const emojiThree = `3️⃣`;
const emojiFour = `4️⃣`;

/*Hp*/
var enemyHP = 100;
var yourHP = 100;

module.exports.run = async (bot, message, args) => 
{

    if(!args[0])
    {
        sendMessage(message);
    }

}

function sendMessage(message, embedMessage)
{
    if (enemyHP <= 0 || yourHP <= 0) { return; }

    const embed = new Discord.RichEmbed() //create a new embed message and put data in it
        .setColor(colors.cyan)
        .setTitle("Battle!")
        .setDescription(`Enemy: Meeseek\n${enemyHP}/100\nYou: Rick\n${yourHP}/100\n\nWhat attack will you use?`)
        .addField("WUBBA LUBBA DUB DUB", `React with ${emojiOne} to use WUBBA LUBBA DUB DUB`)
        .addField("Swifty", `React with ${emojiTwo} to get swifty`)
        .addField("Rickify", `React with ${emojiThree} to Rickify your enemy`)
        .addField("Bird person", `React with ${emojiFour} to use Bird Person Attack`)
    var embedMessage = message.channel.send(embed).then(embedMessage => {
        embedMessage.react(emojiOne)
        .then(() => embedMessage.react(emojiTwo))
        .then(() => embedMessage.react(emojiThree))
        .then(() => embedMessage.react(emojiFour))
        .catch(() => console.error('One of the emojis failed to react to the Battle embed.'));
        const filterOne = (reaction, user) => { //create a filter that only triggers if the emoji is one of the predefined and the user is the person who ran the command
            return reaction.emoji.name === emojiOne && user.id === message.author.id;
        };
        const filterTwo = (reaction, user) => {
            return reaction.emoji.name === emojiTwo && user.id === message.author.id;
        };
        const filterThree = (reaction, user) => {
            return reaction.emoji.name === emojiThree && user.id === message.author.id;
        };
        const filterFour = (reaction, user) => {
            return reaction.emoji.name === emojiFour && user.id === message.author.id;
        };

        embedMessage.awaitReactions(filterOne, { max: 1}) //if the filter got triggered, do...
        .then(collected => {
            var multiplier = 10;
            var attackName = "WUBBA LUBBA DUB DUB";
            embedMessage.delete();
            runSimulation(message, embedMessage, multiplier, attackName);
        });
        embedMessage.awaitReactions(filterTwo, { max: 1})
        .then(collected => {
            var multiplier = 15;
            var attackName = "Swifty";
            embedMessage.delete();
            runSimulation(message, embedMessage, multiplier, attackName);
        });
        embedMessage.awaitReactions(filterThree, { max: 1})
        .then(collected => {
            var multiplier = 20;
            var attackName = "Rickify";
            embedMessage.delete();
            runSimulation(message, embedMessage, multiplier, attackName);
        });
        embedMessage.awaitReactions(filterFour, { max: 1})
        .then(collected => {
            var multiplier = 13;
            var attackName = "Bird person"
            embedMessage.delete();
            runSimulation(message, embedMessage, multiplier, attackName);
        });

    });
}

function runSimulation(message, embedMessage, multiplier, attackName)
{
    // const keysAttack = Object.keys(attack.attack)
    // const randIndexAttack = Math.floor(Math.random() * keysAttack.length)
    // const randKeyAttack = keysAttack[randIndexAttack]
    // const attackQuote = attack.attack[randKeyAttack]

    var attackDMG = Math.floor(Math.random() * multiplier);
    var defenceDMG = Math.floor(Math.random() * 15);

    enemyHP = enemyHP - attackDMG;
    yourHP = yourHP - defenceDMG;

    if (enemyHP <= 0) { enemyFaint(message, yourHP, attackName, attackDMG, defenceDMG); return; }
    if (yourHP <= 0) { playerFaint(message, enemyHP, attackName, attackDMG, defenceDMG); return; }

    // const keysHit = Object.keys(attack.takeHit)
    // const randIndexHit = Math.floor(Math.random() * keysHit.length)
    // const randKeyHit = keysHit[randIndexHit]
    // const hitQuote = attack.takeHit[randKeyHit]

    const embed = new Discord.RichEmbed() //create a new embed message and put data in it
        .setColor(colors.orange)
        .setTitle("Battle stats")
        .setDescription(`Here are the stats for your last move`)
        .addField("You", `You used ${attackName} and dealth ${attackDMG} damage by using it`)
        .addField("Mr. Meeseek", `Mr. Meeseeks used his Meeseek power to deal ${defenceDMG} damage`)
    var battleEmbedMessage = message.channel.send(embed).then(m => m.delete(10000));

    sendMessage(message, embedMessage, battleEmbedMessage);

}

function enemyFaint(message, yourHP, attackName, attackDMG, defenceDMG)
{
    const embed = new Discord.RichEmbed() //create a new embed message and put data in it
        .setColor(colors.orange)
        .setTitle("Rick you did it! The enemy has fainted!")
        .setDescription(`Here are the stats for your last move`)
        .addField("HP", `You still had ${yourHP} left, whilst your enemy has 0 hp left`)
        .addField("You", `You used ${attackName} and dealth ${attackDMG} damage by using it`)
        .addField("Mr. Meeseek", `Mr. Meeseeks used his Meeseek power to deal ${defenceDMG} damage`)
    message.channel.send(embed);
}
function playerFaint(message, enemyHP, attackName, attackDMG, defenceDMG)
{
    const embed = new Discord.RichEmbed() //create a new embed message and put data in it
        .setColor(colors.orange)
        .setTitle("You got destroyed by Mr. Meeseeks!")
        .setDescription(`Here are the stats for your last move`)
        .addField("HP", `You had 0 hp left, whilst your enemy still has ${enemyHP} hp left`)
        .addField("You", `You used ${attackName} and dealth ${attackDMG} damage by using it`)
        .addField("Mr. Meeseek", `Mr. Meeseeks used his Meeseek power to deal ${defenceDMG} damage`)
    message.channel.send(embed);
}

module.exports.config = 
{
    name: "battle",
    aliases: [],
    usage: "-usage",
    description: "Play a game of Ping Pong with the bot",
    accessableby: "Members"
}