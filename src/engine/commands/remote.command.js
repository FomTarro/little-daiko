const { AppConfig } = require("../../../app.config");
const { Command, HelpTip } = require('../../models/command');
const { LiteralConstants } = require('../../utils/literal.constants');
const { Logger } = require('../../utils/logger');
const oneline = require('oneline');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new Command(
        ['remote', 'rem'],
        100, 
        async (message, args, override) => { 
            const configKey = override ? override : message;
            if(args.length > 1 && appConfig.DISCORD_HELPERS.getOtherBotGuilds(message).find(g => g.id == args[0])){
                const command = appConfig.COMMANDS(appConfig).find(c => { return c.aliases.includes(args[1]); });
                const newOverride = {
                    guild: {
                        id: args[0]
                    }
                }
                const origin = appConfig.DISCORD_HELPERS.getGuildId(message);
                new Logger(origin).log(`Remote execution of command: [${args[1]}] on server: ${args[0]}`);
                new Logger(args[0]).log(`Remote execution of command: [${args[1]}] from server: ${origin}`);
                await command.callback(message, args.slice(2), newOverride);
                return LiteralConstants.REACT_OK_EMOJI;
            }
            return LiteralConstants.REACT_ERROR_EMOJI;
        }, 
        [
            new HelpTip(
                `remote <server id> <command> <command args>`,
                oneline`Allows remote execution of commands on deployed servers by the bot owner, 
                for checking on bot status and assisting with setup.`
            ),
        ]
    );
}

module.exports.RemoteCommand = command;