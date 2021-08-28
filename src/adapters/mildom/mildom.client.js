const { ChatMessage } = require('../../models/chat.message');
const { LiveInfo } = require('../../models/live.info');
const { v4 } = require('uuid');
const https = require('https');
const WebSocket = require('ws');

const liveInfoURL = "https://cloudac.mildom.com/nonolive/gappserv/live/enterstudio"
const serverUrl = "https://im.mildom.com/"

/**
 * Performs a basic GET request to the given URL.
 * @param {URL} url The URL to GET.
 * @param {console} logger Logging implementation.
 * @returns 
 */
async function getRequest(url, logger){
    const promise = new Promise(function(resolve, reject){
        const req = https.get(url, res => {
            logger.log(`GET Server Info status code: ${res.statusCode}`)
            res.on('data', d => {
                if(res.statusCode != 200){
                    reject(`Bad status code: [${res.statusCode}]`);
                    return;
                }else{
                    resolve(d);
                }
            });
        });
            
        req.on('error', error => {
            reject(error.toString());
        });
        
        req.end();
    }).then((d) => { return JSON.parse(d.toString()) }).catch((error) => { logger.error(error); return {} });

    return promise;  
}

/**
 * Gets info from mildom including the websocket address for the given channel.
 * @param {Number} roomId Channel ID, must be numeric.
 * @param {console} logger Logging implementation.
 * @returns 
 */
async function getServerInfo(roomId, logger){
    const url = new URL(serverUrl);
    url.searchParams.append("room_id", roomId);
    return getRequest(url, logger);
}

/**
 * Gets live info status about the given channel.
 * @param {Number} roomId Channel ID, must be numeric.
 * @param {string} guestId Guest ID fort he client.
 * @param {console} logger Logging implementation.
 * @returns {LiveInfo} The live info.
 */
async function getLiveInfo(roomId, guestId, logger){
    const url = new URL(liveInfoURL);
    url.searchParams.append("user_id", roomId);
    url.searchParams.append("timestamp", Date.parse(new Date()))
    url.searchParams.append("__guest_id", guestId)
    url.searchParams.append("__location", "Japan|Tokyo")
    url.searchParams.append("__country", "Japan")
    url.searchParams.append("__cluster", "aws_japan")
    url.searchParams.append("__platform", "web")
    url.searchParams.append("__la", "ja")
    url.searchParams.append("__sfr", "pc")
    const liveInfo = await getRequest(url, logger);
    if(liveInfo && liveInfo.body){        
        return new LiveInfo(liveInfo.body['live_start_ms'], Boolean(liveInfo.body['live_mode'] == 1));
    }
    return new LiveInfo(0, false);
}

/**
 * The callback for an receiving a chat message.
 *
 * @callback ChatMessageCallback
 * @param {ChatMessage} message The message.
 */

/**
 * The callback for an receiving liveInfo.
 *
 * @callback LiveInfoCallback
 * @param {LiveInfo} live The live Info.
 */


/**
 * Creates and starts a listener to the mildom channel of the given ID.
 * @param {Number} roomId Channel ID, must be numeric.
 * @param {ChatMessageCallback} onChatMessage Callback to execute upon recieving a chat message.
 * @param {LiveInfoCallback} onLiveStart Callback to execute upon the channel going live.
 * @param {LiveInfoCallback} onLiveEnd Callback to execute upon the channel ending the live.
 * @param {VoidFunction} onOpen Callback to execute upon successful connection to the channel.
 * @param {VoidFunction} onClose Callback to execute upon disconnect from the channel.
 * @param {console} logger Logging implementation.
 * @returns {ChatListener} The listener to the channel.
 */
