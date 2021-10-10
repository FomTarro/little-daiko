const { AppConfig } = require('./app.config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const clientId = AppConfig.DISCORD_BOT_CLIENT_ID;
const guildId = '866887704234950666';

const rest = new REST({ version: '9' }).setToken(AppConfig.DISCORD_BOT_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
        const commands = AppConfig.SLASH_COMMANDS(AppConfig).map(a => a.json);
        console.log(JSON.stringify(commands));
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();