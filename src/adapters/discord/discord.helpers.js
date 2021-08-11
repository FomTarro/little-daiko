const Discord = require('discord.js');
const { ChatMessage } = require('../../models/chat.message');

const owner = '106091790301421568';

/**
 * 
 * @param {*} subject 
 * @returns {Boolean}
 */
function isMessage (subject){
    return subject instanceof Discord.Message;
}

/**
 * 
 * @param {*} subject 
 * @returns {Boolean}
 */
function isGuild(subject){
    return subject instanceof Discord.Guild;
}
  
/**
 * 
 * @param {Discord.Message} subject 
 * @returns {Boolean}
 */
function isDm(subject){
    return subject.guild === undefined;
}

/**
 * 
 * @param {Discord.Message|Discord.User} subject 
 * @returns {Boolean}
 */
function isBot(subject){
    return isMessage(subject) ? 
    subject.author.bot 
    : subject.bot;
}

/**
 * 
 * @param {Discord.Message|Discord.User} subject 
 * @param {Number|String} role 
 * @returns {Boolean}
 */
function isAdmin(subject, role){
    return hasRole(subject, role);
}

/**
 * 
 * @param {Discord.Message|Discord.User} subject 
 * @returns {Boolean}
 */
function isGuildOwner(subject){
    return getUserId(subject) == subject.guild.ownerID;
}

/**
 * 
 * @param {Discord.Message|Discord.User} subject 
 * @returns {Boolean}
 */
function isBotOwner(subject){
    return getUserId(subject) == owner;
}

/**
 * 
 * @param {Discord.Message|Discord.User} subject 
 * @returns {Number}
 */
function getUserId(subject){ 
    return isMessage(subject) ? subject.author.id : subject.id;
}

/**
 * 
 * @param {Discord.Message|Discord.Guild} subject 
 * @returns {Number}
 */
function getGuildId(subject){
    const dm = isMessage(subject) && isDm(subject);
    return dm                   ? '0'
        : isMessage(subject)    ? subject.guild.id
        : isGuild(subject)      ? subject.id
        : subject.guild         ? subject.guild.id : subject.id;
}

/**
 * 
 * @param {Discord.Message|Discord.Guild} subject 
 * @returns {Discord.Guild[]}
 */
function getOtherBotGuilds(subject){
    return  isMessage(subject) ? subject.guild.me.client.guilds.cache.array() :
            isGuild(subject) ? subject.me.client.guilds.cache.array() :
            subject.guild.me.client.guilds.cache.array();
}

/**
 * 
 * @param {Discord.Message} subject 
 * @param {Number|String} role 
 * @returns {Boolean}
 */
function hasRole(subject, role){
    const user = isMessage(subject) ? subject.member : subject;
    // TODO: make this use getRole
    const foundRole = !isNaN(Number(role)) ? 
    user.roles.cache.find((r) => r.id == Number(role)) : 
    user.roles.cache.find((r) => r.name === role)
    return foundRole !== undefined;
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {String} role 
 * @returns {Discord.Role}
 */
function getRoleByName(guild, role){
    return isGuild(guild) ? guild.roles.cache.find((r) => r.name === role) : undefined;
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Number} role 
 * @returns {Discord.Role}
 */
function getRoleById(guild, role){
    return isGuild(guild) ? guild.roles.cache.find((r) => r.id == role) : undefined;
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Number|String} roleIdentifier 
 * @returns {Discord.Role}
 */
function getRole(guild, roleIdentifier){
    return !isNaN(Number(roleIdentifier)) ? 
    getRoleById(guild, Number(roleIdentifier)) : 
    getRoleByName(guild, roleIdentifier);
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Discord.TextChannel} channel 
 * @returns 
 */
function getChannelByName(guild, channel){
    return isGuild(guild) ? guild.channels.cache.find((r) => r.name === channel) : undefined;
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Number} channel 
 * @returns {Discord.TextChannel}
 */
function getChannelById(guild, channel){
    return isGuild(guild) ? guild.channels.cache.find((r) => r.id == channel) : undefined;
}

/**
 * 
 * @param {Discord.Guild} guild 
 * @param {Number|String} channelIdentifier 
 * @returns {Discord.TextChannel}
 */
function getChannel(guild, channelIdentifier){
    return !isNaN(Number(channelIdentifier)) ? 
    getChannelById(guild, Number(channelIdentifier)) : 
    getChannelByName(guild, channelIdentifier);
}

/**
 * Generates an embed for a given ChatMessage.
 * @param {ChatMessage} message The message to embded.
 * @returns {Discord.MessageEmbed}
 */
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

/**
 * 
 * @param {String} content 
 * @param {String} name 
 * @returns {Discord.MessageAttachment}
 */
function generateAttachment(content, name){
    return new Discord.MessageAttachment(Buffer.from(content, 'utf-8'), name);
}

module.exports.ownerId = owner;
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
module.exports.generateAttachment = generateAttachment;