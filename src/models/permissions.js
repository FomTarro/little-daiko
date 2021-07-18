function permissions(appConfig){
    const discordHelpers = appConfig.DISCORD_HELPERS;
    return {
        1: {
            check: async(user, role) => { 
                return true;
            },
            description: `Any user`
        },
        2: {
            check: async(user, role) => { 
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
                || discordHelpers.isAdmin(user, role) 
            },
            description: `Bot Operator, Server Owner or Bot Owner`
        },
        3: {
            check: async(user, role) => { 
                return discordHelpers.isBotOwner(user) 
                || discordHelpers.isGuildOwner(user) 
            },
            description: `Server Owner or Bot Owner`
        },
        100: {
            check: async(user, role) => { 
                return discordHelpers.isBotOwner(user) 
            },
            description: `Bot Owner`
        }
    }
}

module.exports = permissions;