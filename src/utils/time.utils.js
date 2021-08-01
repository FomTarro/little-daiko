const secondsInMiliseconds = 1000, 
minutesInMiliseconds = 60 * secondsInMiliseconds,
hoursInMiliseconds = 60 * minutesInMiliseconds;

/**
 * Converts milliseconds into hours, minutes, seconds.
 * @param {Number} millis 
 * @returns {FormattedTime}
 */
function formatTime(millis){
    const hours = millis / hoursInMiliseconds;
    const minutes = hours % 1 * 60;
    const seconds = minutes % 1 * 60;
    return new FormattedTime(Math.floor(hours), Math.floor(minutes), Math.floor(seconds));
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
        this.minutes = minutes;
        this.seconds = seconds;
    }

    /**
     * Generates a hhhh:mm:ss formatted timestamp.
     * @returns {String}
     */
    print(){
        return `${this.hours}:${pad(this.minutes)}:${pad(this.seconds)}`;
    }
}

function pad(digit){
    return `00${digit}`.slice(-2);
}

module.exports.formatTime = formatTime;
module.exports.FormattedTime = FormattedTime;