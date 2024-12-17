import { APPROVER_SUPERVISOR_LABEL } from "~/utils/config";
import type { Canvass } from "../canvass/canvass.types";
import type { CreateRvInput, FindAllResponse, MutationResponse, RV, UpdateRvInput } from "./rv.types";
import { sendRequest } from "~/utils/api"
import type { RvApproverSettings } from "./rv-approver.types";
import type { Employee } from "~/composables/hr/employee/employee.types";

export async function fetchDataInSearchFilters(): Promise<{
    canvasses: Canvass[],
    rvs: RV[],
    employees: Employee[]
}> {
    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    rc_number
                }
            },
            rvs(page: 1, pageSize: 10) {
                data{
                    rv_number
                }
            }
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

        let canvasses = []
        let rvs = []
        let employees = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.canvasses && data.canvasses.data) {
            canvasses = data.canvasses.data
        }

        if (data.rvs && data.rvs.data) {
            rvs = data.rvs.data
        }

        return {
            canvasses,
            employees,
            rvs
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            rvs: []
        }
    }
}

export async function findByRcNumber(rcNumber: string): Promise<RV | undefined> {
    const query = `
        query {
            rv(rc_number: "${rcNumber}") {
                id
                rv_number
                created_by
                status
                can_update
                canvass{
                    rc_number
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                }
                date_requested
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.rv) {
            return response.data.data.rv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findByRvNumber(rvNumber: string): Promise<RV | undefined> {
    const query = `
        query {
            rv(rv_number: "${rvNumber}") {
                id
                rv_number
                created_by
                status
                can_update
                canvass{
                    rc_number
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                }
                date_requested
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.rv) {
            return response.data.data.rv;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<RV | undefined> {

    console.log('isValidRcNumber(id)', isValidRcNumber(id));
    let args = ''
    if(isValidRcNumber(id)){
        args = `rv_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            rv(${args}) {
                id
                rv_number
                canvass_number
                status
                date_requested 
                work_order_no
                work_order_date
                notes
                cancelled_at
                created_by
                can_update
                canvass {
                    id
                    rc_number
                    requested_by {
                        firstname 
                        middlename 
                        lastname
                    }
                    purpose
                    canvass_items {
                        description
                        unit {
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
                supervisor {
                    firstname 
                    middlename 
                    lastname
                }
                classification{
                    name
                }
                rv_approvers{
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
                meqs {
                    id
                    meqs_number
                    meqs_suppliers {
                        po {
                            id
                            po_number
                            rrs {
                                id 
                                rr_number
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

        if (response.data && response.data.data && response.data.data.rv) {
            return response.data.data.rv;
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
    }): 
    Promise<FindAllResponse> {

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
            rvs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
                approval_status: ${approval_status2},
            ) {
                data {
                    id
                    rv_number
                    created_by
                    status
                    can_update
                    canvass{
                        rc_number
                        requested_by {
                            id
                            firstname
                            middlename
                            lastname
                        }
                    }
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
        return response.data.data.rvs;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    canvasses: Canvass[],
    employees: Employee[],
    approvers: RvApproverSettings[],
    classifications: Classification[],
}> {

    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    id
                    rc_number
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    purpose
                    notes
                    is_referenced
                }
            },
            employees(page: 1, pageSize: 30) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                    rank_number
                }
            },
            rvApproverSettings{
                approver_id
                approver{
                  id
                  firstname
                  middlename
                  lastname
                  rank_number
                }
                label
                order
            },
            classifications(page: 1, pageSize: 10) {
                data {
                    id
                    name
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let canvasses = []
        let employees = []
        let approvers = []
        let classifications = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.canvasses && data.canvasses.data) {
            canvasses = response.data.data.canvasses.data
        }

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.classifications && data.classifications.data) {
            classifications = response.data.data.classifications.data
        }

        if (data.rvApproverSettings) {
            approvers = data.rvApproverSettings
        }

        return {
            canvasses,
            employees,
            approvers,
            classifications
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            approvers: [],
            classifications: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    classifications: Classification[],
    rv: RV | undefined
}> {
    const query = `
        query {
            rv(id: "${id}") {
                id
                rv_number
                status
                created_by
                can_update
                canvass {
                    id
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
                classification {
                    id
                    name
                }
                supervisor {
                    id
                    firstname
                    middlename
                    lastname
                    rank_number
                }
                date_requested
                work_order_no
                work_order_date
                notes
                cancelled_at
                rv_approvers {
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

            },
            employees(page: 1, pageSize: 30) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                    rank_number
                }
            },
            classifications(page: 1, pageSize: 10) {
                data {
                    id
                    name
                }
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []
        let classifications: Classification[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.rv) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const rv = data.rv

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.classifications && data.classifications.data) {
            classifications = response.data.data.classifications.data
        }
        return {
            rv,
            employees,
            classifications,
        }

    } catch (error) {
        console.error(error);
        return {
            rv: undefined,
            employees: [],
            classifications: [],
        }
    }
}

export async function create(input: CreateRvInput): Promise<MutationResponse> {

    let work_order_no = null
    let work_order_date = null
    let classification_id = null

    if (input.work_order_no) {
        work_order_no = `"${input.work_order_no}"`
    }

    if (input.work_order_date) {
        work_order_date = `"${input.work_order_date}"`
    }

    if (input.classification) {
        classification_id = `"${input.classification.id}"`
    }


    // set the supervisor as the 1st approver
    input.approvers.push({
        approver_id: input.supervisor!.id,
        approver: input.supervisor,
        label: APPROVER_SUPERVISOR_LABEL,
        order: 1,
    })


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
            createRv(
                input: {
                    canvass_id: "${input.canvass?.id}"
                    work_order_no: ${work_order_no}
                    work_order_date: ${work_order_date}
                    classification_id: ${classification_id}
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

        if (response.data && response.data.data && response.data.data.createRv) {
            return {
                success: true,
                msg: 'RV created successfully!',
                data: response.data.data.createRv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create RV. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateRvInput): Promise<MutationResponse> {

    let work_order_no = null
    let work_order_date = null
    let classification_id = null

    if (input.work_order_no) {
        work_order_no = `"${input.work_order_no}"`
    }

    if (input.work_order_date) {
        work_order_date = `"${input.work_order_date}"`
    }

    if (input.classification) {
        classification_id = `"${input.classification.id}"`
    }

    const mutation = `
        mutation {
            updateRv(
                id: "${id}",
                input: {
                    supervisor_id: "${input.supervisor?.id}"
                    work_order_no: ${work_order_no}
                    work_order_date: ${work_order_date}
                    classification_id: ${classification_id}
                    notes: "${input.notes}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateRv) {
            return {
                success: true,
                msg: 'RV updated successfully!',
                data: response.data.data.updateRv
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update RV. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelRv(
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

        if (response.data && response.data.data && response.data.data.cancelRv) {
            return response.data.data.cancelRv
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel RV. Please contact system administrator'
        };
    }
}

export async function fetchRvNumbers(payload: string): Promise<RV[]> {
    const query = `
        query {
            rvs_by_rv_number(rv_number: "${payload}") {
                rv_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.rvs_by_rv_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchRVsByRvNumber(payload: string): Promise<RV[]> {
    const query = `
        query {
            rvs_by_rv_number(rv_number: "${payload}", is_detail_included: true) {
                id
                rv_number
                status
                is_referenced
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
                    canvass_items{
                        id
                        canvass_id
                        description
                        unit{
                            id
                            name
                        }
                        quantity
                    }
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
        return response.data.data.rvs_by_rv_number

    } catch (error) {
        console.error(error);
        return []
    }
}