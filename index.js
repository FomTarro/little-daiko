const { AppConfig } = require('./app.config');

async function main(){

    AppConfig.DISCORD_CLIENT.initialize(
        () => { console.log(`:^)`) }, 
        (input, e) => {
            console.log(e)
        }
    );
}

main();