const { Message } = require('discord.js');

/**
 * A command for the bot to respond to.
 */
class Command{
    /**
     * The callback for a command.
     *
     * @callback CommandCallback
     * @param {Message} message
     * @param {string[]} args
     * @param {Message} override
     * @returns {string} 
     */
    
    /**
     * 
     * @param {string[]} aliases 
     * @param {number} permissionLevel 
     * @param {CommandCallback} callback 
     * @param {HelpTip[]} helpTips 
     */
    constructor(aliases, permissionLevel, callback, helpTips){
        this.aliases = aliases;
        this.permissionLevel = permissionLevel;
        this.callback = callback;
        this.helpTips = helpTips;
    }
}

/**
 *  A tooltip about a usage of the command.
 */
class HelpTip{
    /**
     *
     * @param {string} usage 
     * @param {string} description 
     */
    constructor(usage, description){
        this.usage = usage;
        this.description = description;
    }
}

module.exports.Command = Command;
module.exports.HelpTip = HelpTip;