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
        languages: ["en"],
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