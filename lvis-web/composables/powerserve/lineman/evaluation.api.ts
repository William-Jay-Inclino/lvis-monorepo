import { formatISO, parseISO } from "date-fns";
import type { Area } from "../area/area.types";
import type { Lineman } from "./lineman.types";


export async function evaluation_index_init(payload: { 
    start_date: Date,
    end_date: Date,
    employee_id?: string
}): Promise<{
    linemen: Lineman[],
    areas: Area[],
}> {
    const { start_date, end_date, employee_id } = payload;

    // Format dates to ISO string
    const startDateISO = start_date.toISOString();
    const endDateISO = end_date.toISOString();
    const employeeIdArg = employee_id ? `employee_id: "${employee_id}"` : '';

    const query = `
        query {
            linemen_with_activities(
                start_date: "${startDateISO}",
                end_date: "${endDateISO}"
                ${employeeIdArg}
            ) {
                id
                employee {
                    id 
                    firstname
                    middlename
                    lastname
                    name_prefix
                    name_suffix
                    position
                } 
                supervisor {
                    id 
                    firstname
                    middlename
                    lastname
                    name_prefix
                    name_suffix
                } 
                area {
                    id 
                    name
                }
                total_numerical_rating
                total_distance_travelled
                remarks {
                    label
                    color_class
                }
                activities {
                    activity {
                        unit {
                            id 
                            name
                        }
                        code 
                        name
                        quantity
                        num_of_personnel
                    }
                    acted_at
                    accomplishment_qty
                    barangay {
                        id 
                        name
                    }
                    task {
                        id
                        ref_number
                    }
                    numerical_rating 
                    remarks {
                        label 
                        color_class 
                    }
                    distance_travelled_in_km
                }
            }
            areas {
                id
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response);
        return {
            areas: response.data.data.areas,
            linemen: response.data.data.linemen_with_activities,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function get_linemen_with_activities(payload: { 
    start_date: string,  // Changed to string
    end_date: string,    // Changed to string
    employee_id?: string
}): Promise<{
    linemen: Lineman[],
}> {
    try {
        // Validate and parse dates
        const startDate = parseISO(payload.start_date);
        const endDate = parseISO(payload.end_date);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format. Please use YYYY-MM-DD format');
        }

        // Format dates to ISO string without timezone offset
        const startDateISO = formatISO(startDate, { representation: 'date' });
        const endDateISO = formatISO(endDate, { representation: 'date' });

        const employeeIdArg = payload.employee_id ? `employee_id: "${payload.employee_id}"` : '';

        const query = `
            query {
                linemen_with_activities(
                    start_date: "${startDateISO}",
                    end_date: "${endDateISO}"
                    ${employeeIdArg}
                ) {
                    id
                    employee {
                        id 
                        firstname
                        middlename
                        lastname
                        name_prefix
                        name_suffix
                        position
                    } 
                    supervisor {
                        id 
                        firstname
                        middlename
                        lastname
                        name_prefix
                        name_suffix
                    } 
                    area {
                        id 
                        name
                    }
                    total_numerical_rating
                    total_distance_travelled
                    remarks {
                        label
                        color_class
                    }
                    activities {
                        activity {
                            unit {
                                id 
                                name
                            }
                            code 
                            name
                            quantity
                            num_of_personnel
                        }
                        acted_at
                        accomplishment_qty
                        barangay {
                            id 
                            name
                        }
                        task {
                            id
                            ref_number
                        }
                        numerical_rating 
                        remarks {
                            label 
                            color_class 
                        }
                        distance_travelled_in_km
                    }
                }
            }
        `;

        const response = await sendRequest(query);
        
        return {
            linemen: response.data.data.linemen_with_activities,
        };
    } catch (error) {
        console.error('Error fetching linemen activities:', error);
        throw new Error(
            error instanceof Error 
                ? error.message 
                : 'Failed to fetch linemen activities'
        );
    }
}
// export async function get_linemen_with_activities(payload: { 
//     start_date: Date,
//     end_date: Date,
//     employee_id?: string
// }): Promise<{
//     linemen: Lineman[],
// }> {
//     const { start_date, end_date, employee_id } = payload;

//     // Format dates to ISO string
//     const startDateISO = start_date.toISOString();
//     const endDateISO = end_date.toISOString();

//     const employeeIdArg = employee_id ? `employee_id: "${employee_id}"` : '';

//     const query = `
//         query {
//             linemen_with_activities(
//                 start_date: "${startDateISO}",
//                 end_date: "${endDateISO}"
//                 ${employeeIdArg}
//             ) {
//                 id
//                 employee {
//                     id 
//                     firstname
//                     middlename
//                     lastname
//                     name_prefix
//                     name_suffix
//                     position
//                 } 
//                 supervisor {
//                     id 
//                     firstname
//                     middlename
//                     lastname
//                     name_prefix
//                     name_suffix
//                 } 
//                 area {
//                     id 
//                     name
//                 }
//                 total_numerical_rating
//                 total_distance_travelled
//                 remarks {
//                     label
//                     color_class
//                 }
//                 activities {
//                     activity {
//                         unit {
//                             id 
//                             name
//                         }
//                         code 
//                         name
//                         quantity
//                         num_of_personnel
//                     }
//                     acted_at
//                     accomplishment_qty
//                     barangay {
//                         id 
//                         name
//                     }
//                     task {
//                         id
//                         ref_number
//                     }
//                     numerical_rating 
//                     remarks {
//                         label 
//                         color_class 
//                     }
//                     distance_travelled_in_km
//                 }
//             }
//         }
//     `;

//     try {
//         const response = await sendRequest(query);
//         console.log('response', response);
//         return {
//             linemen: response.data.data.linemen_with_activities,
//         };
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }