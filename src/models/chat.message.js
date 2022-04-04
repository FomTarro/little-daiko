/**
 * A generalized wrapper for a message from a stream chat platform
 */
class ChatMessage{
    /**
     * 
     * @param {string} userName The name of the author.
     * @param {number} userId An ID of the author, for checking against the approved users list. Should be a number.
     * @param {URL} userImg A URL to an avatar of the author.
     * @param {string} msg The content of the message.
     * @param {number} timestamp A UTC timestamp.
     * @param {boolean} shouldLog Should this message be logged?
     */
    constructor(userName, userId, userImg, msg, timestamp, shouldLog){
        this.authorName = userName;
        this.authorId = userId;
        this.authorImage = userImg;
        this.message = msg;
        this.time = timestamp;
        this.shouldLog = shouldLog != undefined ? shouldLog : true
    }
}

module.exports.ChatMessage = ChatMessage