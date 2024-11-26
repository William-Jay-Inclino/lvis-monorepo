import type { CreateOsrivInput, FindAllResponse, MutationResponse, OSRIV, UpdateOsrivInput } from "./osriv.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/system/employee/employee.types";
import type { Station } from "../station/station";
import type { Item } from "../item/item.type";

export async function fetchDataInSearchFilters(): Promise<{
    osrivs: OSRIV[],
    employees: Employee[]
}> {
    const query = `
        query {
            osrivs(page: 1, pageSize: 10) {
                data{
                    osriv_number
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

        let osrivs = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.osrivs && data.osrivs.data) {
            osrivs = data.osrivs.data
        }

        return {
            osrivs,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            osrivs: [],
            employees: [],
        }
    }
}

export async function findByOsrivNumber(osrivNumber: string): Promise<OSRIV | undefined> {
    const query = `
        query {
            osriv(osriv_number: "${osrivNumber}") {
                id
                osriv_number
                requested_by {
                    id
                    firstname
                    middlename 
                    lastname
                    department {
                        id
                        name
                    }
                }
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

        if (response.data && response.data.data && response.data.data.osriv) {
            return response.data.data.osriv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<OSRIV | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `osriv_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            osriv(${args}) {
                id
                osriv_number
                status
                date_requested 
                purpose
                cancelled_at
                created_by
                can_update
                item_from {
                    name
                }
                requested_by {
                    firstname 
                    middlename 
                    lastname
                    department {
                        id
                        name
                    }
                }
                osriv_approvers{
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
                osriv_items {
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

        if (response.data && response.data.data && response.data.data.osriv) {
            return response.data.data.osriv;
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
            osrivs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    osriv_number
                    requested_by {
                        id
                        firstname
                        middlename 
                        lastname
                        department {
                            id
                            name
                        }
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
        return response.data.data.osrivs;
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
    warehouse_custodian: Employee | null,
}> {

    const query = `
        query {
            items(page: 1, pageSize: 200, item_codes: "${ITEM_TYPE.OFFICE_SUPPLY}") {
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
                    rank_number
                }
            },
            stations {
                id 
                name
            },
            default_station {
                id 
                name
            },
            warehouse_custodian {
                id 
                firstname
                middlename
                lastname
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let stations = []
        let items = []
        let warehouse_custodian = undefined
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

        if(data.warehouse_custodian) {
            warehouse_custodian = data.warehouse_custodian
        }

        if(data.default_station) {
            default_station = data.default_station
        }

        return {
            employees,
            stations,
            items,
            warehouse_custodian,
            default_station,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            stations: [],
            items: [],
            warehouse_custodian: null,
            default_station: null,
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    stations: Station[],
    items: Item[],
    osriv: OSRIV | undefined
}> {
    const query = `
        query {
            osriv(id: "${id}") {
                id
                osriv_number
                status
                created_by
                can_update
                date_requested
                purpose
                cancelled_at
                requested_by{
                    id
                    firstname
                    middlename
                    lastname
                }
                item_from {
                    id 
                    name
                }
                osriv_approvers {
                    id
                    approver {
                        id
                        firstname
                        middlename
                        lastname
                        rank_number
                    }
                    date_approval 
                    notes
                    status
                    label
                    order
                }
                osriv_items {
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
            employees(page: 1, pageSize: 500) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                    rank_number
                }
            },
            items(page: 1, pageSize: 500, item_codes: "${ITEM_TYPE.OFFICE_SUPPLY}") {
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
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []
        let stations: Station[] = []
        let items: Item[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.osriv) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const osriv = data.osriv

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.stations && data.stations) {
            stations = data.stations
        }

        return {
            osriv,
            employees,
            items,
            stations,
        }

    } catch (error) {
        console.error(error);
        return {
            osriv: undefined,
            employees: [],
            items: [],
            stations: [],
        }
    }
}

export async function create(input: CreateOsrivInput): Promise<MutationResponse> {

    console.log('create', input);

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
            createOsriv(
                input: {
                    purpose: "${input.purpose}"
                    requested_by_id: "${input.requested_by?.id}"
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

        if (response.data && response.data.data && response.data.data.createOsriv) {
            return {
                success: true,
                msg: 'OSRIV created successfully!',
                data: response.data.data.createOsriv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create OSRIV. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateOsrivInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateOsriv(
                id: "${id}",
                input: {
                    purpose: "${input.purpose}"
                    requested_by_id: "${input.requested_by?.id}"
                    item_from_id: "${input.item_from?.id}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateOsriv) {
            return {
                success: true,
                msg: 'OSRIV updated successfully!',
                data: response.data.data.updateOsriv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update OSRIV. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelOsriv(
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

        if (response.data && response.data.data && response.data.data.cancelOsriv) {
            return response.data.data.cancelOsriv
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel OSRIV. Please contact system administrator'
        };
    }
}

export async function fetchOsrivNumbers(payload: string): Promise<OSRIV[]> {
    const query = `
        query {
            osrivs_by_osriv_number(osriv_number: "${payload}") {
                osriv_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.osrivs_by_osriv_number

    } catch (error) {
        console.error(error);
        return []
    }
}

export async function fetchOSRIVsByOsrivNumber(payload: string): Promise<OSRIV[]> {
    const query = `
        query {
            osrivs_by_osriv_number(osriv_number: "${payload}", is_detail_included: true) {
                id
                osriv_number
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
        return response.data.data.osrivs_by_osriv_number

    } catch (error) {
        console.error(error);
        return []
    }
}

