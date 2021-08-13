const { AppConfig } = require('../../../app.config');
const { HelpCommand } = require('./help.command');

describe("General command tests", () => {
    test("All aliases are unique", async() => {
        const commands = AppConfig.COMMANDS(AppConfig);
        let count = 0;
        for(let command of commands){
            for(let otherCommand of commands){
                if(!(command === otherCommand)){
                    expect(command.aliases.some(a => otherCommand.aliases.includes(a))).toBe(false);
                    count = count + 1;
                }
            }
        }
        expect(count).toEqual(commands.length * (commands.length - 1));
    });
});

describe("Help command tests", () => {
    test("Help with no args", async() => {
        // set up mock dependencies
        let embed = undefined
        const dummyConfig = {
            DISCORD_HELPERS:{
                generateEmbed(message){
                    embed = message;
                }
            },
            CONFIG_STORAGE: {
                getProperty(){
                    return '!';
                }
            },
            COMMANDS: AppConfig.COMMANDS,
        }
        let sent = false;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            }
        }
        // execute test
        expect(sent).toBe(false);
        const help = HelpCommand(dummyConfig)
        const result = await help.callback(dummyMessage, undefined);
        expect(sent).toBe(true);;
        expect(embed.fields.length).toBe(2);
    });

    test("Help with 'users' arg", async() => {
        // set up mock dependencies
        let embed = undefined
        const dummyConfig = {
            DISCORD_HELPERS:{
                generateEmbed(message){
                    embed = message;
                }
            },
            CONFIG_STORAGE: {
                getProperty(){
                    return '!';
                }
            },
            PERMISSIONS: AppConfig.PERMISSIONS,
            COMMANDS: AppConfig.COMMANDS,
        }
        let sent = false;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            }
        }
        // execute test
        expect(sent).toBe(false);
        const help = HelpCommand(dummyConfig)
        const result = await help.callback(dummyMessage, 'users');
        expect(sent).toBe(true);
        expect(embed.fields.length).toBe(3);
    });
});

describe("Config command tests", () => {
    test("Config with no args", async() => {
        // set up mock dependencies
        let embed = undefined
        const dummyConfig = {
            DISCORD_HELPERS: {
                generateEmbed(message){
                    embed = message;
                }
            },
            CONFIG_STORAGE: {
                getAllProperties(){
                    return [
                        ['key', 'value'],
                        ['one', 'two']
                    ]
                }
            }
        }
        let sent = false;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            }
        }
        // execute test
        expect(sent).toBe(false);
        const commands = AppConfig.COMMANDS(dummyConfig);
        const config = commands.find(c => { return c.aliases.includes('config')});
        const result = await config.callback(dummyMessage, undefined);
        expect(sent).toBe(true);
        expect(embed.fields.length).toBe(2);
        expect(embed.message).toBeDefined();
    });
});

describe("Role command tests", () => {
    test("Role with args", async() => {
        // set up mock dependencies
        let role = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    role = value;
                },
                getProperty(guild, prop){
                    return {};
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('role')});
        const result = await help.callback(dummyMessage, ['admin', 'secondary']);
        expect(role).toEqual(undefined);
        expect(result).toEqual('❌')
    });
    test("Role with ops args", async() => {
        // set up mock dependencies
        let role = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    role = value;
                },
                getProperty(guild, prop){
                    return {};
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('role')});
        const result = await help.callback(dummyMessage, ['ops', 'admin']);
        expect(role).toEqual({ops: 'admin'});
        expect(result).toEqual('✔️')
    });
    test("Role with alert args", async() => {
        // set up mock dependencies
        let role = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    role = value;
                },
                getProperty(guild, prop){
                    return {};
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('role')});
        const result = await help.callback(dummyMessage, ['alert', 'mildom']);
        expect(role).toEqual({alert: 'mildom'});
        expect(result).toEqual('✔️')
    });
    test("Role with no args", async() => {
        // set up mock dependencies
        let role = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    role = value;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('role')});
        const result = await help.callback(dummyMessage, undefined);
        expect(role).toEqual(undefined);
        expect(result).toEqual('❌');
    });
});

