class ChatMessage{
    constructor(userName, userId, userImg, msg, timestamp){
        this. authorName = userName;
        this.authorId = userId;
        this.authorImage = userImg;
        this.message = msg;
        this.time = timestamp;
    }
}

module.exports.ChatMessage = ChatMessage