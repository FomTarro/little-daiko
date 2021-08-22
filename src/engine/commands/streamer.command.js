const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { LiteralConstants } = require('../../utils/literal.constants');
const oneline = require('oneline');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
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
        ],
        `Designates the stream for the bot to listen to.`
    );
}

module.exports.StreamerCommand = command;