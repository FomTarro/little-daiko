const { AppConfig } = require("../../../app.config");
const { Button } = require('../../models/button');
const { AdjustButton } = require("./adjust.button");

/**
 * A list of button definitions for the bot to listen to, 
 * including permission levels and the callback function.
 * @param {AppConfig} appConfig The dependency injection config.
 * @returns {Button[]} The list of buttons.
 */
function buttons(appConfig){
    return [
        AdjustButton(appConfig),
    ]
}

module.exports = buttons;