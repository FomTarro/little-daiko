const constants = {
    get BOT_NAME(){ return `little-daiko`},
    get ONLINE_EMOJI(){ return `🟢`},
    get OFFLINE_EMOJI(){ return `🔴`},
    get BOT_NAME_ONLINE(){ return `${this.BOT_NAME} ${this.ONLINE_EMOJI}`},
    get BOT_NAME_OFFLINE(){ return `${this.BOT_NAME} ${this.OFFLINE_EMOJI}`},
    get REACT_OK_EMOJI(){ return '✔️'},
    get REACT_ERROR_EMOJI(){ return '❌'},
}

module.exports = constants;