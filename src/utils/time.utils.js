const secondsInMiliseconds = 1000, 
minutesInMiliseconds = 60 * secondsInMiliseconds,
hoursInMiliseconds = 60 * minutesInMiliseconds;

/**
 * Converts milliseconds into hours, minutes, seconds.
 * @param {Number} millis 
 * @returns {FormattedTime}
 */
function formatTime(millis){
    const hours = Math.floor(millis / hoursInMiliseconds);
    const minutes = Math.floor(hours % 1 * 60)
    const seconds = Math.floor(minutes % 1 * 60)
    return new FormattedTime(hours, minutes, seconds);
}

class FormattedTime{
    /**
     * 
     * @param {Number} hours 
     * @param {Number} minutes 
     * @param {Number} seconds 
     */
    constructor(hours, minutes, seconds){
        this.hours = hours;
        this.seconds = seconds;
        this.minutes = minutes;
    }

    /**
     * Generates a hhhh:mm:ss formatted timestamp.
     * @returns {String}
     */
    print(){
        return `${this.hours}:${pad(this.minutes)}:${pad(this.minutes)}`;
    }
}

function pad(digit){
    return `00${digit}`.slice(-2);
}

module.exports.formatTime = formatTime;
module.exports.FormattedTime = FormattedTime;