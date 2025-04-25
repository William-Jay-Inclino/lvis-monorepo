import { toZonedTime, format } from 'date-fns-tz'; // Assuming you're using these methods
import { isValid, parse } from 'date-fns';
import { Prisma } from 'apps/system/prisma/generated/client';

const timeZone = process.env.TZ || 'Asia/Manila'; 

const convertDate = (date: any) => {
  try {
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
// export const convertDatesToPhTime = (data: any): any => {
//     if (Array.isArray(data)) {
//         return data.map(item => convertDatesToPhTime(item)); // Convert all items in array
//     } else if (data !== null && typeof data === 'object') {
//         const convertedObject: any = {};
//         for (const key in data) {
//             if (data.hasOwnProperty(key)) {
//                 const fieldValue = data[key];
//                 // Check if the field is a Date object
//                 if (fieldValue instanceof Date) {
//                     // If it's a datetime field, convert it
//                     convertedObject[key] = convertDate(fieldValue);
//                 } else if (fieldValue && typeof fieldValue === 'object') {
//                     // If it's an object or array, recursively process it
//                     convertedObject[key] = convertDatesToPhTime(fieldValue);
//                 } else {
//                     // If it's not a datetime field, just copy the value
//                     convertedObject[key] = fieldValue;
//                 }
//             }
//         }
//         return convertedObject;
//     } else {
//         return data; // If it's not an object or array, return as is
//     }
// };

export const filterPrismaResult = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(item => filterPrismaResult(item)); 
    } else if (data !== null && typeof data === 'object') {
        if (Prisma.Decimal.isDecimal(data)) {
            return data.toString(); 
        }
        
        const convertedObject: any = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const fieldValue = data[key];
                if (fieldValue instanceof Date) {
                    convertedObject[key] = convertDate(fieldValue);
                } 
                else if (Prisma.Decimal.isDecimal(fieldValue)) {
                    convertedObject[key] = fieldValue.toString();
                }
                else if (fieldValue && typeof fieldValue === 'object') {
                    convertedObject[key] = filterPrismaResult(fieldValue);
                } else {
                    convertedObject[key] = fieldValue;
                }
            }
        }
        return convertedObject;
    } else {
        return data; // If it's not an object or array, return as is
    }
};

export const formatDateToMMDDYY = (date: string): string => {
    if (!date || typeof date !== 'string' || date.trim() === '') {
        return ''
    }

    const isoDateString = date.replace(' ', 'T');

    const parsedDate = parse(isoDateString, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());

    if (!isValid(parsedDate)) {
        return ''
    }

    return format(parsedDate, 'MM/dd/yy');
    
};

export const formatDateToTime = (date: string): string => {
    if (!date || typeof date !== 'string' || date.trim() === '') {
        return ''
    }

    const isoDateString = date.replace(' ', 'T');

    const parsedDate = parse(isoDateString, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());

    if (!isValid(parsedDate)) {
        return ''
    }

    return format(parsedDate, 'h:mm a');
    
};

export function normalizeIp(ip: string): string {
    try {
      if (ip.startsWith('::ffff:')) {
        // Remove IPv4-mapped IPv6 prefix (::ffff:) if present
        return ip.substring(7);
      }
      return ip;
    } catch (error) {
      console.error('Error normalizing IP:', error);
      return ip;  // If normalization fails, return the original IP
    }
}

export const isPastDate = (value: string) => {
    const now = new Date();
    const _inputDate = new Date(value);

    // Normalize both dates to ignore the time portion
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(_inputDate.getFullYear(), _inputDate.getMonth(), _inputDate.getDate());

    if(inputDate < nowDate) {
        return true 
    }

    return false

}