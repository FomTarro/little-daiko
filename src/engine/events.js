const { AppConfig } = require("../../app.config");
const { Message, Client } = require('discord.js');
const { LiteralConstants } = require("../models/literal.constants");
const { Logger } = require('../utils/logger');

/**
 * The callback for an event.
 *
 * @callback EventCallback
 * @param {Client} client
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
        ["ready", async (client, input, onError) => {
            for(let guild of client.guilds.cache.array()){
                if(guild && guild.me){
                    guild.me.setNickname(LiteralConstants.BOT_NAME_OFFLINE);
                    // TODO: notify servers of changes since last login
                }
                // logger.log(`${guild.name} | ${guild.id}`);
                new Logger(appConfig.DISCORD_HELPERS.getGuildId(guild)).log(LiteralConstants.LOG_SESSION_START);
                const dummyMessage = {
                    guild: guild,
                    channel:{send(){}}
                }
                try{
                    const listening = appConfig.CONFIG_STORAGE.getProperty(guild, 'listening');
                    if(listening == true){
                        await appConfig.COMMANDS(appConfig).find(c => c.aliases.includes('start')).callback(dummyMessage);
                    }
                }catch(e){
                    console.log(e);
                    onError(dummyMessage, `Error staring listener for Guild: ${appConfig.DISCORD_HELPERS.getGuildId(guild)}: ${e.stack ? e.stack : e}`);
                }
            }
        }],
        ["guildDelete", async (client, input, onError) => {
            return appConfig.CONFIG_STORAGE.deleteGuildConfig(input);
        }],
        ["message", async (client, message, onError) => { 
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
        }],
        ["error", async (input, onError) => {
            onError(input);
        }]
    ]);
}

module.exports = events;