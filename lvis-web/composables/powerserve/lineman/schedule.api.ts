import type { Area } from "../area/area.types";
import type { Shift } from "../shift/shift.entity";
import type { Lineman, LinemanSchedule, LinemanScheduleMutationResponse } from "./lineman.types";


export async function schedule_index_init(): Promise<{
    linemen: Lineman[],
    areas: Area[],
    shifts: Shift[],
}> {

    const query = `
        query {
            linemen(with_schedule: true) {
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


export async function update_lineman_schedule(payload: { input: LinemanSchedule }): Promise<LinemanScheduleMutationResponse> {

    const { input } = payload
    
    const mutation = `
        mutation {
            update_lineman_schedule(
                input: {
                    lineman_id: "${ input.lineman_id }",
                    general_shift_id: ${ input.general_shift?.id },
                    mon_shift_id: ${ input.mon_shift?.id },
                    tue_shift_id: ${ input.tue_shift?.id },
                    wed_shift_id: ${ input.wed_shift?.id },
                    thu_shift_id: ${ input.thu_shift?.id },
                    fri_shift_id: ${ input.fri_shift?.id },
                    sat_shift_id: ${ input.sat_shift?.id },
                    sun_shift_id: ${ input.sun_shift?.id },
                },
            ) {
                success
                msg
                data {
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
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log("response", response);

        if (response?.data?.data?.update_lineman_schedule) {
            return response.data.data.update_lineman_schedule;
        }

        throw new Error(JSON.stringify(response?.data?.errors || "Unknown error"));
    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: "Failed to update lineman schedule. Please contact the system administrator.",
        };
    }
}