import { expect, Locator, Page } from '@playwright/test'
import * as x from '../../shared/utils'
import { MstData } from './mst.types'


export const goto_create_mst_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'mst-menu' })
    await x.click({ page, test_id: 'create-mst' })

    await expect(page).toHaveURL(`${url}/warehouse/mst/create`, { timeout: 5000 });
    
}


export const goto_mst_view_page = async(payload: { page: Page, url: string, mst_number: string }) => {

    const { page, url, mst_number } = payload

    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'mst-menu' })
    
    await x.custom_select({
        page,
        test_id: 'search-mst-number',
        value: mst_number
    })
    
    await x.click({ page, test_id: 'search' })
    await x.click({ page, test_id: `view-details-${mst_number}` })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mst/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });
    
}

export const verify_items_to_be_transacted = async(payload: { page: Page, url: string, mst_number: string }) => {

    const { page, url, mst_number } = payload

    await page.waitForSelector('[data-test="item-link"]', { timeout: 5000 });

    const items = await x.get_elements_by_selector({ page, selector: '[data-test="item-link"]' })

    console.log('items', items);

    for(let item of items) {

        await x.click({ page, element: item })

        const dynamicUrlPattern = new RegExp(`${url}/warehouse/item/view/[a-zA-Z0-9-]+`)
        await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

        await expect(page.getByTestId(`mst-${ mst_number }`)).toBeVisible();

        await x.go_back({ page })

    }

}

export const create_mst = async(payload: { page: Page, data: MstData, url: string, item_code: string }): Promise<{ mst_number: string }> => {

    const { page, data, url, item_code } = payload 
    
    await x.input({
        page,
        test_id: 'remarks',
        value: data.remarks,
    })

    await x.custom_select({
        page,
        test_id: 'returned-by',
        value: data.returned_by,
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

    // input status on each item
    const item_status_inputs = await x.get_elements_by_selector({ page, selector: '[data-test="item-status"]' })
    await input_status({ inputs: item_status_inputs, page })

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mst/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const mst_number = await x.getText({ page, test_id: 'mst-number' })

    return { mst_number }

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


export const input_status = async(payload: { inputs: Locator[], page: Page }) => {

    const { inputs, page } = payload 
    
    for(let input of inputs) {

        await x.select({
            page,
            el: input,
            value: "1",
        })

    }

}