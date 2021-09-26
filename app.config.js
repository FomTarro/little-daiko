require('dotenv').config();

/**
 * A dependency injection configuration.
 */
class AppConfig{
    get ENV(){ return process.env.NODE_ENV || 'local'; };
    get PORT(){ return process.env.PORT || 8080; };
    get DOMAIN(){ return process.env.domain || `http://localhost:${this.PORT}` };
    get DISCORD_BOT_TOKEN(){return process.env.discord_bot_token};
    get DISCORD_BOT_NAME(){return 'little-daiko'};

    get MILDOM_CLIENT(){ return require('./src/adapters/mildom/mildom.client')};
    get DISCORD_CLIENT(){ return require('./src/adapters/discord/discord.client')};
    get DISCORD_HELPERS(){ return require('./src/adapters/discord/discord.helpers')};

    get CONFIG_STORAGE(){ return require('./src/persistence/config.storage')};
    get LISTENER_STORAGE(){ return require('./src/persistence/listener.storage')};
    get TIMESTAMP_STORAGE(){ return require('./src/persistence/timestamp.storage')};

    get BOT(){ return require('./src/engine/bot')};
    get EVENTS(){ return require('./src/engine/events')};
    get COMMANDS(){ return require('./src/engine/commands/commands')};
    get BUTTONS(){ return require('./src/engine/buttons/buttons')};
    get PERMISSIONS(){ return require('./src/engine/permissions')};
}

const instance = new AppConfig();

module.exports.AppConfig = instance;