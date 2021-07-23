const { AppConfig } = require('./app.config');
const Logger = require('./src/utils/logger');

async function main(){
    const logger = new Logger('system');
    const bot = await AppConfig.BOT.initialize(AppConfig, logger);
    bot.login(AppConfig.DISCORD_BOT_TOKEN);
}
main();