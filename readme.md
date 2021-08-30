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

If the bot is currently listening, it will include `🟢` in its display name. If it is not listening, it will instead include `🔴`.

## Commands

Here is a list of every command the bot currently supports.

You can learn more about them by typing `!help <command>`.

### `config`

Command Information:

Alternate Names: `[config, conf, c]`

Usable by: Operator Role, Server Owner or Developer.

`!config`

Displays a list of all configurable properties for the server.

### `emote`

Command Information:

Alternate Names: `[emote, em, e]`

Usable by: Operator Role, Server Owner or Developer.

`!emote add <mildom emote number> <discord emote>`

Sets the Discord emote equivalent of a Mildom emote that is contained in a transmitted message.

`!emote remove <mildom emote number>`

Removes the Discord emote equivalent of a Mildom emote.

### `help`

Command Information:

Alternate Names: `[help, h]`

Usable by: Any user.

`!help`

Displays a list of all commands and their alternate names.

`!help <command>`

Displays usage information about a specific command.

### `output`

Command Information:

Alternate Names: `[output, out, o]`

Usable by: Operator Role, Server Owner or Developer.

`!output chat add <language prefix> <channel name or id>`

Sets the server channel which stream messages with the designated language prefix will be posted to. Stream messages from the streamer will go to all language channels.

`!output chat remove <language prefix>`

Stops posting to the server for the given language prefix.

`!output alert <channel name or id>`

Sets the server channel which stream go-live alerts will be posted to.

### `prefix`

Command Information:

Alternate Names: `[prefix, p]`

Usable by: Operator Role, Server Owner or Developer.

`!prefix <prefix string>`

Sets the prefix to denote bot commands.

### `remote`

Command Information:

Alternate Names: `[remote, rem]`

Usable by: Developer.

`!remote <server id> <command> <command args>`

Allows remote execution of commands on deployed servers by the bot owner,  for checking on bot status and assisting with setup.

### `role`

Command Information:

Alternate Names: `[role, r]`

Usable by: Server Owner or Developer.

`!role ops <role name or id>`

Sets the role of permitted operators of the bot for this server. The server owner and the developer are granted these permissions without needing the role.

`!role alert <role name or id>`

Sets the role to ping when the designated streamer goes live.  The alert will be posted in the designated alert channel.

### `servers`

Command Information:

Alternate Names: `[servers, sv, guilds]`

Usable by: Developer.

`!servers`

Lists all servers that the bot is currently connected to.

### `start`

Command Information:

Alternate Names: `[start, listen, l]`

Usable by: Operator Role, Server Owner or Developer.

`!start`

Starts listening to the chat of the selected streamer,  for messages tagged with the designated language tag that are posted by users on the designated users list.

### `status`

Command Information:

Alternate Names: `[status]`

Usable by: Operator Role, Server Owner or Developer.

`!status`

Lists the status of the chat listener for the server.

### `stop`

Command Information:

Alternate Names: `[stop, x]`

Usable by: Operator Role, Server Owner or Developer.

`!stop`

Stops listening to the chat of the selected streamer.

### `streamer`

Command Information:

Alternate Names: `[streamer, s]`

Usable by: Operator Role, Server Owner or Developer.

`!streamer <streamer id>`

Sets the streamer to listen to. The streamer id must be a number.  If this is changed while the listener is currently active, the listener will need to be restarted.

### `timestamp`

Command Information:

Alternate Names: `[timestamp, ts, t]`

Usable by: Any user.

`!timestamp <text description>`

Creates a timestamp ten seconds before invocation, with the given description.  Timestamps can be upvoted or downvoted with the assigned reacts.  If the number of downvotes is greater than the number of upvotes, the timestamp will be discarded. A summary list of all remaining timestamps will be posted at the conclusion of the stream.

### `users`

Command Information:

Alternate Names: `[users, u]`

Usable by: Operator Role, Server Owner or Developer.

`!users add <list of numeric user ids>`

Adds all listed user ids to the list of users to listen for.  The list must be space-separated. The user ids must be numbers. The streamer is implicitly on the list.

`!users remove <list of numeric user ids>`

Removes all listed user ids from the list of users to listen for.  The list must be space-separated. The user ids must be numbers.

