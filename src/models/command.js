const oneline = require('oneline')

const REACT_OK = '✔️';
const REACT_ERROR = '❌'

/**
 * A! 
 */
function commands(appConfig){
    const discordHelpers = appConfig.DISCORD_HELPERS;
    return [
        {
            aliases: ['config', 'conf', 'c'],
            permissions: async (user, role) => { 
                return true 
            },
            callback: async (message, args) => { 
                const fields = appConfig.CONFIG_STORAGE.getAllProperties(message).map(prop => {
                    return {
                        name: `\`${prop[0]}\``,
                        value: `'${prop[1]}'`,
                    }
                });
                await message.channel.send(discordHelpers.generateEmbed({
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
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
            },
            callback: async (message, args) => { 
                if(args && args.length > 0){
                    appConfig.CONFIG_STORAGE.setProperty(message, "role", args[0]);
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
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
                || discordHelpers.isAdmin(user, role) 
            },
            callback: async (message, args) => { 
                if(args && args.length > 0){
                    const argId = Number(args[0]);
                    if(!isNaN(argId)){
                        appConfig.CONFIG_STORAGE.setProperty(message, "streamer", argId);
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
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
                || discordHelpers.isAdmin(user, role) 
            },
            callback: async (message, args) => { 
                if(args && args.length > 1){
                    const action = args[0];
                    let users = appConfig.CONFIG_STORAGE.getProperty(message, 'users');
                    users = users ? users : [];
                    const argIds = [...new Set(args.map((user) => {
                        return Number(user);
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
                        appConfig.CONFIG_STORAGE.setProperty(message, "users", updatedUsers);
                        return REACT_OK;
                    }else if("add" === action){
                        const updatedUsers = [...new Set(users.concat(argIds))];
                        appConfig.CONFIG_STORAGE.setProperty(message, "users", updatedUsers);
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
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
                || discordHelpers.isAdmin(user, role) 
            },
            callback: async (message, args) => { 
                if(args && args.length > 0){
                    appConfig.CONFIG_STORAGE.setProperty(message, "channel", args[0]);
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
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
                || discordHelpers.isAdmin(user, role) 
            },
            callback: async (message, args) => { 
                await message.channel.send("Starting listener.");
                const startEpoch = Date.parse(new Date());
                const language = `[${appConfig.CONFIG_STORAGE.getProperty(message, 'language')}]`;
                const channel =  message.guild.channels.cache.find(i => i.name === appConfig.CONFIG_STORAGE.getProperty(message, 'channel'));
                const streamer = Number(appConfig.CONFIG_STORAGE.getProperty(message, 'streamer'));
                const listener = await appConfig.MILDOM_CLIENT.startListener(streamer, 
                (comment) => {
                    if(comment.authorId == streamer
                    || (appConfig.CONFIG_STORAGE.getProperty(message, "users").includes(comment.authorId) && comment.message.toLowerCase().startsWith(language))){
                        if(comment.time > startEpoch){
                            channel.send(appConfig.DISCORD_HELPERS.generateEmbed(comment));
                        }
                    }
                });
                appConfig.LISTENER_STORAGE.setListener(message, listener);
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
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
                || discordHelpers.isAdmin(user, role) 
            },
            callback: async (message, args) => { 
                await message.channel.send("Stopping listener.");
                appConfig.LISTENER_STORAGE.deleteListener(message);
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
                if(args && args.length > 0){
                    for(let entry of commands(appConfig)){
                        if(entry.aliases.includes(args[0])){
                            const fields = entry.help.map(value => {
                                return {
                                    name: `\`${value.usage}\``,
                                    value: value.description,
                                };
                            });
                            message.channel.send(discordHelpers.generateEmbed({
                                message: 'Command Information:',
                                fields: fields
                            }));
                            return;
                        }
                    }
                }
                const fields = commands(appConfig).map((value) => {
                    return {
                        name: `\`${value.aliases.join(', ')}\``,
                        value: '- - -'
                    };
                }).sort((a, b) => { 
                    return a.name.localeCompare(b.name);
                });
                await message.channel.send(discordHelpers.generateEmbed({
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
}

module.exports = commands;