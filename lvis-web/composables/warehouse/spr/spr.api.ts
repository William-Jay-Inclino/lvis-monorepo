import { APPROVER_SUPERVISOR_LABEL } from "~/utils/config";
import type { Canvass } from "../canvass/canvass.types";
import type { CreateSprInput, FindAllResponse, MutationResponse, SPR, UpdateSprInput } from "./spr.types";
import { sendRequest } from "~/utils/api"
import type { SprApproverSettings } from "./spr-approver.types";
import type { Employee } from "~/composables/system/employee/employee.types";

export async function fetchDataInSearchFilters(): Promise<{
    canvasses: Canvass[],
    sprs: SPR[],
    employees: Employee[]
}> {
    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    rc_number
                }
            },
            sprs(page: 1, pageSize: 10) {
                data{
                    spr_number
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
        let sprs = []
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

        if (data.sprs && data.sprs.data) {
            sprs = data.sprs.data
        }

        return {
            canvasses,
            employees,
            sprs
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            sprs: []
        }
    }
}

export async function findByRcNumber(rcNumber: string): Promise<SPR | undefined> {
    const query = `
        query {
            spr(rc_number: "${rcNumber}") {
                id
                spr_number
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

        if (response.data && response.data.data && response.data.data.spr) {
            return response.data.data.spr;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findBySprNumber(sprNumber: string): Promise<SPR | undefined> {
    const query = `
        query {
            spr(spr_number: "${sprNumber}") {
                id
                spr_number
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

        if (response.data && response.data.data && response.data.data.spr) {
            return response.data.data.spr;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<SPR | undefined> {

    let args = ''
    if(isValidRcNumber(id)){
        args = `spr_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            spr(${args}) {
                id
                spr_number
                status
                date_requested 
                can_update
                vehicle {
                    id 
                    name 
                    vehicle_number
                }
                created_by
                notes
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
                spr_approvers{
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

        if (response.data && response.data.data && response.data.data.spr) {
            return response.data.data.spr;
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
            sprs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    spr_number
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
        return response.data.data.sprs;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function fetchFormDataInCreate(): Promise<{
    canvasses: Canvass[],
    employees: Employee[],
    approvers: SprApproverSettings[],
    classifications: Classification[],
    vehicles: Vehicle[],
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
            sprApproverSettings{
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
            classifications{
                id
                name
            },
            vehicles{
                id
                name
                vehicle_number
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
        let vehicles = []

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

        if (data.sprApproverSettings) {
            approvers = data.sprApproverSettings
        }

        if (data.classifications) {
            classifications = data.classifications
        }

        if (data.vehicles) {
            vehicles = data.vehicles
        }

        return {
            canvasses,
            employees,
            approvers,
            classifications,
            vehicles,
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
            approvers: [],
            classifications: [],
            vehicles: [],
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    classifications: Classification[],
    vehicles: Vehicle[],
    spr: SPR | undefined
}> {
    const query = `
        query {
            spr(id: "${id}") {
                id
                spr_number
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
                vehicle {
                    id 
                    name 
                    vehicle_number
                }
                supervisor {
                    id
                    firstname
                    middlename
                    lastname
                    rank_number
                }
                date_requested
                notes
                cancelled_at
                spr_approvers {
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
            classifications{
                id
                name
            },
            vehicles{
                id
                name
                vehicle_number
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []
        let classifications: Classification[] = []
        let vehicles: Vehicle[] = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.spr) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const spr = data.spr

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.classifications) {
            classifications = response.data.data.classifications
        }

        if (data.vehicles) {
            vehicles = response.data.data.vehicles
        }

        return {
            spr,
            employees,
            classifications,
            vehicles,
        }

    } catch (error) {
        console.error(error);
        return {
            spr: undefined,
            employees: [],
            classifications: [],
            vehicles: [],
        }
    }
}

export async function create(input: CreateSprInput): Promise<MutationResponse> {

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
            createSpr(
                input: {
                    canvass_id: "${input.canvass?.id}"
                    vehicle_id: "${input.vehicle?.id}"
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

        if (response.data && response.data.data && response.data.data.createSpr) {
            return {
                success: true,
                msg: 'SPR created successfully!',
                data: response.data.data.createSpr
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create SPR. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateSprInput): Promise<MutationResponse> {

    let classification_id = null

    if (input.classification) {
        classification_id = `"${input.classification.id}"`
    }

    const mutation = `
        mutation {
            updateSpr(
                id: "${id}",
                input: {
                    supervisor_id: "${input.supervisor?.id}"
                    vehicle_id: "${input.vehicle?.id}"
                    classification_id: ${classification_id}
                    notes: "${input.notes}"
                }
            ) {
                id
                spr_approvers {
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

        if (response.data && response.data.data && response.data.data.updateSpr) {
            return {
                success: true,
                msg: 'SPR updated successfully!',
                data: response.data.data.updateSpr
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update SPR. Please contact system administrator'
        };
    }
}


export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelSpr(
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

        if (response.data && response.data.data && response.data.data.cancelSpr) {
            return response.data.data.cancelSpr
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel SPR. Please contact system administrator'
        };
    }
}


export async function fetchSprNumbers(payload: string): Promise<SPR[]> {
    const query = `
        query {
            sprs_by_spr_number(spr_number: "${payload}") {
                spr_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.sprs_by_spr_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchSPRsBySprNumber(payload: string): Promise<SPR[]> {
    const query = `
        query {
            sprs_by_spr_number(spr_number: "${payload}", is_detail_included: true) {
                id
                spr_number
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
        return response.data.data.sprs_by_spr_number

    } catch (error) {
        console.error(error);
        return []
    }
}