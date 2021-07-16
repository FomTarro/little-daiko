async function initialize(appConfig){
    const client = await appConfig.DISCORD_CLIENT.initialize(
        () => { console.log(`:^)`) }, 
        (input, e) => {
            const error = `Sorry! We hit an error! The stupid mother fucker who wrote this bot doesn't know how to fucking program: \`\`\`${e}\`\`\``
            client.respondToMessage(input, error);
        },
        appConfig
    );
    return new Bot(appConfig, client);
}

class Bot{
    constructor(appConfig, client){
        this.appConfig = appConfig;
        this.client = client;
    }

    async login(token){
        if(this.client){
            this.client.login(token);
        }
    }
    
    async shutdown(){
        if(this.client){
            this.client.shutdown();
        }
    }
}

module.exports.initialize = initialize;
module.exports.Bot = Bot;

