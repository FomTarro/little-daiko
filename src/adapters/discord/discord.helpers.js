const Discord = require('discord.js');
const owner = '106091790301421568';

function isMessage (subject){
    return subject instanceof Discord.Message;
}

function isGuild(subject){
    return subject instanceof Discord.Guild;
}
  
function isDm(subject){
    return subject.guild === undefined;
}

function isBot(subject){
    return isMessage(subject) ? 
    subject.author.bot 
    : subject.bot;
}

function isAdmin(subject, role){
    return hasRole(subject, role);
}

function isGuildOwner(subject){
    return getUserId(subject) == subject.guild.ownerID;
}

function isBotOwner(subject){
    return getUserId(subject) == owner;
}

function getUserId(subject){ 
    return isMessage(subject) ? subject.author.id : subject.id;
}

function getGuildId(subject){
    const dm = isMessage(subject) && isDm(subject);
    return dm                   ? '0'
        : isMessage(subject)    ? subject.guild.id
        : isGuild(subject)      ? subject.id
                                : subject.guild.id;
}

function getOtherBotGuilds(subject){
    return  isMessage(subject) ? subject.guild.me.client.guilds.cache.array() :
            isGuild(subject) ? subject.me.client.guilds.cache.array() :
            [];
}

function hasRole(subject, role){
    const user = isMessage(subject) ? subject.member : subject;
    // TODO: make this use getRole
    const foundRole = !isNaN(Number(role)) ? 
    user.roles.cache.find((r) => r.id == Number(role)) : 
    user.roles.cache.find((r) => r.name === role)
    return foundRole !== undefined;
}

function getRoleByName(guild, role){
    return isGuild(guild) ? guild.roles.cache.find((r) => r.name === role) : undefined;
}

function getRoleById(guild, role){
    return isGuild(guild) ? guild.roles.cache.find((r) => r.id == role) : undefined;
}

function getRole(guild, roleIdentifier){
    return !isNaN(Number(roleIdentifier)) ? 
    getRoleById(guild, Number(roleIdentifier)) : 
    getRoleByName(guild, roleIdentifier);
}

function getChannelByName(guild, channel){
    return isGuild(guild) ? guild.channels.cache.find((r) => r.name === channel) : undefined;
}

function getChannelById(guild, channel){
    return isGuild(guild) ? guild.channels.cache.find((r) => r.id == channel) : undefined;
}

function getChannel(guild, channelIdentifier){
    return !isNaN(Number(channelIdentifier)) ? 
    getChannelById(guild, Number(channelIdentifier)) : 
    getChannelByName(guild, channelIdentifier);
}

function generateEmbed(message){
    const embed = new Discord.MessageEmbed().setColor('#f1c40f');
    embed.setDescription(message.message)
    if(message.authorName){
        embed.setAuthor(message.authorName, message.authorImage)
    }
    if(message.time){
        // 0 sets the date to epoch
        const date = new Date(0).setUTCMilliseconds(message.time); 
        embed.setTimestamp(date);
    }
    if(message.fields){
        for(let field of message.fields){
            embed.addField(field.name, field.value, field.inline)
        };
    }
    return embed;
}

module.exports.isMessage = isMessage;
module.exports.isGuild = isGuild;
module.exports.isDm = isDm;
module.exports.isBot = isBot;
module.exports.isAdmin = isAdmin;
module.exports.isGuildOwner = isGuildOwner;
module.exports.isBotOwner = isBotOwner;
module.exports.hasRole = hasRole;
module.exports.getRoleByName = getRoleByName;
module.exports.getRoleById = getRoleById;
module.exports.getRole = getRole;
module.exports.getChannelByName = getChannelByName;
module.exports.getChannelById = getChannelById;
module.exports.getChannel = getChannel;
module.exports.getUserId = getUserId;
module.exports.getGuildId = getGuildId;
module.exports.getOtherBotGuilds = getOtherBotGuilds;

module.exports.generateEmbed = generateEmbed;