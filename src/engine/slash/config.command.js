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
        ['config', 'conf', 'c'],
        2,
        async (interaction) => { 
            const configKey = interaction.guild;
            const fields = appConfig.CONFIG_STORAGE.getAllProperties(configKey).map(prop => {
                return {
                    name: `${prop[0]}:`,
                    value: `\`${JSON.stringify(prop[1], undefined, 2)}\``,
                }
            });
            interaction.reply({
                embeds: [
                    appConfig.DISCORD_HELPERS.generateEmbed({
                        message: `Here is the current configuration of this server:`,
                        fields: fields,
                    })
                ],
            });
        },      
        new SlashCommandBuilder(),
        [
            new HelpTip(
                `config`,
                oneline`Displays a list of all configurable properties for the server.`
            ),
        ],
        `Displays configruable properties.`
    );
}

module.exports.ConfigCommand = command;