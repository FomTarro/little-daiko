const { AppConfig } = require("../../../app.config");
const { sanitize } = require("../../adapters/mildom/mildom.client");
const { FlushCommand } = require("./flush.command");
const { Command, HelpTip } = require('../../models/command');
const { Timestamp } = require("../../models/timestamp");
const { LiteralConstants } = require('../../utils/literal.constants');
const { Logger } = require('../../utils/logger');
const { formatTime } = require('../../utils/time.utils');
const oneline = require('oneline');

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
                // console.log(comment);
                const channels = appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat;
                const users = appConfig.CONFIG_STORAGE.getProperty(configKey, "users");
                for(let language in channels){
                    if(comment.authorId == streamer
                    || (users.includes(comment.authorId) 
                    && comment.message.toLowerCase().startsWith(`[${language.toLowerCase()}]`))){
                        if(comment.time > startEpoch){
                            const liveInfo = await listener.getLiveStatus();
                            if(liveInfo.isMembership() == false){ // bypass all this if it's membership only
                                const chatChannel = appConfig.DISCORD_HELPERS.getChannel(guild, channels[language]);
                                if(chatChannel){
                                    const emotes = appConfig.CONFIG_STORAGE.getProperty(configKey, "emotes");
                                    // TODO: handle when there are 0 properties on the object
                                    const emotePairs = emotes ? [...Object.entries(emotes)] : [];
                                    comment.message = sanitize(comment.message, emotePairs);
                                    logger.log(`Posting: ${JSON.stringify(comment)} in channel: ${chatChannel.id}`);
                                    const embed = await chatChannel.send({ embeds: [appConfig.DISCORD_HELPERS.generateEmbed(comment)]});
                                    // post message to timestamps log if we're live
                                    if(liveInfo.isLive()){
                                        const now = Date.parse(new Date())
                                        const timestamp = new Timestamp(formatTime(now - liveInfo.startTime), `${comment.authorName}: ${comment.message}`);
                                        appConfig.TIMESTAMP_STORAGE.addTimestamp(guild, language, embed.id, `${timestamp.time.print()} - ${timestamp.description}`);
                                    }
                                }
                            }else{
                                logger.log(`Bypassing post because stream is membership-only.`);
                                logger.log(JSON.stringify(comment));
                                return;
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
                    logger.log(`Posting: ${post} in channel: ${alertChannel.id}`);
                    alertChannel.send({content: post });
                }
            },
            // on live end
            async (live) => {
                await FlushCommand(appConfig).callback(message, args, override);
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

            await message.channel.send({content: `Starting listener.`});
            appConfig.LISTENER_STORAGE.setListener(configKey, listener);
            appConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', true);
            logger.log(`Listener instantiated.`);

            // flush if stream is offline when start up (IE, bot went down and we missed the onLiveEnd event)
            const liveStatus = await listener.getLiveStatus()
            if(!liveStatus.isLive()){
                await FlushCommand(appConfig).callback(message, args, override);
            }
        }, 
        [
            new HelpTip(
                `start`,
                oneline`Starts listening to the chat of the selected streamer, 
                for messages tagged with the designated language tag that are posted by users on the designated users list.`
            ),
        ],
        `Starts listening to the designated stream.`
    );
}

module.exports.StartCommand = command;