import { expect, Page } from "@playwright/test";
import * as x from '../../shared/utils'
import { OsrivData } from "./osriv.types";


export const goto_create_osriv_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'warehouse' })
    await x.click({ page, test_id: 'osriv-menu' })
    await x.click({ page, test_id: 'create-osriv' })

    await expect(page).toHaveURL(`${url}/warehouse/osriv/create`, { timeout: 5000 });
    
}


export const create_osriv = async(payload: { page: Page, data: OsrivData, url: string }): Promise<{ osriv_number: string }> => {

    const { page, data, url } = payload 

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

    for(const [indx, approver] of data.approvers.entries()) {

        await x.custom_select({
            page,
            test_id: `approver-${ indx }`,
            value: approver,
        })
    }

    await x.click({ page, test_id: 'next' })
    await x.click({ page, test_id: 'add-item' })

    return { osriv_number: '' }

    // await x.click({ page, test_id: 'save' })

    // const dynamicUrlPattern = new RegExp(`${url}/purchase/canvass/view/[a-zA-Z0-9-]+`)
    // await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    // await x.close_popup({ page })

    // const rc_number = await x.getText({ page, test_id: 'rc-number' })

    // return { rc_number }

}