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
        ],
        `Designates which channels various messages output to.`
    );
}

module.exports.OutputCommand = command;