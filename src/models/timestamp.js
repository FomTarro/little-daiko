class Timestamp{
    /**
     * Class for represeting a timestamp in a stream.
     * @param {Number} startTime The timestamp of stream start.
     * @param {Number} stampTime The timestamp of the moment.
     * @param {String} dscription The description of the timestamp.
     */
    constructor(startTime, stampTime, description){
        this.startTime = startTime;
        this.stampTime = stampTime;
        this.description = description;
    }
}

module.exports.Timestamp = Timestamp;