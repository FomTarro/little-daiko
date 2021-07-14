const { AppConfig } = require('../../../app.config');
const Discord = require('discord.js');

const client = new Discord.Client();

function initialize(onLogin, onException){

    for(let [event, callback] of AppConfig.EVENTS){
        client.on(event, (input) => {
            callback(input, onException);
        });
    }

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        for(let guild of client.guilds.cache.array()){
            console.log(`${guild.name} | ${guild.id}`);
        }
        onLogin();
    });

    client.login(AppConfig.DISCORD_BOT_TOKEN);
}

function respondToMessage(message, content){
    try{
        message.channel.send(content);
    }catch(e){
        console.error(e);
    }
}

module.exports.initialize = initialize;
module.exports.respondToMessage = respondToMessage;