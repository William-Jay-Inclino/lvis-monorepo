import type { Account } from "~/composables/system/account/account";
import type { MEQS } from "../meqs/meqs.types";
import type { PoApproverSettings } from "./po-approver.types";
import type { CreatePoInput, FindAllResponse, MutationResponse, PO, UpdatePoInput } from "./po.types";
import type { Employee } from "~/composables/system/employee/employee.types";

export async function findByRefNumber(payload: { po_number?: string, meqs_number?: string }): Promise<PO | undefined> {

    let referenceField = 'po_number'
    let referenceValue = null

    if (payload.meqs_number) {
        referenceField = 'meqs_number'
        referenceValue = payload.meqs_number
    } else {
        referenceValue = payload.po_number
    }

    const query = `
        query {
            po(${referenceField}: "${referenceValue}") {
                id
                po_number
                meqs_number
                status
                po_date
                created_by
                cancelled_at
                can_update
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                meqs_supplier {
                    meqs {
                        meqs_number
                        rv {
                            rv_number
                            canvass {
                                rc_number 
                                requested_by {
                                    id 
                                    firstname
                                    middlename
                                    lastname
                                }
                            }
                        }
                        spr {
                            spr_number
                            canvass {
                                rc_number 
                                requested_by {
                                    id 
                                    firstname
                                    middlename
                                    lastname
                                }
                            }
                        }
                        jo {
                            jo_number
                            canvass {
                                rc_number 
                                requested_by {
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
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.po) {
            return response.data.data.po;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findAll(payload: { 
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
            pos(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
                approval_status: ${approval_status2},
            ) {
                data {
                    id
                    po_number
                    meqs_number
                    status
                    po_date
                    created_by
                    cancelled_at
                    can_update
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    meqs_supplier {
                        meqs {
                            meqs_number
                            rv {
                                rv_number
                                canvass {
                                    rc_number 
                                    requested_by {
                                        id 
                                        firstname
                                        middlename
                                        lastname
                                    }
                                }
                            }
                            spr {
                                spr_number
                                canvass {
                                    rc_number 
                                    requested_by {
                                        id 
                                        firstname
                                        middlename
                                        lastname
                                    }
                                }
                            }
                            jo {
                                jo_number
                                canvass {
                                    rc_number 
                                    requested_by {
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
                totalItems
                currentPage
                totalPages
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)
        return response.data.data.pos;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchDataInSearchFilters(): Promise<{
    pos: PO[],
    employees: Employee[],
    meqs: MEQS[],
}> {
    const query = `
        query {
            pos(page: 1, pageSize: 10) {
                data{
                    po_number
                }
            },
            meqs(page: 1, pageSize: 10) {
                data{
                    meqs_number
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

        let pos = []
        let employees = []
        let meqs = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.pos && data.pos.data) {
            pos = data.pos.data
        }

        if (data.meqs && data.meqs.data) {
            meqs = data.meqs.data
        }

        return {
            pos,
            employees,
            meqs,
        }

    } catch (error) {
        console.error(error);
        return {
            pos: [],
            employees: [],
            meqs: [],
        }
    }
}

export async function fetchFormDataInCreate(): Promise<{
    meqs: MEQS[],
    accounts: Account[],
    approvers: PoApproverSettings[]
}> {

    const query = `
        query {
            meqs(page: 1, pageSize: 10) {
                data{
                    id
                    meqs_number
                    status
                    meqs_suppliers {
                        id
                        payment_terms
                        is_referenced
                        supplier{
                            id
                            name 
                            is_vat_registered
                        }
                        meqs_supplier_items {
                            id 
                            price 
                            notes 
                            is_awarded
                            vat_type
                            canvass_item {
                                id 
                                description
                                unit {
                                    id 
                                    name 
                                }
                                quantity
                            }
                        }
                    }
                }
            },
            poApproverSettings{
                approver_id
                approver{
                  id
                  firstname
                  middlename
                  lastname
                }
                label
                order
            },
            accounts {
                id
                code
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let meqs = []
        let approvers = []
        let accounts = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.meqs && data.meqs.data) {
            meqs = data.meqs.data
        }

        if (data.poApproverSettings) {
            approvers = data.poApproverSettings
        }

        if (data.accounts) {
            accounts = data.accounts
        }

        return {
            meqs,
            approvers,
            accounts
        }

    } catch (error) {
        console.error(error);
        return {
            meqs: [],
            approvers: [],
            accounts: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    accounts: Account[],
    po: PO | undefined
}> {

    const query = `
        query {
            po(id: "${id}") {
                id 
                po_number 
                po_date
                cancelled_at
                created_by
                notes
                can_update
                fund_source {
                    id 
                    name
                }
                meqs_supplier{
                    id
                    supplier {
                        id 
                        name
                        is_vat_registered
                    }
                    meqs {
                        id 
                        meqs_number
                        rv {
                            id
                            rv_number 
                            canvass {
                                rc_number
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                                purpose
                                notes
                            }
                        }
                        spr {
                            id
                            spr_number 
                            canvass {
                                rc_number
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                                purpose
                                notes
                            }
                        }
                        jo {
                            id
                            jo_number 
                            canvass {
                                rc_number
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                                purpose
                                notes
                            }
                        }
                    }
                }
                po_approvers {
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
            accounts {
                id
                code
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []
        let accounts: Account[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.po) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.accounts) {
            accounts = data.accounts
        }

        return {
            po: data.po,
            employees,
            accounts,
        }

    } catch (error) {
        console.error(error);
        return {
            po: undefined,
            employees: [],
            accounts: [],
        }
    }


}

export async function create(input: CreatePoInput): Promise<MutationResponse> {

    const approvers = input.approvers.map(item => {
        return `
        {
          approver_id: "${item.approver?.id}"
          label: "${item.label}"
          order: ${item.order}
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createPo(
                input: {
                    meqs_supplier_id: "${input.meqs_supplier?.id}"
                    fund_source_id: ${input.fund_source ? `"${input.fund_source.id}"` : null}
                    notes: "${input.notes}"
                    approvers: [${approvers}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createPo) {
            return {
                success: true,
                msg: 'PO created successfully!',
                data: response.data.data.createPo
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create PO. Please contact system administrator'
        };
    }
}

export async function findOne(id: string): Promise<PO | undefined> {

    let args = ''
    if(isValidRcNumber(id)){
        args = `po_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            po(${args}) {
                id
                po_number
                meqs_number
                status
                po_date
                notes
                created_by
                cancelled_at
                can_update
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                fund_source {
                    id 
                    name 
                }
                po_approvers{
                    approver {
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
                rrs {
                    id
                    rr_number
                }
                meqs_supplier {
                    id
                    payment_terms
                    supplier{
                        id
                        name 
                        is_vat_registered
                    }
                    meqs {
                        id
                        meqs_number
                        rv {
                            id
                            rv_number
                            canvass {
                                id
                                rc_number
                                purpose 
                                notes
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                            }
                        }
                        spr {
                            id
                            spr_number
                            canvass {
                                id
                                rc_number
                                purpose 
                                notes
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                            }
                        }
                        jo {
                            id
                            jo_number
                            canvass {
                                id
                                rc_number
                                purpose 
                                notes
                                requested_by {
                                    id
                                    firstname
                                    middlename
                                    lastname
                                }
                            }
                        }
                    }
                    meqs_supplier_items {
                        id 
                        price 
                        notes 
                        is_awarded
                        vat_type
                        canvass_item {
                            id 
                            description
                            unit {
                                id 
                                name 
                            }
                            quantity
                            item {
                                id
                                code 
                                description
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

        if (response.data && response.data.data && response.data.data.po) {
            return response.data.data.po;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function update(id: string, input: UpdatePoInput): Promise<MutationResponse> {


    const mutation = `
        mutation {
            updatePo(
                id: "${id}",
                input: {
                    fund_source_id: ${input.fund_source ? `"${input.fund_source.id}"` : null}
                    notes: "${input.notes}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updatePo) {
            return {
                success: true,
                msg: 'PO updated successfully!',
                data: response.data.data.updatePo
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update PO. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelPo(
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

        if (response.data && response.data.data && response.data.data.cancelPo) {
            return response.data.data.cancelPo
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel PO. Please contact system administrator'
        };
    }
}

export async function fetchPoNumbers(payload: string): Promise<PO[]> {
    const query = `
        query {
            pos_by_po_number(po_number: "${payload}") {
                po_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.pos_by_po_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchPosByPoNumber(payload: string): Promise<PO[]> {
    const query = `
        query {
            pos_by_po_number(po_number: "${payload}", is_detail_included: true) {
                id
                po_number
                status
                meqs_supplier {
                    id
                    payment_terms
                    is_referenced
                    supplier{
                        id
                        name 
                        is_vat_registered
                    }
                    meqs_supplier_items {
                        id 
                        price 
                        notes 
                        is_awarded
                        vat_type
                        canvass_item {
                            id 
                            description
                            unit {
                                id 
                                name 
                            }
                            quantity
                            item {
                                id 
                                code 
                                description
                            }
                        }
                    }
                }
                rrs {
                    id 
                    rr_number
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
        return response.data.data.pos_by_po_number

    } catch (error) {
        console.error(error);
        return []
    }
}