const Discord = require('discord.js');

/*Configuration files*/
const botconfig = require('../../botconfig.json');

/*Data files*/
const colors = require('../../data/colors.json');

module.exports.run = async (bot, message, args) => {
  message.channel.send(
    `**:ping_pong: Pong! Your Ping Is:** ${Math.round(bot.ping)}ms`
  );
};

module.exports.config = {
  name: 'ping',
  aliases: [],
  usage: '-usage',
  description: 'Play a game of Ping Pong with the bot',
  accessableby: 'Members',
};
