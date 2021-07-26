const fs = require('fs');
const { AppConfig } = require('../../app.config');
// cache write streams to prevent thread lock on the same file
const streams = new Map();

/**
 * Logging implementation that writes to disk.
 */
class Logger{
    /**
     * 
     * @param {string} guildId File name and server identifier.
     */
    constructor(guildId){
        this.console = streams.has(guildId) ? streams.get(guildId) : 
        streams.set(guildId, AppConfig.ENV == "test" ? 
            testLogger : new console.Console(fs.createWriteStream(`./logs/${guildId}.log`, {flags:'a'}))
            ).get(guildId);
    }
    log(message){
        this.console.log(`[INFO] (${new Date().toLocaleString()}) - ${message}`);
    }
    warn(message){
        this.console.warn(`[WARN] (${new Date().toLocaleString()}) - ${message}`);
    }
    error(message){
        this.console.error(`[FAIL] (${new Date().toLocaleString()}) - ${message}`);
    }
} 

const testLogger = {
    log(){},
    warn(){},
    error(){}
}

module.exports.Logger = Logger;