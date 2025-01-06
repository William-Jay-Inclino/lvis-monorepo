import type { Employee } from "~/composables/hr/employee/employee.types";
import type { Item } from "../../warehouse/item/item.type";
import type { Canvass, CreateCanvassInput, FindAllResponse, MutationResponse, UpdateCanvassInput } from "./canvass.types";
import { sendRequest } from "~/utils/api"

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
            canvasses(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
            ) {
                data {
                    id
                    rc_number
                    date_requested
                    created_by
                    can_update
                    requested_by {
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
        return response.data.data.canvasses;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findByRcNumber(rcNumber: string): Promise<Canvass | undefined> {
    const query = `
        query {
            canvass(rc_number: "${rcNumber}") {
                id
                rc_number
                date_requested
                created_by
                can_update
                requested_by {
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

        if (response.data && response.data.data && response.data.data.canvass) {
            return response.data.data.canvass;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findOne(id: string): Promise<Canvass | undefined> {

    let args = ''
    if(isValidRcNumber(id)){
        args = `rc_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            canvass(${args}) {
                id
                rc_number
                date_requested
                purpose 
                notes
                created_by
                can_update
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
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
                rv{
                    id
                    rv_number
                    status
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
                jo{
                    id
                    jo_number
                    status
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
                spr{
                    id
                    spr_number
                    status
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
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.canvass) {
            return response.data.data.canvass;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function fetchFormDataInCreate(): Promise<{
    employees: Employee[],
    units: Unit[],
    items: Item[],
    warehouse_custodian: Employee | undefined,
}> {


    const query = `
        query {
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            }
            units{
                id
                name
            }
            items(page: 1, pageSize: 10){
                data {
                    id
                    code
                    description
                    unit {
                        id 
                        name
                    }
                }
            }
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
        let units = []
        let items = []
        let warehouse_custodian = undefined

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.units) {
            units = data.units
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.warehouse_custodian) {
            warehouse_custodian = data.warehouse_custodian
        }

        return {
            employees,
            units,
            items,
            warehouse_custodian,
        }

    } catch (error) {
        console.error(error);
        return {
            employees: [],
            units: [],
            items: [],
            warehouse_custodian: undefined
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    canvass: Canvass | undefined,
    employees: Employee[],
    units: Unit[],
    items: Item[],
    warehouse_custodian: Employee | undefined,
}> {
    const query = `
        query {
            canvass(id: "${id}") {
                id
                rc_number
                date_requested
                purpose
                notes
                created_by
                is_reference_in_rr
                can_update
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                canvass_items{
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
            },
            employees(page: 1, pageSize: 10) {
                data {
                    id
                    firstname
                    middlename
                    lastname
                }
            },
            items(page: 1, pageSize: 10){
                data {
                    id
                    code
                    description
                    unit {
                        id 
                        name
                    }
                }
            }
            units{
                id
                name
            }
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
        let units = []
        let items = []
        let warehouse_custodian = undefined

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.canvass) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const canvass = data.canvass

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.units) {
            units = data.units
        }

        if (data.items && data.items.data) {
            items = response.data.data.items.data
        }

        if (data.warehouse_custodian) {
            warehouse_custodian = data.warehouse_custodian
        }

        return {
            canvass,
            employees,
            units,
            items,
            warehouse_custodian
        }

    } catch (error) {
        console.error(error);
        return {
            canvass: undefined,
            employees: [],
            units: [],
            items: [],
            warehouse_custodian: undefined
        }
    }
}

export async function fetchDataInSearchFilters(): Promise<{
    canvasses: Canvass[],
    employees: Employee[]
}> {
    const query = `
        query {
            canvasses(page: 1, pageSize: 10) {
                data{
                    rc_number
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

        let canvasses = []
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
        return {
            canvasses,
            employees
        }

    } catch (error) {
        console.error(error);
        return {
            canvasses: [],
            employees: [],
        }
    }
}

export async function create(input: CreateCanvassInput): Promise<MutationResponse> {

    const canvassItems = input.canvass_items.map(item => {

        let unitId = null
        let itemId = null
        if (item.unit) {
            unitId = `"${item.unit.id}"`
        }

        if (item.item) {
            itemId = `"${item.item.id}"`
        }

        return `
        {
          description: "${item.description.replace(/\n/g, '\\n')}"
          unit_id: ${unitId}
          item_id: ${itemId}
          quantity: ${item.quantity}
        }`;
    }).join(', ');

    const formattedPurpose = input.purpose.replace(/\n/g, '\\n');
    const formattedNotes = input.notes.replace(/\n/g, '\\n');

    const mutation = `
        mutation {
            createCanvass(
                input: {
                    purpose: "${formattedPurpose}"
                    notes: "${formattedNotes}"
                    requested_by_id: "${input.requested_by?.id}"
                    canvass_items: [${canvassItems}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createCanvass) {
            return {
                success: true,
                msg: 'Canvass created successfully!',
                data: response.data.data.createCanvass
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create Canvass. Please contact system administrator'
        };
    }
}

export async function update(id: string, input: UpdateCanvassInput): Promise<MutationResponse> {

    const formattedPurpose = input.purpose.replace(/\n/g, '\\n');
    const formattedNotes = input.notes.replace(/\n/g, '\\n');

    const mutation = `

        mutation {
            updateCanvass(
                id: "${id}",
                input: {
                    purpose: "${formattedPurpose}"
                    notes: "${formattedNotes}"
                    requested_by_id: "${input.requested_by?.id}"
                }
            ) {
                id
                rc_number
            }
        }
    
    `

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateCanvass) {
            return {
                success: true,
                msg: 'Canvass updated successfully!',
                data: response.data.data.updateCanvass
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to Update Canvass. Please contact system administrator'
        };
    }



}

export async function fetchRcNumbers(payload: string): Promise<Canvass[]> {
    const query = `
        query {
            canvasses_by_rc_number(rc_number: "${payload}") {
                rc_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.canvasses_by_rc_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchCanvassesByRcNumber(payload: string): Promise<Canvass[]> {
    const query = `
        query {
            canvasses_by_rc_number(rc_number: "${payload}", is_detail_included: true) {
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
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.canvasses_by_rc_number

    } catch (error) {
        console.error(error);
        return []
    }
}