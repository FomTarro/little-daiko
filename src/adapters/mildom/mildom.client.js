const { v4 } = require('uuid');
const https = require('https');
const WebSocket = require('ws');

const liveInfoURL = "https://cloudac.mildom.com/nonolive/gappserv/live/enterstudio"
const serverUrl = "https://im.mildom.com/"

async function getServerInfo(roomId){
    const url = new URL(serverUrl);
    url.searchParams.append("room_id", roomId);
    //console.log(url);
    const promise = new Promise(function(resolve, reject){
        const req = https.get(url, res => {
            console.log(`GET Server Info status code: ${res.statusCode}`)
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
    }).then((d) => { return JSON.parse(d.toString()) }).catch((error) => { console.error(error); return {} });

    return promise;  
}

async function startListener(roomId, onChatMessage, onLiveStart){
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

    const serverInfo = await getServerInfo(roomId);
    if(serverInfo['wss_server']){
        const wsUrl = `wss://${serverInfo['wss_server']}?roomId=${roomId}`;
        //console.log(wsUrl);
        const ws = new WebSocket(wsUrl);
        ws.on('open', () => {
            console.log(`Connecting to chat for roomId: ${roomId}...`);
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
        });   
        ws.on('message', (data) => {
            if(data){
                const dataStruct = JSON.parse(data);
                switch(dataStruct.cmd)
                {
                    case "enterRoom":
                        console.log(`Connected to chat for roomId: ${roomId}!`);
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
                        onLiveStart({
                            roomId: dataStruct.roomId,
                        });
                        break;
                    case "onLiveEnd":
                        console.log(`Live has ended, closing socket! Thank you for watching!`);
                        ws.close();
                        break;
                }
            }
        });
        return new ChatListener(roomId, ws);
    }
}

class ChatListener{
    constructor(roomId, webSocket){
        this.roomId = roomId;
        this.webSocket = webSocket;
    }

    stopListener(){
        if(this.webSocket){
            this.webSocket.close();
        }
    }
}

module.exports.startListener = startListener;
module.exports.ChatListener = ChatListener;