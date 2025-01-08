import { expect, Locator, Page } from "@playwright/test"
import * as x from '../../shared/utils'
import { Item } from "./item.types"



export const goto_search_item_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'data-management-dropdown' })
    await x.click({ page, test_id: 'item-menu' })

    await expect(page).toHaveURL(`${url}/warehouse/item`, { timeout: 5000 });
    
}

export const goto_create_item_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload

    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'data-management-dropdown' })
    await x.click({ page, test_id: 'item-menu' })
    await x.click({ page, test_id: 'create-item' })

    await expect(page).toHaveURL(`${url}/warehouse/item/create`, { timeout: 5000 });
    
}

export const create_item = async(payload: { page: Page, data: Item, url: string }): Promise<{ item_code: string }> => {
    const { page, data, url } = payload

    await x.input({
        page,
        test_id: 'description',
        value: data.description,
    })

    await x.input({
        page,
        test_id: 'initial-qty',
        value: data.initial_qty.toString(),
    })

    await x.input({
        page,
        test_id: 'initial-price',
        value: data.initial_price.toString(),
    })
    
    await x.custom_select({
        page,
        test_id: 'unit',
        value: data.unit
    })

    await x.custom_select({
        page,
        test_id: 'item-type',
        value: data.item_type
    })

    if(data.project) {
        await x.custom_select({
            page,
            test_id: 'project',
            value: data.project
        })
    }

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/warehouse/item/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const item_code = await x.getText({ page, test_id: 'item-code' })

    return { item_code }

}

export const expect_salvaged_item_created = async(payload: { page: Page, item_desc: string }) => {

    const { page, item_desc } = payload

    await x.input({
        page,
        test_id: 'search-item-desc',
        value: item_desc
    })

    await x.click({ page, test_id: 'search' })
    
    const item_desc_tds = await x.get_elements_by_selector({ page, selector: `[data-test="test-${item_desc}"]` })

    expect(item_desc_tds.length).toBeGreaterThan(1);

    let containsSU = false;
    for (let el of item_desc_tds) {
        const text = await x.getText({ page, el });
        console.log('text', text);
        if (text.includes('SU')) {
            containsSU = true;
            break; // Exit the loop as soon as we find an element with 'SU'
        }
    }

    console.log('containsSU', containsSU);

    // Assert that at least one <td> contains "SU"
    expect(containsSU).toBe(true);

}