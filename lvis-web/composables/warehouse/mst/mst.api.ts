import type { CreateMstInput, FindAllResponse, MutationResponse, MST, UpdateMstInput } from "./mst.types";
import { sendRequest } from "~/utils/api"
import type { Employee } from "~/composables/system/employee/employee.types";
import type { Item } from "../item/item.type";

export async function fetchDataInSearchFilters(): Promise<{
    msts: MST[],
    employees: Employee[]
}> {
    const query = `
        query {
            msts(page: 1, pageSize: 10) {
                data{
                    mst_number
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

        let msts = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.msts && data.msts.data) {
            msts = data.msts.data
        }

        return {
            msts,
            employees
        }

    } catch (error) {
        console.error(error);
        return {
            msts: [],
            employees: [],
        }
    }
}

export async function findByMstNumber(mstNumber: string): Promise<MST | undefined> {
    const query = `
        query {
            mst(mst_number: "${mstNumber}") {
                id
                mst_number
                created_by
                status
                can_update
                mst_date
                cancelled_at
                returned_by {
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

        if (response.data && response.data.data && response.data.data.mst) {
            return response.data.data.mst;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<MST | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `mst_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            mst(${args}) {
                id
                mst_number
                status
                mst_date 
                remarks
                cwo_number
                mwo_number
                jo_number
                cancelled_at
                created_by
                can_update
                returned_by {
                    firstname 
                    middlename 
                    lastname
                }
                mst_approvers{
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
                mst_items {
                    id 
                    quantity
                    price
                    status
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

        if (response.data && response.data.data && response.data.data.mst) {
            return response.data.data.mst;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(payload: { page: number, pageSize: number, date_requested: string | null, returned_by_id: string | null}): Promise<FindAllResponse> {

    const { page, pageSize, date_requested, returned_by_id } = payload;

    let date_requested2 = null
    let returned_by_id2 = null

    if (date_requested) {
        date_requested2 = `"${date_requested}"`
    }

    if (returned_by_id) {
        returned_by_id2 = `"${returned_by_id}"`
    }

    const query = `
        query {
            msts(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                returned_by_id: ${returned_by_id2},
            ) {
                data {
                    id
                    mst_number
                    created_by
                    status
                    can_update
                    mst_date
                    cancelled_at
                    returned_by {
                        id
                        firstname
                        middlename
                        lastname
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
        return response.data.data.msts;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
    items: Item[],
}> {

    const query = `
        query {
            items(page: 1, pageSize: 500) {
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
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees = []
        let items = []

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

        return {
            employees,
            items,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            items: [],
        }
    }


}

export async function create(input: CreateMstInput): Promise<MutationResponse> {

    console.log('create', input);

    const cwo_number = input.cwo_number?.trim() === '' ? null : `"${input.cwo_number}"`
    const mwo_number = input.mwo_number?.trim() === '' ? null : `"${input.mwo_number}"`
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
          item_id: "${i.item.id}"
          quantity: ${i.quantity}
          price: ${i.price}
          status: ${i.status}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createMst(
                input: {
                    returned_by_id: "${input.returned_by?.id}"
                    cwo_number: ${cwo_number}
                    mwo_number: ${mwo_number}
                    jo_number: ${jo_number}
                    remarks: "${input.remarks}"
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

        if (response.data && response.data.data && response.data.data.createMst) {
            return {
                success: true,
                msg: 'MST created successfully!',
                data: response.data.data.createMst
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create MST. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateMstInput): Promise<MutationResponse> {

    const cwo_number = input.cwo_number?.trim() === '' || !input.cwo_number ? null : `"${input.cwo_number}"`
    const mwo_number = input.mwo_number?.trim() === '' || !input.mwo_number ? null : `"${input.mwo_number}"`
    const jo_number = input.jo_number?.trim() === '' || !input.jo_number ? null : `"${input.jo_number}"`

    const mutation = `
        mutation {
            updateMst(
                id: "${id}",
                input: {
                    remarks: "${input.remarks}"
                    returned_by_id: "${input.returned_by?.id}"
                    cwo_number: ${cwo_number}
                    mwo_number: ${mwo_number}
                    jo_number: ${jo_number}
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMst) {
            return {
                success: true,
                msg: 'MST updated successfully!',
                data: response.data.data.updateMst
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update MST. Please contact system administrator'
        };
    }
}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    items: Item[],
    mst: MST | undefined
}> {
    const query = `
        query {
            mst(id: "${id}") {
                id
                mst_number
                mst_date
                status
                created_by
                can_update
                returned_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                cwo_number
                mwo_number
                jo_number
                remarks
                cancelled_at
                mst_approvers {
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
                mst_items {
                    id
                    quantity
                    price
                    status
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
            items(page: 1, pageSize: 1000, item_codes: "${ITEM_TYPE.LINE_MATERIALS}") {
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
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []
        let items: Item[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.mst) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const mst = data.mst

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        return {
            mst,
            employees,
            items,
        }

    } catch (error) {
        console.error(error);
        return {
            mst: undefined,
            employees: [],
            items: [],
        }
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelMst(
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

        if (response.data && response.data.data && response.data.data.cancelMst) {
            return response.data.data.cancelMst
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel MST. Please contact system administrator'
        };
    }
}

export async function fetchMstNumbers(payload: string): Promise<MST[]> {
    const query = `
        query {
            msts_by_mst_number(mst_number: "${payload}") {
                mst_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.msts_by_mst_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchMSTsByMstNumber(payload: string): Promise<MST[]> {
    const query = `
        query {
            msts_by_mst_number(mst_number: "${payload}", is_detail_included: true) {
                id
                mst_number
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
        return response.data.data.msts_by_mst_number

    } catch (error) {
        console.error(error);
        return []
    }
}