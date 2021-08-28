const { AppConfig } = require('./app.config');
const fs = require('fs');
const { HelpCommand } = require('./src/engine/commands/help.command');
const { LiteralConstants } = require('./src/utils/literal.constants');

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
    const help = HelpCommand(dummyConfig);
    for(command of commands){
        await help.callback(dummyMessage, [command.aliases[0]]);
        output = output + `### \`${command.aliases[0]}\`\n\n`
        for(field of helpText.fields){
            output = output + `${field.name}\n\n${field.value.replace('\n', '\n\n').trim()}\n\n`;
        }
    }
    template = template.replace('${COMMANDS}', output);
    template = template.replace('${OFFLINE}', LiteralConstants.OFFLINE_EMOJI);
    template = template.replace('${ONLINE}', LiteralConstants.ONLINE_EMOJI);
    fs.writeFileSync('./readme.md', template);
}
main();