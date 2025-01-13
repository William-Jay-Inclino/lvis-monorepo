import { AuthUser } from 'apps/system/src/__common__/auth-user.entity';
import { toZonedTime, format } from 'date-fns-tz'; // Assuming you're using these methods
import axios from 'axios';
import { getFullnameWithTitles } from './helpers';
import { Employee } from './types';
import { MEQS } from '../meqs/entities/meq.entity';
import { Vehicle } from 'apps/warehouse/prisma/generated/client';
import { isValid, parse } from 'date-fns';

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

export const getEmployee = async(employeeId: string, authUser: AuthUser): Promise<Employee> => {
    const query = `
        query {
            employee(id: "${employeeId}") {
                id
                firstname
                middlename
                lastname
                name_prefix
                name_suffix
            }
        }
    `;

    const headers = {
        Authorization: authUser.authorization,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(
            process.env.API_GATEWAY_URL,
            { query },
            { headers }
        );

        if (!response.data || !response.data.data) {
            return undefined;
        }

        if(response.data && response.data.data && response.data.data.employee) {
            return response.data.data.employee;
        }

        throw new Error('Failed to fetch employee data.')

        
    } catch (error) {
        throw new Error('Failed to fetch employee data.');
    }
}

export const get_pending_description = (payload: {
    employee: Employee,
    purpose: string, 
    label?: string,
    desc_label?: string,
}): string => {

    const { 
        employee, 
        purpose, 
        label = 'Requested by',
        desc_label = 'Purpose',
    } = payload

    const fullname = getFullnameWithTitles(employee.firstname, employee.lastname, employee.middlename, employee.name_prefix, employee.name_suffix)

    const description = [
        `${label}: ${fullname}`,
        `${desc_label}: ${purpose}`
    ].join('\n');

    return description
}

export const get_pending_description_for_motorpool = (payload: {
    vehicle: Vehicle,
    employee: Employee,
    purpose: string, 
    label?: string,
    desc_label?: string,
}): string => {

    const { 
        employee, 
        purpose, 
        label = 'Driver', 
        vehicle,
        desc_label = 'Purpose',
    } = payload

    const fullname = getFullnameWithTitles(employee.firstname, employee.lastname, employee.middlename, employee.name_prefix, employee.name_suffix)

    const description = [
        `${label}: ${fullname}`,
        `Vehicle No: ${ vehicle.vehicle_number }`,
        `Vehicle Name: ${ vehicle.name }`,
        `${desc_label}: ${purpose}`
    ].join('\n');

    return description
}

export const get_canvass_info = (payload: { 
    meqs: MEQS 
}): { 
    requested_by_id: string, 
    purpose: string 
} => {

    const { meqs } = payload    

    if(meqs.rv) {
        return {
            requested_by_id: meqs.rv.canvass.requested_by_id,
            purpose: meqs.rv.canvass.purpose,
        }
    }

    if(meqs.spr) {
        return {
            requested_by_id: meqs.spr.canvass.requested_by_id,
            purpose: meqs.spr.canvass.purpose,
        }
    }

    if(meqs.jo) {
        return {
            requested_by_id: meqs.jo.canvass.requested_by_id,
            purpose: meqs.jo.canvass.purpose,
        }
    }

    throw new Error('Payload has no RV, SPR, OR JO')

}

export const formatDateToMMDDYY = (date: string): string => {
    if (!date || typeof date !== 'string' || date.trim() === '') {
        return 'N/A'
    }

    const isoDateString = date.replace(' ', 'T');

    const parsedDate = parse(isoDateString, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());

    if (!isValid(parsedDate)) {
        return 'N/A'
    }

    return format(parsedDate, 'MM/dd/yy');
    
};

export const formatDateToTime = (date: string): string => {
    if (!date || typeof date !== 'string' || date.trim() === '') {
        return 'N/A'
    }

    const isoDateString = date.replace(' ', 'T');

    const parsedDate = parse(isoDateString, "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());

    if (!isValid(parsedDate)) {
        return 'N/A'
    }

    return format(parsedDate, 'h:mm a');
    
};
