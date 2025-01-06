import axios from "axios";
import type { RV } from "../rv/rv.types";
import type { CreateMeqsInput, FindAllResponse, MEQS, MeqsApproverSettings, MutationResponse, UpdateMeqsInput } from "./meqs.types";
import type { SPR } from "../spr/spr.types";
import type { JO } from "../jo/jo.types";
import type { Supplier } from "../../warehouse/supplier/supplier";
import type { Employee } from "~/composables/hr/employee/employee.types";


export async function fetchDataInSearchFilters(): Promise<{
    meqs: MEQS[],
    employees: Employee[],
    rvs: RV[],
    sprs: SPR[],
    jos: JO[],
    suppliers: Supplier[],
}> {
    const query = `
        query {
            meqs(page: 1, pageSize: 10) {
                data{
                    meqs_number
                }
            },
            rvs(page: 1, pageSize: 10) {
                data{
                    rv_number
                }
            }
            sprs(page: 1, pageSize: 10) {
                data{
                    spr_number
                }
            }
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
            suppliers(page: 1, pageSize: 10) {
                data {
                    id
                    name
                }
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let meqs = []
        let rvs = []
        let sprs = []
        let jos = []
        let employees = []
        let suppliers = []

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        console.log('data', data)

        if (data.employees && data.employees.data) {
            employees = data.employees.data
        }

        if (data.meqs && data.meqs.data) {
            meqs = data.meqs.data
        }

        if (data.rvs && data.rvs.data) {
            rvs = data.rvs.data
        }

        if (data.sprs && data.sprs.data) {
            sprs = data.sprs.data
        }

        if (data.jos && data.jos.data) {
            jos = data.jos.data
        }

        if (data.suppliers && data.suppliers.data) {
            suppliers = data.suppliers.data
        }

        return {
            meqs,
            employees,
            rvs,
            sprs,
            jos,
            suppliers,
        }

    } catch (error) {
        console.error(error);
        return {
            meqs: [],
            employees: [],
            rvs: [],
            sprs: [],
            jos: [],
            suppliers: [],
        }
    }
}

export async function findByMeqsNumber(meqsNumber: string): Promise<MEQS | undefined> {
    const query = `
        query {
            meq(meqs_number: "${meqsNumber}") {
                id
                meqs_number
                rv_number
                spr_number
                jo_number
                created_by
                status
                can_update
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                rv {
                    rv_number
                    canvass {
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
                        requested_by {
                            id
                            firstname
                            middlename
                            lastname
                        }
                    }
                }
                meqs_date
                meqs_approvers {
                    status
                }
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.meq) {
            return response.data.data.meq;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function findByReferenceNumber(payload: {
    rv_number?: string,
    jo_number?: string,
    spr_number?: string
}): Promise<MEQS | undefined> {

    const { rv_number, jo_number, spr_number } = payload;
    let searchField: string | undefined;

    if (rv_number) {
        searchField = 'rv_number';
    } else if (jo_number) {
        searchField = 'jo_number';
    } else if (spr_number) {
        searchField = 'spr_number';
    }

    const query = `
        query {
            meq(${searchField}: "${rv_number ?? jo_number ?? spr_number}") {
                id
                meqs_number
                rv_number
                spr_number
                jo_number
                created_by
                status
                can_update
                requested_by {
                    id
                    firstname
                    middlename
                    lastname
                }
                rv {
                    rv_number
                    canvass {
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
                        requested_by {
                            id
                            firstname
                            middlename
                            lastname
                        }
                    }
                }
                meqs_date
                meqs_approvers {
                    status
                }
                cancelled_at
            }
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.meq) {
            return response.data.data.meq;
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
        supplier_id: string | null,
        approval_status: APPROVAL_STATUS | null, 
    }): Promise<FindAllResponse> {

    const { page, pageSize, date_requested, requested_by_id, supplier_id, approval_status } = payload;

    let date_requested2 = null
    let requested_by_id2 = null
    let supplier_id2 = null
    let approval_status2 = null

    if (date_requested) {
        date_requested2 = `"${date_requested}"`
    }

    if (requested_by_id) {
        requested_by_id2 = `"${requested_by_id}"`
    }

    if (supplier_id) {
        supplier_id2 = `"${supplier_id}"`
    }

    if (approval_status) {
        approval_status2 = approval_status
    }

    const query = `
        query {
            meqs(
                page: ${page},
                pageSize: ${pageSize},
                date_requested: ${date_requested2},
                requested_by_id: ${requested_by_id2},
                supplier_id: ${supplier_id2},
                approval_status: ${approval_status2},
            ) {
                data {
                    id
                    meqs_number
                    rv_number
                    spr_number
                    jo_number
                    created_by
                    status
                    can_update
                    requested_by {
                        id
                        firstname
                        middlename
                        lastname
                    }
                    rv {
                        rv_number
                        canvass {
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
                            requested_by {
                                id
                                firstname
                                middlename
                                lastname
                            }
                        }
                    }
                    meqs_date
                    meqs_approvers {
                        status
                    }
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
        return response.data.data.meqs;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function findOne(id: string): Promise<MEQS | undefined> {

    let args = ''
    if(isValidRcNumber(id)){
        args = `meqs_number: "${id}"`
    } else {
        args = `id: "${id}"`
    }

    const query = `
        query {
            meq(${args}) {
                id
                meqs_number
                rv_number
                spr_number
                jo_number
                created_by
                notes
                can_update
                rv{
                    id
                    rv_number
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
                }
                jo{
                    id
                    jo_number
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
                }
                spr{
                    id
                    spr_number
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
                }
                meqs_date
                status
                cancelled_at
                meqs_approvers{
                    approver_id
                    approver{
                        firstname
                        lastname
                    }
                    label
                    order
                    status
                    notes
                    notes
                    date_approval
                }
                meqs_suppliers{
                    id
                    supplier_id
                    supplier{
                        name
                    }
                    payment_terms 
                    meqs_supplier_items{
                        canvass_item{
                            id
                            description
                            unit{
                                name
                            }
                            quantity
                        }
                        price
                        notes
                        is_awarded
                    }
                    attachments{
                        src
                    }
                }
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
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (response.data && response.data.data && response.data.data.meq) {
            return response.data.data.meq;
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);
        return undefined
    }
}

export async function fetchFormDataInCreate(): Promise<{
    rvs: RV[],
    sprs: SPR[],
    jos: JO[],
    suppliers: Supplier[],
    approvers: MeqsApproverSettings[],
    minimum_no_of_supplier: number,
    maximum_no_of_supplier: number,
}> {

    const query = `
        query {
            rvs(page: 1, pageSize: 10) {
                data{
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
                }
            },
            jos(page: 1, pageSize: 10) {
                data{
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
                }
            },
            sprs(page: 1, pageSize: 10) {
                data{
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
                }
            },
            suppliers(page: 1, pageSize: 10) {
                data {
                    id 
                    name
                    address
                    is_vat_registered
                    vat_type
                }
            },
            meqsApproverSettings{
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
            minimum_no_of_supplier_in_meqs,
            maximum_no_of_supplier_in_meqs,
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let rvs = []
        let jos = []
        let sprs = []
        let suppliers = []
        let approvers = []
        let minimum_no_of_supplier = 3
        let maximum_no_of_supplier = 5

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (data.rvs && data.rvs.data) {
            rvs = response.data.data.rvs.data
        }

        if (data.jos && data.jos.data) {
            jos = response.data.data.jos.data
        }

        if (data.sprs && data.sprs.data) {
            sprs = response.data.data.sprs.data
        }

        if (data.suppliers && data.suppliers.data) {
            suppliers = response.data.data.suppliers.data
        }

        if (data.meqsApproverSettings) {
            approvers = data.meqsApproverSettings
        }

        if(data.minimum_no_of_supplier_in_meqs) {
            minimum_no_of_supplier = data.minimum_no_of_supplier_in_meqs
        }

        if(data.maximum_no_of_supplier_in_meqs) {
            maximum_no_of_supplier = data.maximum_no_of_supplier_in_meqs
        }

        return {
            rvs,
            jos,
            sprs,
            suppliers,
            approvers,
            minimum_no_of_supplier,
            maximum_no_of_supplier
        }

    } catch (error) {
        console.error(error);
        return {
            rvs: [],
            jos: [],
            sprs: [],
            suppliers: [],
            approvers: [],
            minimum_no_of_supplier: 3,
            maximum_no_of_supplier: 5,
        }
    }


}

export async function fetchFormDataInUpdate(id: string): Promise<{
    employees: Employee[],
    suppliers: Supplier[],
    meqs: MEQS | undefined,
    minimum_no_of_supplier: number,
    maximum_no_of_supplier: number,
}> {

    const query = `
        query {
            meq(id: "${id}") {
                id 
                meqs_number 
                meqs_date
                cancelled_at
                notes
                created_by
                can_update
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
                }
                meqs_approvers {
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
                meqs_suppliers {
                    id
                    payment_terms 
                    supplier {
                        id 
                        name 
                        address
                        is_vat_registered
                        vat_type
                    }
                    attachments {
                        id 
                        src
                        filename
                    }
                    meqs_supplier_items {
                        id 
                        price 
                        notes 
                        is_awarded 
                        vat_type
                        canvass_item {
                            id 
                            unit {
                                id 
                                name 
                            }
                            item {
                                id
                                code 
                                description
                            }
                            description
                            quantity
                        }
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
            suppliers(page: 1, pageSize: 10) {
                data {
                    id 
                    name
                    address
                    is_vat_registered
                    vat_type
                }
            },
            minimum_no_of_supplier_in_meqs,
            maximum_no_of_supplier_in_meqs,
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        let employees: Employee[] = []
        let suppliers: Supplier[] = []
        let minimum_no_of_supplier = 3
        let maximum_no_of_supplier = 5

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        const data = response.data.data

        if (!data.meq) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        if (data.employees && data.employees.data) {
            employees = response.data.data.employees.data
        }

        if (data.suppliers && data.suppliers.data) {
            suppliers = response.data.data.suppliers.data
        }

        if(data.minimum_no_of_supplier_in_meqs) {
            minimum_no_of_supplier = data.minimum_no_of_supplier_in_meqs
        }

        if(data.maximum_no_of_supplier_in_meqs) {
            maximum_no_of_supplier = data.maximum_no_of_supplier_in_meqs
        }

        return {
            meqs: data.meq,
            employees,
            suppliers,
            minimum_no_of_supplier,
            maximum_no_of_supplier
        }

    } catch (error) {
        console.error(error);
        return {
            meqs: undefined,
            employees: [],
            suppliers: [],
            minimum_no_of_supplier: 3,
            maximum_no_of_supplier: 5,
        }
    }


}

export async function uploadAttachments(attachments: any[], apiUrl: string): Promise<string[] | null> {

    console.log('uploadAttachments', attachments)

    const images = attachments.map(i => i.file)

    console.log('images', images)

    const formData = new FormData();

    for (let img of images) {
        formData.append('files', img)
    }

    const fileUploadApi = apiUrl + '/api/v1/file-upload/warehouse/meqs/multiple'

    try {
        const response = await axios.post(fileUploadApi, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('response', response.data);

        if (response.data && response.data.success && response.data.data) {
            return response.data.data as string[]
        }

        return null

    } catch (error) {
        console.error('Error uploading images:', error);
        return null
    }

}

export async function uploadSingleAttachment(attachment: any, apiUrl: string): Promise<string | null> {

    console.log('uploadSingleAttachment', attachment)

    const image = attachment.file

    console.log('image', image)

    const formData = new FormData();

    formData.append('file', image)

    const fileUploadApi = apiUrl + '/api/v1/file-upload/warehouse/meqs/single'

    try {
        const response = await axios.post(fileUploadApi, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('response', response.data);

        if (response.data && response.data.success && response.data.data) {
            return response.data.data as string
        }

        return null

    } catch (error) {
        console.error('Error uploading images:', error);
        return null
    }

}

export async function create(input: CreateMeqsInput): Promise<MutationResponse> {

    let jo_id = null
    let rv_id = null
    let spr_id = null

    if (input.rv) {
        rv_id = `"${input.rv.id}"`
    } else if (input.jo) {
        jo_id = `"${input.jo.id}"`
    } else if (input.spr) {
        spr_id = `"${input.spr.id}"`
    }

    const approvers = input.approvers.map(item => {

        return `
        {
          approver_id: "${item.approver?.id}"
          label: "${item.label}"
          order: ${item.order}
        }`;
    }).join(', ');

    const meqs_suppliers = input.meqs_suppliers.map(meqSupplier => {

        const meqs_supplier_items = meqSupplier.meqs_supplier_items.map(item => {

            if (!item.notes) {
                item.notes = ''
            }

            return `
            {
              canvass_item_id: "${item.canvass_item.id}"
              price: ${item.price}
              notes: "${item.notes.replace(/\n/g, '\\n')}"
              is_awarded: ${item.is_awarded}
              vat_type: ${item.vat!.value}
            }`;
        }).join(', ');

        const attachments = meqSupplier.attachments.map(attachment => {
            return `
            {
              src: "${attachment.src}"
              filename: "${attachment.filename}"
            }`;
        })

        return `
        {
          supplier_id: "${meqSupplier.supplier?.id}"
          payment_terms: "${meqSupplier.payment_terms}"
          meqs_supplier_items: [${meqs_supplier_items}]
          attachments: [${attachments}]
        }`;
    }).join(', ');

    const mutation = `
        mutation {
            createMeqs(
                input: {
                    rv_id: ${rv_id}
                    jo_id: ${jo_id}
                    spr_id: ${spr_id}
                    notes: "${input.notes}"
                    approvers: [${approvers}]
                    meqs_suppliers: [${meqs_suppliers}]
                }
            ) {
                id
            }
        }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.createMeqs) {
            return {
                success: true,
                msg: 'MEQS created successfully!',
                data: response.data.data.createMeqs
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to create MEQS. Please contact system administrator'
        };
    }

}

export async function update(id: string, input: UpdateMeqsInput): Promise<MutationResponse> {


    const mutation = `
        mutation {
            updateMeqs(
                id: "${id}",
                input: {
                    notes: "${input.notes}"
                }
            ) {
                id
            }
    }`;

    try {
        const response = await sendRequest(mutation);
        console.log('response', response);

        if (response.data && response.data.data && response.data.data.updateMeqs) {
            return {
                success: true,
                msg: 'MEQS updated successfully!',
                data: response.data.data.updateMeqs
            };
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to update MEQS. Please contact system administrator'
        };
    }
}

export async function cancel(id: string): Promise<CancelResponse> {

    const mutation = `
        mutation {
            cancelMeqs(
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

        if (response.data && response.data.data && response.data.data.cancelMeqs) {
            return response.data.data.cancelMeqs
        }

        throw new Error(JSON.stringify(response.data.errors));

    } catch (error) {
        console.error(error);

        return {
            success: false,
            msg: 'Failed to cancel MEQS. Please contact system administrator'
        };
    }
}

export async function fetchMeqsNumbers(payload: string): Promise<MEQS[]> {
    const query = `
        query {
            meqs_by_meqs_number(meqs_number: "${payload}") {
                meqs_number
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.meqs_by_meqs_number

    } catch (error) {
        console.error(error);
        return []
    }
}


export async function fetchMeqsByMeqsNumber(payload: string): Promise<MEQS[]> {
    const query = `
        query {
            meqs_by_meqs_number(meqs_number: "${payload}", is_detail_included: true) {
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
            },
        }
    `;

    try {
        const response = await sendRequest(query);
        console.log('response', response)

        if (!response.data || !response.data.data) {
            throw new Error(JSON.stringify(response.data.errors));
        }
        return response.data.data.meqs_by_meqs_number

    } catch (error) {
        console.error(error);
        return []
    }
}