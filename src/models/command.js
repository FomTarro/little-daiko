const { AppConfig } = require('../../app.config');
const DiscordHelpers = AppConfig.DISCORD_HELPERS;

const REACT_OK = '✔️';
const REACT_ERROR = '❌'

/**
 * A! 
 */
const commands = [
    {
        aliases: ['config', 'conf', 'c'],
        permissions: async (user, role) => { 
            return true },
        callback: async (message, args) => { 
            const configProps = AppConfig.CONFIG_STORAGE.getAllProperties(message).map(prop => {
                return `${prop[0]}  :  ${prop[1]}`;
            });
            message.channel.send(`Here is this server's current configuration: \`\`\`${configProps.join("\n")}\`\`\``);
        },
        help: {
            // TODO
        }
    },
    {
        aliases: ['role', 'r'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) },
        callback: async (message, args) => { 
            if(args.length > 0){
                AppConfig.CONFIG_STORAGE.setProperty(message, "role", arg[0]);
                return REACT_OK;
            }
            return REACT_ERROR;
        },
        help: {
            // TODO
        }
    },
    {
        aliases: ['streamer', 's'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) },
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
        help: {
            // TODO
        }
    },
    {
        aliases: ['users', 'u'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) },
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
        help: {
            // TODO
        }
    },
    {
        aliases: ['channel', 'ch'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) },
        callback: async (message, args) => { 
            if(args.length > 0){
                AppConfig.CONFIG_STORAGE.setProperty(message, "channel", args[0]);
                return REACT_OK;
            }
            return REACT_ERROR;
        },
        help: {
            // TODO
        }
    },
    {
        aliases: ['start', 'listen', 'l'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) },
        callback: async (message, args) => { 
            message.channel.send("Starting listener.");
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
            return REACT_OK;
        },
        help: {
            // TODO
        }
    },
    {
        aliases: ['stop', 'x'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) },
        callback: async (message, args) => { 
            message.channel.send("Stopping listener.");
            AppConfig.LISTENER_STORAGE.deleteListener(message);
            return REACT_OK;
        },
        help: {
            // TODO
        }
    },
]

module.exports = commands;