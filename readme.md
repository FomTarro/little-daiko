# little-daiko
A Discord bot for integrating with the [mildom.com](https://www.mildom.com) streaming platform
 
## About
Named after the digital persona of beloved mildom streamer [kson](https://www.mildom.com/10882672), this bot was built to help facilitate the enjoyment of her streams by her western fans. 
 
To that end, this bot seeks to achieve two primary goals:
1) To provide go-live alerts for a designated streamer by pinging a designated role, and posting the alert in a designated Discord channel.
2) To transmit translation messages from designated "trusted chat members" that are prefixed with a translation indicator (such as `[EN]`) into a designated Discord channel. 
 
## Contact
 
This bot is built and managed by Tom "Skeletom" Farro. If you need to contact him, the best way to do so is via [Twitter](https://www.twitter.com/fomtarro) or by leaving an issue ticket on this repo. Currently, this bot is not available for public deployment, but may become public in the near future.
 
# Usage
 
While it was built with kson in mind, it can be configured by server operators to work with any mildom streamer's channel. 
 
In addition, there is no limit to the number of `[language : Discord channel]` pairs for translation message transmission. This means that you can have seperate output channels for `[EN]`, `[ES]`, `[JP]`, `[ITA]`, etc.
 
## Commands
### `!config`

Usable by: Any user.

Displays a list of all configurable properties for the server.

### `!prefix <prefix string>`

Usable by: Bot Operator, Server Owner or Bot Owner.

Sets the prefix to denote bot commands.

### `!role ops <role name or id>`

Usable by: Server Owner or Bot Owner.

Sets the role name of permitted bot operators for this server. The server owner and the bot owner are granted these permissions without needing the role.

### `!role alert <role name or id>`

Usable by: Server Owner or Bot Owner.

Sets the role to ping when the designated streamer goes live.  The alert will be posted in the designated alert channel.

### `!streamer <streamer id>`

Usable by: Bot Operator, Server Owner or Bot Owner.

Sets the streamer to listen to. The streamer id must be a number.

### `!users add <list of numeric user ids>`

Usable by: Bot Operator, Server Owner or Bot Owner.

Adds all listed user ids to the list of users to listen for.  The list must be space-separated. The user ids must be numbers. The streamer is implicitly on the list.

### `!users remove <list of numeric user ids>`

Usable by: Bot Operator, Server Owner or Bot Owner.

Removes all listed user ids from the list of users to listen for.  The list must be space-separated. The user ids must be numbers.

### `!output chat add <language prefix> <channel name or id>`

Usable by: Bot Operator, Server Owner or Bot Owner.

Sets the server channel which stream messages with the designated language prefix will be posted to. Stream messages from the streamer will go to all language channels.

### `!output chat remove <language prefix>`

Usable by: Bot Operator, Server Owner or Bot Owner.

Stops posting to the server for the given language prefix.

### `!output alert <channel name or id>`

Usable by: Bot Operator, Server Owner or Bot Owner.

Sets the server channel which stream go-live alerts will be posted to.

### `!start`

Usable by: Bot Operator, Server Owner or Bot Owner.

Starts listening to the chat of the selected streamer,  for messages tagged with the designated language tag that are posted by users on the designated users list.

### `!stop`

Usable by: Bot Operator, Server Owner or Bot Owner.

Stops listening to the chat of the selected streamer.

### `!status`

Usable by: Bot Operator, Server Owner or Bot Owner.

Lists the status of the chat listener for the server.

### `!help`

Usable by: Any user.

Displays a list of all commands and their aliases.

### `!help <command>`

Usable by: Any user.

Displays usage information about a specific command.

