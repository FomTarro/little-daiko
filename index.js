const { AppConfig } = require('./app.config');

async function main(){
    const bot = await AppConfig.BOT.initialize(AppConfig);
    bot.login(AppConfig.DISCORD_BOT_TOKEN);
}
main();