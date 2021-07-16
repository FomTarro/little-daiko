const { AppConfig } = require('./app.config');

async function main(){
    await AppConfig.BOT.initialize(AppConfig);
    AppConfig.BOT.login(AppConfig.DISCORD_BOT_TOKEN);
}
main();