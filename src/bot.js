// TODO: refactor this to output a class

let config;
async function initialize(appConfig){
    config = appConfig;
    const client = await appConfig.DISCORD_CLIENT.initialize(
        () => { console.log(`:^)`) }, 
        (input, e) => {
            const error = `Sorry! We hit an error! The stupid mother fucker who wrote this bot doesn't know how to fucking program: \`\`\`${e}\`\`\``
            appConfig.DISCORD_CLIENT.respondToMessage(input, error);
        },
        appConfig
    );
}

async function login(token){
    if(config){
        config.DISCORD_CLIENT.login(token);
    }
}

async function shutdown(){
    if(config){
        config.DISCORD_CLIENT.shutdown();
    }
}

module.exports.initialize = initialize;
module.exports.login = login;
module.exports.shutdown = shutdown;

