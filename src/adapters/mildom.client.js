const { v4 } = require('uuid');
const https = require('https');
const ws = require('ws');

const liveInfoURL = "https://cloudac.mildom.com/nonolive/gappserv/live/enterstudio"
const serverUrl = "https://im.mildom.com/"

function getLiveInfo(url){

}

async function getServerInfo(roomId){
    const url = new URL(serverUrl);
    url.searchParams.append("room_id", roomId);
    //console.log(url);
    const promise = new Promise(function(resolve, reject){
        const req = https.get(url, res => {
            console.log(`GET statusCode: ${res.statusCode}`)
            res.on('data', d => {
                if(res.statusCode != 200){
                    reject(`bad status code: [${res.statusCode}]`);
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

async function getListener(roomId, messageHandler){
    const uuId = v4();
    const guestId = `pc-gp-${uuId}`;

    const url = new URL(liveInfoURL);
    url.searchParams.append("user_id", roomId);
    url.searchParams.append("timestamp", new Date())
    url.searchParams.append("__guest_id", guestId)
    url.searchParams.append("__location", "Japan|Tokyo")
    url.searchParams.append("__country", "Japan")
    url.searchParams.append("__cluster", "aws_japan")
    url.searchParams.append("__platform", "web")
    url.searchParams.append("__la", "ja")
    url.searchParams.append("__sfr", "pc")

    //console.log(url);

    const serverInfo = await getServerInfo(roomId);
    if(serverInfo['wss_server']){
        const wsUrl = `wss://${serverInfo['wss_server']}?roomId=${roomId}`;
        //console.log(wsUrl);
        const socket = new ws(wsUrl);
        socket.on('open', function open() {
            console.log('open!');
            socket.send(JSON.stringify(
            {
                level: 1,
                userName: "little_daiko",
                guestId: guestId,
                nonopara: "nonopara",
                roomId: roomId,
                cmd: "enterRoom",
                reqId: 1
            }));
        });   
        socket.on('message', function incoming(data) {
            if(data){
                const dataStruct = JSON.parse(data);
                switch(dataStruct.cmd)
                {
                    case "onChat":
                        messageHandler({
                            userName: dataStruct.userName,
                            userId: dataStruct.userId,
                            userImg: dataStruct.userImg,
                            message: dataStruct.msg,
                            time: dataStruct.time,
                        });
                        break;
                    case "onLiveEnd":
                        console.log("Live has ended, closing socket! Thank you for watching!");
                        socket.close();
                        break;
                }
            }
        });
    }
}
// getListener(10203132, (m) => console.log(m))
// //getListener(10882672);

module.exports.ChatListener = getListener;