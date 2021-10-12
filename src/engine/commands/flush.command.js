const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { Logger } = require('../../utils/logger');
const { LiteralConstants } = require('../../utils/literal.constants');
const { formatTime } = require('../../utils/time.utils');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['flush', 'f'],
        2,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
            const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
            const timestamps = appConfig.TIMESTAMP_STORAGE.getAllTimestamps(guild);
            logger.log(`Generating stream-end summary...`);
            if(timestamps && timestamps.length > 0){
                // get all language channels
                const channels = [...Object.entries(appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat)];
                for(entry of timestamps){
                    // if timestamp log has content
                    if(entry.length > 1){
                        const language = entry[0];
                        const summary = [];
                        // find corresponding output channel
                        const channel = appConfig.DISCORD_HELPERS.getChannel(guild, channels.find(c => c[0] == language)[1]);
                        for(timestamp of entry[1]){
                            // check each stored timestamp for upvotes
                            if(timestamp.length > 1){
                                const timestampId = timestamp[0];
                                try{
                                    const timestampMessage = await channel.messages.fetch(timestampId);
                                    if(timestampMessage){
                                        const upvotes = timestampMessage.reactions.cache.get(LiteralConstants.REACT_UPVOTE_EMOJI);
                                        const upvoteCount = upvotes ? upvotes.count : 0;
                                        const downvotes = timestampMessage.reactions.cache.get(LiteralConstants.REACT_DOWNVOTE_EMOJI);
                                        const downvoteCount = downvotes ? downvotes.count : 0;
                                        if(upvoteCount >= downvoteCount){
                                            // write to summary log if upvoted
                                            const timestampEntry = `${formatTime(
                                                timestamp[1].stampTime + 
                                                timestamp[1].adjustment - 
                                                timestamp[1].startTime).print()} - ${timestamp[1].description}`
                                            summary.push(timestampEntry);
                                            // console.log(`${guild.id} - ${language} - ${JSON.stringify(timestamp)}`);
                                        }
                                        // disables the buttons
                                        await timestampMessage.edit({
                                            components: timestampMessage.components.map((a) => {
                                                    a.components.map((b) => {
                                                    b.setDisabled(true);
                                                    return b;
                                                })
                                                return a;
                                            })
                                        })
                                    }
                                }catch(e){
                                    logger.error(`Unable to find message with ID: ${timestampId}: ${e}`);
                                }
                            }
                        }
                        if(summary.length > 0){
                            const content = summary.sort().join('\n');
                            logger.log(`Posting ${language} summary:\n${content}`);
                            const attachment = appConfig.DISCORD_HELPERS.generateAttachment(content, `${language}-summary.txt`);
                            await channel.send({ content: `The stream has ended. Here's a summary:`, files: [ attachment ]});
                        }
                    }
                }
                // flush
                appConfig.TIMESTAMP_STORAGE.deleteGuildTimestamps(guild);
            }
        },
        [
            new HelpTip(
                `flush`,
                `Flushes all timestamps to log files immediately, and posts them to their respective channels. 
                Flushing happens automatically on stream end, so you will probably never need to invoke this command manually.`
            ),
        ],
        `Dumps current timestamps to a log.`
    );
}

module.exports.FlushCommand = command;