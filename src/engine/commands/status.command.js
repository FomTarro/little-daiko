const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { LiteralConstants } = require('../../utils/literal.constants');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['status'],
        2,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            const guild = appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == configKey.guild.id);
            const listener = appConfig.LISTENER_STORAGE.getListener(configKey);
            const isListening = listener && listener.isListening();
            if(guild && guild.me){
                guild.me.setNickname(isListening == true ? LiteralConstants.BOT_NAME_ONLINE : LiteralConstants.BOT_NAME_OFFLINE);
            }
            appConfig.CONFIG_STORAGE.setProperty(configKey, 'listening', Boolean(isListening));

            const status = isListening ? "listening" : "stopped";
            message.channel.send({content: `Current status: \`${status}\`.`});
        },
        [
            new HelpTip(
                `status`,
                `Lists the status of the chat listener for the server.`
            ),
        ],
        `Displays the listener status.`
    );
}

module.exports.StatusCommand = command;