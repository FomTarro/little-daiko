const { CommandInteraction } = require('discord.js');

/**
 * A command for the bot to respond to.
 */
class SlashCommand{
    /**
     * The callback for a command.
     *
     * @callback CommandCallback
     * @param {CommandInteraction} interaction
     * @returns {Promise<string>} 
     */
    
    /**
     * 
     * @param {string[]} aliases A list of aliases for calling the command.
     * @param {number} permissionLevel The permission level required to use the command.
     * @param {CommandCallback} callback The actual functionality of the command.
     * @param {Object} json The JSON representation of the command. 
     * @param {HelpTip[]} helpTips The tooltips about the command's usages.
     * @param {String} summary A high-level summary of the command.
     */
    constructor(aliases, permissionLevel, callback, json, helpTips, summary){
        this.aliases = aliases;
        this.permissionLevel = permissionLevel;
        this.callback = callback;
        this.json = json;
        this.summary = summary;
        this.helpTips = helpTips;
    }
}

/**
 *  A tooltip about a usage of the command.
 */
class HelpTip{
    /**
     *
     * @param {string} usage The way the command can be invoked.
     * @param {string} description A description about what this method of invocation does.
     */
    constructor(usage, description){
        this.usage = usage;
        this.description = description;
    }
}

module.exports.SlashCommand = SlashCommand;
module.exports.HelpTip = HelpTip;