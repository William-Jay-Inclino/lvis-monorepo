import { format, toZonedTime } from "date-fns-tz";


export function getDateRange(dateString: string): { startDate: string, endDate: string } {
    const requestedDate = new Date(dateString);
    const startDate = new Date(
        requestedDate.getFullYear(),
        requestedDate.getMonth(),
        requestedDate.getDate(),
        0,
        0,
        0
    );
    const endDate = new Date(
        requestedDate.getFullYear(),
        requestedDate.getMonth(),
        requestedDate.getDate(),
        23,
        59,
        59
    );
    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    };
}



const convertDate = (date: any) => {
    try {

        const timeZone = process.env.TZ || 'Asia/Manila'; 

            if (!timeZone) {
                console.warn('Warning: TZ is not set in .env, defaulting to Asia/Manila');
            }

            const zonedDate = toZonedTime(new Date(date), timeZone);
            return format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
        } catch (error) {
            console.error(`Error converting date: ${date}`, error);
            return date;  
        }
};

// Recursive function to traverse and convert datetime fields
export const convertDatesToPhTime = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(item => convertDatesToPhTime(item)); // Convert all items in array
    } else if (data !== null && typeof data === 'object') {
        const convertedObject: any = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const fieldValue = data[key];
                // Check if the field is a Date object
                if (fieldValue instanceof Date) {
                    // If it's a datetime field, convert it
                    convertedObject[key] = convertDate(fieldValue);
                } else if (fieldValue && typeof fieldValue === 'object') {
                    // If it's an object or array, recursively process it
                    convertedObject[key] = convertDatesToPhTime(fieldValue);
                } else {
                    // If it's not a datetime field, just copy the value
                    convertedObject[key] = fieldValue;
                }
            }
        }
        return convertedObject;
    } else {
        return data; // If it's not an object or array, return as is
    }
};