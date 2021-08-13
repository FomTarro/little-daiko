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
        ['help', 'h'],
        1,
        async (message, args, override) => { 
            const configKey = override ? override : message;
            const prefix = appConfig.CONFIG_STORAGE.getProperty(configKey, 'prefix');
            if(args && args.length > 0){
                for(let entry of appConfig.COMMANDS(appConfig)){
                    if(entry.aliases.includes(args[0])){
                        const fields = entry.helpTips.map(value => {
                            return {
                                name: `\`${prefix}${value.usage}\``,
                                value: `${value.description}`,
                            };
                        });
                        fields.unshift({
                            name:  `Command Information:`,
                            value: `Aliases: \`[${entry.aliases.join(', ')}]\`\nUsable by: ${appConfig.PERMISSIONS(appConfig).get(entry.permissionLevel).description}.`
                        });

                        message.channel.send(appConfig.DISCORD_HELPERS.generateEmbed({
                            fields: fields
                        }));
                        return;
                    }
                }
                return LiteralConstants.REACT_ERROR_EMOJI;
            }
            const fields = appConfig.COMMANDS(appConfig).map((value) => {
                return `\`[${value.aliases.join(', ')}]\``;
            }).sort((a, b) => { 
                return a.localeCompare(b);
            });

            await message.channel.send(appConfig.DISCORD_HELPERS.generateEmbed({
                fields: [{
                    name: `General Help:`,
                    value: `Commands can be invoked by prefixing a message with \`${prefix}\`, or by mentioning the bot with the desired command.
                You can learn more about commands and their usages by typing \`${prefix}help <command>\`.`
                },
                {
                    name: `Command and Alias List:`,
                    value:  `${fields.join('\n')}`
                }],
            }));
        },
        [
            new HelpTip(
                `help`,
                `Displays a list of all commands and their aliases.`
            ),
            new HelpTip(
                `help <command>`,
                `Displays usage information about a specific command.`
            ),
        ]
    );
}

module.exports.HelpCommand = command;