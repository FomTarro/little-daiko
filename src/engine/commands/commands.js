const { AppConfig } = require("../../../app.config");
const { Command } = require('../../models/command');
const { ConfigCommand } = require("./config.command");
const { HelpCommand } = require("./help.command");
const { RoleCommand } = require("./role.command");
const { PrefixCommand } = require("./prefix.command");
const { StreamerCommand } = require("./streamer.command");
const { UsersCommand } = require("./users.commands");
const { OutputCommand } = require("./output.command");
const { StartCommand } = require("./start.command");
const { TimestampCommand } = require("./timestamp.command");
const { StatusCommand } = require("./status.command");
const { RemoteCommand } = require("./remote.command");
const { ServerCommand } = require("./servers.command");
const { StopCommand } = require("./stop.command");

/**
 * A list of command definitions for the bot to listen to, 
 * including permission levels, the callback function, and help tooltips.
 * @param {AppConfig} appConfig The dependency injection config.
 * @returns {Command[]} The list of commands.
 */
function commands(appConfig){
    return [
        ConfigCommand(appConfig),
        HelpCommand(appConfig),
        RoleCommand(appConfig),
        PrefixCommand(appConfig),
        StreamerCommand(appConfig),
        UsersCommand(appConfig),
        OutputCommand(appConfig),
        StartCommand(appConfig),
        StopCommand(appConfig),
        TimestampCommand(appConfig),
        StatusCommand(appConfig),
        RemoteCommand(appConfig),
        ServerCommand(appConfig),
    ];
}

module.exports = commands;