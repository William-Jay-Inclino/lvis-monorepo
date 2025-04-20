import type { Lineman } from "./lineman.types";


export async function evaluation_index_init(payload: { 
    start_date: Date,
    end_date: Date,
}): Promise<{
    linemen: Lineman[],
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

    try {
        const response = await sendRequest(query);
        console.log('response', response);
        return {
            linemen: response.data.data.linemen_with_activities,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}