const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { LiteralConstants } = require('../../utils/literal.constants');
const oneline = require('oneline');;

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['servers', 'sv', 'guilds'],
        100, 
        async (message, args, override) => { 
            const configKey = override ? override : message;
            const guilds = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).map((guild) => {
                const listener = appConfig.LISTENER_STORAGE.getListener(guild);
                const isListening = listener && listener.isListening();
                return {
                    name: `${guild.name}`,
                    value: `\`${guild.id}\` ${isListening == true ? LiteralConstants.ONLINE_EMOJI : LiteralConstants.OFFLINE_EMOJI}`
                }
            });
            message.channel.send(appConfig.DISCORD_HELPERS.generateEmbed({
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
    );
}

module.exports.ServerCommand = command;