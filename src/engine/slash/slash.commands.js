const { AppConfig } = require("../../../app.config");
const { SlashCommand } = require('../../models/slash.command');
const { ConfigCommand } = require("./config.command");
const { HelpCommand } = require("./help.command");

/**
 * A list of command definitions for the bot to listen to, 
 * including permission levels, the callback function, and help tooltips.
 * @param {AppConfig} appConfig The dependency injection config.
 * @returns {SlashCommand[]} The list of commands.
 */
 function commands(appConfig){
    return [
        ConfigCommand(appConfig),
        HelpCommand(appConfig),
    ];
}

module.exports = commands;