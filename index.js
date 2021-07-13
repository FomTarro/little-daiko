const { AppConfig } = require('./app.config');

async function main(){

    AppConfig.DISCORD_CLIENT.initialize(
        () => { console.log(`:^)`) }, 
        (input, e) => {
            console.error(e);
            AppConfig.DISCORD_CLIENT.respondToMessage(input);
        }
    );
}

main();