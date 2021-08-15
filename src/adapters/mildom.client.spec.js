const { sanitize } = require("./mildom/mildom.client")

describe("Text sanitization tests",  () => {
    test("simple replacement of platform emoji", () => {
        const input = "Hello, I'm a [/1001] (beginner)."
        const output = sanitize(input);
        expect(output).toContain('🔰');
    })
    test("simple replacement of multiple platform emoji", () => {
        const input = "Here's seveal more emoji: [/1001][/1002][/1003]"
        const output = sanitize(input);
        expect(output).toContain('🔰');
        expect(output).toContain('😨');
        expect(output).toContain('🚩');
    })

    test("replacement of unknown emoji", () => {
        const input = "What emote is this? [/2345]"
        const output = sanitize(input);
        expect(output).toContain('[❓]');
    })

    test("no replacement when spaces", () => {
        const input = "What emote is this? [/23 45]"
        const output = sanitize(input);
        expect(output).toContain('[/23 45]');
    })
})