const { AppConfig } = require('../../../app.config');
const Discord = require('discord.js');

const client = new Discord.Client();

function initialize(onLogin){

    const events = AppConfig.EVENTS;
    events.forEach((callback, event) => {
        client.on(event, callback);
    })

    // client.on("message", async (message) => {
    //     // Skip processing messages from DMs and other bots
    //     if(isDm(message) || isBot(message)){
    //         return;
    //     }

    //     const guildConfig = storedConfig.get(message.guild.id);
    //     if(message.content.indexOf(guildConfig.prefix) !== 0){ 
    //         return; 
    //     }
      
    //     // Then we use the config prefix to get our arguments and command
    //     const args = message.content.split(/\s+/g);
    //     const command = args.shift().slice(guildConfig.prefix.length).toLowerCase();
    //     const [...value] = args;

    //     // Check permissions for ownership
    //     if(isBotOwner(message) 
    //     || isGuildOwner(message) 
    //     || isAdmin(message, guildConfig.role)){
    //         if(command == "streamer"){ // Set watched streamer
    //             if(value.length > 0){
    //                 const argId = Number.parseInt(value[0]);
    //                 if(!isNaN(argId)){
    //                     storedConfig.set(getGuildId(message), argId, "streamer")
    //                 }
    //             }
    //         }else if(command == "+users"){ // Add watched users
    //             const users = storedConfig.get(getGuildId(message), "users");
    //             const argIds = [...new Set(value.map((user) => {
    //                 return Number.parseInt(user);
    //             }).filter((user) => { 
    //                 return !isNaN(user) 
    //             }))];
    //             const updatedUsers = users.concat(argIds);
    //             storedConfig.set(getGuildId(message), updatedUsers, "users");
    //         }else if(command ==  "-users"){ // Remove watched users
    //             const users = storedConfig.get(getGuildId(message), "users");
    //             const argIds = [...new Set(value.map((user) => {
    //                 return Number.parseInt(user);
    //             }).filter((user) => { 
    //                 return !isNaN(user) 
    //             }))];
    //             const updatedUsers = users.filter((user) => { 
    //                 return !argIds.includes(user)
    //             });
    //             storedConfig.set(getGuildId(message), updatedUsers, "users");
    //         }else if(command == "channel"){ // Set output channel
    //             if(value.length > 0){
    //                 storedConfig.set(getGuildId(message), value[0], "channel");
    //             }
    //         }else if(command == "language"){ // Set the language to listen for
    //             if(value.length > 0){
    //                 storedConfig.set(getGuildId(message), value[0], "language")
    //             }
    //         }else if(command == "listen"){ // Start listening for mildom chat messages
    //             message.channel.send("Starting listener.");
    //             const startEpoch = Date.parse(new Date());
    //             const language = `[${guildConfig.language}]`;
    //             const channel =  message.guild.channels.cache.find(i => i.name === guildConfig.channel);
    //             const listener = await AppConfig.MILDOM_CLIENT.startListener(Number.parseInt(guildConfig.streamer), (m) => {
    //                 if(m.userId == guildConfig.streamer
    //                 || (guildConfig.users.includes(m.userId) && m.message.toLowerCase().startsWith(language))){
    //                     if(m.time > startEpoch){
    //                         console.log(m);
    //                         channel.send(generateEmbed(m));
    //                     }
    //                 }
    //             });
    //             listeners.set(getGuildId(message), listener);
    //         }else if(command == "stop"){ // Stop listening for mildom chat messages
    //             const listener = listeners.get(getGuildId(message));
    //             if(listener){
    //                 listener.stopListener();
    //                 listeners.delete(getGuildId(message));
    //                 message.channel.send("Stopping listener.");
    //             }else{
    //                 message.channel.send("No listener activated to stop on this server.");
    //             }
    //         }
    //     }

    //     // No permissions required for support functions
    //     if(command == "config"){
    //         const configProps = Object.keys(guildConfig).map(prop => {
    //             return `${prop}  :  ${guildConfig[prop]}`;
    //         });
    //         message.channel.send(`Here is this server's current configuration: \`\`\`${configProps.join("\n")}\`\`\``);
    //     }else if(command == "help"){
    //         // TODO print list of commands/arguments
    //     }
    // });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.guilds.cache.forEach(guild => {
            console.log(`${guild.name} | ${guild.id}`);
        });
        onLogin();
    });
    client.login(AppConfig.DISCORD_BOT_TOKEN);
}

module.exports.initialize = initialize;