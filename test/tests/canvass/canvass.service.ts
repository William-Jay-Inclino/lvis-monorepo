import { expect, Page } from "@playwright/test";
import * as x from '../../shared/utils'
import { CanvassData } from "./canvass.types";

export const goto_create_canvass_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'purchasing' })
    await x.click({ page, test_id: 'canvass-menu' })
    await x.click({ page, test_id: 'create-canvass' })

    await expect(page).toHaveURL(`${url}/purchase/canvass/create`, { timeout: 5000 });
    
}

export const create_canvass = async(payload: { page: Page, data: CanvassData, url: string }): Promise<{ rc_number: string }> => {
    const { page, data, url } = payload

    await x.custom_select({
        page,
        test_id: 'requisitioner',
        value: data.requisitioner
    })

    await x.input({
        page,
        test_id: 'purpose',
        value: data.purpose,
    })

    await x.input({
        page,
        test_id: 'notes',
        value: data.notes,
    })

    await x.click({ page, test_id: 'next' })
    
    
    for(let item of data.items) {
        await x.click({ page, test_id: 'add-item' })

        await x.input({
            page,
            test_id: 'description',
            value: item.description || 'test item',
        })

        await x.custom_select({
            page,
            test_id: 'unit',
            value: item.unit || 'pcs',
        })

        await x.input({
            page,
            test_id: 'quantity',
            value: item.quantity.toString(),
        })

        await x.click({ page, test_id: 'modal-add-item' })
    }

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/purchase/canvass/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const rc_number = await x.getText({ page, test_id: 'rc-number' })

    return { rc_number }

}