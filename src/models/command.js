const { AppConfig } = require('../../app.config');
const DiscordHelpers = AppConfig.DISCORD_HELPERS;

const commands = [
    {
        aliases: ['config', 'conf'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) },
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
        aliases: ['streamer', 's'],
        permissions: async (user, role) => { 
            return DiscordHelpers.isBotOwner(user) 
            || DiscordHelpers.isGuildOwner(user) 
            || DiscordHelpers.isAdmin(user, role) },
        callback: async (message, args) => { 
            if(args.length > 0){
                const argId = Number.parseInt(args[0]);
                console.log(argId);
                if(!isNaN(argId)){
                    AppConfig.CONFIG_STORAGE.setProperty(message, "streamer", argId);
                }
            }
        },
        help: {
            // TODO
        }
    },
]

module.exports = commands;