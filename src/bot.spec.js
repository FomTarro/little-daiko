const { AppConfig } = require("../app.config");

describe("Error handling tests", () => {
    test("Basic error in command", async() => {
        // set up mock dependencies
        const dummyConfig = {
            DISCORD_CLIENT: AppConfig.DISCORD_CLIENT,
            DISCORD_HELPERS: {
                isDm(){
                    return false;
                },
                isBot(){
                    return false;
                },
                generateEmbed(message){
                    return message;
                }
            },
            CONFIG_STORAGE: {
                getProperty(guild, prop){
                    if(prop == 'prefix'){
                        return '!'
                    }
                }
            },
            EVENTS: AppConfig.EVENTS,
            COMMANDS(){
                return [
                {
                    aliases: ['help'],
                    async callback(){
                        throw "here's a special new error!"
                    },
                    permissions(){
                        return true;
                    }
                }
            ]}
        }
        let sent = undefined
        const dummyMessage = {
            content: '!help',
            channel: {
                send(message){
                   sent = message;
                }
            }
        }
        // execute test
        await AppConfig.BOT.initialize(dummyConfig);
        expect(sent).toBe(undefined);
        AppConfig.DISCORD_CLIENT.emit('message', dummyMessage);
        await new Promise((r) => setTimeout(r, 1000));
        AppConfig.BOT.shutdown();
        expect(sent).toContain("here's a special new error!");
        expect(sent).toContain("We hit an error!");
    });
});