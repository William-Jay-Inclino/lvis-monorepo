
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

export const approve_notifications = async(payload: { page: Page, ref_number: string, db_entity: DB_ENTITY }) => {
    const { page, ref_number, db_entity } = payload

    await x.click({ page, test_id: 'notification' })

    await x.click({ page, test_id: `test-${db_entity}-${ref_number}` })

    await x.click_if_exists({
        page,
        selector: '.swal2-popup .swal2-confirm' 
      });

}