const { AppConfig } = require("../../../app.config");
const { SlashCommand, HelpTip } = require('../../models/slash.command');
const { SlashCommandBuilder } = require('@discordjs/builders');
const oneline = require('oneline');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {SlashCommand}
 */
function command(appConfig){
    return new SlashCommand(
        ['help'],
        1,
        async (interaction) => { 
            const args = interaction.options.get('command');
            if(args && args.value){
                for(let entry of appConfig.SLASH_COMMANDS(appConfig)){
                    if(entry.aliases.includes(args.value)){
                        const fields = entry.helpTips.map(value => {
                            return {
                                name: `\`/${value.usage}\``,
                                value: `${value.description}`,
                            };
                        });
                        fields.unshift({
                            name:  `Command Information:`,
                            value: `Alternate Names: \`[${entry.aliases.join(', ')}]\`\nUsable by: ${appConfig.PERMISSIONS(appConfig).get(entry.permissionLevel).description}.`
                        });

                        return await interaction.reply({
                            embeds: [
                                appConfig.DISCORD_HELPERS.generateEmbed({ fields: fields })
                            ]
                        });
                    }
                }
                // else do nothing
            }
            const fields = appConfig.SLASH_COMMANDS(appConfig).map((value) => {
                return `\`[${value.aliases.join(', ')}]\` - ${value.summary}`;
            }).sort((a, b) => { 
                return a.localeCompare(b);
            });

            return await interaction.reply({
                embeds: [
                    appConfig.DISCORD_HELPERS.generateEmbed({
                        fields: [{
                            name: `General Help:`,
                            value: `Commands can be invoked by starting a message with \`/\`.
                        You can learn more about commands and their usages by typing \`/help <command>\`.`
                        },
                        {
                            name: `Command and Alternate Name List:`,
                            value:  `${fields.join('\n')}`
                        }],
                    })
                ]
            });
        },
        new SlashCommandBuilder()
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to get help with.')
                .setRequired(false)
        ),
        [
            new HelpTip(
                `help`,
                `Displays a list of all commands and their alternate names.`
            ),
            new HelpTip(
                `help <command>`,
                `Displays usage information about a specific command.`
            ),
        ],
        `Provides guidance for how to use commands.`,
    );
}

module.exports.HelpCommand = command;