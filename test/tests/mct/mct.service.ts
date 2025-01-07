import { expect, Page } from '@playwright/test'
import * as x from '../../shared/utils'
import { MctData } from './mct.types'


export const goto_create_mct_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'mct-menu' })
    await x.click({ page, test_id: 'create-mct' })

    await expect(page).toHaveURL(`${url}/warehouse/mct/create`, { timeout: 5000 });
    
}

export const click_mrv_number_link = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload

    await x.click({ page, test_id: 'mrv-number' })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mrv/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });
    
}

export const goto_mct_view_page = async(payload: { page: Page, url: string, mct_number: string }) => {

    const { page, url, mct_number } = payload

    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'warehouse-dropdown' })
    await x.click({ page, test_id: 'mct-menu' })
    
    await x.custom_select({
        page,
        test_id: 'search-mct-number',
        value: mct_number
    })
    
    await x.click({ page, test_id: 'search' })
    await x.click({ page, test_id: `view-details-${mct_number}` })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mct/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });
    
}

export const verify_items_to_be_transacted = async(payload: { page: Page, url: string, mct_number: string }) => {

    const { page, url, mct_number } = payload

    await page.waitForSelector('[data-test="item-link"]', { timeout: 5000 });

    const items = await x.get_elements_by_selector({ page, selector: '[data-test="item-link"]' })

    console.log('items', items);

    for(let item of items) {

        await x.click({ page, element: item })

        const dynamicUrlPattern = new RegExp(`${url}/warehouse/item/view/[a-zA-Z0-9-]+`)
        await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

        await expect(page.getByTestId(`mct-${ mct_number }`)).toBeVisible();

        await x.go_back({ page })

    }

}

export const create_mct = async(payload: { page: Page, data: MctData, url: string }): Promise<{ mct_number: string }> => {

    const { page, data, url } = payload 

    await x.custom_select({
        page,
        test_id: 'mrv-number',
        value: data.mrv_number,
    })

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/mct/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const mct_number = await x.getText({ page, test_id: 'mct-number' })

    return { mct_number }

}