import { expect, Page } from "@playwright/test"
import * as x from '../../shared/utils'
import { RrData } from "./rr.types"
import { generate_invoice_number } from "../../shared/helpers"



export const goto_create_rr_page = async(payload: {page: Page, url: string}) => {

    const { page, url } = payload

    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'rr-menu' })
    await x.click({ page, test_id: 'create-rr' })

    await expect(page).toHaveURL(`${url}/warehouse/rr/create`, { timeout: 5000 });
    
}

export const create_rrs = async(
    payload: { 
        page: Page, 
        data: RrData, 
        url: string,
        po_numbers: string[],
    }): Promise<{ rr_numbers: string[] }> => {
    
    const { page, data, url, po_numbers } = payload

    const rr_numbers = []

    for(let po_number of po_numbers) {

        data.po_number = po_number
        data.invoice = generate_invoice_number()
        const rr = await create_rr({ page, url, data }) 

        rr_numbers.push(rr.rr_number)

        await x.click({ page, test_id: 'add-new-rr' })
    }

    return { rr_numbers }

}


export const create_rr = async(
    payload: { 
        page: Page, 
        url: string,
        data: RrData,
    }): Promise<{ rr_number: string }> => {
    
    const { page, url, data } = payload

    await x.custom_select({
        page,
        test_id: 'po-number',
        value: data.po_number
    })

    await x.input({
        page,
        test_id: 'invoice',
        value: data.invoice
    })

    await x.custom_select({
        page,
        test_id: 'received-by',
        value: data.received_by
    }) 

    await x.click({ page, test_id: 'next' })

    const qty_accepted_items = await x.get_elements_by_selector({ page, selector: '[data-test="qty-accepted"]' })

    for(let item of qty_accepted_items) {
        await x.fill({ element: item, value: '1' })
    }

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/rr/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const rr_number = await x.getText({ page, test_id: 'rr-number' })

    return { rr_number }

}