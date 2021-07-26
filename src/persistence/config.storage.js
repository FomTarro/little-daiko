const { AppConfig } = require('../../app.config');
const Enmap = require('enmap');

const schema = new Enmap({
    name: "config",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
    autoEnsure: {
        prefix: "!",
        role: {
            ops: "admin",
            alert: "mildom" 
        },
        streamer: 0,
        users: [],
        output: {
            chat: {
                "en": "general"
            },
            alert: "general"
        },
    }
});

/**
 * Gets a property with the given name for the given originating event
 * @param {*} subject The originating event
 * @param {string} property The name of the property to find
 * @returns The property value
 */
function getProperty(subject, property){
    return getGuildConfig(subject)[property];
}

/**
 * Gets all properties for the given originating event
 * @param {*} subject The originating event
 * @returns List of all properties
 */
function getAllProperties(subject){
    return [...Object.entries(getGuildConfig(subject))];
}

/**
 * Sets a property with the given name for the given originating event to the given value
 * @param {*} subject The originating event
 * @param {string} property The name of the property to find
 * @param {*} value The value to set
 * @returns 
 */
function setProperty(subject, property, value){
    return schema.set(AppConfig.DISCORD_HELPERS.getGuildId(subject), value, property);
}

function getGuildConfig(subject){
    return schema.get(AppConfig.DISCORD_HELPERS.getGuildId(subject));
}

/**
 * Deletes the entire properties list for the originating event from disk
 * @param {*} subject The originating event
 * @returns 
 */
function deleteGuildConfig(subject){
    return schema.delete(AppConfig.DISCORD_HELPERS.getGuildId(subject))
}

module.exports.getProperty = getProperty;
module.exports.getAllProperties = getAllProperties;
module.exports.setProperty = setProperty;
module.exports.deleteGuildConfig = deleteGuildConfig;