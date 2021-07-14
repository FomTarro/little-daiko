const { AppConfig } = require('./app.config');

async function main(){

    AppConfig.DISCORD_CLIENT.initialize(
        () => { console.log(`:^)`) }, 
        (input, e) => {
            console.error(e);
            const error = `Sorry! We hit an error! The stupid mother fucker who wrote this bot doesn't know how to fucking program: \`\`\`${e}\`\`\``
            AppConfig.DISCORD_CLIENT.respondToMessage(input, error);
        }
    );
}

main();