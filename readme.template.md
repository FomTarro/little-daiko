# little-daiko
A Discord bot for integrating with the [mildom.com](https://www.mildom.com) streaming platform.
 
## About
Named after the digital persona of beloved Mildom streamer [kson](https://www.mildom.com/10882672), this bot was built to help facilitate the enjoyment of her streams by her fans abroad. 
 
To that end, this bot seeks to achieve three primary goals:
1) To provide go-live alerts for a designated streamer by pinging a designated role, and posting the alert in a designated Discord channel.
2) To transmit translation messages from designated "trusted chat members" that are prefixed with a translation indicator (such as `[EN]`) into a designated Discord channel. 
3) To allow users to mark timestamps for noteworthy moments during a stream, which will be summarized in a log file at the end of the stream.
 
## Contact
 
This bot is built and managed by Tom "Skeletom" Farro. If you need to contact him, the best way to do so is via [Twitter](https://www.twitter.com/fomtarro) or by leaving an issue ticket on this repo. Currently, this bot is not available for public deployment, but may become public in the near future.
 
# Usage
 
While it was built with kson in mind, it can be configured by server operators to work with any Mildom streamer's channel. 

## The Basics

Like most Discord bots, this one is controlled via commands.

Commands can be invoked by starting a message with a designated prefix (`!` by default), or by mentioning the bot with the desired command.
 
## Live Translation / Message Transmission

The bot can handle the transmission of translated messages for as many languages as are desired. Each language can be configured to transmit into a designated channel using the `output` command.

For example, let's run the following command:
```
!output chat add en stream-chat-en
```
This will configure the bot to transmit messages from [specified chat members](#users) that are prefixed with `[en]` (case does not matter) into the Discord channel named `stream-chat-en`.

You can then repeat this process for as many languages as you see fit.

## Listening

To get the bot to start listening for chat messages and go-live notifications for a stream, first designate the stream to listen to with the following command:
```
!streamer 123456
```
This will have the bot listen to the Mildom channel ID `123456`, when the bot is active. Next, let's activate the bot with the following command: 
```
!start
```
The bot should now be set to listen to the channel forever. If for some reason you wish to stop listening, simply stop it with the following command:
```
!stop
```

If the bot is currently listening, it will include `${ONLINE}` in its display name. If it is not listening, it will instead include `${OFFLINE}`.

## Commands

Here is a list of every command the bot currently supports.

You can learn more about them by typing `!help <command>`.

${COMMANDS}