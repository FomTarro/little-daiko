const fs = require('fs');

class Logger{
    constructor(guildId){
        this.console = 
        new console.Console(fs.createWriteStream(`./logs/${guildId}.log`, {flags:'a'}));
    }
    log(message, ...args){
        this.console.log(message, args);
    }
    warn(message, ...args){
        this.console.warn(message, args);
    }
    error(message, ...args){
        this.console.error(message, args);
    }
} 

module.exports = Logger;