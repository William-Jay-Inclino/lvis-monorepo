import type { CreateSerivInput, FindAllResponse, MutationResponse, SERIV, UpdateSerivInput } from "./seriv.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/system/employee/employee.types";
import type { Station } from "../station/station";
import type { Item } from "../item/item.type";
import { ITEM_TYPE } from "~/utils/constants";

export async function fetchDataInSearchFilters(): Promise<{
    serivs: SERIV[],
    employees: Employee[]
}> {
    const query = `
        query {
            serivs(page: 1, pageSize: 10) {
                data{
                    seriv_number
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

        let serivs = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.serivs && data.serivs.data) {
            serivs = data.serivs.data
        }

        return {
            serivs,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            serivs: [],
            employees: [],
        }
    }
}

export async function findBySerivNumber(serivNumber: string): Promise<SERIV | undefined> {
    const query = `
        query {
            seriv(seriv_number: "${serivNumber}") {
                id
                seriv_number
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

        if (response.data && response.data.data && response.data.data.seriv) {
            return response.data.data.seriv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<SERIV | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `seriv_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            seriv(${args}) {
                id
                seriv_number
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
                exp_date
                mcrts {
                    id
                    mcrt_number
                }
                item_from {
                    name
                }
                requested_by {
                    firstname 
                    middlename 
                    lastname
                }
                withdrawn_by {
                    firstname 
                    middlename 
                    lastname
                }
                seriv_approvers{
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
                seriv_items {
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

        if (response.data && response.data.data && response.data.data.seriv) {
            return response.data.data.seriv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(
    payload: { 
        page: number, 
        pageSize: number, 
        date_requested: string | null, 
        requested_by_id: string | null, 
        approval_status: APPROVAL_STATUS | null, 
    }): Promise<FindAllResponse> {

    const { page, pageSize, date_requested, requested_by_id, approval_status } = payload;

    let date_requested2 = null
    let requested_by_id2 = null
    let approval_status2 = null

    if (date_requested) {
        date_requested2 = `"${date_requested}"`
    }

    if (requested_by_id) {
        requested_by_id2 = `"${requested_by_id}"`
    }

    if (approval_status) {
        approval_status2 = approval_status
    }

    const query = `
        query {
            serivs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
                approval_status: ${approval_status2},
            ) {
                data {
                    id
                    seriv_number
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
        return response.data.data.serivs;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
    auditors: Employee[],
    stations: Station[],
    items: Item[],
    default_station: Station | null,
    warehouse_custodian: Employee | null,
    seriv_expiration: number | null,
}> {

    const query = `
        query {
            items(page: 1, pageSize: 500, item_codes: "${ITEM_TYPE.SPECIAL_EQUIPMENT}") {
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
            employees(page: 1, pageSize: 500) {
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
            },
            auditors {
                id 
                firstname
                middlename
                lastname
            },
            seriv_expiration
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let auditors = []
        let stations = []
        let items = []
        let warehouse_custodian = undefined
        let default_station = undefined
        let seriv_expiration = undefined

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

        if(data.auditors) {
            auditors = data.auditors
        }

        if(data.seriv_expiration) {
            seriv_expiration = data.seriv_expiration
        }

        return {
            employees,
            stations,
            items,
            warehouse_custodian,
            default_station,
            auditors,
            seriv_expiration,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            auditors: [],
            stations: [],
            items: [],
            warehouse_custodian: null,
            default_station: null,
            seriv_expiration: null,
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    auditors: Employee[],
    stations: Station[],
    items: Item[],
    seriv: SERIV | undefined
}> {
    const query = `
        query {
            seriv(id: "${id}") {
                id
                seriv_number
                status
                created_by
                can_update
                date_requested
                purpose
                request_type
                mwo_number
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
                seriv_approvers {
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
                seriv_items {
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
                }
            },
            items(page: 1, pageSize: 1000, item_codes: "${ITEM_TYPE.SPECIAL_EQUIPMENT}") {
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
            auditors {
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

        let employees: Employee[] = []
        let auditors: Employee[] = []
        let stations: Station[] = []
        let items: Item[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.seriv) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const seriv = data.seriv

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.stations && data.stations) {
            stations = data.stations
        }

        if (data.auditors && data.auditors) {
            auditors = data.auditors
        }

        return {
            seriv,
            employees,
            stations,
            items,
            auditors,
        }

    } catch (error) {
        console.error(error);
        return {
            seriv: undefined,
            employees: [],
            auditors: [],
            stations: [],
            items: [],
        }
    }
}

export async function create(input: CreateSerivInput): Promise<MutationResponse> {

    console.log('create', input);

    const or_number = input.or_number?.trim() === '' ? null : `"${input.or_number}"`
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
            createSeriv(
                input: {
                    request_type: ${input.request_type?.id}
                    purpose: "${input.purpose}"
                    or_number: ${or_number}
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

        if (response.data && response.data.data && response.data.data.createSeriv) {
            return {
                success: true,
                msg: 'SERIV created successfully!',
                data: response.data.data.createSeriv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create SERIV. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateSerivInput): Promise<MutationResponse> {

    const or_number = input.or_number?.trim() === '' || !input.or_number ? null : `"${input.or_number}"`
    const cwo_number = input.cwo_number?.trim() === '' || !input.cwo_number ? null : `"${input.cwo_number}"`
    const jo_number = input.jo_number?.trim() === '' || !input.jo_number ? null : `"${input.jo_number}"`

    const mutation = `
        mutation {
            updateSeriv(
                id: "${id}",
                input: {
                    purpose: "${input.purpose}"
                    request_type: ${input.request_type?.id}
                    requested_by_id: "${input.requested_by?.id}"
                    withdrawn_by_id: "${input.withdrawn_by?.id}"
                    item_from_id: "${input.item_from?.id}"
                    or_number: ${or_number}
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

        if (response.data && response.data.data && response.data.data.updateSeriv) {
            return {
                success: true,
                msg: 'SERIV updated successfully!',
                data: response.data.data.updateSeriv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update SERIV. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelSeriv(
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

        if (response.data && response.data.data && response.data.data.cancelSeriv) {
            return response.data.data.cancelSeriv
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel SERIV. Please contact system administrator'
        };
    }
}

export async function fetchSerivNumbers(payload: string): Promise<SERIV[]> {
    const query = `
        query {
            serivs_by_seriv_number(seriv_number: "${payload}") {
                seriv_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.serivs_by_seriv_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchSERIVsBySerivNumber(payload: string): Promise<SERIV[]> {
    const query = `
        query {
            serivs_by_seriv_number(seriv_number: "${payload}", is_detail_included: true) {
                id
                seriv_number
                status
                seriv_items {
                    id
                    quantity
                    price
                    qty_returned
                    qty_on_queue
                    item {
                        id 
                        unit {
                            id 
                            name
                        }
                        code 
                        description
                        total_quantity
                        quantity_on_queue
                        GWAPrice
                    }
                }
                mcrts {
                    id
                    mcrt_number
                    status
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.serivs_by_seriv_number

    } catch (error) {
        console.error(error);
        return []
    }
}