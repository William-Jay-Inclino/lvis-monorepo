import { expect, Locator, Page } from '@playwright/test'
import * as x from '../../shared/utils'
import { MrvData } from './mrv.types'


export const goto_create_mrv_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'mrv-menu' })
    await x.click({ page, test_id: 'create-mrv' })

    await expect(page).toHaveURL(`${url}/warehouse/mrv/create`, { timeout: 5000 });
    
}

export const create_mrv = async(payload: { page: Page, data: MrvData, url: string, item_code: string }): Promise<{ mrv_number: string }> => {

    const { page, data, url, item_code } = payload 

    await x.custom_select({
        page,
        test_id: 'request-type',
        value: data.request_type,
    })

    await x.input({
        page,
        test_id: 'consumer-name',
        value: data.consumer_name,
    })

    await x.input({
        page,
        test_id: 'location',
        value: data.location,
    })

    await x.input({
        page,
        test_id: 'purpose',
        value: data.purpose,
    })

    await x.custom_select({
        page,
        test_id: 'requested-by',
        value: data.requested_by,
    })

    await x.custom_select({
        page,
        test_id: 'withdrawn-by',
        value: data.withdrawn_by,
    })

    for(const [indx, approver] of data.approvers.entries()) {

        await x.custom_select({
            page,
            test_id: `approver-${ indx }`,
            value: approver,
        })
    }

    await x.click({ page, test_id: 'next' })
    await x.click({ page, test_id: 'add-item' })

    await x.input({ page, test_id: 'search-input', value: item_code })

    // add modal items
    const add_item_btns = await x.get_elements_by_selector({ page, selector: '[data-test="modal-add-item-btn"]' })
    await add_items({ page, btns: add_item_btns })

    await x.close_all_toasts({ page });

    // input qty on each item
    const item_qty_inputs = await x.get_elements_by_selector({ page, selector: '[data-test="item-qty"]' })
    await input_qty({ inputs: item_qty_inputs })

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mrv/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const mrv_number = await x.getText({ page, test_id: 'mrv-number' })

    return { mrv_number }

}

export const add_items = async(payload: { page: Page, btns: Locator[] }) => {

    const { page, btns } = payload 
    
    let ctr = 0

    for(let btn of btns) {

        if(ctr === 1) break 

        await x.click({ page, element: btn})
        ctr++

    }

    await x.click({ page, test_id: 'close-modal' })

}


export const input_qty = async(payload: { inputs: Locator[] }) => {

    const { inputs } = payload 
    
    for(let input of inputs) {

        await x.fill({ element: input, value: '1' })

    }

}