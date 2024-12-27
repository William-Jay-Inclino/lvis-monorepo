import { expect, Page } from "@playwright/test";
import * as x from '../../shared/utils'
import { CanvassData } from "./canvass.types";
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.TEST_URL;

export const goto_create_canvass_page = async(payload: {page: Page}) => {

    const { page } = payload


    await x.click({ page, test_id: 'purchasing' })
    await x.click({ page, test_id: 'canvass-menu' })
    await x.click({ page, test_id: 'canvass-menu' })
    await x.click({ page, test_id: 'create-canvass' })

    await expect(page).toHaveURL(`${url}/purchase/canvass/create`, { timeout: 5000 });
    
}

export const create_canvass = async(payload: { page: Page, data: CanvassData }) => {
    const { page, data } = payload

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

    // click ok on success msg SWAL
    await x.click_if_exists({
        page,
        selector: '.swal2-confirm.swal2-styled',
    });

    await x.toContainText({ page, test_id: 'canvass-info', value: 'Canvass Info' })

}