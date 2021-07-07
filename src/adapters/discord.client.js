const { AppConfig } = require('../../app.config');
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

function generateEmbed(message){
    // 0 sets the date to epoch
    const date = new Date(0).setUTCMilliseconds(message.time); 
    return new Discord.MessageEmbed()
    .setColor('#f1c40f')
    .setAuthor(message.userName, message.userImg)
    .setDescription(message.message)
    .setTimestamp(date)
}

module.exports.Bot = client;
module.exports.GenerateEmbed = generateEmbed;