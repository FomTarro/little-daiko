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
        ['streamer', 's'],
        2,
        async (interaction) => { 
            const configKey = interaction.guild;
            const args = interaction.options.get('streamer_id');
            const argId = Number(args.value);
            if(!isNaN(argId)){
                appConfig.CONFIG_STORAGE.setProperty(configKey, "streamer", argId);
                return await interaction.reply({
                    content: LiteralConstants.REACT_OK_EMOJI
                });
            }
            return await interaction.reply({
                content: LiteralConstants.REACT_ERROR_EMOJI
            });
        },
        new SlashCommandBuilder()
        .addStringOption(option => 
            option.setName('streamer_id')
            .setDescription(`The Mildom User ID of the streamer to listen to.`)
            .setRequired(true)),
        [
            new HelpTip(
                `streamer <streamer id>`,
                oneline`Sets the streamer to listen to. The streamer id must be a number. 
                If this is changed while the listener is currently active, the listener will need to be restarted.`
            ),
        ],
        `Designates the stream for the bot to listen to.`
    );
}

module.exports.StreamerCommand = command;