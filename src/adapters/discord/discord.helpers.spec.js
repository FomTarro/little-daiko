const { AppConfig } = require('../../../app.config');
const Discord = require('discord.js');

describe("Discord Helpers tests", () => {
    const client = new Discord.Client({ intents: new Discord.Intents(['GUILDS'])});
    const message = new Discord.Message(client, {
        channel_id: 1234,
        id: "absce",
        type: "TEXT",
        content: "CONTENT",
        author: {bot: false, username: "ME"},
        nonce: "123"
    }); 
    const guild = new Discord.Guild(client, {
        id: "GUILD"
    });
    test("isMessage", async() => {
        // execute tests
        const result1 = AppConfig.DISCORD_HELPERS.isMessage(message)
        expect(result1).toBe(true);
        const result2 = AppConfig.DISCORD_HELPERS.isMessage(guild);
        expect(result2).toBe(false);
    });
    test("isGuild", async() => {
        // execute tests
        const result1 = AppConfig.DISCORD_HELPERS.isGuild(message)
        expect(result1).toBe(false);
        const result2 = AppConfig.DISCORD_HELPERS.isGuild(guild);
        expect(result2).toBe(true);
    });
    test("isDm", async() => {
        // execute tests
        const result1 = AppConfig.DISCORD_HELPERS.isMessage(message)
        expect(result1).toBe(true);
        const result2 = AppConfig.DISCORD_HELPERS.isMessage(guild);
        expect(result2).toBe(false);
    });
    test("isBot", async() => {
        // execute tests
        const botMessage = new Discord.Message(client, {
            channel_id: 1234,
            id: "absce",
            type: "TEXT",
            content: "CONTENT",
            author: {bot: true, username: "ME"},
            nonce: "123"
        }); 
        const result1 = AppConfig.DISCORD_HELPERS.isBot(guild)
        expect(result1).toBe(undefined);
        const result2 = AppConfig.DISCORD_HELPERS.isBot(botMessage);
        expect(result2).toBe(true);
    });
});