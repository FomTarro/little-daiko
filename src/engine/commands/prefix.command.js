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
        ],
        `Assigns the prefix for using commands.`
    );
}

module.exports.PrefixCommand = command;