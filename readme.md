# little-daiko
A Discord bot for integrating with the [mildom.com](https://www.mildom.com) streaming platform.
 
## About
Named after the digital persona of beloved mildom streamer [kson](https://www.mildom.com/10882672), this bot was built to help facilitate the enjoyment of her streams by her fans abroad. 
 
To that end, this bot seeks to achieve two primary goals:
1) To provide go-live alerts for a designated streamer by pinging a designated role, and posting the alert in a designated Discord channel.
2) To transmit translation messages from designated "trusted chat members" that are prefixed with a translation indicator (such as `[EN]`) into a designated Discord channel. 
 
## Contact
 
This bot is built and managed by Tom "Skeletom" Farro. If you need to contact him, the best way to do so is via [Twitter](https://www.twitter.com/fomtarro) or by leaving an issue ticket on this repo. Currently, this bot is not available for public deployment, but may become public in the near future.
 
# Usage
 
While it was built with kson in mind, it can be configured by server operators to work with any mildom streamer's channel. 
 
In addition, there is no limit to the number of `[language : Discord channel]` pairs for translation message transmission. This means that you can have seperate output channels for `[EN]`, `[ES]`, `[JP]`, `[ITA]`, etc.
 
## Commands

Commands can be invoked by prefixing a message with a designated prefix (`!` by default), or by mentioning the bot with the desired command.

You can learn more about them by typing `!help <command>`.

### `config`

Command Information:

Aliases: `[config, conf, c]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!config`

Displays a list of all configurable properties for the server.

### `help`

Command Information:

Aliases: `[help, h]`

Usable by: Any user.

`!help`

Displays a list of all commands and their aliases.

`!help <command>`

Displays usage information about a specific command.

### `output`

Command Information:

Aliases: `[output, out, o]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!output chat add <language prefix> <channel name or id>`

Sets the server channel which stream messages with the designated language prefix will be posted to. Stream messages from the streamer will go to all language channels.

`!output chat remove <language prefix>`

Stops posting to the server for the given language prefix.

`!output alert <channel name or id>`

Sets the server channel which stream go-live alerts will be posted to.

### `prefix`

Command Information:

Aliases: `[prefix, p]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!prefix <prefix string>`

Sets the prefix to denote bot commands.

### `remote`

Command Information:

Aliases: `[remote, rem]`

Usable by: Bot Owner.

`!remote <server id> <command> <command args>`

Allows remote execution of commands on deployed servers by the bot owner,  for checking on bot status and assisting with setup.

### `role`

Command Information:

Aliases: `[role, r]`

Usable by: Server Owner or Bot Owner.

`!role ops <role name or id>`

Sets the role name of permitted bot operators for this server. The server owner and the bot owner are granted these permissions without needing the role.

`!role alert <role name or id>`

Sets the role to ping when the designated streamer goes live.  The alert will be posted in the designated alert channel.

### `servers`

Command Information:

Aliases: `[servers, sv, guilds]`

Usable by: Bot Owner.

`!servers`

Lists all servers that the bot is currently connected to.

### `start`

Command Information:

Aliases: `[start, listen, l]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!start`

Starts listening to the chat of the selected streamer,  for messages tagged with the designated language tag that are posted by users on the designated users list.

### `status`

Command Information:

Aliases: `[status]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!status`

Lists the status of the chat listener for the server.

### `stop`

Command Information:

Aliases: `[stop, x]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!stop`

Stops listening to the chat of the selected streamer.

### `streamer`

Command Information:

Aliases: `[streamer, s]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!streamer <streamer id>`

Sets the streamer to listen to. The streamer id must be a number.  If this is changed while the listener is currently active, the listener will need to be restarted.

### `timestamp`

Command Information:

Aliases: `[timestamp, ts, t]`

Usable by: Any user.

`!timestamp <text description>`

Creates a timestamp ten seconds before invocation, with the given description.  Timestamps can be upvoted or downvoted with the assigned reacts.  If the number of downvotes is greater than the number of upvotes, the timestamp will be discarded. A summary list of all remaining timestamps will be posted at the conclusion of the stream.

### `users`

Command Information:

Aliases: `[users, u]`

Usable by: Bot Operator, Server Owner or Bot Owner.

`!users add <list of numeric user ids>`

Adds all listed user ids to the list of users to listen for.  The list must be space-separated. The user ids must be numbers. The streamer is implicitly on the list.

`!users remove <list of numeric user ids>`

Removes all listed user ids from the list of users to listen for.  The list must be space-separated. The user ids must be numbers.

