import { expect, Page } from "@playwright/test"
import { RvData } from "./rv.types"
import * as x from '../../shared/utils'

export const goto_create_rv_page = async(payload: {page: Page, url: string}) => {

    const { page, url } = payload

    await x.click({ page, test_id: 'rv-menu' })
    await x.click({ page, test_id: 'create-rv' })

    await expect(page).toHaveURL(`${url}/purchase/rv/create`, { timeout: 5000 });
    
}

export const create_rv = async(payload: { page: Page, data: RvData, url: string }): Promise<{ rv_number: string }> => {
    const { page, data, url } = payload

    await x.custom_select({
        page,
        test_id: 'rc-number',
        value: data.rc_number
    })

    await x.custom_select({
        page,
        test_id: 'supervisor',
        value: data.supervisor
    })

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/purchase/rv/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const rv_number = await x.getText({ page, test_id: 'rv-number' })

    return { rv_number }

}