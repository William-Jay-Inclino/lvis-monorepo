import type { CreateMrvInput, FindAllResponse, MutationResponse, MRV, UpdateMrvInput } from "./mrv.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/system/employee/employee.types";
import type { Station } from "../station/station";
import type { Item } from "../item/item.type";

export async function fetchDataInSearchFilters(): Promise<{
    mrvs: MRV[],
    employees: Employee[]
}> {
    const query = `
        query {
            mrvs(page: 1, pageSize: 10) {
                data{
                    mrv_number
                }
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let mrvs = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.mrvs && data.mrvs.data) {
            mrvs = data.mrvs.data
        }

        return {
            mrvs,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            mrvs: [],
            employees: [],
        }
    }
}

export async function findByMrvNumber(mrvNumber: string): Promise<MRV | undefined> {
    const query = `
        query {
            mrv(mrv_number: "${mrvNumber}") {
                id
                mrv_number
                created_by
                status
                can_update
                date_requested
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.mrv) {
            return response.data.data.mrv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<MRV | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `mrv_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            mrv(${args}) {
                id
                mrv_number
                status
                date_requested 
                purpose
                request_type
                or_number
                mwo_number
                cwo_number
                jo_number
                consumer_name
                location
                cancelled_at
                created_by
                can_update
                item_from {
                    name
                }
                project {
                    name
                }
                requested_by {
                    id
                    firstname 
                    middlename 
                    lastname
                }
                withdrawn_by {
                    id
                    firstname 
                    middlename 
                    lastname
                }
                mct {
                    id
                    mct_number
                }
                mrv_approvers{
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    status
                    label
                    order
                    notes
                    date_approval
                }
                mrv_items {
                    id 
                    quantity
                    price
                    item {
                        id 
                        code
                        description
                        unit {
                            name 
                        }
                        total_quantity
                        quantity_on_queue
                    }
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.mrv) {
            return response.data.data.mrv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(payload: { page: number, pageSize: number, date_requested: string | null, requested_by_id: string | null }): Promise<FindAllResponse> {

    const { page, pageSize, date_requested, requested_by_id } = payload;

    let date_requested2 = null
    let requested_by_id2 = null

    if (date_requested) {
        date_requested2 = `"${date_requested}"`
    }

    if (requested_by_id) {
        requested_by_id2 = `"${requested_by_id}"`
    }

    const query = `
        query {
            mrvs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    mrv_number
                    requested_by {
                        id
                        firstname
                        middlename 
                        lastname
                    }
                    created_by
                    status
                    can_update
                    date_requested
                    cancelled_at
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
        return response.data.data.mrvs;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
    stations: Station[],
    items: Item[],
    default_station: Station | null,
    projects: Project[],
}> {

    const query = `
        query {
            items(page: 1, pageSize: 200, item_codes: "${ITEM_TYPE.LINE_MATERIALS}") {
                data{
                    id
                    code
                    description
                    item_type {
                        id
                        code 
                        name
                    }
                    unit {
                        id 
                        name
                    }
                    total_quantity
                    quantity_on_queue
                    GWAPrice
                }
            },
            employees(page: 1, pageSize: 300) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            stations {
                id 
                name
                location
            },
            projects {
                id 
                name
            },
            default_station {
                id 
                name
                location
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let stations = []
        let items = []
        let projects = []
        let default_station = undefined

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.stations) {
            stations = response.data.data.stations
        }

        if (data.projects) {
            projects = response.data.data.projects
        }

        if(data.default_station) {
            default_station = data.default_station
        }

        return {
            employees,
            stations,
            items,
            projects,
            default_station,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            stations: [],
            items: [],
            projects: [],
            default_station: null,
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    stations: Station[],
    items: Item[],
    projects: Project[],
    mrv: MRV | undefined
}> {
    const query = `
        query {
            mrv(id: "${id}") {
                id
                mrv_number
                status
                created_by
                can_update
                date_requested
                purpose
                request_type
                or_number
                mwo_number
                cwo_number
                jo_number
                consumer_name
                location
                cancelled_at
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                withdrawn_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                item_from {
                    id 
                    name
                }
                project{
                    id
                    name
                }
                mrv_approvers {
                    id
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    date_approval 
                    notes
                    status
                    label
                    order
                }
                mrv_items {
                    id
                    quantity
                    price
                    item {
                        id
                        code
                        description
                        item_type {
                            id 
                            name
                        }
                        unit {
                            id 
                            name
                        }
                        total_quantity
                        quantity_on_queue
                        GWAPrice
                    }
                }
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            items(page: 1, pageSize: 200, item_codes: "${ITEM_TYPE.LINE_MATERIALS}") {
                data{
                    id
                    code
                    description
                    item_type {
                        id 
                        code 
                        name
                    }
                    unit {
                        id 
                        name
                    }
                    total_quantity
                    quantity_on_queue
                    GWAPrice
                }
            },
            stations {
                id 
                name
            },
            projects {
                id 
                name
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []
        let stations: Station[] = []
        let items: Item[] = []
        let projects: Project[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.mrv) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const mrv = data.mrv

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.stations && data.stations) {
            stations = data.stations
        }

        if (data.projects && data.projects) {
            projects = data.projects
        }

        return {
            mrv,
            employees,
            stations,
            items,
            projects,
        }

    } catch (error) {
        console.error(error);
        return {
            mrv: undefined,
            employees: [],
            stations: [],
            items: [],
            projects: [],
        }
    }
}

export async function create(input: CreateMrvInput): Promise<MutationResponse> {

    console.log('create', input);

    const or_number = input.or_number?.trim() === '' ? null : `"${input.or_number}"`
    const mwo_number = input.mwo_number?.trim() === '' ? null : `"${input.mwo_number}"`
    const cwo_number = input.cwo_number?.trim() === '' ? null : `"${input.cwo_number}"`
    const jo_number = input.jo_number?.trim() === '' ? null : `"${input.jo_number}"`

    const approvers = input.approvers.map(i => {
        return `
        {
          approver_id: "${i.approver?.id}"
          label: "${i.label}"
          order: ${i.order}
        }`;
    }).join(', ');

    const items = input.items.map(i => {
        return `
        {
          item_id: "${i.id}"
          quantity: ${i.qty_request}
          price: ${i.GWAPrice}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createMrv(
                input: {
                    project_id: "${input.project?.id}"
                    request_type: ${input.request_type?.id}
                    purpose: "${input.purpose}"
                    or_number: ${or_number}
                    mwo_number: ${mwo_number}
                    cwo_number: ${cwo_number}
                    jo_number: ${jo_number}
                    consumer_name: "${input.consumer_name}"
                    location: "${input.location}"
                    requested_by_id: "${input.requested_by?.id}"
                    withdrawn_by_id: "${input.withdrawn_by?.id}"
                    item_from_id: "${input.item_from?.id}"
                    approvers: [${approvers}]
                    items: [${items}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createMrv) {
            return {
                success: true,
                msg: 'MRV created successfully!',
                data: response.data.data.createMrv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create MRV. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateMrvInput): Promise<MutationResponse> {

    const or_number = input.or_number?.trim() === '' || !input.or_number ? null : `"${input.or_number}"`
    const mwo_number = input.mwo_number?.trim() === '' || !input.mwo_number ? null : `"${input.mwo_number}"`
    const cwo_number = input.cwo_number?.trim() === '' || !input.cwo_number ? null : `"${input.cwo_number}"`
    const jo_number = input.jo_number?.trim() === '' || !input.jo_number ? null : `"${input.jo_number}"`

    const mutation = `
        mutation {
            updateMrv(
                id: "${id}",
                input: {
                    project_id: "${input.project?.id}"
                    purpose: "${input.purpose}"
                    request_type: ${input.request_type?.id}
                    requested_by_id: "${input.requested_by?.id}"
                    withdrawn_by_id: "${input.withdrawn_by?.id}"
                    item_from_id: "${input.item_from?.id}"
                    or_number: ${or_number}
                    mwo_number: ${mwo_number}
                    cwo_number: ${cwo_number}
                    jo_number: ${jo_number}
                    consumer_name: "${input.consumer_name}"
                    location: "${input.location}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMrv) {
            return {
                success: true,
                msg: 'MRV updated successfully!',
                data: response.data.data.updateMrv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update MRV. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelMrv(
                id: "${id}"
            ) {
                msg
                success
                cancelled_at
                cancelled_by
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.cancelMrv) {
            return response.data.data.cancelMrv
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel MRV. Please contact system administrator'
        };
    }
}

export async function fetchMrvNumbers(payload: string): Promise<MRV[]> {
    const query = `
        query {
            mrvs_by_mrv_number(mrv_number: "${payload}") {
                mrv_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.mrvs_by_mrv_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchMRVsByMrvNumber(payload: string): Promise<MRV[]> {
    const query = `
        query {
            mrvs_by_mrv_number(mrv_number: "${payload}", is_detail_included: true) {
                id
                mrv_number
                status
                is_referenced
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.mrvs_by_mrv_number

    } catch (error) {
        console.error(error);
        return []
    }
}