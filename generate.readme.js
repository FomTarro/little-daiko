const { AppConfig } = require('./app.config');
const fs = require('fs');

async function main(){
    const dummyConfig = {
        CONFIG_STORAGE: {
            getProperty(guild, prop){
                return '!'
            }
        },
        COMMANDS: AppConfig.COMMANDS,
        PERMISSIONS: AppConfig.PERMISSIONS,
        DISCORD_HELPERS: {
            generateEmbed(content){
                return content;
            }
        }
    }
    let helpText;
    const dummyMessage = {
        channel: {
            send(content){
                helpText = content;
            }
        }
    }
    let template = String(fs.readFileSync('./readme.template.md'));
    let output = '';
    const commands = AppConfig.COMMANDS(dummyConfig).sort((a, b) => { 
        return a.aliases[0].localeCompare(b.aliases[0]);
    });
    const help = commands.find(c => { return c.aliases.includes('help')});
    for(command of commands){
        await help.callback(dummyMessage, [command.aliases[0]]);
        output = output + `### \`[${command.aliases.join(', ')}]\`\n\n`
        for(field of helpText.fields){
            output = output + `${field.name}\n\n${field.value.trim()}\n\n`;
        }
    }
    template = template.replace('${COMMANDS}', output);
    fs.writeFileSync('./readme.md', template);
}
main();