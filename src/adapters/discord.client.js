const { AppConfig } = require('../../app.config');
const Discord = require('discord.js');
const Enmap = require('enmap');

const client = new Discord.Client();
const owner = '106091790301421568';
const listeners = new Map();
const storedConfig = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
    autoEnsure: {
        prefix: "!",
        role: "@admin",
        streamer: 00000,
        users: [],
        channel: "general",
        language: "en",
    }
});

function initialize(onLogin){

    client.on("guildDelete", guild => {
        // When the bot leaves or is kicked, delete settings to prevent stale entries.
        storedConfig.delete(guild.id);
    });

    client.on("message", async (message) => {
        // Skip processing messages from DMs and other bots
        if(isDm(message) || isBot(message)){
            return;
        }

        const guildConfig = storedConfig.get(message.guild.id);
        if(message.content.indexOf(guildConfig.prefix) !== 0){ 
            return; 
        }
      
        // Then we use the config prefix to get our arguments and command
        const args = message.content.split(/\s+/g);
        const command = args.shift().slice(guildConfig.prefix.length).toLowerCase();
        const [...value] = args;

        // Check permissions for ownership
        if(isBotOwner(message) 
        || isGuildOwner(message) 
        || isAdmin(message, guildConfig.role)){
            if(command == "streamer"){ // Set watched streamer
                if(value.length > 0){
                    const argId = Number.parseInt(value[0]);
                    if(!isNaN(argId)){
                        storedConfig.set(getGuildId(message), argId, "streamer")
                    }
                }
            }else if(command == "+users"){ // Add watched users
                const users = storedConfig.get(getGuildId(message), "users");
                const argIds = [...new Set(value.map((user) => {
                    return Number.parseInt(user);
                }).filter((user) => { 
                    return !isNaN(user) 
                }))];
                const updatedUsers = users.concat(argIds);
                storedConfig.set(getGuildId(message), updatedUsers, "users");
            }else if(command ==  "-users"){ // Remove watched users
                const users = storedConfig.get(getGuildId(message), "users");
                const argIds = [...new Set(value.map((user) => {
                    return Number.parseInt(user);
                }).filter((user) => { 
                    return !isNaN(user) 
                }))];
                const updatedUsers = users.filter((user) => { 
                    return !argIds.includes(user)
                });
                storedConfig.set(getGuildId(message), updatedUsers, "users");
            }else if(command == "channel"){ // Set output channel
                if(value.length > 0){
                    storedConfig.set(getGuildId(message), value[0], "channel");
                }
            }else if(command == "language"){ // Set the language to listen for
                if(value.length > 0){
                    storedConfig.set(getGuildId(message), value[0], "language")
                }
            }else if(command == "listen"){ // Start listening for mildom chat messages
                message.channel.send("Starting listener.");
                const startEpoch = Date.parse(new Date());
                const language = `[${guildConfig.language}]`;
                const channel =  message.guild.channels.cache.find(i => i.name === guildConfig.channel);
                const listener = await AppConfig.MILDOM_CLIENT.startListener(Number.parseInt(guildConfig.streamer), (m) => {
                    if(m.userId == guildConfig.streamer
                    || (guildConfig.users.includes(m.userId) && m.message.toLowerCase().startsWith(language))){
                        if(m.time > startEpoch){
                            console.log(m);
                            channel.send(generateEmbed(m));
                        }
                    }
                });
                listeners.set(getGuildId(message), listener);
            }else if(command == "stop"){ // Stop listening for mildom chat messages
                const listener = listeners.get(getGuildId(message));
                if(listener){
                    listener.stopListener();
                    listeners.delete(getGuildId(message));
                    message.channel.send("Stopping listener.");
                }else{
                    message.channel.send("No listener activated to stop on this server.");
                }
            }
        }

        // No permissions required for support functions
        if(command == "config"){
            const configProps = Object.keys(guildConfig).map(prop => {
                return `${prop}  :  ${guildConfig[prop]}`;
            });
            message.channel.send(`Here is this server's current configuration: \`\`\`${configProps.join("\n")}\`\`\``);
        }else if(command == "help"){
            // TODO print list of commands/arguments
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

// Helper methods
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

function getUserId(subject){ 
    return isMessage(subject) ? subject.author.id : subject.id;
}

function getGuildId(subject){
    const isADm = isMessage(subject) && isDm(subject);
    return isADm                ? '0'
        : isMessage(subject)    ? subject.guild.id
        : isGuild(subject)      ? subject.id
                                : subject.guild.id;
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

module.exports.initialize = initialize;