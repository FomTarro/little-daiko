const { AppConfig } = require('../../app.config');
const { ChatListener } = require('../adapters/mildom/mildom.client');

const storage = new Map();

/**
 * Stores the given listener for the given originating event
 * @param {*} subject The originating event
 * @param {ChatListener} listener The listener to store
 * @returns {string} The key of the deleted entry
 */
function setListener(subject, listener){
    const key = deleteListener(subject);
    storage.set(key, listener);
    return key;
}

/**
 * Gets the listener for the originating event
 * @param {*} subject The originating event
 * @returns {ChatListener} The stored Chat Listener
 */
function getListener(subject){
    const key = AppConfig.DISCORD_HELPERS.getGuildId(subject);
    if(storage.has(key)){
        return storage.get(key);
    }
}

/**
 * Deletes and shuts down the listener for the given originating event
 * @param {*} subject The originating event
 * @returns {string} The key of the deleted entry
 */
function deleteListener(subject){
    const key = AppConfig.DISCORD_HELPERS.getGuildId(subject);
    if(storage.has(key)){
        storage.get(key).stopListener();
        storage.delete(key);
    }
    return key;
}

module.exports.setListener = setListener;
module.exports.getListener = getListener;
module.exports.deleteListener = deleteListener;