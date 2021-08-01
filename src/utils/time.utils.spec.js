const { formatTime } = require("./time.utils");

describe("Time util tests", () => {
    const cases = [ 
        [57000, 0, 0, 57, `0:00:57`],
        [157000, 0, 2, 37, `0:02:37`],
        [3615200, 1, 0, 15, `1:00:15`],
    ];
    test.each(cases)("Time formatting", async(
        millis,
        hour,
        minute,
        second,
        formatted
    ) => {
        const out = formatTime(millis);
        expect(out.hours).toEqual(hour);
        expect(out.minutes).toEqual(minute);
        expect(out.seconds).toEqual(second);
        expect(out.print()).toEqual(formatted);
    });
});