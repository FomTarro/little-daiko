/**
 * Several useful constant literal values for use throughout the bot.
 */
class LiteralConstants{
    get BOT_NAME(){ return `little-daiko`};
    get ONLINE_EMOJI(){ return `🟢`};
    get OFFLINE_EMOJI(){ return `🔴`};
    get BOT_NAME_ONLINE(){ return `${this.BOT_NAME} ${this.ONLINE_EMOJI}`};
    get BOT_NAME_OFFLINE(){ return `${this.BOT_NAME} ${this.OFFLINE_EMOJI}`};
    get REACT_OK_EMOJI(){ return '✔️'};
    get REACT_ERROR_EMOJI(){ return '❌'};
    get REACT_UPVOTE_EMOJI(){ return '👍'};
    get REACT_DOWNVOTE_EMOJI(){ return '👎'};
    get LOG_SYSTEM_ID(){ return `system` };
    get LOG_SESSION_START(){ return `------- SESSION START -------` };
}

const constants = new LiteralConstants();

module.exports.LiteralConstants = constants;