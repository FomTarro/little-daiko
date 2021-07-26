const { AppConfig } = require("../../app.config");
const { Command } = require("../models/command");

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
                new Command(
                    ['help'],
                    1,
                    async () => {
                        throw "here's a special new error!"
                    },
                )
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
        const bot = await AppConfig.BOT.startBot(dummyConfig, 'test');
        expect(sent).toBe(undefined);
        bot.client.emit('message', dummyMessage);
        await new Promise((r) => setTimeout(r, 1000));
        bot.shutdown();
        expect(sent).toContain("here's a special new error!");
        expect(sent).toContain("We hit an error!");
    });
});