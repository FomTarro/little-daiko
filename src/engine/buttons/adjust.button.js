const { AppConfig } = require("../../../app.config");
const { Button } = require('../../models/button');
const { renderTimestamp } = require('../commands/timestamp.command');

const offset = 5 * 1000;

/**
 * 
 * @param {AppConfig} appConfig 
 * @returns {Button}
 */
function button(appConfig){
    return new Button(
        ['timestamp_add', 'timestamp_subtract'],
        1,
        async (interaction) => { 
            const timestamps = appConfig.TIMESTAMP_STORAGE.getAllTimestamps(interaction.guild);
            //console.log(JSON.stringify(timestamps));
            let timestamp;
            for(let language of timestamps){
                for(let entry of language[1]){
                    const messageId = entry[0];
                    if(interaction.message.id == messageId){
                        timestamp = entry[1];
                        if(interaction.customId.includes("subtract")){
                            timestamp.adjustment = timestamp.adjustment - offset;
                        }else{
                            timestamp.adjustment = Math.min(0, timestamp.adjustment + offset);
                        }
                        appConfig.TIMESTAMP_STORAGE.addTimestamp(interaction.guild, language[0], messageId, timestamp);
                    }
                }
            }
            if(timestamp){
                return interaction.update(
                { 
                    embeds: [ 
                        renderTimestamp(appConfig, timestamp)
                    ] 
                });
            }
        }
    );
}

module.exports.AdjustButton = button;