describe("Streamer command tests", () => {
    test("Streamer with numeric args", async() => {
        // set up mock dependencies
        let streamer = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    streamer = value;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('streamer')});
        const result = await help.callback(dummyMessage, [12345, 'secondary']);
        expect(streamer).toEqual(12345);
        expect(result).toEqual('✔️')
    });
    test("Streamer with no args", async() => {
        // set up mock dependencies
        let streamer = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    streamer = value;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('streamer')});
        const result = await help.callback(dummyMessage, undefined);
        expect(streamer).toEqual(undefined);
        expect(result).toEqual('❌');
    });
    test("Streamer with non-numeric args", async() => {
        // set up mock dependencies
        let streamer = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    streamer = value;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('streamer')});
        const result = await help.callback(dummyMessage, ['12a345', 'secondary']);
        expect(streamer).toEqual(undefined);
        expect(result).toEqual('❌');
    });
});

describe("Channel command tests", () => {
    test("Channel with add args", async() => {
        // set up mock dependencies
        let channel = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    channel = value;
                },
                getProperty(guild, prop){
                    return { chat: {}};
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('output')});
        const result = await help.callback(dummyMessage, ['chat', 'add', 'en', 'general', 'secondary']);
        expect(channel).toEqual({chat: {en: 'general'}});
        expect(result).toEqual('✔️')
    });
    test("Channel with remove args", async() => {
        // set up mock dependencies
        let channel = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    channel = value;
                },
                getProperty(guild, prop){
                    return { chat: {en: 'general'}};
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.filter(c => { return c.aliases.includes('output')})[0];
        const result = await help.callback(dummyMessage, ['chat', 'remove', 'en', 'general', 'secondary']);
        expect(channel).toEqual({chat: {}});
        expect(result).toEqual('✔️')
    });
    test("Channel with no args", async() => {
        // set up mock dependencies
        let channel = 'general';
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    channel = value;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.filter(c => { return c.aliases.includes('output')})[0];
        const result = await help.callback(dummyMessage, undefined);
        expect(channel).toEqual('general');
        expect(result).toEqual('❌');
    });
});

describe("Users command tests", () => {
    test("Users add with args", async() => {
        // set up mock dependencies
        let users = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    users = value;
                },
                getProperty(guild, prop){
                   return users;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('users')});
        const result = await help.callback(dummyMessage, ['add', 12345, 'secondary', 67890]);
        expect(users).toEqual([12345, 67890]);
        expect(result).toEqual('✔️')
    });
    test("Users add with no args", async() => {
        // set up mock dependencies
        let users = [3456, 2313];
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    users = value;
                },
                getProperty(guild, prop){
                   return users;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('users')});
        const result = await help.callback(dummyMessage, ['add']);
        expect(users).toEqual([3456, 2313]);
        expect(result).toEqual('❌');
    });
    test("Users remove with args", async() => {
        // set up mock dependencies
        let users = [123,456,789];
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    users = value;
                },
                getProperty(guild, prop){
                   return users;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.filter(c => { return c.aliases.includes('users')})[0];
        const result = await help.callback(dummyMessage, ['remove', 456, 'secondary', 67890]);
        expect(users).toEqual([123, 789]);
        expect(result).toEqual('✔️')
    });
    test("Users remove with no args", async() => {
        // set up mock dependencies
        let users = [3456, 2313];
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    users = value;
                },
                getProperty(guild, prop){
                   return users;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.filter(c => { return c.aliases.includes('users')})[0];
        const result = await help.callback(dummyMessage, ['remove']);
        expect(users).toEqual([3456, 2313]);
        expect(result).toEqual('❌');
    });
    test("Users with no args", async() => {
        // set up mock dependencies
        let users = [3456, 2313];
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    users = value;
                },
                getProperty(guild, prop){
                   return users;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.filter(c => { return c.aliases.includes('users')})[0];
        const result = await help.callback(dummyMessage, undefined);
        expect(users).toEqual([3456, 2313]);
        expect(result).toEqual('❌');
    });
    test("Users with bad first args", async() => {
        // set up mock dependencies
        let users = [3456, 2313];
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(guild, prop, value){
                    users = value;
                },
                getProperty(guild, prop){
                   return users;
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.filter(c => { return c.aliases.includes('users')})[0];
        const result = await help.callback(dummyMessage, ['nonsense']);
        expect(users).toEqual([3456, 2313]);
        expect(result).toEqual('❌');
    });
});

