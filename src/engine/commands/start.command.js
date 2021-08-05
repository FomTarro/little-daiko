const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { Timestamp } = require("../../models/timestamp");
const { LiteralConstants } = require('../../utils/literal.constants');
const { Logger } = require('../../utils/logger');
const { formatTime } = require('../../utils/time.utils');
const oneline = require('oneline');
const { Guild } = require("discord.js");

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['start', 'listen', 'l'],
        2,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
            const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
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
                            const chatChannel = appConfig.DISCORD_HELPERS.getChannel(guild, channels[prefix]);
                            if(chatChannel){
                                logger.log(`Posting: ${JSON.stringify(comment)}`);
                                const embed = await chatChannel.send(appConfig.DISCORD_HELPERS.generateEmbed(comment));
                                // post message to timestamps log if we're live
                                const liveInfo = await listener.getLiveStatus();
                                if(liveInfo.isLive()){
                                    const now = Date.parse(new Date())
                                    const timestamp = new Timestamp(formatTime(now - liveInfo.startTime), `${comment.authorName}: ${comment.message}`);
                                    appConfig.TIMESTAMP_STORAGE.addTimestamp(guild, prefix, embed.id, `${timestamp.time.print()} - ${timestamp.description}`);
                                }
                            }
                        }
                    }
                }
            },
            // on go live
            async (live) => {
                const alertRole = appConfig.DISCORD_HELPERS.getRole(guild, appConfig.CONFIG_STORAGE.getProperty(configKey, 'role').alert);
                const alertChannel = appConfig.DISCORD_HELPERS.getChannel(guild, appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').alert);
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
    );
}

/**
 * 
 * @param {AppConfig} appConfig 
 * @param {*} configKey 
 * @param {Guild} guild 
 * @param {console} logger 
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

module.exports.StartCommand = command;