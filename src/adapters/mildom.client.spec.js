const { sanitize } = require("./mildom/mildom.client")

describe("Text sanitization tests",  () => {
    test("simple replacement of platform emoji", () => {
        const input = "Hello, I'm a [/1001] (beginner)."
        const output = sanitize(input);
        expect(output).toContain('🔰');
    })
    test("simple replacement of platform emoji", () => {
        const input = "Hello, I'm a [/1001][/1002][/1003] (beginner)."
        const output = sanitize(input);
        expect(output).toContain('🔰');
        expect(output).toContain('😨');
        expect(output).toContain('🚩');
    })
})