describe("Start command tests", () => {
    test("Start", async() => {
        // set up mock dependencies
        let listener = undefined;
        const dummyConfig = {
            CONFIG_STORAGE: {
                getProperty(guild, prop){
                    if(prop === 'languages'){
                        return ['en']
                    }
                    return 11629553; // My channel ID
                },
                setProperty(){

                }
            },
            MILDOM_CLIENT: AppConfig.MILDOM_CLIENT,
            LISTENER_STORAGE: {
                setListener(message, l){
                    listener = l;
                }
            },
            TIMESTAMP_STORAGE: {
                getAllTimestamps(){
                    return [];
                }
            },
            DISCORD_HELPERS:{
                getGuildId(){
                    return 1234;
                },
                getOtherBotGuilds(){
                    return [];
                }
            }
        }
        let sent = false;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            },
            guild: {
                channels: {
                    cache: [{
                            name: 11629553
                        }]
                }
            }
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('start')});
        await help.callback(dummyMessage, []);
        await new Promise((r) => setTimeout(r, 2000));
        expect(listener).toBeInstanceOf(AppConfig.MILDOM_CLIENT.ChatListener);
        expect(listener.roomId).toBe(11629553);
        listener.stopListener();
        await new Promise((r) => setTimeout(r, 1000));
        expect(sent).toBe(true);
    });
});

describe("Stop command tests", () => {
    test("Stop", async() => {
        // set up mock dependencies
        let deleted = false;
        const dummyConfig = {
            LISTENER_STORAGE: {
                deleteListener(message){
                    deleted = true;
                }
            },
            CONFIG_STORAGE:{
                setProperty(){
                    
                }
            },
            DISCORD_HELPERS:{
                getGuildId(){
                    return 1234;
                },
            }
        }
        let sent = false;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            },
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.find(c => { return c.aliases.includes('stop')});
        await help.callback(dummyMessage, []);
        expect(sent).toBe(true);
        expect(deleted).toBe(true);
    });
});

describe("Remote command tests", () => {
    test("Remote set prefix", async() => {
        // set up mock dependencies
        let newProp = undefined;
        const dummyConfig = {
            CONFIG_STORAGE:{
                getProperty(){
                    return '!'
                },
                setProperty(key, prop, input){
                    newProp = input;
                }
            },
            COMMANDS: AppConfig.COMMANDS,
            PERMISSIONS: AppConfig.PERMISSIONS,
            DISCORD_HELPERS: {
                generateEmbed(input){
                    return input;
                },
                getGuildId(){
                    return 11223344;
                },
                getOtherBotGuilds(){
                    return [{
                        id: 11223344
                    }];
                }
            },
        }
        let sent = false;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            },
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const remote = commands.find(c => { return c.aliases.includes('remote')});
        const result = await remote.callback(dummyMessage, ['11223344', 'prefix', '?']);
        expect(newProp).toBe('?');
        expect(result).toBe('✔️');
    });
});

describe("Status command tests", () => {
    test("Status up", async() => {
        // set up mock dependencies
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(){

                }
            },
            LISTENER_STORAGE: {
                getListener(){
                    return {
                        isListening(){
                            return true;
                        }
                    }
                }
            },
            DISCORD_HELPERS:{
                getGuildId(){
                    return 1234;
                },
                getOtherBotGuilds(){
                    return [{
                        id: 1234,
                        me:{
                            setNickname(nick){
                                nickname = nick;
                            }
                        }
                    }];
                }
            }
        }
        let sent = false;
        let nickname = undefined;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            },
            guild:{
                id: 1234
            }
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const status = commands.find(c => { return c.aliases.includes('status')});
        const result = await status.callback(dummyMessage, []);
        expect(sent).toBe(true);
        expect(nickname).toBe('little-daiko 🟢');
    });
    test("Status down", async() => {
        // set up mock dependencies
        const dummyConfig = {
            CONFIG_STORAGE: {
                setProperty(){

                }
            },
            LISTENER_STORAGE: {
                getListener(){
                    return {
                        isListening(){
                            return false;
                        }
                    }
                }
            },
            DISCORD_HELPERS: {
                getGuildId(){
                    return 1234;
                },
                getOtherBotGuilds(){
                    return [{
                        id: 1234,
                        me:{
                            setNickname(nick){
                                nickname = nick;
                            }
                        }
                    }];
                }
            }
        }
        let sent = false;
        let nickname = undefined;
        const dummyMessage = {
            channel: {
                send(){
                    sent = true;
                }
            },
            guild:{
                id: 1234
            }
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const status = commands.find(c => { return c.aliases.includes('status')});
        const result = await status.callback(dummyMessage, []);
        expect(sent).toBe(true);
        expect(nickname).toBe('little-daiko 🔴');
    });
});