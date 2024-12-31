import { expect, Page } from '@playwright/test'
import * as x from '../../shared/utils'
import { PoData } from './po.types'


export const goto_create_po_page = async(payload: {page: Page, url: string}) => {

    const { page, url } = payload

    await x.click({ page, test_id: 'purchasing' })
    await x.click({ page, test_id: 'po-menu' })
    await x.click({ page, test_id: 'create-po' })

    await expect(page).toHaveURL(`${url}/purchase/po/create`, { timeout: 5000 });
    
}


export const create_pos = async(
    payload: { 
        page: Page, 
        data: PoData, 
        url: string,
    }): Promise<{ po_numbers: string[] }> => {
    
    const { page, data, url } = payload

    const po_numbers = []

    for(let supplier_name of data.supplier_names) {

        const po = await create_po({ page, url, supplier_name, meqs_number: data.meqs_number }) 

        po_numbers.push(po.po_number)

        await x.click({ page, test_id: 'add-new-po' })
    }

    return { po_numbers }

}


export const create_po = async(
    payload: { 
        page: Page, 
        url: string,
        meqs_number: string,
        supplier_name: string
    }): Promise<{ po_number: string }> => {
    
    const { page, supplier_name, meqs_number, url } = payload
    
    await x.custom_select({
        page,
        test_id: 'meqs-number',
        value: meqs_number
    })

    await x.custom_select({
        page,
        test_id: 'supplier',
        value: supplier_name
    }) 

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/purchase/po/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    await x.toContainText({ page, test_id: 'po-info', value: 'PO Info' })

    const po_number = await x.getText({ page, test_id: 'po-number' })

    return { po_number }

}