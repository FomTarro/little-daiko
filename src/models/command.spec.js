const { AppConfig } = require('../../app.config');

describe("Help command tests", () => {
    test("Help with no args", async() => {
        // set up mock dependencies
        let embed = undefined
        const dummyConfig = {
            DISCORD_HELPERS:{
                generateEmbed(message){
                    embed = message;
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
        const help = commands.filter(c => { return c.aliases.includes('help')})[0];
        const result = await help.callback(dummyMessage, undefined);
        expect(sent).toBe(true);
        expect(embed.fields.length).toBe(commands.length);
    });

    test("Help with 'users' arg", async() => {
        // set up mock dependencies
        let embed = undefined
        const dummyConfig = {
            DISCORD_HELPERS:{
                generateEmbed(message){
                    embed = message;
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
        const help = commands.filter(c => { return c.aliases.includes('help')})[0];
        const result = await help.callback(dummyMessage, 'users');
        expect(sent).toBe(true);
        expect(embed.fields.length).toBe(2);
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
        const help = commands.filter(c => { return c.aliases.includes('config')})[0];
        const result = await help.callback(dummyMessage, undefined);
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
                }
            }
        }
        const dummyMessage = {
        }
        // execute test
        const commands = AppConfig.COMMANDS(dummyConfig);
        const help = commands.filter(c => { return c.aliases.includes('role')})[0];
        const result = await help.callback(dummyMessage, ['admin', 'secondary']);
        expect(role).toEqual('admin');
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
        const help = commands.filter(c => { return c.aliases.includes('role')})[0];
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
        const help = commands.filter(c => { return c.aliases.includes('streamer')})[0];
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
        const help = commands.filter(c => { return c.aliases.includes('streamer')})[0];
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
        const help = commands.filter(c => { return c.aliases.includes('streamer')})[0];
        const result = await help.callback(dummyMessage, ['12a345', 'secondary']);
        expect(streamer).toEqual(undefined);
        expect(result).toEqual('❌');
    });
});

describe("Channel command tests", () => {
    test("Channel with args", async() => {
        // set up mock dependencies
        let channel = undefined;
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
        const help = commands.filter(c => { return c.aliases.includes('channel')})[0];
        const result = await help.callback(dummyMessage, ['general', 'secondary']);
        expect(channel).toEqual('general');
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
        const help = commands.filter(c => { return c.aliases.includes('channel')})[0];
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
        const help = commands.filter(c => { return c.aliases.includes('users')})[0];
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
        const help = commands.filter(c => { return c.aliases.includes('users')})[0];
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