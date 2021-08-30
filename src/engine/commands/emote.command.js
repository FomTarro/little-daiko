const { AppConfig } = require("../../../app.config");
const { isEmote } = require("../../adapters/mildom/mildom.client");
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
        ['emote', 'em', 'e'],
        2,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            if(args && args.length > 1){
                const operation = args[0].toLowerCase();
                let platformEmote = args[1].toLowerCase();
                platformEmote = isEmote(platformEmote) 
                ? platformEmote.substr(2, platformEmote.length-3) 
                : platformEmote;
                if(isNaN(new Number(platformEmote))){
                    return LiteralConstants.REACT_ERROR_EMOJI;
                }
                let emoteMap = appConfig.CONFIG_STORAGE.getProperty(configKey, "emotes");
                emoteMap = emoteMap ? emoteMap : {};
                if(operation === 'add' && args.length > 2){
                    const discordEmote = args[2].toLowerCase();
                    emoteMap[platformEmote] = discordEmote;
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "emotes", emoteMap);
                    return LiteralConstants.REACT_OK_EMOJI;
                }else if(operation === 'remove'){
                    delete emoteMap[platformEmote];
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "emotes", emoteMap);
                    return LiteralConstants.REACT_OK_EMOJI;
                }
            }
            return LiteralConstants.REACT_ERROR_EMOJI;
        },      
        [
            new HelpTip(
                `emote add <mildom emote number> <discord emote>`,
                oneline`Sets the Discord emote equivalent of a Mildom emote that is contained in a transmitted message.`
            ),
            new HelpTip(
                `emote remove <mildom emote number>`,
                oneline`Removes the Discord emote equivalent of a Mildom emote.`
            ),
        ],
        `Sets how Mildom emotes are displayed in Discord.`
    );
}

module.exports.EmoteCommand = command;