const { AppConfig } = require("../../app.config");
const { DiscordClient } = require("../adapters/discord/discord.client");
const { Constants } = require("../models/constants");
const Logger = require('../utils/logger');

const sessionStart = `------- SESSION START -------`

/**
 * Starts an instance of the bot
 * @param {AppConfig} appConfig The dependency injection config
 * @param {string} logId Log file name for system logs
 * @returns {Bot} An instance of the bot
 */
async function startBot(appConfig, logId){
    const logger = new Logger(logId);
    logger.log(sessionStart)
    const client = await appConfig.DISCORD_CLIENT.startClient(
        (c) => { 
            for(let guild of c.guilds.cache.array()){
                if(guild && guild.me){
                    guild.me.setNickname(Constants.BOT_NAME_OFFLINE);
                    // TODO: notify servers of changes since last login
                }
                logger.log(`${guild.name} | ${guild.id}`);
                new Logger(appConfig.DISCORD_HELPERS.getGuildId(guild)).log(sessionStart);
            } 
        }, 
        (input, e) => {
            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(input));
            logger.error(`${e.stack ? e.stack : e}`);
            const error = `Sorry! We hit an error! The stupid mother fucker who wrote this bot doesn't know how to fucking program: \`\`\`${e}\`\`\``;
            try{
                input.channel.send(error);
            }catch(e){
                logger.error(`${e.stack ? e.stack : e}`);
            }
        },
        appConfig.EVENTS(appConfig),
        logger
    );
    return new Bot(appConfig, client);
}

class Bot{
    /**
     * A bot for interacting with discord
     * @param {AppConfig} appConfig 
     * @param {DiscordClient} client 
     */
    constructor(appConfig, client){
        this.appConfig = appConfig;
        this.client = client;
    }

    async login(token){
        if(this.client){
            this.client.login(token);
        }
    }
    
    async shutdown(){
        if(this.client){
            this.client.shutdown();
        }
    }
}

module.exports.startBot = startBot;
module.exports.Bot = Bot;

