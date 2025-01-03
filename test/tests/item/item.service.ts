import { expect, Page } from "@playwright/test"
import * as x from '../../shared/utils'
import { Item } from "./item.types"



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