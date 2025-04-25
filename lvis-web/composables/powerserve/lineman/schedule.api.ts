import type { Area } from "../area/area.types";
import type { Shift } from "../shift/shift.entity";
import type { Lineman } from "./lineman.types";


export async function schedule_index_init(): Promise<{
    linemen: Lineman[],
    areas: Area[],
    shifts: Shift[],
}> {

    const query = `
        query {
            linemen {
                id
                status
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
                schedule {
                    id 
                    lineman_id 
                    general_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                    mon_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                    tue_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                    wed_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                    thu_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                    fri_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                    sat_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                    sun_shift {
                        id 
                        name
                        start_time 
                        end_time
                        is_day_off
                        color_class
                    }
                }
            }
            areas {
                id
                name
            }
            shifts {
                id
                name
                start_time
                end_time
                is_day_off
                color_class
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            linemen: response.data.data.linemen,
            areas: response.data.data.areas,
            shifts: response.data.data.shifts,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}