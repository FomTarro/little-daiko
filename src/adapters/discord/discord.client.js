const Discord = require('discord.js');
const client = new Discord.Client();

async function initialize(onLogin, onException, appConfig){

    for(let [event, callback] of appConfig.EVENTS(appConfig)){
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
}

function login(token){
    client.login(token);
}

function shutdown(){
    client.destroy();
}

function emit(event, input){
    client.emit(event, input)
}

function respondToMessage(message, content){
    try{
        message.channel.send(content);
    }catch(e){
        console.error(e);
    }
}

module.exports.initialize = initialize;
module.exports.emit = emit;
module.exports.login = login;
module.exports.shutdown = shutdown;
module.exports.respondToMessage = respondToMessage;