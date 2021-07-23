const fs = require('fs');
const { AppConfig } = require('../../app.config');
// cache write streams to prevent thread lock on the same file
const streams = new Map();

class Logger{
    constructor(guildId){
        this.console = streams.has(guildId) ? streams.get(guildId) : 
        streams.set(guildId, AppConfig.ENV == "test" ? 
            console :  
            new console.Console(fs.createWriteStream(`./logs/${guildId}.log`, {flags:'a'}))).get(guildId);
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

module.exports = Logger;