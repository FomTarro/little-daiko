const fs = require('fs');
const { AppConfig } = require('../../app.config');

/**
 * Logging implementation that writes to disk.
 */
class Logger{
    /**
     * 
     * @param {string} guildId File name and server identifier.
     */
    constructor(guildId){  
        this.writePath = `./logs/${AppConfig.ENV.toLocaleLowerCase() != 'test' ? guildId : 'TEST'}.log`;
    }
    log(message){
        // open/close write stream each time to prevent hitting the concurrent I/O limit at massive scale
        const writeStream = fs.createWriteStream(this.writePath, {flags:'a'});
        writeStream.write(`[INFO] (${new Date().toLocaleString()}) - ${message}\n`);
        writeStream.end();
    }
    warn(message){
        const writeStream = fs.createWriteStream(this.writePath, {flags:'a'});
        writeStream.write(`[WARN] (${new Date().toLocaleString()}) - ${message}\n`);
        writeStream.end();
    }
    error(message){
        const writeStream = fs.createWriteStream(this.writePath, {flags:'a'});
        writeStream.write(`[FAIL] (${new Date().toLocaleString()}) - ${message}\n`);
        writeStream.end();
    }
} 

module.exports.Logger = Logger;