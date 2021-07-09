const { AppConfig } = require('../../app.config');
const Discord = require('discord.js');
const Enmap = require('enmap');

const client = new Discord.Client();
const owner = '106091790301421568';
const settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
    autoEnsure: {
        prefix: "!",
        role: "@admin",
        streamer: 00000,
        users: [],
        channel: "general"
    }
});

function initialize(onLogin){

    client.on("guildDelete", guild => {
        // When the bot leaves or is kicked, delete settings to prevent stale entries.
        settings.delete(guild.id);
    });

    client.on("message", async (message) => {
        if(isDm(message) || isBot(message)){
            return;
        }

        console.log(getUserId(message));
        
        const guildConf = settings.get(message.guild.id);
        if(message.content.indexOf(guildConf.prefix) !== 0){ 
            return; 
        }
      
        //Then we use the config prefix to get our arguments and command:
        const args = message.content.split(/\s+/g);
        const command = args.shift().slice(guildConf.prefix.length).toLowerCase();
        const [...value] = args;
        switch(command){
            case "streamer":
                console.log(value);
                settings.set(message.guild.id, value.join(" "), "streamer")
                break;
            case "+user":
                break;
            case "-user":
                break;
            case "listen":
                // console.log(isBotOwner(message))
                // console.log(isAdmin(message))
                // console.log(isGuildOwner(message))
                if(isBotOwner(message) || isAdmin(message) || isGuildOwner(message)){
                    const language = AppConfig.LANGUAGES.ENGLISH;
                    const startEpoch = Date.parse(new Date());
                    AppConfig.MILDOM_CLIENT.startListener(Number.parseInt(guildConf.streamer), (m) => {
                        if(m.userId == guildConf.streamer
                        || (guildConf.users.includes(m.userId) && m.message.startsWith(language))){
                            if(m.time > startEpoch){
                                console.log(m);
                                AppConfig.DISCORD_CLIENT.sendMessage(guildConf.channel, m);
                            }
                        }
                    });
                }
                break;
            case "stop":
                break;
            case "config":
                const configProps = Object.keys(guildConf).map(prop => {
                    return `${prop}  :  ${guildConf[prop]}`;
                });
                message.channel.send(`The following are the server's current configuration: \`\`\`${configProps.join("\n")}\`\`\``);
                break;
        }
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.guilds.cache.forEach(guild => {
            console.log(`${guild.name} | ${guild.id}`);
        });
        onLogin();
    });
    client.login(AppConfig.DISCORD_BOT_TOKEN);
}

function sendMessage(channelName, message){
    client.channels.cache.find(i => i.name === channelName).send(generateEmbed(message));
}

function generateEmbed(message){
    // 0 sets the date to epoch
    const date = new Date(0).setUTCMilliseconds(message.time); 
    return new Discord.MessageEmbed()
    .setColor('#f1c40f')
    .setAuthor(message.userName, message.userImg)
    .setDescription(message.message)
    .setTimestamp(date)
}

// helpers

function isMessage (subject){
    return subject instanceof Discord.Message;
}

function isGuild(subject){
    return subject instanceof Discord.Guild;
}
  
function isDm(subject){
    return subject.guild === undefined;
}

function isBot(subject){
    return isMessage(subject) ? subject.author.bot : subject.bot;
}

function getUserId(subject){ 
    return isMessage(subject) ? subject.author.id : subject.id;
}

function isAdmin(member, role){
    return hasRole(member, role);
}

function isGuildOwner(subject){
    return getUserId(subject) == subject.guild.ownerID;
}

function isBotOwner(subject){
    return getUserId(subject) == owner;
}

function hasRole(subject, role){
    const user = isMessage(subject) ? subject.member : subject;
    return user.roles.cache.has(role);
}

module.exports.initialize = initialize;
module.exports.sendMessage = sendMessage;
module.exports.generateEmbed = generateEmbed;