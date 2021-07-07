const { AppConfig } = require('./app.config');

async function main(){

    const bot = AppConfig.DISCORD_CLIENT.Bot
    bot.login(AppConfig.DISCORD_BOT_TOKEN);

    const profile = AppConfig.PROFILES.debug;
    AppConfig.MILDOM_CLIENT.ChatListener(profile.streamer, (m) => {
        if(m.userId == profile.streamer 
        || (profile.users.includes(m.userId) && m.message.startsWith('[EN]'))){
            console.log(m);
            bot.channels.cache.find(i => i.name === profile.channel).send(AppConfig.DISCORD_CLIENT.GenerateEmbed(m));
        }
    });
}

main();