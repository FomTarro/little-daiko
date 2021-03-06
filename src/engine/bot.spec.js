
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
        const bot = await AppConfig.BOT.startBot(dummyConfig);
        expect(sent).toBe(undefined);
        bot.client.emit('messageCreate', dummyMessage);
        await delay();
        bot.shutdown();
        expect(sent).toContain("here's a special new error!");
        expect(sent).toContain("We hit an error!");
    });
});

describe("Other bot functions", () => {
    test("Auto-reboot Listener", async() => {
        // set up mock dependencies
        var isListening = false;
        const dummyConfig = {
            MILDOM_CLIENT: {
                startListener(){
                    isListening = true;
                    return {
                        isListening(){
                            return isListening;
                        },
                        stopListener(){
                            isListening = false;
                        }
                    }
                }
            },
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
                    return 'test';
                },
                getOtherBotGuilds(){
                    return [];
                },
                isAdmin(){
                    return true;
                },
                isBotOwner(){
                    return true;
                },
                isGuildOwner(){
                    return true;
                }
            },
            CONFIG_STORAGE: AppConfig.CONFIG_STORAGE,
            LISTENER_STORAGE: AppConfig.LISTENER_STORAGE,
            EVENTS: AppConfig.EVENTS,
            COMMANDS: AppConfig.COMMANDS,
            PERMISSIONS: AppConfig.PERMISSIONS,
        }
        let sent = undefined;
        const dummyMessage = {
            content: '!start',
            guild:{
                id: 'test'
            },
            channel:
            {
                async send(input){
                    sent = input;
                }
            }
        }
        // execute test
        // start listener
        dummyConfig.CONFIG_STORAGE.deleteGuildConfig(dummyMessage);
        let bot = await AppConfig.BOT.startBot(dummyConfig);
        bot.client.emit('messageCreate', dummyMessage);
        await delay();
        
        // check status
        dummyMessage.content = '!status';
        bot.client.emit('messageCreate', dummyMessage);
        await delay();
        expect(sent.content).toContain('listening');
        await bot.shutdown();
        dummyConfig.LISTENER_STORAGE.deleteListener(dummyMessage);

        // check status again on reboot
        await delay();
        bot = await AppConfig.BOT.startBot(dummyConfig);
        // cache is empty, this is the error
        bot.client.client.guilds.cache.values = () => { return [{id: 'test'}]};
        bot.client.emit('ready', dummyMessage);
        await delay();
        bot.client.emit('messageCreate', dummyMessage);
        await delay();
        await bot.shutdown();
        dummyConfig.CONFIG_STORAGE.deleteGuildConfig(dummyMessage);
        expect(sent.content).toContain('listening');
    });
});

async function delay(){
    return await new Promise((r) => setTimeout(r, 100));
}