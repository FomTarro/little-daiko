const Discord = require('discord.js');

async function initialize(onLogin, onException, events, logger){
    const client = new Discord.Client();
    for(let [event, callback] of events){
        client.on(event, (input) => {
            callback(input, onException);
        });
    }

    client.on('ready', () => {
        logger.log(`Logged in as ${client.user.tag}!`);
        onLogin(client);
    });
    logger.log(`Client instantiated, awaiting login...`);
    return new DiscordClient(client, logger);
}

class DiscordClient{
    constructor(client, logger){
        this.client = client;
        this.logger = logger;
    }
    login(token){
        if(this.client){
            this.client.login(token);
        }
    }
    
    shutdown(){
        if(this.client){
            this.logger.log(`Client shutting down...`)
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
            this.logger.error(e);
        }
    }
}

module.exports.initialize = initialize;
module.exports.DiscordClient = DiscordClient;