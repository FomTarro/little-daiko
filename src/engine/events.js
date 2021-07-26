const { AppConfig } = require("../../app.config");
const { Message } = require('discord.js');

/**
 * The callback for an event.
 *
 * @callback EventCallback
 * @param {Message} message
 * @param {ErrorCallback} onError
 */

/**
 * The callback for an error.
 *
 * @callback ErrorCallback
 * @param {Message} message
 * @param {*} Exception
 */

/**
 * List of events for the discord client to listen for.
 * @param {AppConfig} appConfig The dependency injection config.
 * @returns {Map<string, EventCallback>} Map of events indexed by name.
 */
function events(appConfig) { 
    const discordHelpers = appConfig.DISCORD_HELPERS;
        return new Map([
        ["guildDelete", async (input, onError) => {
            return appConfig.CONFIG_STORAGE.deleteGuildConfig(input);
        }],
        ["message", async (message, onError) => { 
            if(discordHelpers.isDm(message) || discordHelpers.isBot(message)){
                return;
            }
            const prefix = appConfig.CONFIG_STORAGE.getProperty(message, 'prefix');
            if(message.content.indexOf(prefix) !== 0){ 
                return; 
            }
            const [...args] = message.content.split(/\s+/g);
            const command = args.shift().slice(prefix.length).toLowerCase();
            const role = appConfig.CONFIG_STORAGE.getProperty(message, 'role');
            for(let entry of appConfig.COMMANDS(appConfig)){
                if(entry.aliases.includes(command)){
                    if(appConfig.PERMISSIONS(appConfig).get(entry.permissionLevel).check(message, role.ops)){
                        entry.callback(message, args).then((out) => { 
                            if(out){
                                message.react(out);
                            }
                        }).catch((e) => { 
                            onError(message, e);
                        });
                    }else{
                        message.channel.send('You do not have permission to use that command.');
                    }
                    return;
                }
            }
        }]
    ]);
}

module.exports = events;