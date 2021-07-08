const { AppConfig } = require('../../app.config');
const Discord = require('discord.js');

const client = new Discord.Client();

function initialize(onLogin){
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.guilds.cache.forEach(guild => {
            console.log(`${guild.name} | ${guild.id}`);
        })
        onLogin();
    });
    client.login(AppConfig.DISCORD_BOT_TOKEN);
}

function sendMessage(channelName, message){
    client.channels.cache.find(i => i.name === channelName).send(generateEmbed(message));
}

function generateEmbed(message){
    // 0 sets the date to epoch
    const date = new Date(0).setUTCMilliseconds(message.time); 
    return new Discord.MessageEmbed()
    .setColor('#f1c40f')
    .setAuthor(message.userName, message.userImg)
    .setDescription(message.message)
    .setTimestamp(date)
}

module.exports.initialize = initialize;
module.exports.sendMessage = sendMessage;
module.exports.generateEmbed = generateEmbed;