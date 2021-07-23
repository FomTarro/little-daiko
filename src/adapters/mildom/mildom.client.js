const { v4 } = require('uuid');
const https = require('https');
const WebSocket = require('ws');

const liveInfoURL = "https://cloudac.mildom.com/nonolive/gappserv/live/enterstudio"
const serverUrl = "https://im.mildom.com/"

async function getServerInfo(roomId, logger){
    const url = new URL(serverUrl);
    url.searchParams.append("room_id", roomId);
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

async function startListener(roomId, onChatMessage, onLiveStart, onOpen, onClose, logger){
    const uuId = v4();
    const guestId = `pc-gp-${uuId}`;

    /*
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

    const liveStatus = await getLiveInfo(url);
    if(liveStatus.body && liveStatus.body['live_type'] === 2)
    console.log(liveStatus)
    */

    const serverInfo = await getServerInfo(roomId, logger);
    if(serverInfo['wss_server']){
        const wsUrl = `wss://${serverInfo['wss_server']}?roomId=${roomId}`;
        logger.log(`Obtained websocket URL: ${wsUrl}`);
        const ws = generateWebSocket(wsUrl, roomId, guestId, logger);
        return new ChatListener(roomId, ws, logger);
    }

    function generateWebSocket(wsUrl, roomId, guestId, logger){
        const ws = new WebSocket(wsUrl);
        ws.on('open', () => {
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
                onOpen();
            }
        });   
        ws.on('message', (data) => {
            if(data){
                const dataStruct = JSON.parse(data);
                switch(dataStruct.cmd)
                {
                    case "enterRoom":
                        logger.log(`Connected to chat for roomId: ${roomId}!`);
                        break;
                    case "onChat":
                        onChatMessage({
                            authorName: dataStruct.userName,
                            authorId: dataStruct.userId,
                            authorImage: dataStruct.userImg,
                            message: dataStruct.msg,
                            time: dataStruct.time,
                        });
                        break;
                    case "onLiveStart":
                        logger.log(`Live has started, let's watch!`);
                        onLiveStart({
                            roomId: dataStruct.roomId,
                        });
                        break;
                    case "onLiveEnd":
                        logger.log(`Live has ended, thank you for watching!`);
                        break;
                }
            }
        });
        ws.on('close', (data) => {
            logger.log(`Closing connection to chat for roomId: ${roomId}!`);
            if(onClose){
                onClose();
            }
        })
        ws.reopen = () => { return generateWebSocket(wsUrl, roomId, guestId, logger)};
        return ws;
    }
}

class ChatListener{
    constructor(roomId, webSocket, logger){
        this.roomId = roomId;
        this.webSocket = webSocket;
        this.logger = logger ? logger : console;
        this.ping();
    }

    stopListener(){
        if(this.pingTimer){
            clearTimeout(this.pingTimer);
        }
        if(this.webSocket){
            this.webSocket.close();
        }
    }

    isListening(){
        return this.webSocket ? this.webSocket.readyState === 1 : false;
    }

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

module.exports.startListener = startListener;
module.exports.ChatListener = ChatListener;