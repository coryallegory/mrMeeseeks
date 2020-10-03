const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");

/*Data files*/
const colors = require("../../data/colors.json");
const meeseek = require("../../data/meeseekquote.json");

module.exports.run = async (bot, message, args) => 
{
    // If no argument is given it will print out a predefined quote
    if(!args[0])
    {
        message.channel.send("I'm Mr. Meeseeks! Look at me!");
    }

    // Get a random quote from the all quoted list
    if(args[0] === "quote" || args[0] === "q")
    {
        const keys = Object.keys(meeseek.all)
        const randIndex = Math.floor(Math.random() * keys.length)
        const randKey = keys[randIndex]
        const meeseekQuote = meeseek.all[randKey]
        message.channel.send(`> ${meeseekQuote}`);
    }

}

module.exports.config = 
{
    name: "meeseek",
    aliases: ["mr", "mr.meeseek", "meseek", "mesek"],
    usage: "-usage",
    description: "Get some nice quotes from Mr. Meeseek",
    accessableby: "Members"
}