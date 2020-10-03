const Discord = require("discord.js")
const snekfetch = require('snekfetch');

/*Data files*/
const reddit = require("../../data/reddit.json");
const colors = require("../../data/colors.json");
const meeseek = require("../../data/meeseekquote.json");

module.exports.run = async (bot, message, args) =>
{

    // Get a random Mr. Meeseeks quote from the happy quotes list
    const keys = Object.keys(meeseek.happy)
    const randIndex = Math.floor(Math.random() * keys.length)
    const randKey = keys[randIndex]
    const meeseekQuote = meeseek.happy[randKey]

    // If no argument is given, print out a post from a random subreddit
    if(!args[0] || args[0] == "random" || args[0] == "r") {
        // Get a random subreddit
        const keys = Object.keys(reddit)
        const randIndex = Math.floor(Math.random() * keys.length)
        const randKey = keys[randIndex]
        const subReddit = reddit[randKey]

        try { //try to get a random post from the randomly chosen subreddit, put it in a embed and send it
            const { body } = await snekfetch
                .get(`https://www.reddit.com/r/${subReddit}.json?sort=top&t=week`)
                .query({ limit: 800 });
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return sendErrorMessage(message);
            const randomnumber = Math.floor(Math.random() * allowed.length)
            const embed = new Discord.RichEmbed()
            .setColor(colors.cyan)
            .setTitle(`${meeseekQuote} Here is a random meme\n ${allowed[randomnumber].data.title}`)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .setFooter(`Memes provided by r/${subReddit}`)
            message.channel.send(embed)
        } catch (err) { //if the above code did not work, log the error in the console
            return console.log(err);
        }
    } else {
        // A argument was given, it will print out a post from the specified subreddit
        try {
            const { body } = await snekfetch
                .get(`https://www.reddit.com/r/${args[0]}.json?sort=top&t=week`)
                .query({ limit: 800 });
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return sendErrorMessage(message);
            const randomnumber = Math.floor(Math.random() * allowed.length)
            const embed = new Discord.RichEmbed()
            .setColor(colors.cyan)
            .setTitle(`${meeseekQuote} Here is a random meme\n ${allowed[randomnumber].data.title}`)
            .setDescription("Posted by: " + allowed[randomnumber].data.author)
            .setImage(allowed[randomnumber].data.url)
            .setFooter(`Memes provided by r/${args[0]}`)
            message.channel.send(embed)
        } catch (err) {
            return console.log(err);
        }

    }

}

function sendErrorMessage(message)
{
    const keys = Object.keys(meeseek.error)
        const randIndex = Math.floor(Math.random() * keys.length)
        const randKey = keys[randIndex]
        const meeseekQuote = meeseek.error[randKey]
	const embed = new Discord.RichEmbed() //create a new embed builder
        .setColor(colors.red)
        .setTitle(`${meeseekQuote}`)
        .setDescription(`I am not able to find anything to post. Make sure the content is not NSFW and the subreddit is valid.`)
        .setFooter(`Mr. Meeseeks did not know how to deal with the error...`);
    message.channel.send(embed)
}

module.exports.config = 
{
    name: "plox",
    aliases: ["plz"],
    usage: "-usage",
    description: "Send memes",
    accessableby: "Members"
}