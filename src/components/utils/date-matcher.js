import Moment from "moment";

export default class DateMatcher {
    constructor(maxDiff) {
        this.maxDiffSeconds = maxDiff
    }
    // Ordered list of unix dates from csv and list of unix dates from images
    match(timestamps_unix, images_unix) {
        const matches = []
        if (!timestamps_unix || !images_unix) {
            return matches;
        }

        // Order of image dates are sorted
        let startImageIndex = 0;
        let prevTimestamp = {};
        for(let i = 0; i < timestamps_unix.length; i ++) {
            // See if there are matches for timestamp row
            const rowDate = timestamps_unix[i]
            let hasMatch = false;
            if (!rowDate) {
                // Nan or null continue
                continue;
            }

            for (let j = startImageIndex; j < images_unix.length; j ++) {
                const imageDate = images_unix[j]
                if (!imageDate) {
                    continue;
                }

                if (rowDate === imageDate) {
                    matches.push({from: i, to: j});
                    hasMatch = true;
                    startImageIndex = j + 1;
                    break;
                }
                // If they do not match exactly we make a connection with comment
                const diffInSeconds = Moment.unix(rowDate).diff(Moment.unix(imageDate), "seconds");
                if (diffInSeconds < this.maxDiffSeconds && diffInSeconds > 0) {

                    // Check if next image is closer
                    let nextImageDiff = Number.MAX_SAFE_INTEGER;
                    if (j + 1 < images_unix.length) {
                        const nextImage = images_unix[j + 1];
                        nextImageDiff = Moment.unix(rowDate).diff(Moment.unix(nextImage), "seconds");
                    }
                    if (Math.abs(nextImageDiff) < Math.abs(diffInSeconds)) {
                        // Next image is a better match
                        continue;
                    }
                    // Check if previous timestamp was closer
                    let prevDiff = Number.MAX_SAFE_INTEGER;
                    if (prevTimestamp.index && !prevTimestamp.hadMatch) {
                        const prevRow = timestamps_unix[prevTimestamp.index];
                        prevDiff = Moment.unix(prevRow).diff(Moment.unix(imageDate), "seconds");
                    }
                    if (Math.abs(prevDiff) < Math.abs(diffInSeconds)) {
                        matches.push({from: prevTimestamp.index, to: j, comment: "within 5 minutes"});
                    }
                    else {
                        matches.push({from: i, to: j, comment: "within 5 minutes"});
                    }
                    startImageIndex = j + 1;
                    hasMatch = true;
                    break;
                }

                // If we are at the last timestamp, we can peek forward and see if next image is within
                if (i === timestamps_unix.length -1) {
                    if (Math.abs(diffInSeconds) < this.maxDiffSeconds) {
                        matches.push({from: i, to: j, comment: "within 5 minutes"});
                    }
                }
            }

            prevTimestamp = {index: i, hadMatch: hasMatch};
        }
        return matches
    }
}
