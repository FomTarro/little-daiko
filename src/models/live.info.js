class LiveInfo{
    /**
     * A struct for carrying live info status about a stream.
     * @param {Number} startTime The start time of the stream, in ms.
     * @param {Boolean} live A boolean determining of the stream is currently live.
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
        return Boolean(this.live == true);
    }
}

module.exports.LiveInfo = LiveInfo;