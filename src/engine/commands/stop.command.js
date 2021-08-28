const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { Logger } = require('../../utils/logger');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['stop', 'x'],
        2, 
        async (message, args, override) => { 
            const configKey = override ? override : message;
            const logger = new Logger(appConfig.DISCORD_HELPERS.getGuildId(configKey));
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
        ],
        `Stops listening to the designated stream.`
    );
}

module.exports.StopCommand = command;