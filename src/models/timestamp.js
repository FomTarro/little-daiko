class Timestamp{
    /**
     * Class for represeting a timestamp in a stream.
     * @param {Number} startTime The timestamp of stream start.
     * @param {Number} stampTime The timestamp of the moment.
     * @param {Number} adjustment The amount of time backward to offset the timestamp.
     * @param {String} dscription The description of the timestamp.
     */
    constructor(startTime, stampTime, adjustment, description){
        this.startTime = startTime;
        this.stampTime = stampTime;
        this.adjustment = adjustment;
        this.description = description;
    }
}

module.exports.Timestamp = Timestamp;