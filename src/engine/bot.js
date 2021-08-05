const { AppConfig } = require("../../app.config");
const { DiscordClient } = require("../adapters/discord/discord.client");
const { LiteralConstants } = require("../utils/literal.constants");
const { Logger } = require('../utils/logger');

/**
 * Starts an instance of the bot.
 * @param {AppConfig} appConfig The dependency injection config.
 * @returns {Bot} An instance of the bot.
 */
async function startBot(appConfig){
    const logger = new Logger(LiteralConstants.LOG_SYSTEM_ID);
    logger.log(LiteralConstants.LOG_SESSION_START);
    const client = await appConfig.DISCORD_CLIENT.startClient( 
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
     * A bot for interacting with Discord.
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

