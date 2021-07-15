const { AppConfig } = require('../../app.config');
const { generateEmbed } = require('../adapters/discord/discord.helpers');

describe("Events tests", () => {
    test("Events", async() => {
        // set up mock dependencies
        const dummyConfig = {
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
            COMMANDS: AppConfig.COMMANDS
        }
        let sent = false;
        const dummyMessage = {
            content: '!help',
            channel: {
                send(message){
                    sent = true;
                }
            }
        }
        // execute test
        const events = AppConfig.EVENTS(dummyConfig);
        const onMessage = events.get('message');
        await onMessage(dummyMessage, () => {});
        expect(sent).toBe(true);
    });
});