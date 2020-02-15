const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");

/*Data files*/
const colors = require("../../data/colors.json");
const meeseek = require("../../data/meeseekquote.json");

module.exports.run = async (bot, message, args) => 
{
    if(!args[0])
    {
        message.channel.send("I'm Mr. Meeseeks! Look at me!");
    }

    if(args[0] === "quote" || args[0] === "q")
    {
        const keys = Object.keys(meeseek.all)

        // Generate random index based on number of keys
        const randIndex = Math.floor(Math.random() * keys.length)

        // Select a key from the array of keys using the random index
        const randKey = keys[randIndex]

        // Use the key to get the corresponding name from the "reddit" object
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