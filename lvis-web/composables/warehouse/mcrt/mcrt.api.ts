import type { CreateMcrtInput, FindAllResponse, MutationResponse, MCRT, UpdateMcrtInput } from "./mcrt.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/system/employee/employee.types";
import type { Station } from "../station/station";
import type { Item } from "../item/item.type";
import type { MCT } from "../mct/mct.types";
import type { SERIV } from "../seriv/seriv.types";

export async function fetchDataInSearchFilters(): Promise<{
    mcrts: MCRT[],
}> {
    const query = `
        query {
            mcrts(page: 1, pageSize: 10) {
                data{
                    mcrt_number
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let mcrts = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.mcrts && data.mcrts.data) {
            mcrts = data.mcrts.data
        }

        return {
            mcrts,
        }

    } catch (error) {
        console.error(error);
        return {
            mcrts: [],
        }
    }
}

export async function findByMcrtNumber(mcrtNumber: string): Promise<MCRT | undefined> {
    const query = `
        query {
            mcrt(mcrt_number: "${mcrtNumber}") {
                id
                mcrt_number
                created_by
                status
                can_update
                mcrt_date
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.mcrt) {
            return response.data.data.mcrt;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<MCRT | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `mcrt_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            mcrt(${args}) {
                id
                mcrt_number
                mct_number
                seriv_number
                status
                mcrt_date 
                note
                cancelled_at
                created_by
                can_update
                note
                mct {
                    id 
                    mct_number
                    mrv {
                        jo_number
                        mwo_number
                        cwo_number
                    }
                }
                seriv {
                    id 
                    seriv_number
                    jo_number
                    mwo_number
                    cwo_number
                }
                returned_by {
                    firstname 
                    middlename 
                    lastname
                }
                mcrt_approvers{
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
                mcrt_items {
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

        if (response.data && response.data.data && response.data.data.mcrt) {
            return response.data.data.mcrt;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(payload: { page: number, pageSize: number, date_requested: string | null}): Promise<FindAllResponse> {

    const { page, pageSize, date_requested } = payload;

    let date_requested2 = null

    if (date_requested) {
        date_requested2 = `"${date_requested}"`
    }

    const query = `
        query {
            mcrts(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
            ) {
                data {
                    id
                    mcrt_number
                    created_by
                    status
                    can_update
                    mcrt_date
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
        return response.data.data.mcrts;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
    auditors: Employee[],
    items: Item[],
    mcts: MCT[],
    serivs: SERIV[],
    general_manager: Employee | null,
}> {

    const query = `
        query {
            items(page: 1, pageSize: 500, item_codes: "${ITEM_TYPE.LINE_MATERIALS},${ITEM_TYPE.SPECIAL_EQUIPMENT}") {
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
                }
            },
            mcts(page: 1, pageSize: 10) {
                data{
                    id
                    mct_number
                    status
                    mrv {
                        mwo_number
                        cwo_number
                        jo_number
                        mrv_items {
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
                    }
                    mcrts {
                        id
                        mcrt_number
                        status
                    }
                }
            },
            serivs(page: 1, pageSize: 10) {
                data{
                    id
                    seriv_number
                    status
                    mwo_number
                    cwo_number
                    jo_number
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
                }
            },
            general_manager {
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
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let auditors = []
        let items = []
        let mcts = []
        let serivs = []
        let general_manager = null

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

        if (data.mcts && data.mcts.data) {
            mcts = response.data.data.mcts.data
        }

        if (data.serivs && data.serivs.data) {
            serivs = response.data.data.serivs.data
        }

        if(data.general_manager) {
            general_manager = data.general_manager
        }

        if(data.auditors) {
            auditors = data.auditors
        }

        return {
            employees,
            items,
            mcts,
            serivs,
            general_manager,
            auditors,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            auditors: [],
            items: [],
            mcts: [],
            serivs: [],
            general_manager: null,
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    auditors: Employee[],
    stations: Station[],
    items: Item[],
    mcrt: MCRT | undefined
}> {
    const query = `
        query {
            mcrt(id: "${id}") {
                id
                mct_id
                mct_number
                seriv_id
                seriv_number
                mcrt_number
                mcrt_date
                status
                created_by
                can_update
                seriv {
                    cwo_number
                    mwo_number
                    jo_number
                }
                mct {
                    mrv {
                        cwo_number
                        mwo_number
                        jo_number
                    }
                }
                returned_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                note
                cancelled_at
                mcrt_approvers {
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
                mcrt_items {
                    id
                    quantity
                    price
                    reference_qty
                    qty_returned
                    qty_on_queue
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
            items(page: 1, pageSize: 5000, item_codes: "${ITEM_TYPE.LINE_MATERIALS}") {
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

        if (!data.mcrt) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const mcrt = data.mcrt

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.stations) {
            stations = data.stations
        }

        if (data.auditors) {
            auditors = data.auditors
        }

        return {
            mcrt,
            employees,
            stations,
            items,
            auditors,
        }

    } catch (error) {
        console.error(error);
        return {
            mcrt: undefined,
            employees: [],
            auditors: [],
            stations: [],
            items: [],
        }
    }
}

export async function create(input: CreateMcrtInput): Promise<MutationResponse> {

    console.log('create', input);

    const mct_id = input.mct ? `"${input.mct.id}"` : null
    const seriv_id = input.seriv ? `"${input.seriv.id}"` : null

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
          item_id: "${i.item.id}"
          quantity: ${i.quantity}
          price: ${i.price}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createMcrt(
                input: {
                    mct_id: ${mct_id}
                    seriv_id: ${seriv_id}
                    returned_by_id: "${input.returned_by?.id}"
                    note: "${input.note}"
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

        if (response.data && response.data.data && response.data.data.createMcrt) {
            return {
                success: true,
                msg: 'MCRT created successfully!',
                data: response.data.data.createMcrt
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create MCRT. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateMcrtInput): Promise<MutationResponse> {

    const mutation = `
        mutation {
            updateMcrt(
                id: "${id}",
                input: {
                    note: "${input.note}"
                    returned_by_id: "${input.returned_by?.id}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMcrt) {
            return {
                success: true,
                msg: 'MCRT updated successfully!',
                data: response.data.data.updateMcrt
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update MCRT. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelMcrt(
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

        if (response.data && response.data.data && response.data.data.cancelMcrt) {
            return response.data.data.cancelMcrt
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel MCRT. Please contact system administrator'
        };
    }
}

export async function fetchMcrtNumbers(payload: string): Promise<MCRT[]> {
    const query = `
        query {
            mcrts_by_mcrt_number(mcrt_number: "${payload}") {
                mcrt_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.mcrts_by_mcrt_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchMCRTsByMcrtNumber(payload: string): Promise<MCRT[]> {
    const query = `
        query {
            mcrts_by_mcrt_number(mcrt_number: "${payload}", is_detail_included: true) {
                id
                mcrt_number
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
        return response.data.data.mcrts_by_mcrt_number

    } catch (error) {
        console.error(error);
        return []
    }
}