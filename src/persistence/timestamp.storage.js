const { AppConfig } = require('../../app.config');
const Enmap = require('enmap');

const timestamps = new Enmap({
    name: "timestamps",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
    autoEnsure: {

    }
});

/**
 * Gets all properties for the given originating event.
 * @param {*} subject The originating event.
 * @returns List of all properties.
 */
function getAllTimestamps(subject){
    return [...Object.entries(getGuildTimestamps(subject))];
}

function addTimestamp(subject, language, messageId, timestamp){
    let currentList = getTimestamps(subject, language);
    if(!currentList){
        currentList = [];
    }
    currentList.push([messageId, timestamp]);
    return timestamps.set(AppConfig.DISCORD_HELPERS.getGuildId(subject), currentList, language);
}

/**
 * Gets a property with the given name for the given originating event.
 * @param {*} subject The originating event.
 * @param {string} language The name of the property to find.
 * @returns The property value.
 */
 function getTimestamps(subject, language){
    return getGuildTimestamps(subject)[language];
}

function getGuildTimestamps(subject){
    return timestamps.get(AppConfig.DISCORD_HELPERS.getGuildId(subject));
}

/**
 * Deletes the entire timestamp list for the originating event from disk.
 * @param {*} subject The originating event.
 * @returns 
 */
function deleteGuildTimestamps(subject){
    return timestamps.delete(AppConfig.DISCORD_HELPERS.getGuildId(subject))
}

module.exports.getAllProperties = getAllTimestamps;
module.exports.addTimestamp = addTimestamp;
module.exports.deleteGuildTimestamps = deleteGuildTimestamps;