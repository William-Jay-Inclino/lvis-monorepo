import type { Remarks } from "../common";
import type { Lineman } from "./lineman.types";


export async function evaluation_index_init(payload: { 
    start_date: Date,
    end_date: Date,
}): Promise<{
    linemen: Lineman[],
    remarks: Remarks[],
}> {
    const { start_date, end_date } = payload;

    // Format dates to ISO string
    const startDateISO = start_date.toISOString();
    const endDateISO = end_date.toISOString();

    const query = `
        query {
            linemen_with_activities(
                start_date: "${startDateISO}",
                end_date: "${endDateISO}"
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
                power_interruptions {
                    task_detail {
                        distance_travel_in_km
                        barangay {
                            id 
                            name
                        }
                        task {
                            complaint {
                                ref_number
                            }
                            accomplishment_qty
                            status {
                                id 
                                name
                            }
                            activity {
                                unit {
                                    id 
                                    name
                                }
                                name 
                                code 
                                quantity
                                num_of_personnel
                            }
                        }
                    }
                }
            }
            remarks {
                id 
                min 
                max
                label
                color_class
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response);
        return {
            linemen: response.data.data.linemen_with_activities,
            remarks: response.data.data.remarks,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}