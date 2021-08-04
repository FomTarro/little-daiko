class LiveInfo{
    /**
     * 
     * @param {Number} startTime 
     * @param {Boolean} live
     */
    constructor(startTime, live){
        this.startTime = startTime;
        this.live = live;
    }

    /**
     * Is the stream currently live?
     * @returns {Boolean}
     */
    isLive(){
        return Boolean(this.isLive);
    }
}

module.exports.LiveInfo = LiveInfo;