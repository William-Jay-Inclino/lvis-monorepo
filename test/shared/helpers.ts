
import { expect, Page } from '@playwright/test'
import * as x from './utils'
import { DB_ENTITY } from '../tests/rv'

export const login = async(payload: { page: Page, username: string, password: string, url: string }) => {
    
    const { page, username, password, url } = payload

    await x.goto({ page, url })

    await x.input({
        page,
        test_id: 'username',
        value: username
    })

    await x.input({
        page,
        test_id: 'password',
        value: password
    })

    await x.click({ page, test_id: 'login' })

    await expect(page).toHaveURL(`${url}/home`, { timeout: 5000 });
}


export const logout = async(payload: { page: Page, url: string }) => {
    
    const { page, url } = payload

    await x.click({ page, test_id: 'username-dropdown' })
    await x.click({ page, test_id: 'logout' })

    await expect(page).toHaveURL(`${url}`, { timeout: 5000 });
}

export const approve_signatory = async(payload: { page: Page, ref_number: string, db_entity: DB_ENTITY, popup: 'swal' | 'modal' }) => {
    const { page, ref_number, db_entity, popup } = payload

    // click notification icon
    await x.click({ page, test_id: 'notification' })

    // approve the item in the table
    await x.click({ page, test_id: `test-${db_entity}-${ref_number}` })

    if(popup === 'modal') {
        await x.custom_select({ page, test_id: 'classification' })
        await x.click({ page, test_id: 'approve' })
    }

    // close swal is a loop. It wil always click ok or confirm
    await x.close_swal({ page })


}