import { APPROVER_SUPERVISOR_LABEL } from "~/utils/config";
import type { Canvass } from "../canvass/canvass.types";
import type { CreateJoInput, FindAllResponse, MutationResponse, JO, UpdateJoInput } from "./jo.types";
import { sendRequest } from "~/utils/api"
import type { JoApproverSettings } from "./jo-approver.types";
import type { Employee } from "~/composables/system/employee/employee.types";

export async function fetchDataInSearchFilters(): Promise<{
    canvasses: Canvass[],
    jos: JO[],
    employees: Employee[]
}> {
    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    rc_number
                }
            },
            jos(page: 1, pageSize: 10) {
                data{
                    jo_number
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
        let jos = []
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

        if (data.jos && data.jos.data) {
            jos = data.jos.data
        }

        return {
            canvasses,
            employees,
            jos
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            jos: []
        }
    }
}

export async function findByRcNumber(rcNumber: string): Promise<JO | undefined> {
    const query = `
        query {
            jo(rc_number: "${rcNumber}") {
                id
                jo_number
                status
                created_by
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

        if (response.data && response.data.data && response.data.data.jo) {
            return response.data.data.jo;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findByJoNumber(joNumber: string): Promise<JO | undefined> {
    const query = `
        query {
            jo(jo_number: "${joNumber}") {
                id
                jo_number
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

        if (response.data && response.data.data && response.data.data.jo) {
            return response.data.data.jo;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<JO | undefined> {

    let args = ''
    if(isValidRcNumber(id)){
        args = `jo_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            jo(${args}) {
                id
                jo_number
                status
                date_requested 
                equipment
                can_update
                department {
                    id 
                    code 
                    name
                }
                notes
                created_by
                cancelled_at
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
                            name 
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
                jo_approvers{
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

        if (response.data && response.data.data && response.data.data.jo) {
            return response.data.data.jo;
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
            jos(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    jo_number
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
        return response.data.data.jos;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    canvasses: Canvass[],
    employees: Employee[],
    approvers: JoApproverSettings[],
    classifications: Classification[],
    departments: Department[],
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
            employees(page: 1, pageSize: 10) {
                data{
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            joApproverSettings{
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
            classifications{
                id
                name
            },
            departments{
                id
                code
                name
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let canvasses = []
        let employees = []
        let approvers = []
        let classifications = []
        let departments = []

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

        if (data.joApproverSettings) {
            approvers = data.joApproverSettings
        }

        if (data.classifications) {
            classifications = data.classifications
        }

        if (data.departments) {
            departments = data.departments
        }

        return {
            canvasses,
            employees,
            approvers,
            classifications,
            departments,
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            approvers: [],
            classifications: [],
            departments: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    classifications: Classification[],
    departments: Department[],
    jo: JO | undefined
}> {
    const query = `
        query {
            jo(id: "${id}") {
                id
                jo_number
                created_by
                status
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
                department {
                    id 
                    code 
                    name
                }
                supervisor {
                    id
                    firstname
                    middlename
                    lastname
                }
                date_requested
                equipment
                notes
                cancelled_at
                jo_approvers {
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
            classifications{
                id
                name
            },
            departments{
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
        let classifications: Classification[] = []
        let departments: Department[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.jo) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const jo = data.jo

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.classifications) {
            classifications = response.data.data.classifications
        }

        if (data.departments) {
            departments = response.data.data.departments
        }

        return {
            jo,
            employees,
            classifications,
            departments,
        }

    } catch (error) {
        console.error(error);
        return {
            jo: undefined,
            employees: [],
            classifications: [],
            departments: [],
        }
    }
}

export async function create(input: CreateJoInput): Promise<MutationResponse> {

    let classification_id = null

    if (input.classification) {
        classification_id = `"${input.classification.id}"`
    }


    // set the supervisor as the 1st approver
    input.approvers.push({
        approver_id: input.supervisor!.id,
        approver: input.supervisor,
        label: APPROVER_SUPERVISOR_LABEL,
        order: 1,
        is_supervisor: true

    })

    const approvers = input.approvers.map(item => {
        return `
        {
          approver_id: "${item.approver?.id}"
          label: "${item.label}"
          order: ${item.order}
          is_supervisor: ${ !!item.is_supervisor ? item.is_supervisor : false }
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createJo(
                input: {
                    canvass_id: "${input.canvass?.id}"
                    supervisor_id: "${input.supervisor?.id}"
                    department_id: "${input.department?.id}"
                    equipment: "${input.equipment}"
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

        if (response.data && response.data.data && response.data.data.createJo) {
            return {
                success: true,
                msg: 'JO created successfully!',
                data: response.data.data.createJo
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create JO. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateJoInput): Promise<MutationResponse> {

    let classification_id = null

    if (input.classification) {
        classification_id = `"${input.classification.id}"`
    }

    const mutation = `
        mutation {
            updateJo(
                id: "${id}",
                input: {
                    supervisor_id: "${input.supervisor?.id}"
                    department_id: "${input.department?.id}"
                    equipment: "${input.equipment}"
                    classification_id: ${classification_id}
                    notes: "${input.notes}"
                }
            ) {
                id
                jo_approvers {
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
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateJo) {
            return {
                success: true,
                msg: 'JO updated successfully!',
                data: response.data.data.updateJo
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update JO. Please contact system administrator'
        };
    }
}


export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelJo(
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

        if (response.data && response.data.data && response.data.data.cancelJo) {
            return response.data.data.cancelJo
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel JO. Please contact system administrator'
        };
    }
}


export async function fetchJoNumbers(payload: string): Promise<JO[]> {
    const query = `
        query {
            jos_by_jo_number(jo_number: "${payload}") {
                jo_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.jos_by_jo_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchJOsByJoNumber(payload: string): Promise<JO[]> {
    const query = `
        query {
            jos_by_jo_number(jo_number: "${payload}", is_detail_included: true) {
                id
                jo_number
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
        return response.data.data.jos_by_jo_number

    } catch (error) {
        console.error(error);
        return []
    }
}