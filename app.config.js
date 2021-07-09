require('dotenv').config();
const path = require("path");

const appConfig = {
    // config vars
    get ENV(){ return process.env.NODE_ENV || 'local'; },
    get PORT(){ return process.env.PORT || 8080; },
    get DOMAIN(){ return process.env.domain || `http://localhost:${this.PORT}` },
    get SESSION_SECRET(){ return process.env.session_secret; },
    get RATE_LIMIT_WINDOW_MS(){return process.env.rate_limit_window_ms || 15 * 60 * 1000;},
    get RATE_LIMIT_MAX_REQUESTS(){return process.env.rate_limit_max_requests || 100;},
    get DISCORD_BOT_TOKEN(){return process.env.discord_bot_token},

    get MILDOM_CLIENT(){ return require('./src/adapters/mildom/mildom.client')},
    get DISCORD_CLIENT(){ return require('./src/adapters/discord/discord.client')},
    get DISCORD_HELPERS(){ return require('./src/adapters/discord/discord.helpers')},

    get CONFIG_STORAGE(){ return require('./src/persistence/config.storage')},

    get PROFILES(){ return require('./src/models/profiles')},
    get LANGUAGES(){ return require('./src/models/languages')},
    get EVENTS(){ return require('./src/models/event')},
    get COMMANDS(){ return require('./src/models/command')},
}

module.exports.AppConfig = appConfig;