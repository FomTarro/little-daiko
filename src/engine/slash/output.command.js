const { AppConfig } = require("../../../app.config");
const { SlashCommand, HelpTip } = require('../../models/slash.command');
const { LiteralConstants } = require('../../utils/literal.constants');
const { SlashCommandBuilder } = require('@discordjs/builders');
const oneline = require('oneline');

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Command}
 */
function command(appConfig){
    return new SlashCommand(
        ['output'],
        2,
        async (interaction) => { 
            const configKey = interaction.guild;
            const group = interaction.options.getSubcommandGroup();
            const channels = appConfig.CONFIG_STORAGE.getProperty(configKey, "output");
            const channel = interaction.options.getChannel('channel');
            if(group === 'chat'){
                const subcommand = interaction.options.getSubcommand();
                const language = interaction.options.getString('language').toLowerCase().trim();
                if(subcommand === 'add'){
                    channels.chat[language] = channel.id;
                    appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                    return await interaction.reply({content: LiteralConstants.REACT_OK_EMOJI });
                }else if(subcommand === 'remove'){
                    if(channels.chat[language]){
                        delete channels.chat[language];
                        appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                        return await interaction.reply({content: LiteralConstants.REACT_OK_EMOJI });
                    }
                    return await interaction.reply({content: 'The specified language channel does not exist.' });
                }
            }
            else if(group === 'alert'){
                channels.alert = channel.id;
                appConfig.CONFIG_STORAGE.setProperty(configKey, "output", channels);
                return await interaction.reply({content: LiteralConstants.REACT_OK_EMOJI });
            }
            interaction.reply({content: LiteralConstants.REACT_ERROR_EMOJI });
        }, 
        new SlashCommandBuilder()
        .addSubcommandGroup(chat =>
            chat
            .setName('chat')
            .setDescription('Adds or removes a language output channel.')
            .addSubcommand(add =>
                add
                .setName('add')
                .setDescription('Adds a language output channel.')
                .addStringOption(lang =>
                    lang
                    .setName('language')
                    .setDescription('The language to add.')
                    .setRequired(true)
                )
                .addChannelOption(channel => 
                    channel
                    .setName('channel')
                    .setDescription('The channel to output into.')
                    .setRequired(true))
            )
            .addSubcommand(remove =>
                remove
                .setName('remove')
                .setDescription('Removes a language output channel.')
                .addStringOption(lang =>
                    lang
                    .setName('language')
                    .setDescription('The language to remove.')
                    .setRequired(true)
                )
            )
        ).addSubcommandGroup(alert =>
            alert
            .setName('alert')
            .setDescription('Designates the go-live alert channel.')
            .addSubcommand(set => 
                set
                .setName('set')
                .setDescription('Sets the channel to output into.')
                .addChannelOption(channel =>
                    channel
                    .setName('channel')
                    .setDescription('The channel to output into.')
                    .setRequired(true)
                    )
            )
        ),
        [
            new HelpTip(
                `output chat add <language prefix> <channel>`,
                oneline`Sets the server channel which stream messages with the designated language prefix will be posted to.
                Stream messages from the streamer will go to all language channels.`
            ),
            new HelpTip(
                `output chat remove <language prefix>`,
                `Stops posting to the server for the given language prefix.`
            ),
            new HelpTip(
                `output alert set <channel>`,
                `Sets the server channel which stream go-live alerts will be posted to.`
            ),
        ],
        `Designates which channels various messages output into.`
    );
}

module.exports.OutputCommand = command;