const { AppConfig } = require("../../../app.config");
const { SlashCommand, HelpTip } = require('../../models/slash.command');
const { LiteralConstants } = require('../../utils/literal.constants');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {SlashCommand}
 */
function command(appConfig){
    return new SlashCommand(
        ['first', 'f', '1st'],
        1,
        async (interaction) => {
            console.log("FIRST")
            console.log(interaction.options.get('input'));
            interaction.reply(interaction.options.get('input').value);
        },
        new SlashCommandBuilder()
        // .setName('first')
        // .setDescription('Replies with your input!')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
        ),
        [
            new HelpTip(`a`, `b`)
        ],
        `Baby's first command!`,
    );
}

module.exports.FirstCommand = command;