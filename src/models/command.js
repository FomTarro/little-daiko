const { AppConfig } = require('../../app.config');
const DiscordHelpers = AppConfig.DISCORD_HELPERS;
const oneline = require('oneline')

const REACT_OK = '✔️';
const REACT_ERROR = '❌'

/**
 * A! 
 */
const commands = [
    {
        aliases: ['config', 'conf', 'c'],
        permissions: async (user, role) => { 
            return true 
        },
        callback: async (message, args) => { 
            const fields = AppConfig.CONFIG_STORAGE.getAllProperties(message).map(prop => {
                console.log(prop);
                // TODO: this complains!
                return {
                    name: `\`${prop[0]}\``,
                    value: new String(prop[1]),
                }
            });
            message.channel.send(DiscordHelpers.generateEmbed({
                message: `Here is the current configuration of this server:`,
                fields: fields,
            }));
        },
        help:         
        [
            {
                usage: `config`,
                description: oneline`Displays a list of all configurable properties for the server.`
            },
        ]
    },
    {
        aliases: ['role', 'r'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
        },
        callback: async (message, args) => { 
            if(args.length > 0){
                AppConfig.CONFIG_STORAGE.setProperty(message, "role", arg[0]);
                return REACT_OK;
            }
            return REACT_ERROR;
        },
        help: 
        [
            {
                usage: `role <role name>`,
                description: oneline`Sets the role name of permitted bot operators for this server.
                The server owner and the bot owner are granted these permissions without needing the role.`
            },
        ]
    },
    {
        aliases: ['streamer', 's'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) 
        },
        callback: async (message, args) => { 
            if(args.length > 0){
                const argId = Number.parseInt(args[0]);
                if(!isNaN(argId)){
                    AppConfig.CONFIG_STORAGE.setProperty(message, "streamer", argId);
                    return REACT_OK;
                }
            }
            return REACT_ERROR;
        },
        help: 
        [
            {
                usage: `channel <channel name>`,
                description: `Sets the server channel which stream messages will be posted to.`
            },
        ]
    },
    {
        aliases: ['users', 'u'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) 
        },
        callback: async (message, args) => { 
            if(args.length > 1){
                const action = args[0];
                const users = AppConfig.CONFIG_STORAGE.getProperty(message, 'users');
                const argIds = [...new Set(args.map((user) => {
                    return Number.parseInt(user);
                }).filter((user) => { 
                    return !isNaN(user) 
                }))];
                if(argIds.length <= 0){
                    return REACT_ERROR;
                }
                if("remove" === action){
                    const updatedUsers = users.filter((user) => { 
                        return !argIds.includes(user)
                    });
                    if(updatedUsers.length === users.length){
                        // no users removed
                        return REACT_ERROR;
                    }
                    AppConfig.CONFIG_STORAGE.setProperty(message, "users", updatedUsers);
                    return REACT_OK;
                }else if("add" === action){
                    const updatedUsers = [...new Set(users.concat(argIds))];
                    AppConfig.CONFIG_STORAGE.setProperty(message, "users", updatedUsers);
                    return REACT_OK;
                }
            }
            return REACT_ERROR;
        },
        help:
        [
            {
                usage: `users add <list of numeric user ids>`,
                description: oneline`Adds all listed user ids to the list of users to listen for. 
                The list must be space-separated. The user ids must be numbers.
                The streamer is implicitly on the list.`
            },
            {
                usage: `users remove <list of numeric user ids>`,
                description:  oneline`Removes all listed user ids from the list of users to listen for. 
                The list must be space-separated. The user ids must be numbers.`
            },
        ]
    },
    {
        aliases: ['channel', 'ch'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) 
        },
        callback: async (message, args) => { 
            if(args.length > 0){
                AppConfig.CONFIG_STORAGE.setProperty(message, "channel", args[0]);
                return REACT_OK;
            }
            return REACT_ERROR;
        },
        help: 
        [
            {
                usage: `channel <channel name>`,
                description: `Sets the server channel which stream messages will be posted to.`
            },
        ]
    },
    {
        aliases: ['start', 'listen', 'l'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) 
        },
        callback: async (message, args) => { 
            await message.channel.send("Starting listener.");
            const startEpoch = Date.parse(new Date());
            const language = `[${AppConfig.CONFIG_STORAGE.getProperty(message, 'language')}]`;
            const channel =  message.guild.channels.cache.find(i => i.name === AppConfig.CONFIG_STORAGE.getProperty(message, 'channel'));
            const streamer = AppConfig.CONFIG_STORAGE.getProperty(message, 'streamer');
            const listener = await AppConfig.MILDOM_CLIENT.startListener(Number.parseInt(streamer), 
            (m) => {
                if(m.userId == streamer
                || (AppConfig.getProperty(message, "users").includes(m.userId) && m.message.toLowerCase().startsWith(language))){
                    if(m.time > startEpoch){
                        channel.send(AppConfig.DISCORD_HELPERS.generateEmbed(m));
                    }
                }
            });
            AppConfig.LISTENER_STORAGE.setListener(message, listener);
        },
        help: 
        [
            {
                usage: `start`,
                description: oneline`Starts listening to the chat of the selected streamer, 
                for messages tagged with the designated language tag that are posted by users on the designated users list.`
            },
        ]
    },
    {
        aliases: ['stop', 'x'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) 
        },
        callback: async (message, args) => { 
            message.channel.send("Stopping listener.");
            AppConfig.LISTENER_STORAGE.deleteListener(message);
        },
        help: 
        [
            {
                usage: `stop`,
                description: `Stops listening to the chat of the selected streamer.`
            },
        ]
    },
    {
        aliases: ['help', 'halp', 'h'],
        permissions: async (user, role) => { 
            return true;
        },
        callback: async (message, args) => { 
            if(args.length > 0){
                for(let entry of AppConfig.COMMANDS){
                    if(entry.aliases.includes(args[0])){
                        const fields = entry.help.map(value => {
                            return {
                                name: `\`${value.usage}\``,
                                value: value.description,
                            };
                        });
                        message.channel.send(DiscordHelpers.generateEmbed({
                            message: 'Command Information:',
                            fields: fields
                        }));
                        return;
                    }
                }
            }
            const fields = commands.map((value) => {
                return {
                    name: `\`${value.aliases.join(', ')}\``,
                    value: '- - -'
                };
            }).sort((a, b) => { 
                return a.name.localeCompare(b.name);
            });
            message.channel.send(DiscordHelpers.generateEmbed({
                message: `Here's a list of possible commands and their aliases. 
                You can learn more about them by typing \`!help <command>\`.`,
                fields: fields,
            }));
        },
        help: 
        [
            {
                usage: `help`,
                description: `Displays a list of all commands and their aliases.`
            },
            {
                usage: `help <command>`,
                description: `Displays usage information about a specific command.`
            },
        ]
    },
]

module.exports = commands;