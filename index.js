const { AppConfig } = require('./app.config');

async function main(){
    const bot = await AppConfig.BOT.startBot(AppConfig, 'system');
    bot.login(AppConfig.DISCORD_BOT_TOKEN);
}
main();