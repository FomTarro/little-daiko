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
    return isMessage(subject) ? subject.author.bot : subject.bot;
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

function hasRole(subject, role){
    const user = isMessage(subject) ? subject.member : subject;
    return user.roles.cache.has(role);
}

function generateEmbed(message){
    // 0 sets the date to epoch
    const date = new Date(0).setUTCMilliseconds(message.time); 
    return new Discord.MessageEmbed()
    .setColor('#f1c40f')
    .setAuthor(message.userName, message.userImg)
    .setDescription(message.message)
    .setTimestamp(date)
}

module.exports.isMessage = isMessage;
module.exports.isGuild = isGuild;
module.exports.isDm = isDm;
module.exports.isBot = isBot;
module.exports.isAdmin = isAdmin;
module.exports.isGuildOwner = isGuildOwner;
module.exports.isBotOwner = isBotOwner;
module.exports.hasRole = hasRole;
module.exports.getUserId = getUserId;
module.exports.getGuildId = getGuildId;

module.exports.generateEmbed = generateEmbed;