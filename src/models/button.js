const { MessageComponentInteraction } = require('discord.js');

/**
 * A Button Interaction for the bot to respond to.
 */
class Button{
    /**
     * The callback for a Button.
     *
     * @callback ButtonCallback
     * @param {MessageComponentInteraction} interaction
     * @returns {Promise<void>} 
     */
    
    /**
     * 
     * @param {string[]} aliases A list of aliases for calling the button.
     * @param {number} permissionLevel The permission level required to use the button.
     * @param {ButtonCallback} callback The actual functionality of the button.
     */
    constructor(aliases, permissionLevel, callback){
        this.aliases = aliases;
        this.permissionLevel = permissionLevel;
        this.callback = callback;
    }
}


module.exports.Button = Button;