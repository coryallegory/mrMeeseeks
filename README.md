# Mr. Meeseeks
Welcome to the Mr. Meeseeks repo, this project started out as a school project but has been used as a moderating bot for quite some time after on a Discord server. 
We are currently working on a new Discord bot so this one is no longer needed hence I made it open source for Hacktoberfest.

### Things you should know before you get started:
This project has been modified for Hacktoberfest to have issues that are beginner friendly so that everyone can make their way towards earning that tee or tree.
Instructions on how to get started working on this project can be found below.

### How to get started:
- First you should fork this repo
- Once you have forked this repo you should clone it to your computer
  1. From your GitHub account page, open the forked repository and click Code. Then click the copy-to-clipboard button.
  2. Open a terminal and run the following command: git clone <url-you-just-copied>
- Make sure you have NodeJS installed
  1. You can check if you have NodeJS installed by running 'npm version' in a powershell window
- Update the botconfig
  1. Go to the [discord developer portal](https://discord.com/developers/applications) and create a test application by clicking 'New Application'
  2. From there click on the 'Bot' tab and select 'Add Bot'
  3. 'Click to Reveal Token', then use it as the token value in botconfig.json
- Create a new Discord server and invite the bot
  1. You can invite the bot by [using this link](https://discordapi.com/permissions.html) and filling in the data
- Update the files in the folder named 'data'
  1. Change the channel ids in 'config.json' to the channel ids you wish to use
  2. In 'roles.json' change the id to the moderator role
  3. To copy ids go to your 'Discord settings > Appearance' and under 'Advanced' enable developer mode. (you can now copy ids by right clicking on roles, channels and users)
