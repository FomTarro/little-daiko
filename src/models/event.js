const { AppConfig } = require('../../app.config');
const DiscordHelpers = AppConfig.DISCORD_HELPERS;

const events = new Map([
    ["guildDelete", async (input, onError) => {
        return AppConfig.CONFIG_STORAGE.deleteGuildConfig(input);
    }],
    ["message", async (message, onError) => { 
        if(DiscordHelpers.isDm(message) || DiscordHelpers.isBot(message)){
            return;
        }
        const prefix = AppConfig.CONFIG_STORAGE.getProperty(message, 'prefix');
        if(message.content.indexOf(prefix) !== 0){ 
            return; 
        }
        const [...args] = message.content.split(/\s+/g);
        const command = args.shift().slice(prefix.length).toLowerCase();
        const role = AppConfig.CONFIG_STORAGE.getProperty(message, 'role');
        AppConfig.COMMANDS.forEach(entry => {
            if(entry.aliases.includes(command) 
            && entry.permissions(message, role)){
                entry.callback(message, args).then((out) => { 
                    message.react(out);
                }).catch((e) => { 
                    onError(message, e);
                });
                return;
            }
        })
     }]
]);

module.exports = events;