const { AppConfig } = require('../../app.config');

describe("Permissions tests", () => {
    const cases = [ 
        ["Any User", false, false, false, true, false, false, false],
        ["Bot Owner", true, false, false, true, true, true, true],
        ["Server Owner", false, true, false, true, true, true, false],
        ["Bot Operator", false, false, true, true, true, false, false],
    ];
    test.each(cases)("Permission: %p", async(
        permissionChecked,
        isBotOwner,
        isGuildOwner,
        isAdmin,
        expectedAnyUser,
        expectedHasRole,
        expectedGuildOwner,
        expectedBotOwner
    ) => {
        // set up mock dependencies
        const dummyConfig = {
            DISCORD_HELPERS: {
                isBotOwner(){return isBotOwner},
                isGuildOwner(){return isGuildOwner},
                isAdmin(){return isAdmin},
            },
            PERMISSIONS: AppConfig.PERMISSIONS
        }

        // execute test
        const dummyUser = {};
        const permissions = AppConfig.PERMISSIONS(dummyConfig);
        const anyUser = permissions.get(1);
        expect(anyUser.check(dummyUser)).toBe(expectedAnyUser);
        const hasRole = permissions.get(2);
        expect(hasRole.check(dummyUser)).toBe(expectedHasRole);
        const guildOwner = permissions.get(3);
        expect(guildOwner.check(dummyUser)).toBe(expectedGuildOwner);
        const botOwner = permissions.get(100);
        expect(botOwner.check(dummyUser)).toBe(expectedBotOwner);
    });
});