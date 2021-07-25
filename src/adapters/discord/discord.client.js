const Discord = require('discord.js');

/**
 * Creates a discord client
 * @param {function} onLogin Callback to execute on login
 * @param {function} onException Callback to execute on error
 * @param {*} events List of other events to listen for
 * @param {console} logger Logging implementation
 * @returns {DiscordClient}
 */
async function startClient(onLogin, onException, events, logger){
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

/**
 * A client for a Discord bot
 */
class DiscordClient{
    constructor(client, logger){
        this.client = client;
        this.logger = logger;
    }
    /**
     * Logs in to the bot account
     * @param {string} token The login token
     */
    login(token){
        if(this.client){
            this.client.login(token);
        }
    }
    
    /**
     * Logs out and shuts down the bot
     */
    shutdown(){
        if(this.client){
            this.logger.log(`Client shutting down...`)
            this.client.destroy();
        }
    }
    
    /**
     * Spoofs a message to intercept
     * 
     * Mostly useful for testing
     * @param {string} event The event name to emit
     * @param {any} input The event payload
     */
    emit(event, input){
        if(this.client){
            this.client.emit(event, input)
        }
    }
    
    /**
     * Wrapper for replying to a given message
     * @param {Discord.Message} message The message to respond to
     * @param {String} content The body of the message
     */
    respondToMessage(message, content){
        try{
            message.channel.send(content);
        }catch(e){
            this.logger.error(e);
        }
    }
}

module.exports.startClient = startClient;
module.exports.DiscordClient = DiscordClient;