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
            permissions: 1,
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                const fields = appConfig.CONFIG_STORAGE.getAllProperties(configKey).map(prop => {
                    return {
                        name: `${prop[0]}:`,
                        value: `\`${JSON.stringify(prop[1], undefined, 2)}\``,
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
            aliases: ['prefix', 'p'],
            permissions: 2,
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 0){
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "prefix", args[0]);
                    return REACT_OK;
                }
                return REACT_ERROR;
            },
            help: 
            [
                {
                    usage: `prefix <prefix string>`,
                    description: `Sets the prefix to denote bot commands.`
                },
            ]
        },
        {
            aliases: ['role', 'r'],
            permissions: 3,
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 1){
                    const type = args[0];
                    const roles =  appConfig.CONFIG_STORAGE.getProperty(configKey, "role");
                    if(type === 'ops'){
                        roles.ops = args[1];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                        return REACT_OK;
                    }
                    if(type === 'alert'){
                        roles.alert = args[1];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                        return REACT_OK;
                    }
                }
                return REACT_ERROR;
            },
            help: 
            [
                {
                    usage: `role ops <role name or id>`,
                    description: oneline`Sets the role name of permitted bot operators for this server.
                    The server owner and the bot owner are granted these permissions without needing the role.`
                },
                {
                    usage: `role alert <role name or id>`,
                    description: oneline`Sets the role to ping when the designated streamer goes live. 
                    The alert will be posted in the designated alert channel.`
                },
            ]
        },
        {
            aliases: ['streamer', 's'],
            permissions: 2,
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 0){
                    const argId = Number(args[0]);
                    if(!isNaN(argId)){
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "streamer", argId);
                        return REACT_OK;
                    }
                }
                return REACT_ERROR;
            },
            help: 
            [
                {
                    usage: `streamer <streamer id>`,
                    description: `Sets the streamer to listen to. The streamer id must be a number.`
                },
            ]
        },
        {
            aliases: ['users', 'u'],
            permissions: 2,
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 1){
                    const action = args[0];
                    let users = appConfig.CONFIG_STORAGE.getProperty(configKey, 'users');
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
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "users", updatedUsers);
                        return REACT_OK;
                    }else if("add" === action){
                        const updatedUsers = [...new Set(users.concat(argIds))];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "users", updatedUsers);
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
            aliases: ['output', 'out', 'o'],
            permissions: 2,
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 1){
                    const type = args[0];
                    const channels = appConfig.CONFIG_STORAGE.getProperty(configKey, "output");
                    if(type === 'chat'){
                        if(args.length > 2){
                            const operation = args[1];
                            const language = args[2].toLowerCase();
                            if(operation === 'add' && args.length > 3){
                                channels.chat[language] = args[3];
                                appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                                return REACT_OK;
                            }else if(operation === 'remove'){
                                delete channels.chat[language];
                                appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                                return REACT_OK;
                            }
                        }
                    }
                    if(type === 'alert'){
                        channels.alert = args[1];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                        return REACT_OK;
                    }
                }
                return REACT_ERROR;
            },
            help: 
            [
                {
                    usage: `output chat add <language prefix> <channel name or id>`,
                    description: oneline`Sets the server channel which stream messages with the designated language prefix will be posted to.
                    Stream messages from the streamer will go to all language channels.`
                },
                {
                    usage: `output chat remove <language prefix>`,
                    description: `Stops posting to the server for the given language prefix.`
                },
                {
                    usage: `output alert <channel name or id>`,
                    description: `Sets the server channel which stream go-live alerts will be posted to.`
                },
            ]
        },
        {
            aliases: ['start', 'listen', 'l'],
            permissions: 2,
            callback: async (message, args) => { 
                await message.channel.send("Starting listener.");
                const startEpoch = Date.parse(new Date());
                const streamer = Number(appConfig.CONFIG_STORAGE.getProperty(message, 'streamer'));
                const listener = await appConfig.MILDOM_CLIENT.startListener(streamer, 
                // on message
                (comment) => {
                    const channels = appConfig.CONFIG_STORAGE.getProperty(message, 'output').chat;
                    const users = appConfig.CONFIG_STORAGE.getProperty(message, "users");
                    for(let prefix in channels){
                        if(comment.authorId == streamer
                        || (users.includes(comment.authorId) 
                        && comment.message.toLowerCase().startsWith(`[${prefix.toLowerCase()}]`))){
                            if(comment.time > startEpoch){
                                const chatChannel = discordHelpers.getChannel(message.guild, channels[prefix]);
                                if(chatChannel){
                                    chatChannel.send(appConfig.DISCORD_HELPERS.generateEmbed(comment));
                                }
                            }
                        }
                    }
                },
                // on go live
                (live) => {
                    const alertRole = discordHelpers.getRole(message.guild, appConfig.CONFIG_STORAGE.getProperty(message, 'role').alert);
                    const alertChannel = discordHelpers.getChannel(message.guild,appConfig.CONFIG_STORAGE.getProperty(message, 'output').alert);
                    if(alertChannel){
                        alertChannel.send(`${alertRole ? alertRole : 'NOW LIVE:'} https://www.mildom.com/${streamer}`);
                    }
                },
                // on open
                () => {
                    if(message.guild && message.guild.me){
                        message.guild.me.setNickname('little-daiko 🟢');
                    }
                },
                // on close
                () => {
                    if(message.guild && message.guild.me){
                        message.guild.me.setNickname('little-daiko 🔴');
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
            permissions: 2, 
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                await message.channel.send("Stopping listener.");
                appConfig.LISTENER_STORAGE.deleteListener(configKey);
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
            aliases: ['status'],
            permissions: 2,
            callback: async (message, args) => { 
                const listener = appConfig.LISTENER_STORAGE.getListener(message);
                const isListening = listener && listener.isListening();
                if(message.guild && message.guild.me){
                    if(isListening){
                        message.guild.me.setNickname('little-daiko 🟢');
                    }else{
                        message.guild.me.setNickname('little-daiko 🔴');
                    }
                }
                const status = isListening ? "listening" : "stopped";
                message.channel.send(`Current status: \`${status}\`.`)
            },
            help: 
            [
                {
                    usage: `status`,
                    description: `Lists the status of the chat listener for the server.`
                },
            ]
        },
        {
            aliases: ['remote', 'rem'],
            permissions: 100, 
            callback: async (message, args) => { 
                if(args.length > 1){
                    const command = commands(appConfig).find(c => { return c.aliases.includes(args[1]); });
                    const override = {
                        guild: {
                            id: args[0]
                        }
                    }
                    return await command.callback(message, args.slice(2), override);
                }
                return REACT_ERROR;
            },
            help: 
            [
                {
                    usage: `remote <server id> <command> <command args>`,
                    description: oneline`Allows remote execution of commands on deployed servers by the bot owner, 
                    for checking on bot status and assisting with setup.`
                },
            ]
        },
        {
            aliases: ['servers', 'sv', 'guilds'],
            permissions: 100, 
            callback: async (message, args) => { 
                const guilds = message.guild.me.client.guilds.cache.array().map((guild) => {
                    return {
                        name: `${guild.name}`,
                        value: `\`${guild.id}\``
                    }
                });
                message.channel.send(discordHelpers.generateEmbed({
                    message: 'Connected Servers:',
                    fields: guilds
                }));
            },
            help: 
            [
                {
                    usage: `servers`,
                    description: oneline`Lists all servers that the bot is currently connected to.`
                },
            ]
        },
        {
            aliases: ['help', 'h'],
            permissions: 1,
            callback: async (message, args, override) => { 
                const configKey = override ? override : message;
                const prefix = appConfig.CONFIG_STORAGE.getProperty(configKey, 'prefix');
                if(args && args.length > 0){
                    for(let entry of commands(appConfig)){
                        if(entry.aliases.includes(args[0])){
                            const fields = entry.help.map(value => {
                                return {
                                    name: `\`${prefix}${value.usage}\``,
                                    value: `Usable by: ${appConfig.PERMISSIONS(appConfig)[entry.permissions].description}.\n\n${value.description}`,
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
                    return `\`${value.aliases.join(', ')}\``;
                }).sort((a, b) => { 
                    return a.localeCompare(b);
                });

                await message.channel.send(discordHelpers.generateEmbed({
                    message: `Here's a list of possible commands and their aliases. 
                    You can learn more about them by typing \`${prefix}help <command>\`.
                    ${fields.join('\n')}`,
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