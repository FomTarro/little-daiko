const { AppConfig } = require('../../app.config');

const storage = new Map();

function setListener(subject, listener){
    const key = deleteListener(subject);
    storage.set(key, listener);
    return key;
}

function getListener(subject){
    const key = AppConfig.DISCORD_HELPERS.getGuildId(subject);
    if(storage.has(key)){
        return storage.get(key);
    }
}

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