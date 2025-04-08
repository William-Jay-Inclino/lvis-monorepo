import type { Activity, Device, Feeder, Lineman, MeterBrand, Substation, WeatherCondition } from "../common";
import type { FindAllResponse } from "./task.dto";
import type { Task, TaskStatus } from "./task.types";


export async function init_data(payload: {
    assignee_id: string,
    page: number, 
    pageSize: number, 
    area_id?: string,
}): Promise<{ 
    pending_tasks: Task[],
    task_statuses: TaskStatus[],
    activities: Activity[],
    feeders: Feeder[],
    substations: Substation[],
    weather_conditions: WeatherCondition[],
    devices: Device[],
    meter_brands: MeterBrand[],
    tasks_by_assignee_response: FindAllResponse,
}> {

    const { assignee_id, page, pageSize, area_id } = payload
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

    const query = `
        query {
            pending_tasks_by_group {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                description
                created_at
                task_assignment {
                    id
                    area_id
                    department_id 
                    division_id
                }
            }
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                assignee_id: ${assignee_id2},
            ) {
                data {
                    id
                    ref_number
                    status {
                        id 
                        name
                        color_class
                    }
                    activity {
                        id 
                        name
                    }
                    description
                    created_at
                    task_assignment {
                        id
                        area_id
                        department_id 
                        division_id
                    }
                }
                totalItems
                currentPage
                totalPages
            }
            task_statuses {
                id 
                name
                color_class
                description
                total_count_by_assignee
            }
            activities {
                id 
                name 
                category {
                    id 
                    name
                }
            }
            feeders {
                id 
                name
            }
            weather_conditions {
                id 
                name
            }
            devices {
                id 
                name
            }
            meter_brands {
                id 
                name
            }
            stations {
                id 
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            pending_tasks: response.data.data.pending_tasks_by_group,
            tasks_by_assignee_response: response.data.data.tasks,
            task_statuses: response.data.data.task_statuses,
            activities: response.data.data.activities,
            feeders: response.data.data.feeders,
            weather_conditions: response.data.data.weather_conditions,
            devices: response.data.data.devices,
            meter_brands: response.data.data.meter_brands,
            substations: response.data.data.stations,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function get_tasks_by_assignee(payload: {
    assignee_id: string,
    page: number, 
    pageSize: number, 
}): Promise<{ 
    tasks_by_assignee_response: FindAllResponse,
}> {

    const { assignee_id, page, pageSize } = payload
    const assignee_id2 = assignee_id ? `"${assignee_id}"` : null;

    const query = `
        query {
            tasks(
                page: ${page},
                pageSize: ${pageSize},
                assignee_id: ${assignee_id2},
            ) {
                data {
                    id
                    ref_number
                    status {
                        id 
                        name
                        color_class
                    }
                    activity {
                        id 
                        name
                    }
                    description
                    created_at
                    task_assignment {
                        id
                        area_id
                        department_id 
                        division_id
                    }
                }
                totalItems
                currentPage
                totalPages
            }
            
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            tasks_by_assignee_response: response.data.data.tasks,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function get_task_with_complaint(payload: { id: number }): Promise<Task | undefined> {
    
    const { id } = payload

    const query = `
        query {
            task(id: ${ id }) {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                activity {
                    id 
                    name
                }
                description
                created_at
                complaint {
                    id
                    ref_number 
                    complainant_name
                    complainant_contact_no
                    description 
                    remarks
                    created_at 
                    created_by 
                    report_type {
                        id 
                        name
                    }
                    status {
                        id 
                        name 
                        color_class
                    }
                    assigned_group {
                        id
                        name
                    }
                    complaint_detail {
                        id 
                        consumer {
                            id 
                            name
                            meter_number
                        }
                        barangay {
                            id 
                            name 
                            municipality {
                                id 
                                name
                            }
                        }
                        sitio {
                            id 
                            name 
                        }
                        landmark
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.task) {
            return response.data.data.task;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function get_data_on_view_assignee_task(payload: { id: number, area_id?: string }): Promise<{
    task: Task,
    linemen: Lineman[]
}> {
    
    const { id, area_id } = payload
    const area_id_query = area_id ? `(area_id: "${area_id}")` : '';

    const query = `
        query {
            linemen${area_id_query} {
                id 
                employee {
                    id
                    firstname
                    middlename
                    lastname
                }
            }
            task(id: ${ id }, with_task_details: true) {
                id
                ref_number
                status {
                    id 
                    name
                    color_class
                }
                activity {
                    id 
                    name
                    category {
                        id
                        name
                    }
                }
                description
                remarks
                accomplishment
                action_taken
                created_at
                acted_at
                files {
                    filename
                    source_path
                }
                complaint {
                    id
                    ref_number 
                    complainant_name
                    complainant_contact_no
                    description 
                    remarks
                    created_at 
                    created_by 
                    report_type {
                        id 
                        name
                    }
                    status {
                        id 
                        name 
                        color_class
                    }
                    assigned_group {
                        id
                        name
                    }
                    complaint_detail {
                        id 
                        consumer {
                            id 
                            name
                            meter_number
                        }
                        barangay {
                            id 
                            name 
                            municipality {
                                id 
                                name
                            }
                        }
                        sitio {
                            id 
                            name 
                        }
                        landmark
                    }
                    logs {
                        id 
                        created_by
                        created_at
                        status {
                            id 
                            name
                            color_class
                        }
                        remarks
                    }
                }
                activity {
                    id 
                    name
                }
                assignee {
                    id
                    firstname
                    middlename
                    lastname
                }
                logs {
                    id 
                    created_by
                    created_at
                    status {
                        id 
                        name
                        color_class
                    }
                    remarks
                }
                task_assignment {
                    id
                    area_id
                    department_id
                    division_id 
                    area {
                        id 
                        name
                    }
                }
                task_detail_kwh_meter {
                    id
                    meter_number
                    meter_brand {
                        id
                        name
                    }
                    last_reading
                    initial_reading
                    meter_class
                    linemen_incharge {
                        lineman {
                            id 
                            employee {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                }
                task_detail_power_interruption {
                    id 
                    feeder {
                        id 
                        name
                    }
                    weather_condition {
                        id 
                        name
                    }
                    device {
                        id 
                        name
                    }
                    affected_area 
                    cause 
                    equipment_failed 
                    fuse_rating
                    linemen_incharge {
                        lineman {
                            id 
                            employee {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                }
                task_detail_line_services {
                    id
                    order_number
                    cause
                    mrv_number
                    seriv_number
                    mst_number
                    mcrt_number
                    linemen_incharge {
                        lineman {
                            id 
                            employee {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                }
                task_detail_dles {
                    id
                    sco_number
                    old_serial_number
                    new_serial_number
                    seriv_number
                    kva_rating
                    cause
                    linemen_incharge {
                        lineman {
                            id 
                            employee {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                }
                task_detail_lmdga {
                    id
                    kva_rating
                    substation {
                        id
                        name
                    }
                    dt_location
                    feeder {
                        id 
                        name
                    }
                    phase_number
                    number_of_hc
                    number_of_spans
                    copper_aluminum_primary
                    copper_aluminum_secondary
                    copper_aluminum_ground
                    size_primary
                    size_secondary
                    size_ground
                    terminal_connector_primary
                    terminal_connector_secondary
                    terminal_connector_ground
                    tap_position
                    brand
                    number_of_bushing_primary
                    number_of_bushing_secondary
                    protective_device
                    load_current_sec_bushing
                    load_current_neutral
                    load_current_one
                    load_current_two
                    voltage_level_one
                    voltage_level_two
                    sec_line_conductor_size_one
                    sec_line_conductor_size_two
                    linemen_incharge {
                        lineman {
                            id 
                            employee {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                }
                
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return {
            task: response.data.data.task,
            linemen: response.data.data.linemen,
        }
    } catch (error) {
        console.error(error);
        throw error
    }
}


