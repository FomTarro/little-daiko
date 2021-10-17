const { AppConfig } = require("../../../app.config");
const { SlashCommand, HelpTip } = require('../../models/slash.command');
const { LiteralConstants } = require('../../utils/literal.constants');
const { SlashCommandBuilder } = require('@discordjs/builders');
const oneline = require('oneline');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {SlashCommand}
 */
function command(appConfig){
    return new SlashCommand(
        ['role', 'r'],
        3,
        async (interaction) => { 
            const configKey = interaction.guild;
            const args = interaction.options.getRole('role');
            const subcommand = interaction.options.getSubcommand();
            if(args){
                const roles =  appConfig.CONFIG_STORAGE.getProperty(configKey, "role");
                if(subcommand === 'ops'){
                    roles.ops = args.id;
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                    return await interaction.reply({ content: LiteralConstants.REACT_OK_EMOJI });
                }
                if(subcommand === 'alert'){
                    roles.alert = args.id;
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "role", roles);
                    return await interaction.reply({ content: LiteralConstants.REACT_OK_EMOJI });
                }
            }
            return await interaction.reply({ content: LiteralConstants.REACT_ERROR_EMOJI });
        }, 
        new SlashCommandBuilder()
        .addSubcommand(subcommand => 
            subcommand
            .setName('ops')
            .setDescription('Sets the role of permitted operators of the bot for this server.')
            .addRoleOption(role => 
                role.setName('role')
                .setDescription('Operator role.')
                .setRequired(true))
        ).addSubcommand(subcommand => 
            subcommand
            .setName('alert')
            .setDescription('Sets the role to ping when the designated streamer goes live.')
            .addRoleOption(role => 
                role.setName('role')
                .setDescription('Alert role.')
                .setRequired(true))),
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
        ],
        `Designates which Discord roles are used for various features.`
    )   
}

module.exports.RoleCommand = command;