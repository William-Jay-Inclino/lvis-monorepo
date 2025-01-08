import { expect, Locator, Page } from '@playwright/test'
import * as x from '../../shared/utils'
import { McrtData } from './mcrt.types'


export const goto_create_mcrt_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'mcrt-menu' })
    await x.click({ page, test_id: 'create-mcrt' })

    await expect(page).toHaveURL(`${url}/warehouse/mcrt/create`, { timeout: 5000 });
    
}

export const goto_mcrt_view_page = async(payload: { page: Page, url: string, mcrt_number: string }) => {

    const { page, url, mcrt_number } = payload

    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'mcrt-menu' })
    
    await x.custom_select({
        page,
        test_id: 'search-mcrt-number',
        value: mcrt_number
    })
    
    await x.click({ page, test_id: 'search' })
    await x.click({ page, test_id: `view-details-${mcrt_number}` })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mcrt/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });
    
}

export const verify_items_to_be_transacted = async(payload: { page: Page, url: string, mcrt_number: string }) => {

    const { page, url, mcrt_number } = payload

    await page.waitForSelector('[data-test="item-link"]', { timeout: 5000 });

    const items = await x.get_elements_by_selector({ page, selector: '[data-test="item-link"]' })

    console.log('items', items);

    for(let item of items) {

        await x.click({ page, element: item })

        const dynamicUrlPattern = new RegExp(`${url}/warehouse/item/view/[a-zA-Z0-9-]+`)
        await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

        await expect(page.getByTestId(`mcrt-${ mcrt_number }`)).toBeVisible();

        await x.go_back({ page })

    }

}

export const create_mcrt = async(payload: { page: Page, data: McrtData, url: string }): Promise<{ mcrt_number: string }> => {

    const { page, data, url } = payload 

    await x.custom_select({
        page,
        test_id: 'mct-number',
        value: data.mct_number,
    })

    await x.input({
        page,
        test_id: 'note',
        value: data.note
    })

    await x.custom_select({
        page,
        test_id: 'returned-by',
        value: data.mct_number,
    })

    for(const [indx, approver] of data.approvers.entries()) {

        await x.custom_select({
            page,
            test_id: `approver-${ indx }`,
            value: approver,
        })
    }

    await x.click({ page, test_id: 'next' })

    // input qty on each item
    const item_qty_inputs = await x.get_elements_by_selector({ page, selector: '[data-test="item-qty"]' })
    await input_qty({ inputs: item_qty_inputs })

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mcrt/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const mcrt_number = await x.getText({ page, test_id: 'mcrt-number' })

    return { mcrt_number }

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