const Discord = require("discord.js")
var _this = this;

/*Configuration files*/
const botconfig = require("../botconfig.json");
const config = require("../data/config.json");

/*Data files*/
const colors = require("../data/colors.json");
const meeseek = require("../data/meeseekquote.json");
const roles = require("../data/roles.json");
const songList = require("../data/music.json");

/*Music data files*/
const ytdl = require('ytdl-core');
const queue = new Map();
var musicQueue = "";

var serverLogs;

//server queue vanaf andere classes invoegen
module.exports =
{
excecute: async function(message, bot, serverLogs) { //a function named "execute" that will make sure the song starts playing 
	var args = message.content.split(' '); //split all the arguments given in the message in to different strings
	const serverQueue = queue.get(message.guild.id);

	const voiceChannel = message.member.voiceChannel; //get the voice channle the user that ran the command is in
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!'); //if the user is not in a voice channel return
	const permissions = voiceChannel.permissionsFor(message.client.user); //get the bots permissions
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) { //check if the bot does not have the permissions to join a voice chat and speak in it and if it doesn't do...
		return message.channel.send('I need the permissions to join and speak in your voice channel!'); //tell the user the bot is not allowed to join a voice channel and speak in it.
	}
	if (!args[2]) 
	{
		const keys = Object.keys(songList)
        const randIndex = Math.floor(Math.random() * keys.length)
        const randKey = keys[randIndex]
		const randomSong = songList[randKey]
		
		args[2] = randomSong;
		message.channel.send("You did not specify any song so I added my own song to the queue!")
	}
	
	var songInfo;
	try
	{
	songInfo = await ytdl.getInfo(args[2]); //get information about the song (provided in the form of a url) and put it in a variable
	} catch(err) {

		const keys = Object.keys(meeseek.error)
        const randIndex = Math.floor(Math.random() * keys.length)
        const randKey = keys[randIndex]
        const meeseekQuote = meeseek.error[randKey]
		const embed = new Discord.RichEmbed() //create a new embed builder
            .setColor(colors.red)
            .setTitle(`${meeseekQuote}`)
            .setDescription(`I am not able to find ${args[2]}, make sure the link is a valid youtube url.`)
            .setFooter(`Mr. Meeseeks did not know how to deal with the error...`);
            message.channel.send(embed)
		return;
	}

	const song = { //create a variable and put the song title and link into it
		title: songInfo.title,
		url: songInfo.video_url,
    };
    musicQueue = `${musicQueue} ${song.title}|`; //add the song to our queue updater

	if (!serverQueue) { //if there is no server queue create a new one and put data in it
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

        queue.set(message.guild.id, queueContruct); //set the queue to what we just created
        
		queueContruct.songs.push(song); //get the first song

		try { //try to join the voice channel and run the "play" function
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			this.play(message.guild, queueContruct.songs[0], bot, serverLogs);
			message.channel.send("I started playing music for you!");

			const embed = new Discord.RichEmbed() //create a new embed builder and give it some data to display
				.setColor(colors.cyan)
				.setTimestamp(message.createdAt)
				.setTitle(`I started playing music in ${voiceChannel.name}`)
				.setDescription(`A song has been requested by ${message.member}\nThe song has been requested in ${message.channel}`)
			serverLogs.send(embed);

		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);

		const embed = new Discord.RichEmbed() //create a new embed builder and give it some data to display
				.setColor(colors.cyan)
				.setTimestamp(message.createdAt)
				.setTitle(`I added a song to the queue in ${voiceChannel.name}`)
				.setDescription(`A song has been requested by ${message.member}\nThe song has been requested in ${message.channel}`)
			serverLogs.send(embed);

		return message.channel.send(`*${song.title}* has been added to the queue!`);
	}

},



skip: function (message, bot, serverLogs) 
{
	const serverQueue = queue.get(message.guild.id);

	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');

	serverQueue.connection.dispatcher.end();
	message.channel.send("I skipped the song for you!");

	const embed = new Discord.RichEmbed() //create a new embed builder and give it some data to display
		.setColor(colors.cyan)
		.setTimestamp(message.createdAt)
		.setTitle(`A song has been skipped in ${serverQueue.voiceChannel.name}`)
	serverLogs.send(embed);
},



stop: function (message, bot, serverLogs) 
{
	const serverQueue = queue.get(message.guild.id);

	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (serverQueue == undefined)
	{
		message.channel.send("There is no music playing at the moment")
		return;
	}
	serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
	musicQueue = null;
	message.channel.send("I stopped playing music for you!");

	const embed = new Discord.RichEmbed() //create a new embed builder and give it some data to display
		.setColor(colors.cyan)
		.setTimestamp(message.createdAt)
		.setTitle(`I stopped playing music in ${serverQueue.voiceChannel.name}`)
	serverLogs.send(embed);
},



play: function(guild, song, bot, serverLogs) 
{
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {

            let queueArray = musicQueue.split(`|`) //split the message that has been send into parts
            let queue = queueArray.slice(1);
            let queueList = queue.join('|');
			musicQueue = queueList;
			var now = new Date(); 

			const embed = new Discord.RichEmbed() //create a new embed builder and give it some data to display
				.setColor(colors.cyan)
				.setTimestamp(now)
				.setTitle(`I stopped playing music in ${serverQueue.voiceChannel.name}`)
			serverLogs.send(embed);

			console.log('Music ended!');
			serverQueue.songs.shift();
			this.play(guild, serverQueue.songs[0], bot, serverLogs);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
},

songQueue: function (message)
{
	//Get a random quote from Mr. Meeseeks
	const keys = Object.keys(meeseek.happy)
    const randIndex = Math.floor(Math.random() * keys.length)
    const randKey = keys[randIndex]
	const meeseekQuote = meeseek.happy[randKey]


	//If the queue is empty
	if (musicQueue === null || musicQueue === "")
	{
		const embed = new Discord.RichEmbed()
        .setColor(colors.cyan)
        .setTitle(`${meeseekQuote} The queue is empty`)
        .setDescription(`> Add a new song by typing "${botconfig.prefix}song play <link to youtube video/song>"`)
        .setFooter(`Museek bot at your service!`);
		message.channel.send(embed)
			
		return;
	}
	

	//Get data from the queue and put it in a readable string
    let queueArray = musicQueue.split(`|`)
	let playing = queueArray[0];
    let queue = queueArray.slice(1);
	let queueList = queue.join('\n');

    const embed = new Discord.RichEmbed()
        .setColor(colors.cyan)
        .setTitle(`${meeseekQuote} here is the queue:`)
        .setDescription(`> Now playing: ${playing}\nQueue: \n${queueList}\n`)
        .setFooter(`Museek bot at your service!`);
    message.channel.send(embed)
}
}

module.exports.config = 
{
    name: "song",
    aliases: ["s"],
    usage: "-usage",
    description: "Listen to some nice music in the voice chats",
    accessableby: "Members"
}