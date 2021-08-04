const { AppConfig } = require("../../app.config");
const { Command, HelpTip } = require('../models/command');
const { Timestamp } = require("../models/timestamp");
const { LiteralConstants } = require('../utils/literal.constants');
const { Logger } = require('../utils/logger');
const { formatTime } = require('../utils/time.utils');
const oneline = require('oneline');

/**
 * A list of command definitions for the bot to listen to, 
 * including permission levels, the callback function, and help tooltips.
 * @param {AppConfig} appConfig The dependency injection config.
 * @returns {Command[]} The list of commands.
 */
function commands(appConfig){
    const discordHelpers = appConfig.DISCORD_HELPERS;
    return [
        new Command(
            ['config', 'conf', 'c'],
            2,
            async (message, args, override) => { 
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
            [
                new HelpTip(
                    `config`,
                    oneline`Displays a list of all configurable properties for the server.`
                ),
            ]
        ),
        new Command(
            ['prefix', 'p'],
            2,
            async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 0){
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "prefix", args[0]);
                    return LiteralConstants.REACT_OK_EMOJI;
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            },
            [
                new HelpTip(
                    `prefix <prefix string>`,
                    `Sets the prefix to denote bot commands.`
                ),
            ]
        ),
        new Command(
            ['role', 'r'],
            3,
            async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 1){
                    const type = args[0];
                    const roles =  appConfig.CONFIG_STORAGE.getProperty(configKey, "role");
                    if(type === 'ops'){
                        roles.ops = args[1];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                        return LiteralConstants.REACT_OK_EMOJI;
                    }
                    if(type === 'alert'){
                        roles.alert = args[1];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                        return LiteralConstants.REACT_OK_EMOJI;
                    }
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            }, 
            [
                new HelpTip(
                    `role ops <role name or id>`,
                    oneline`Sets the role name of permitted bot operators for this server.
                    The server owner and the bot owner are granted these permissions without needing the role.`
                ),
                new HelpTip(
                    `role alert <role name or id>`,
                    oneline`Sets the role to ping when the designated streamer goes live. 
                    The alert will be posted in the designated alert channel.`
                ),
            ]
        ),
        new Command(
            ['streamer', 's'],
            2,
            async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args && args.length > 0){
                    const argId = Number(args[0]);
                    if(!isNaN(argId)){
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "streamer", argId);
                        return LiteralConstants.REACT_OK_EMOJI;
                    }
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            },
            [
                new HelpTip(
                    `streamer <streamer id>`,
                    oneline`Sets the streamer to listen to. The streamer id must be a number. 
                    If this is changed while the listener is currently active, the listener will need to be restarted.`
                ),
            ]
        ),
        new Command(
            ['users', 'u'],
            2,
            async (message, args, override) => { 
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
                        return LiteralConstants.REACT_ERROR_EMOJI;
                    }
                    if("remove" === action){
                        const updatedUsers = users.filter((user) => { 
                            return !argIds.includes(user)
                        });
                        if(updatedUsers.length === users.length){
                            // no users removed
                            return LiteralConstants.REACT_ERROR_EMOJI;
                        }
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "users", updatedUsers);
                        return LiteralConstants.REACT_OK_EMOJI;
                    }else if("add" === action){
                        const updatedUsers = [...new Set(users.concat(argIds))];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "users", updatedUsers);
                        return LiteralConstants.REACT_OK_EMOJI;
                    }
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            },
            [
                new HelpTip(
                    `users add <list of numeric user ids>`,
                    oneline`Adds all listed user ids to the list of users to listen for. 
                    The list must be space-separated. The user ids must be numbers.
                    The streamer is implicitly on the list.`
                ),
                new HelpTip(
                    `users remove <list of numeric user ids>`,
                    oneline`Removes all listed user ids from the list of users to listen for. 
                    The list must be space-separated. The user ids must be numbers.`
                ),
            ]
        ),
        new Command(
            ['output', 'out', 'o'],
            2,
            async (message, args, override) => { 
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
                                return LiteralConstants.REACT_OK_EMOJI;
                            }else if(operation === 'remove'){
                                delete channels.chat[language];
                                appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                                return LiteralConstants.REACT_OK_EMOJI;
                            }
                        }
                    }
                    if(type === 'alert'){
                        channels.alert = args[1];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                        return LiteralConstants.REACT_OK_EMOJI;
                    }
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            }, 
            [
                new HelpTip(
                    `output chat add <language prefix> <channel name or id>`,
                    oneline`Sets the server channel which stream messages with the designated language prefix will be posted to.
                    Stream messages from the streamer will go to all language channels.`
                ),
                new HelpTip(
                    `output chat remove <language prefix>`,
                    `Stops posting to the server for the given language prefix.`
                ),
                new HelpTip(
                    `output alert <channel name or id>`,
                    `Sets the server channel which stream go-live alerts will be posted to.`
                ),
            ]
        ),
        new Command(
            ['start', 'listen', 'l'],
            2,
            async (message, args, override) => { 
                const configKey = override ? override : message;
                const logger = new Logger(discordHelpers.getGuildId(configKey));
                const guild = discordHelpers.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
                const startEpoch = Date.parse(new Date());
                const streamer = Number(appConfig.CONFIG_STORAGE.getProperty(configKey, 'streamer'));
                logger.log(`Starting listener for streamer: ${streamer}!`)
                const listener = await appConfig.MILDOM_CLIENT.startListener(streamer, 
                // on message
                async (comment) => {
                    const channels = appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat;
                    const users = appConfig.CONFIG_STORAGE.getProperty(configKey, "users");
                    for(let prefix in channels){
                        if(comment.authorId == streamer
                        || (users.includes(comment.authorId) 
                        && comment.message.toLowerCase().startsWith(`[${prefix.toLowerCase()}]`))){
                            if(comment.time > startEpoch){
                                const chatChannel = discordHelpers.getChannel(guild, channels[prefix]);
                                if(chatChannel){
                                    logger.log(`Posting: ${JSON.stringify(comment)}`);
                                    const embed = await chatChannel.send(appConfig.DISCORD_HELPERS.generateEmbed(comment));
                                    // post message to timestamps log if we're live
                                    const liveInfo = await listener.getLiveStatus();
                                    if(liveInfo.isLive()){
                                        const now = Date.parse(new Date())
                                        const timestamp = new Timestamp(formatTime(now - liveInfo.startTime), `${comment.authorName}: ${comment.message}`);
                                        appConfig.TIMESTAMP_STORAGE.addTimestamp(guild, prefix, embed.id, `${timestamp.time.print()}: ${timestamp.description}`);
                                    }
                                }
                            }
                        }
                    }
                },
                // on go live
                async (live) => {
                    const alertRole = discordHelpers.getRole(guild, appConfig.CONFIG_STORAGE.getProperty(configKey, 'role').alert);
                    const alertChannel = discordHelpers.getChannel(guild, appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').alert);
                    if(alertChannel){
                        const post = `${alertRole ? alertRole : 'NOW LIVE:'} https://www.mildom.com/${streamer}`;
                        logger.log(`Posting: ${post}`);
                        alertChannel.send(post);
                    }
                },
                // on live end
                async (live) => {
                    generateTimestampSummary(appConfig, configKey, guild, logger);
                },
                // on open
                async () => {
                    if(guild && guild.me){
                        guild.me.setNickname(LiteralConstants.BOT_NAME_ONLINE);
                    }
                },
                // on close
                async () => {
                    if(guild && guild.me){
                        guild.me.setNickname(LiteralConstants.BOT_NAME_OFFLINE);
                    }
                },
                logger);

                await message.channel.send(`Starting listener.`);
                appConfig.LISTENER_STORAGE.setListener(configKey, listener);
                appConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', true);
                logger.log(`Listener instantiated.`);

                // flush if stream is offline when start up (IE, bot went down and we missed the onLiveEnd event)
                const liveStatus = await listener.getLiveStatus()
                if(!liveStatus.isLive()){
                    generateTimestampSummary(appConfig, configKey, guild, logger);
                }
            }, 
            [
                new HelpTip(
                    `start`,
                    oneline`Starts listening to the chat of the selected streamer, 
                    for messages tagged with the designated language tag that are posted by users on the designated users list.`
                ),
            ]
        ),
        new Command(
            ['stop', 'x'],
            2, 
            async (message, args, override) => { 
                const configKey = override ? override : message;
                const logger = new Logger(discordHelpers.getGuildId(configKey));
                await message.channel.send("Stopping listener.");
                appConfig.LISTENER_STORAGE.deleteListener(configKey);
                appConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', false);
                logger.log(`Stopping listener.`);
            },
            [
                new HelpTip(
                    `stop`,
                    `Stops listening to the chat of the selected streamer.`
                ),
            ]
        ),
        new Command(
            ['timestamp', 'ts'],
            1,
            async(message, args, override) => {
                const configKey = override ? override : message;
                const logger = new Logger(discordHelpers.getGuildId(configKey));
                const listener = appConfig.LISTENER_STORAGE.getListener(configKey);
                if(args.length > 0){
                    const guild = discordHelpers.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
                    const languages = [...Object.entries(appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat)].filter(c => { 
                        return discordHelpers.getChannel(guild, c[1]) == message.channel
                    });
                    if(languages.length > 0){
                        const liveInfo = await listener.getLiveStatus();
                        if(liveInfo.isLive()){
                            const now = Date.parse(new Date()) - 10000;
                            const timestamp = new Timestamp(formatTime(now - liveInfo.startTime), args.join(' '));
                            const embed = await message.channel.send(discordHelpers.generateEmbed(
                                {
                                    message: `Timestamp:`,
                                    fields: [{
                                        name: `\`${timestamp.time.print()}\``,
                                        value: `"${timestamp.description}"`
                                    }]
                                }
                            ));
                            for(language of languages){
                                const timestampEntry = `${timestamp.time.print()}: ${timestamp.description}`
                                logger.log(`Writing timestamp: $timestampEntry}`);
                                appConfig.TIMESTAMP_STORAGE.addTimestamp(guild, language[0], embed.id, timestampEntry);
                            }
                            await embed.react(LiteralConstants.REACT_UPVOTE_EMOJI);
                            await embed.react(LiteralConstants.REACT_DOWNVOTE_EMOJI);
                            return;
                        }
                        message.channel.send(`Stream is not currently live!`);
                        return;
                    }
                    return LiteralConstants.REACT_ERROR_EMOJI;
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            },
            [
                new HelpTip(
                    `timestamp <text description>`,
                    oneline`Creates a timestamp ten seconds before invocation, with the given description. 
                    Timestamps can be upvoted or downvoted with the assigned reacts. 
                    If the number of downvotes is greater than the number of upvotes, the timestamp will be discarded.
                    A summary list of all remaining timestamps will be posted at the conclusion of the stream.`
                ),
            ]
        ),
        new Command(
            ['status'],
            2,
            async (message, args, override) => { 
                const configKey = override ? override : message;
                const guild = discordHelpers.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
                const listener = appConfig.LISTENER_STORAGE.getListener(configKey);
                const isListening = listener && listener.isListening();
                if(guild && guild.me){
                    guild.me.setNickname(isListening == true ? LiteralConstants.BOT_NAME_ONLINE : LiteralConstants.BOT_NAME_OFFLINE);
                }
                appConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', Boolean(isListening));

                const status = isListening ? "listening" : "stopped";
                message.channel.send(`Current status: \`${status}\`.`);
            },
            [
                new HelpTip(
                    `status`,
                    `Lists the status of the chat listener for the server.`
                ),
            ]
        ),
        new Command(
            ['remote', 'rem'],
            100, 
            async (message, args, override) => { 
                const configKey = override ? override : message;
                if(args.length > 1 && discordHelpers.getOtherBotGuilds(message).find(g => g.id == args[0])){
                    const command = commands(appConfig).find(c => { return c.aliases.includes(args[1]); });
                    const newOverride = {
                        guild: {
                            id: args[0]
                        }
                    }
                    const origin = discordHelpers.getGuildId(message);
                    new Logger(origin).log(`Remote execution of command: [${args[1]}] on server: ${args[0]}`);
                    new Logger(args[0]).log(`Remote execution of command: [${args[1]}] from server: ${origin}`);
                    await command.callback(message, args.slice(2), newOverride);
                    return LiteralConstants.REACT_OK_EMOJI;
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            }, 
            [
                new HelpTip(
                    `remote <server id> <command> <command args>`,
                    oneline`Allows remote execution of commands on deployed servers by the bot owner, 
                    for checking on bot status and assisting with setup.`
                ),
            ]
        ),
        new Command(
            ['servers', 'sv', 'guilds'],
            100, 
            async (message, args, override) => { 
                const configKey = override ? override : message;
                const guilds = discordHelpers.getOtherBotGuilds(message).map((guild) => {
                    const listener = appConfig.LISTENER_STORAGE.getListener(guild);
                    const isListening = listener && listener.isListening();
                    return {
                        name: `${guild.name}`,
                        value: `\`${guild.id}\` ${isListening == true ? LiteralConstants.ONLINE_EMOJI : LiteralConstants.OFFLINE_EMOJI}`
                    }
                });
                message.channel.send(discordHelpers.generateEmbed({
                    message: 'Connected Servers:',
                    fields: guilds
                }));
            },
            [
                new HelpTip(
                    `servers`,
                    oneline`Lists all servers that the bot is currently connected to.`
                ),
            ]
        ),
        new Command(
            ['help', 'h'],
            1,
            async (message, args, override) => { 
                const configKey = override ? override : message;
                const prefix = appConfig.CONFIG_STORAGE.getProperty(configKey, 'prefix');
                if(args && args.length > 0){
                    for(let entry of commands(appConfig)){
                        if(entry.aliases.includes(args[0])){
                            const fields = entry.helpTips.map(value => {
                                return {
                                    name: `\`${prefix}${value.usage}\``,
                                    value: `Usable by: ${appConfig.PERMISSIONS(appConfig).get(entry.permissionLevel).description}.\n\n${value.description}`,
                                };
                            });
                            message.channel.send(discordHelpers.generateEmbed({
                                message: 'Command Information:',
                                fields: fields
                            }));
                            return;
                        }
                    }
                    return LiteralConstants.REACT_ERROR_EMOJI;
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
            [
                new HelpTip(
                    `help`,
                    `Displays a list of all commands and their aliases.`
                ),
                new HelpTip(
                    `help <command>`,
                    `Displays usage information about a specific command.`
                ),
            ]
        ),
    ];
}

/**
 * 
 * @param {AppConfig} appConfig 
 * @param {*} configKey 
 * @param {*} guild 
 */
async function generateTimestampSummary(appConfig, configKey, guild, logger){
    logger.log(`Generating stream-end summary...`);
    const timestamps = appConfig.TIMESTAMP_STORAGE.getAllTimestamps(guild);
    if(timestamps && timestamps.length > 0){
        // get all language channels
        const channels = [...Object.entries(appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat)];
        for(entry of timestamps){
            // if timestamp log has content
            if(entry.length > 1){
                const language = entry[0];
                let summary = "";
                // find corresponding output channel
                const channel = appConfig.DISCORD_HELPERS.getChannel(guild, channels.find(c => c[0] == language)[1]);
                for(timestamp of entry[1]){
                    // check each stored timestamp for upvotes
                    if(timestamp.length > 1){
                        const timestampId = timestamp[0];
                        try{
                            const timestampMessage = await channel.messages.fetch(timestampId, true, true);
                            if(timestampMessage){
                                const upvotes = timestampMessage.reactions.cache.get(LiteralConstants.REACT_UPVOTE_EMOJI);
                                const upvoteCount = upvotes ? upvotes.count : 0;
                                const downvotes = timestampMessage.reactions.cache.get(LiteralConstants.REACT_DOWNVOTE_EMOJI);
                                const downvoteCount = downvotes ? downvotes.count : 0;
                                if(upvoteCount >= downvoteCount){
                                    // write to summary log if upvoted
                                    summary = summary.concat(timestamp[1], '\n');
                                }
                            }
                        }catch(e){
                            logger.error(`Unable to find message with ID: ${timestampId}: ${e}`);
                        }
                    }
                }
                if(summary.length > 0){
                    logger.log(`Posting ${language} summary:\n${summary}`);
                    const attachment = appConfig.DISCORD_HELPERS.generateAttachment(summary, `${language}-summary.txt`);
                    channel.send(`The stream has ended. Here's a summary:`, attachment);
                }
            }
        }
        // flush
        appConfig.TIMESTAMP_STORAGE.deleteGuildTimestamps(guild);
    }
}

module.exports = commands;