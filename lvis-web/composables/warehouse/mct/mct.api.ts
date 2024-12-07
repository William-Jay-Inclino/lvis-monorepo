import type { CreateMctInput, FindAllResponse, MutationResponse, MCT } from "./mct.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/system/employee/employee.types";
import type { Station } from "../station/station";
import type { Item } from "../item/item.type";
import type { MRV } from "../mrv/mrv.types";

export async function fetchDataInSearchFilters(): Promise<{
    mcts: MCT[],
    employees: Employee[]
}> {
    const query = `
        query {
            mcts(page: 1, pageSize: 10) {
                data{
                    mct_number
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

        let mcts = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.mcts && data.mcts.data) {
            mcts = data.mcts.data
        }

        return {
            mcts,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            mcts: [],
            employees: [],
        }
    }
}

export async function findByMctNumber(mctNumber: string): Promise<MCT | undefined> {
    const query = `
        query {
            mct(mct_number: "${mctNumber}") {
                id
                mct_number
                created_by
                status
                can_update
                mct_date
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.mct) {
            return response.data.data.mct;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<MCT | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `mct_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            mct(${args}) {
                id
                mct_number
                mrv_number
                status
                mct_date 
                mcrts {
                    id
                    mcrt_number
                }
                mrv {
                    id
                    mrv_number
                    purpose
                    date_requested
                    location
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
                cancelled_at
                created_by
                can_update
                mct_approvers{
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
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.mct) {
            return response.data.data.mct;
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
            mcts(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
                approval_status: ${approval_status2},
            ) {
                data {
                    id
                    mct_number
                    requested_by {
                        firstname 
                        middlename 
                        lastname
                    }
                    mrv {
                        requested_by {
                            id
                            firstname
                            middlename 
                            lastname
                        }
                    }
                    created_by
                    status
                    can_update
                    mct_date
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
        return response.data.data.mcts;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
    mrvs: MRV[],
    warehouse_custodian: Employee | null,
}> {

    const query = `
        query {
            employees(page: 1, pageSize: 300) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            warehouse_custodian {
                id 
                firstname
                middlename
                lastname
            }
            mrvs(page: 1, pageSize: 10) {
                data{
                    id
                    mrv_number
                    date_requested
                    is_referenced
                    status
                    item_from {
                        name
                    }
                    purpose
                    location
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
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let mrvs = []
        let warehouse_custodian = null

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.mrvs && data.mrvs.data) {
            mrvs = response.data.data.mrvs.data
        }

        if(data.warehouse_custodian) {
            warehouse_custodian = data.warehouse_custodian
        }

        return {
            employees,
            mrvs,
            warehouse_custodian
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            mrvs: [],
            warehouse_custodian: null
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    mct: MCT | undefined
}> {
    const query = `
        query {
            mct(id: "${id}") {
                id
                mct_number
                status
                created_by
                can_update
                mct_date
                mct_approvers {
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
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.mct) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const mct = data.mct

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        return {
            mct,
            employees,
        }

    } catch (error) {
        console.error(error);
        return {
            mct: undefined,
            employees: [],
        }
    }
}

export async function create(input: CreateMctInput): Promise<MutationResponse> {

    console.log('create', input);

    const approvers = input.approvers.map(i => {
        return `
        {
          approver_id: "${i.approver?.id}"
          label: "${i.label}"
          order: ${i.order}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createMct(
                input: {
                    mrv_id: "${input.mrv?.id}"
                    approvers: [${approvers}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createMct) {
            return {
                success: true,
                msg: 'MCT created successfully!',
                data: response.data.data.createMct
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create MCT. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelMct(
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

        if (response.data && response.data.data && response.data.data.cancelMct) {
            return response.data.data.cancelMct
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel MCT. Please contact system administrator'
        };
    }
}

export async function fetchMctNumbers(payload: string): Promise<MCT[]> {
    const query = `
        query {
            mcts_by_mct_number(mct_number: "${payload}") {
                mct_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.mcts_by_mct_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchMCTsByMctNumber(payload: string): Promise<MCT[]> {
    const query = `
        query {
            mcts_by_mct_number(mct_number: "${payload}", is_detail_included: true) {
                id
                mct_number
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
        return response.data.data.mcts_by_mct_number

    } catch (error) {
        console.error(error);
        return []
    }
}