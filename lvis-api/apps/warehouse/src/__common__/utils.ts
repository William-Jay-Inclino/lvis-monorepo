import { toZonedTime, format } from 'date-fns-tz'; // Assuming you're using these methods

// Helper function to check and convert datetime fields
const convertDate = (date: any) => {
    try {
      const zonedDate = toZonedTime(new Date(date), 'Asia/Manila');
      return format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'Asia/Manila' });
    } catch (error) {
      console.error(`Error converting date: ${date}`, error);
      return date;  // Return the original date if an error occurs
    }
};

// Function to check if a string is a valid date string
const isValidDateString = (str: string) => {
  // Regular expression to check for a valid date string format
  // (e.g., "YYYY-MM-DD" or ISO 8601-like formats)
  return !isNaN(Date.parse(str)) && !/^\d+$/.test(str);
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
                // Check if the field is a Date object or a valid date string
                if (fieldValue instanceof Date || (typeof fieldValue === 'string' && isValidDateString(fieldValue))) {
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
