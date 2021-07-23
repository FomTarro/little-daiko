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
                },
                getGuildId(){
                    return 1234;
                },
                getOtherBotGuilds(){
                    return [];
                }
            },
            CONFIG_STORAGE: {
                getProperty(guild, prop){
                    if(prop == 'prefix'){
                        return '!'
                    }
                    if(prop == 'role'){
                        return {
                            ops: "admin"
                        }
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
                    permissions: 1
                }
            ]},
            PERMISSIONS: AppConfig.PERMISSIONS
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
        const bot = await AppConfig.BOT.initialize(dummyConfig, 'test');
        expect(sent).toBe(undefined);
        bot.client.emit('message', dummyMessage);
        await new Promise((r) => setTimeout(r, 1000));
        bot.shutdown();
        expect(sent).toContain("here's a special new error!");
        expect(sent).toContain("We hit an error!");
    });
});