const { AppConfig } = require("../../../app.config");
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
        ['timestamp', 'ts', 't'],
        1,
        async(message, args, override) => {
            const configKey = override ? override : message;
            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
            const listener = appConfig.LISTENER_STORAGE.getListener(configKey);
            if(args.length > 0){
                const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
                const languages = [...Object.entries(appConfig.CONFIG_STORAGE.getProperty(configKey, 'output').chat)].filter(c => { 
                    return appConfig.DISCORD_HELPERS.getChannel(guild, c[1]) == message.channel
                });
                if(languages.length > 0){
                    const liveInfo = await listener.getLiveStatus();
                    if(liveInfo.isLive() == true){
                        const now = Date.parse(new Date()) - 10000;
                        const timestamp = new Timestamp(liveInfo.startTime, now, args.join(' '));
                        const embed = await message.channel.send({
                            embeds: [
                                appConfig.DISCORD_HELPERS.generateEmbed(
                                    {
                                        message: `Timestamp:`,
                                        fields: [{
                                            name: `\`${formatTime(timestamp.stampTime - timestamp.startTime).print()}\``,
                                            value: `"${timestamp.description}"`
                                        }]
                                    }
                                )
                            ],
                            components: [
                                appConfig.DISCORD_HELPERS.generateButtonRow([
                                    { label: '-10s', customId: 'add_ten', style: 2 },
                                    { label: '+10s', customId: 'subtract_ten', style: 2 },
                                ])
                            ],
                        });
                        for(let language of languages){
                            //const timestampEntry = `${timestamp.time.print()} - ${timestamp.description}`
                            logger.log(`Writing timestamp: ${timestamp}`);
                            appConfig.TIMESTAMP_STORAGE.addTimestamp(guild, language[0], embed.id, timestamp);
                        }
                        await embed.react(LiteralConstants.REACT_UPVOTE_EMOJI);
                        await embed.react(LiteralConstants.REACT_DOWNVOTE_EMOJI);
                        return;
                    }
                    message.channel.send({
                        content: `Stream is not currently live!`
                    });
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
        ],
        `Creates a note about a moment from the stream.`
    );
}

module.exports.TimestampCommand = command;