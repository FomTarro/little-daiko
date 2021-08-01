const { FormattedTime } = require("../utils/time.utils");

class Timestamp{
    /**
     * 
     * @param {FormattedTime} time 
     * @param {String} dscription 
     */
    constructor(time, description){
        this.time = time;
        this.description = description;
    }
}

module.exports.Timestamp = Timestamp;