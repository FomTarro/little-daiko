const { FormattedTime } = require("../utils/time.utils");

class Timestamp{
    /**
     * Class for represeting a timestamp in a stream.
     * @param {FormattedTime} time 
     * @param {String} dscription 
     */
    constructor(time, description){
        this.time = time;
        this.description = description;
    }
}

module.exports.Timestamp = Timestamp;