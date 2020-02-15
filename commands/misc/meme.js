const Discord = require("discord.js")
const snekfetch = require('snekfetch');

/*Data files*/
const reddit = require("../../data/reddit.json");
const colors = require("../../data/colors.json");
const meeseek = require("../../data/meeseekquote.json");

module.exports.run = async (bot, message, args) => //if the command "meme" has been typed run the code below:
{

    const keys = Object.keys(meeseek.happy) //get all the data from the meeseek json file

        const randIndex = Math.floor(Math.random() * keys.length) //generate a random number with a max size that is equal to the number of keys in the meeseek file

        const randKey = keys[randIndex] //Get a key with that random

        const meeseekQuote = meeseek.happy[randKey] //get the content that corresponds to the key we obatined above

    if(!args[0] || args[0] == "random" || args[0] == "r") //if there are no arguments given do...
    {
        const keys = Object.keys(reddit)

        // Generate random index based on number of keys
        const randIndex = Math.floor(Math.random() * keys.length)

        // Select a key from the array of keys using the random index
        const randKey = keys[randIndex]

        // Use the key to get the corresponding name from the "reddit" object
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
    }
    else
    {
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