async function startListener(roomId, onChatMessage, onLiveStart, onLiveEnd, onOpen, onClose, logger){
    
    const uuId = v4();
    const guestId = `pc-gp-${uuId}`;

    const serverInfo = await getServerInfo(roomId, logger);
    console.log(serverInfo);
    if(serverInfo['wss_server']){
        const wsUrl = `wss://${serverInfo['wss_server']}?roomId=${roomId}`;
        logger.log(`Obtained websocket URL: ${wsUrl}`);
        const ws = generateWebSocket(wsUrl, roomId, guestId, logger);
        return new ChatListener(roomId, guestId, ws, logger);
    }

    /**
     * Generates a websocket with the provided callbacks for various events.
     * @param {URL} wsUrl Websocket URL.
     * @param {Number} roomId Channel ID.
     * @param {string} guestId User ID
     * @param {console} logger Logging implementation.
     * @returns {WebSocket}
     */
    function generateWebSocket(wsUrl, roomId, guestId, logger){
        const ws = new WebSocket(wsUrl);
        ws.on('open', async () => {
            logger.log(`Connecting to chat for roomId: ${roomId}...`);
            ws.send(JSON.stringify(
            {
                level: 1,
                userName: "little-daiko",
                guestId: guestId,
                roomId: roomId,
                reqId: 1,
                nonopara: "nonopara",
                cmd: "enterRoom",
            }));
            if(onOpen){
                await onOpen();
            }
        });   
        ws.on('message', async (data) => {
            if(data){
                const message = JSON.parse(data);
                switch(message.cmd)
                {
                    case "enterRoom":
                        logger.log(`Connected to chat for roomId: ${roomId}!`);
                        break;
                    case "onChat":
                        await onChatMessage(new ChatMessage(
                            message.userName,
                            message.userId,
                            message.userImg,
                            sanitize(message.msg),
                            message.time,
                        ));
                        break;
                    case "onAdd":
                        // only alert when streamer enters
                        if(roomId == message.userId){
                            await onChatMessage(new ChatMessage(
                                message.userName,
                                message.userId,
                                message.userImg,
                                `User has entered the room.`,
                                Date.parse(new Date()),
                            ));
                        }
                        break;
                    case "onLiveStart":
                        logger.log(`Live has started, let's watch!`);
                        await onLiveStart(new LiveInfo(Date.parse(new Date()), true));
                        break;
                    case "onLiveEnd":
                        logger.log(`Live has ended, thank you for watching!`);
                        await onLiveEnd(new LiveInfo(0, false));
                        break;
                }
            }
        });
        ws.on('close', async (data) => {
            logger.log(`Closing connection to chat for roomId: ${roomId}!`);
            if(onClose){
                await onClose();
            }
        })
        // Stored function configuration to allow the websocket to recreate itself later.
        ws.reopen = () => { return generateWebSocket(wsUrl, roomId, guestId, logger)};
        return ws;
    }
}

/**
 * A listener to the mildom channel of the given ID.
 */
class ChatListener{
    /**
     * 
     * @param {number} roomId 
     * @param {WebSocket} webSocket 
     * @param {console} logger 
     */
    constructor(roomId, guestId, webSocket, logger){
        this.roomId = roomId;
        this.guestId = guestId
        this.webSocket = webSocket;
        this.logger = logger ? logger : console;
        // start pinging
        this.ping();
    }

    /**
     * Gracefully disconnects the listener and stops automatic reconnect attempts.
     */
    stopListener(){
        if(this.pingTimer){
            clearTimeout(this.pingTimer);
        }
        if(this.webSocket){
            this.webSocket.close();
        }
    }
    /**
     * Checks if the listener is actively connected to the channel.
     * @returns {Boolean}
     */
    isListening(){
        return this.webSocket ? this.webSocket.readyState === 1 : false;
    }

    /**
     * Fetches the live info of the stream.
     * @returns {LiveInfo}
     */
    async getLiveStatus(){
        return await getLiveInfo(this.roomId, this.guestId, this.logger);
    }

    /**
     * Recursively pings the channel to keep the listener alive.
     */
    async ping(){
        try{
            if(this.webSocket.readyState === 1){
                this.webSocket.ping();
            }else if(this.webSocket.readyState > 1){
                this.logger.error(`Websocket closed unexpectedly for RoomId ${this.roomId}`)
                this.webSocket = this.webSocket.reopen();
            }
            this.pingTimer = setTimeout(() => {
                // console.log('ping!')
                this.ping();
            }, 2500);
        }catch(e){
            if(this.webSocket){
                this.webSocket.close();
            }
            this.logger.error(`Websocket ping error to RoomId ${this.roomId}: ${e}`);
        }
    }
}

const regex = new RegExp(/\[\/([0-9]+)\]/g);
const platformEmotes = [
    [1001, '🔰'],
    [1002, '😨'],
    [1003, '🚩'],
    [1004, '😆'],
    [1005, '😳'],
    [1006, '😡'],
    [1007, '😴'],
    [1008, '😘'],
    [1009, '😍'],
    [1010, '😤'],
    [1011, '😲'],
    [1012, '😏'],
    [1013, '🍚'], // TODO: better representation for these three?
    [1014, '🍚'],
    [1015, '🍚'],
    [1016, '😈'],
    [1017, '🐱'],
    [1018, '🙋‍♂️'],
    [1019, '👩‍🎤'],
    [1020, '🐸'],
    [1021, '🐸♥'],
];

/**
 * Performs necessary sanitization, such as emote replacement.
 * @param {string} str The input string.
 * @returns {string} The sanitized string.
 */
function sanitize(str){
    let sanitized = str;
    const matches = str.match(regex);
    if(matches){
        for(let match of matches){
            const emote = platformEmotes.find(pair => { return match == `[/${pair[0]}]`});
            const replacement = emote ? emote[1] : `[❓]`;
            sanitized = sanitized.replace(match, replacement);
        }
    }
    return sanitized;
}

module.exports.startListener = startListener;
module.exports.ChatListener = ChatListener;
module.exports.sanitize = sanitize;