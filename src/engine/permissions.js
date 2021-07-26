const { AppConfig } = require("../../app.config");

/**
 * Map of permission levels and their corresonding check functions.
 * @param {AppConfig} appConfig The dependency injection config.
 * @returns {Map<number, PermissionLevel>} Map of permissions.
 */
function permissions(appConfig){
    const discordHelpers = appConfig.DISCORD_HELPERS;
    return new Map([
        [1,  new PermissionLevel(
            (user, role) => { 
                return true;
            },
            `Any user`
        )],
        [2, new PermissionLevel(
            (user, role) => { 
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
                || discordHelpers.isAdmin(user, role) 
            },
            `Bot Operator, Server Owner or Bot Owner`
        )],
        [3, new PermissionLevel(
            (user, role) => { 
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
            },
            `Server Owner or Bot Owner`
        )],
        [100, new PermissionLevel(
            (user, role) => { 
                return discordHelpers.isBotOwner(user) 
            },
            `Bot Owner`
        )]
    ])
}

/**
 * The callback for a command.
 *
 * @callback PermissionCheck
 * @param {*} user
 * @param {string} role
 * @returns {Boolean} 
 */

/**
 * A permission level for commands to be checked against.
 */
class PermissionLevel{
    /**
     * 
     * @param {PermissionCheck} check A function which checks if the given user has this permission level.
     * @param {string} description A written summary of the permission level.
     */
    constructor(check, description){
        this.check = check;
        this.description = description;
    }
}

module.exports = permissions;