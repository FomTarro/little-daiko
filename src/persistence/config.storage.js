const { AppConfig } = require('../../app.config');
const DiscordHelpers = AppConfig.DISCORD_HELPERS;
const Enmap = require('enmap');

const schema = new Enmap({
    name: "config",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
    autoEnsure: {
        prefix: "!",
        role: "@admin",
        streamer: 00000,
        users: [],
        channel: "general",
        language: "en",
    }
});

function getProperty(subject, property){
    return getGuildConfig(subject)[property];
}

function getAllProperties(subject){
    return [...Object.entries(getGuildConfig(subject))];
}

function setProperty(subject, property, value){
    return schema.set(DiscordHelpers.getGuildId(subject), value, property);
}

function getGuildConfig(subject){
    return schema.get(DiscordHelpers.getGuildId(subject));
}

function deleteGuildConfig(subject){
    return schema.delete(DiscordHelpers.getGuildId(subject))
}

module.exports.getProperty = getProperty;
module.exports.getAllProperties = getAllProperties;
module.exports.setProperty = setProperty;
module.exports.deleteGuildConfig = deleteGuildConfig;