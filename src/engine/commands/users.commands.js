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
        ['users', 'u'],
        2,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            if(args && args.length > 1){
                const action = args[0];
                let users = appConfig.CONFIG_STORAGE.getProperty(configKey, 'users');
                users = users ? users : [];
                const argIds = [...new Set(args.map((user) => {
                    return Number(user);
                }).filter((user) => { 
                    return !isNaN(user) 
                }))];
                if(argIds.length <= 0){
                    return LiteralConstants.REACT_ERROR_EMOJI;
                }
                if("remove" === action){
                    const updatedUsers = users.filter((user) => { 
                        return !argIds.includes(user)
                    });
                    if(updatedUsers.length === users.length){
                        // no users removed
                        return LiteralConstants.REACT_ERROR_EMOJI;
                    }
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "users", updatedUsers);
                    return LiteralConstants.REACT_OK_EMOJI;
                }else if("add" === action){
                    const updatedUsers = [...new Set(users.concat(argIds))];
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "users", updatedUsers);
                    return LiteralConstants.REACT_OK_EMOJI;
                }
            }
            return LiteralConstants.REACT_ERROR_EMOJI;
        },
        [
            new HelpTip(
                `users add <list of numeric user ids>`,
                oneline`Adds all listed user ids to the list of users to listen for. 
                The list must be space-separated. The user ids must be numbers.
                The streamer is implicitly on the list.`
            ),
            new HelpTip(
                `users remove <list of numeric user ids>`,
                oneline`Removes all listed user ids from the list of users to listen for. 
                The list must be space-separated. The user ids must be numbers.`
            ),
        ]
    );
}

module.exports.UsersCommand = command;