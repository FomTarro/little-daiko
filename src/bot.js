const constants = require("./models/constants");
const Logger = require('./utils/logger');

async function initialize(appConfig, logId){
    const logger = new Logger(logId);
    logger.log(`-------------`)
    const client = await appConfig.DISCORD_CLIENT.startClient(
        (c) => { 
            for(let guild of c.guilds.cache.array()){
                if(guild && guild.me){
                    guild.me.setNickname(constants.BOT_NAME_OFFLINE);
                    // TODO: notify servers of changes since last login
                }
                logger.log(`${guild.name} | ${guild.id}`);
                new Logger(appConfig.DISCORD_HELPERS.getGuildId(guild)).log(`-------------`);
            } 
        }, 
        (input, e) => {
            new Logger(appConfig.DISCORD_HELPERS.getGuildId(input)).error(`${e.stack ? e.stack : e}`);
            const error = `Sorry! We hit an error! The stupid mother fucker who wrote this bot doesn't know how to fucking program: \`\`\`${e}\`\`\``
            client.respondToMessage(input, error);
        },
        appConfig.EVENTS(appConfig),
        logger
    );
    return new Bot(appConfig, client);
}

class Bot{
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

module.exports.initialize = initialize;
module.exports.Bot = Bot;

