import type { CreateMcrtInput, FindAllResponse, MutationResponse, MCRT } from "./mcrt.types";
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
                date_requested
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
                status
                mcrt_date 
                note
                wo_number
                mo_number
                jo_number
                cancelled_at
                created_by
                can_update
                note
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
                    label_id
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
                        name
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
    items: Item[],
    mcts: MCT[],
    serivs: SERIV[],
}> {

    const query = `
        query {
            items(page: 1, pageSize: 200, item_type: ${ITEM_TYPE.SPECIAL_EQUIPMENT}) {
                data{
                    id
                    code
                    name
                    description
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
            mcts(page: 1, pageSize: 10) {
                data{
                    id
                    mct_number
                    status
                    is_referenced
                    mrv {
                        mrv_items {
                            id
                            quantity
                            price
                            item {
                                id 
                                unit {
                                    id 
                                    name
                                }
                                code 
                                name
                                description
                                total_quantity
                                quantity_on_queue
                                GWAPrice
                            }
                        }
                    }
                }
            },
            serivs(page: 1, pageSize: 10) {
                data{
                    id
                    seriv_number
                    status
                    is_referenced
                    seriv_items {
                        id
                        quantity
                        price
                        item {
                            id 
                            unit {
                                id 
                                name
                            }
                            code 
                            name
                            description
                            total_quantity
                            quantity_on_queue
                            GWAPrice
                        }
                    }
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let items = []
        let mcts = []
        let serivs = []

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

        return {
            employees,
            items,
            mcts,
            serivs,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            items: [],
            mcts: [],
            serivs: [],
        }
    }


}

// export async function fetchFormDataInUpdate(id: string): Promise<{
//     employees: Employee[],
//     mcrt: MCRT | undefined
// }> {
//     const query = `
//         query {
//             mcrt(id: "${id}") {
//                 id
//                 mcrt_number
//                 status
//                 created_by
//                 can_update
//                 date_requested
//                 purpose
//                 request_type
//                 mwo_number
//                 jo_number
//                 consumer_name
//                 location
//                 cancelled_at
//                 mcrt_approvers {
//                     id
//                     approver {
//                         id
//                         firstname
//                         middlename
//                         lastname
//                     }
//                     date_approval 
//                     notes
//                     status
//                     label
//                     order
//                 }

//             },
//             employees(page: 1, pageSize: 10) {
//                 data {
//                     id
//                     firstname
//                     middlename
//                     lastname
//                 }
//             },
//         }
//     `;

//     try {
//         const response = await sendRequest(query);
//         console.log('response', response)

//         let employees: Employee[] = []

//         if (!response.data || !response.data.data) {
//             throw new Error(JSON.stringify(response.data.errors));
//         }

//         const data = response.data.data

//         if (!data.mcrt) {
//             throw new Error(JSON.stringify(response.data.errors));
//         }

//         const mcrt = data.mcrt

//         if (data.employees && data.employees.data) {
//             employees = response.data.data.employees.data
//         }

//         return {
//             mcrt,
//             employees,
//         }

//     } catch (error) {
//         console.error(error);
//         return {
//             mcrt: undefined,
//             employees: [],
//         }
//     }
// }

export async function create(input: CreateMcrtInput): Promise<MutationResponse> {

    console.log('create', input);

    const mct_id = input.mct ? `"${input.mct.id}"` : null
    const seriv_id = input.seriv ? `"${input.seriv.id}"` : null

    const wo_number = input.wo_number?.trim() === '' ? null : `"${input.wo_number}"`
    const mo_number = input.mo_number?.trim() === '' ? null : `"${input.mo_number}"`
    const jo_number = input.jo_number?.trim() === '' ? null : `"${input.jo_number}"`

    const approvers = input.approvers.map(i => {
        return `
        {
          approver_id: "${i.approver?.id}"
          label: "${i.label}"
          label_id: "${i.label_id}"
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
            createMcrt(
                input: {
                    mct_id: ${mct_id}
                    seriv_id: ${seriv_id}
                    returned_by_id: "${input.returned_by?.id}"
                    wo_number: ${wo_number}
                    mo_number: ${mo_number}
                    jo_number: ${jo_number}
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