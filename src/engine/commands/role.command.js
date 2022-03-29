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
        ['role', 'r'],
        3,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            if(args && args.length > 1){
                const type = args[0];
                const roles =  appConfig.CONFIG_STORAGE.getProperty(configKey, "role");
                if(type === 'ops'){
                    roles.ops = args[1];
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                    return LiteralConstants.REACT_OK_EMOJI;
                }
                else if(type === 'alert'){
                    roles.alert = args[1];
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                    return LiteralConstants.REACT_OK_EMOJI;
                }
                else if(type === 'membership'){
                    roles.membership = args[1];
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                    return LiteralConstants.REACT_OK_EMOJI;
                }
            }
            return LiteralConstants.REACT_ERROR_EMOJI;
        }, 
        [
            new HelpTip(
                `role ops <role name or id>`,
                oneline`Sets the role of permitted operators of the bot for this server.
                The server owner and the developer are granted these permissions without needing the role.`
            ),
            new HelpTip(
                `role alert <role name or id>`,
                oneline`Sets the role to ping when the designated streamer goes live. 
                The alert will be posted in the designated alert channel.`
            ),
            new HelpTip(
                `role membership <role name or id>`,
                oneline`Sets the role to ping when the designated streamer goes live with a members-only stream. 
                The alert will be posted in the designated alert channel.`
            ),
        ],
        `Designates which Discord roles are used for various features.`
    );
}

module.exports.RoleCommand = command;