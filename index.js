const { AppConfig } = require('./app.config');

async function main(){

    AppConfig.DISCORD_CLIENT.initialize(() => { console.log(`:^)`) });

    const profile = AppConfig.PROFILES.debug;
    const language = AppConfig.LANGUAGES.ENGLISH;
    const startEpoch = Date.parse(new Date());
    AppConfig.MILDOM_CLIENT.startListener(profile.streamer, (m) => {
        if(m.userId == profile.streamer 
        || (profile.users.includes(m.userId) && m.message.startsWith(language))){
            if(m.time > startEpoch){
                console.log(m);
                AppConfig.DISCORD_CLIENT.sendMessage(profile.channel, m);
            }
        }
    });
}

//main();