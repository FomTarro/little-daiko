const { FormattedTime } = require("../utils/time.utils");

class Timestamp{
    /**
     * Class for represeting a timestamp in a stream.
     * @param {FormattedTime} time The timestamp as a formatted HH:MM:SS structure.
     * @param {String} dscription The description of the timestamp.
     */
    constructor(time, description){
        this.time = time;
        this.description = description;
    }
}

module.exports.Timestamp = Timestamp;