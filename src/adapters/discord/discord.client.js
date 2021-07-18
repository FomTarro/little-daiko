const Discord = require('discord.js');

async function initialize(onLogin, onException, appConfig){
    const client = new Discord.Client();
    for(let [event, callback] of appConfig.EVENTS(appConfig)){
        client.on(event, (input) => {
            callback(input, onException);
        });
    }

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        for(let guild of client.guilds.cache.array()){
            guild.me.setNickname('little-daiko 🔴');
            console.log(`${guild.name} | ${guild.id}`);
        }
        onLogin();
    });

    return new DiscordClient(client);
}

class DiscordClient{
    constructor(client){
        this.client = client;
    }
    login(token){
        if(this.client){
            this.client.login(token);
        }
    }
    
    shutdown(){
        if(this.client){
            this.client.destroy();
        }
    }
    
    emit(event, input){
        if(this.client){
            this.client.emit(event, input)
        }
    }
    
    respondToMessage(message, content){
        try{
            message.channel.send(content);
        }catch(e){
            console.error(e);
        }
    }
}

module.exports.initialize = initialize;
module.exports.DiscordClient = DiscordClient;