class LiveInfo{
    /**
     * 
     * @param {Number} startTime 
     * @param {Number} liveType
     */
    constructor(startTime, liveType){
        this.startTime = startTime;
        this.liveType = liveType;
    }

    /**
     * Is the stream currently live?
     * @returns {Boolean}
     */
    isLive(){
        return true; //Boolean(this.liveType == 1);
    }
}

module.exports.LiveInfo = LiveInfo;