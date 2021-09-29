const { AppConfig } = require('../../../app.config');
const Discord = require('discord.js');
const { ChatMessage } = require('../../models/chat.message');

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
        const result1 = AppConfig.DISCORD_HELPERS.isDm(message)
        expect(result1).toBe(false);
        const result2 = AppConfig.DISCORD_HELPERS.isDm(guild);
        expect(result2).toBe(true);
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
    test("isEmote", async() => {
        // execute tests
        const input = '<:lego_skeleton:881715901282529331>'
        const result1 = AppConfig.DISCORD_HELPERS.isEmote(input)
        expect(result1).toBe(true)
        const result2 = AppConfig.DISCORD_HELPERS.isEmote(undefined)
        expect(result2).toBe(false)
    });
    test("generateButtons", async() => {
        // execute tests
        const buttons = AppConfig.DISCORD_HELPERS.generateButtonRow([
            { label: '-5s', customId: 'timestamp_subtract', style: 2 },
            { label: '+5s', customId: 'timestamp_add', style: 2 },
        ])
        expect(buttons.components.length).toBe(2);
    });
    test("generateEmbed", async() => {
        // execute tests
        const embed = AppConfig.DISCORD_HELPERS.generateEmbed(new ChatMessage("Tom", 1234, undefined, "MESSAGE", 1234567));
        expect(embed.author.name).toBe("Tom");
    });
    test("generateAttachment", async() => {
        // execute tests
        const file = AppConfig.DISCORD_HELPERS.generateAttachment("THE FILE CONTENTS", "file");
        expect(file.attachment.length).toBe(17);
    });
});