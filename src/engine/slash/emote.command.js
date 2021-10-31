const { AppConfig } = require("../../../app.config");
const { isEmote } = require("../../adapters/mildom/mildom.client");
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
        ['emote'],
        2,
        async (interaction) => { 
            const configKey = interaction.guild;
            const operation = interaction.options.getSubcommand();
            let platformEmote = interaction.options.getInteger('number').toString();
            // platformEmote = isEmote(platformEmote) 
            // ? platformEmote.substr(2, platformEmote.length-3) 
            // : platformEmote;
            if(isNaN(new Number(platformEmote))){
                return await interaction.reply({content: LiteralConstants.REACT_ERROR_EMOJI})
            }
            let emoteMap = appConfig.CONFIG_STORAGE.getProperty(configKey, "emotes");
            emoteMap = emoteMap ? emoteMap : {};
            if(operation === 'add'){
                const discordEmote = interaction.options.getString('emote');
                emoteMap[platformEmote] = discordEmote;
                appConfig.CONFIG_STORAGE.setProperty(configKey, "emotes", emoteMap);
                return await interaction.reply({content: LiteralConstants.REACT_OK_EMOJI})
            }else if(operation === 'remove'){
                delete emoteMap[platformEmote];
                appConfig.CONFIG_STORAGE.setProperty(configKey, "emotes", emoteMap);
                return await interaction.reply({content: LiteralConstants.REACT_OK_EMOJI})
            }
            return await interaction.reply({content: LiteralConstants.REACT_ERROR_EMOJI})
        },      
        new SlashCommandBuilder()
        .addSubcommand(add =>
            add
            .setName('add')
            .setDescription('Sets the Discord emote equivalent of a Mildom emote that is contained in a transmitted message.')
            .addIntegerOption(emoteNumber =>
                emoteNumber
                .setName('number')
                .setDescription('The number of the Mildom platform emote.')
                .setRequired(true)
            )
            .addStringOption(emote => 
                emote
                .setName('emote')
                .setDescription('The Discord emote to replace the Mildom platform emote with in transmitted messages.')
                .setRequired(true)
            )
        )
        .addSubcommand(remove =>
            remove
            .setName('remove')
            .setDescription('Removes the Discord emote equivalent of a Mildom emote.')
            .addIntegerOption(emoteNumber =>
                emoteNumber
                .setName('number')
                .setDescription('The number of the Mildom platform emote.')
                .setRequired(true)
            )
        ),
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