class LiveInfo{
    /**
     * A struct for carrying live info status about a stream.
     * @param {Number} startTime The start time of the stream, in ms.
     * @param {Boolean} live A boolean determining of the stream is currently live.
     * @param {Boolean} membership A boolean determining if the stream is members-only.
     */
    constructor(startTime, live, membership){
        this.startTime = startTime;
        this.live = live;
        this.membership = membership;
    }

    /**
     * Is the stream currently live?
     * @returns {Boolean}
     */
    isLive(){
        return Boolean(this.live == true);
    }

    /**
     * Is the stream members-only?
     * @returns {Boolean}
     */
    isMembership(){
        return Boolean(this.membership == true);
    }
}

module.exports.LiveInfo = LiveInfo;