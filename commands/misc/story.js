const Discord = require("discord.js")

/*Configuration files*/
const botconfig = require("../../botconfig.json");

/*Data files*/
const colors = require("../../data/colors.json");
const story = require("../../data/story.json");
const config = require("../../data/config.json");

/*Emojis*/
const emojiOne = `1️⃣`;
const emojiTwo = `2️⃣`;

module.exports.run = async (bot, message, args) =>
{
    if (config.story == "off")
    {
        message.channel.send("This command has been disabled.");
        return;
    }
    message.delete(); //delete the command

    const embed = new Discord.RichEmbed() //create a new embed builder and give it some data to display
        .setColor(colors.cyan)
        .setTitle("It is story time!")
        .setDescription("Are you ready for a story?")
        .addField("Ready?", "React with :one: if you are ready")
        .addField("Not ready?", "React with :two: if you are not ready")
    message.channel.send(embed).then(embedMessage => { //send the embed and react with 2 emojis to it
        embedMessage.react(emojiOne)
        .then(() => embedMessage.react(emojiTwo))

        const filterOne = (reaction, user) => { //create a filter that will only get one of the emoji reactions to the message from the user that ran the command
            return reaction.emoji.name === emojiOne && user.id === message.author.id;
        };
        const filterTwo = (reaction, user) => {
            return reaction.emoji.name === emojiTwo && user.id === message.author.id;
        };
        
        embedMessage.awaitReactions(filterOne, { max: 1}) //if the filter found a user set the stage, set the choice, delete the embed message and run a function
        .then(collected => {
            cstage = 1;
            let choice;
            storyStart(message, cstage, choice)
            embedMessage.delete();
        });

        embedMessage.awaitReactions(filterTwo, { max: 1}) //the user has decided to not want any story time, removing the embed message
        .then(collected => {
            message.channel.send("> No storytime... Big sad")
            embedMessage.delete();
        });

    });

}

function storyStart(message, cstage, choice) //funcation named storyStart using recursion
{
    var stage; //create a variable to put a part of the story in
    console.log(`stage: ${cstage}, choice: ${choice}`) //log the stage and choice made by the user in the console
    if(cstage == 9) {storyEnd(message); return;} //check what stage the story is in and retrieve data/run specific code that corresponds to the current stage
    if(cstage == 8 && choice == 1) {stage = story.stage81;}
    if(cstage == 8 && choice == 2) {stage = story.stage82;}
    if(cstage == 7 && choice == 1) {stage = story.stage71;}
    if(cstage == 7 && choice == 2) {stage = story.stage72;}
    if(cstage == 6 && choice == 1) {stage = story.stage61;}
    if(cstage == 6 && choice == 2) {stage = story.stage62;}
    if(cstage == 5 && choice == 1) {stage = story.stage51;}
    if(cstage == 5 && choice == 2) {stage = story.stage52;}
    if(cstage == 4 && choice == 1) {stage = story.stage41;}
    if(cstage == 4 && choice == 2) {stage = story.stage42;}
    if(cstage == 3 && choice == 1) {stage = story.stage31;}
    if(cstage == 3 && choice == 2) {stage = story.stage32;}
    if(cstage == 2 && choice == 1) {stage = story.stage21;}
    if(cstage == 2 && choice == 2) {stage = story.stage22;}
    if(cstage == 1) {stage = story.stage1;}
    let choice1Title = stage.choice1Title; //get the titles and choises that correspond to the current stage
    let choice2Title = stage.choice2Title;
    let choice1 = stage.choice1;
    let choice2 = stage.choice2;

    const embed = new Discord.RichEmbed() //create a new embed builder and but the above retrieved data in it
        .setColor(colors.cyan)
        .setTitle("The great adventure!")
        .setDescription(stage.title)
        .addField(choice1Title, choice1)
        .addField(choice2Title, choice2)
    message.channel.send(embed).then(embedMessage => { //react with 2 emojis to it to create a menu out of it
        embedMessage.react(emojiOne)
        .then(() => embedMessage.react(emojiTwo));

        const filterOne = (reaction, user) => { //create a filter that only triggers if the emoji is one of the predefined and the user is the person who ran the command
            return reaction.emoji.name === emojiOne && user.id === message.author.id;
        };
        const filterTwo = (reaction, user) => {
            return reaction.emoji.name === emojiTwo && user.id === message.author.id;
        };
        
        embedMessage.awaitReactions(filterOne, { max: 1}) //if the filter got triggered, do...
        .then(collected => {
            choice = 1;
            cstage += 1;
            storyStart(message, cstage, choice);
            embedMessage.delete();
        });

        embedMessage.awaitReactions(filterTwo, { max: 1})
        .then(collected => {
            choice = 2;
            cstage += 1;
            storyStart(message, cstage, choice);
            embedMessage.delete();
        });

    });

}
function storyEnd(message) //function named storyEnd
{
    const embed = new Discord.RichEmbed() //create a new embed message and put data in it
        .setColor(colors.cyan)
        .setTitle("All done!")
        .setDescription("Congratulations, you've made it to the end of the story.\nI hope you liked it.")
    message.channel.send(embed).then(m => m.delete(5000)); //send the embed and delete it after 5000 miliseconds
    //return;
}

module.exports.config = 
{
    name: "story",
    aliases: [],
    usage: "-usage",
    description: "Story time",
    accessableby: "Members"
}