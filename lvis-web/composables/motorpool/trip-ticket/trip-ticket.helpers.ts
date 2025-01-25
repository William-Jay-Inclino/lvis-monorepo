import moment from "moment";


export function get_time_and_day(payload: {actual: any, estimated: any}) {
    
    const { actual, estimated } = payload

    if (!actual || !estimated) {
        return "";
    }

    // Parse the actual and estimated arrival dates
    const actualDate = moment(actual);
    const estimatedDate = moment(estimated);

    // Check if the actual is the same day as the estimated
    if (actualDate.isSame(estimatedDate, 'day')) {
        // Return only the time if they are on the same day
        return actualDate.format('h:mm A');
    } else {
        // Return day and time if they are not on the same day
        return actualDate.format('h:mm A, ddd'); 
    }
}