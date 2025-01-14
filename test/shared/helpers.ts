
import { expect, Page } from '@playwright/test'
import * as x from './utils'
import { DB_ENTITY } from './enums'
import { Approver } from './types'

export const login = async(payload: { page: Page, username: string, password: string, url: string }) => {
    
    const { page, username, password, url } = payload

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

    await expect(page).toHaveURL(`${url}/home`, { timeout: 10000 });
}

export const logout = async(payload: { page: Page, url: string }) => {
    
    const { page, url } = payload

    await x.click({ page, test_id: 'username-dropdown' })
    await x.click({ page, test_id: 'logout' })

    await expect(page).toHaveURL(`${url}`, { timeout: 5000 });
}

export const approve_signatory = async(
    payload: { 
        page: Page, 
        ref_number: string, 
        db_entity: DB_ENTITY, 
        popup: 'swal' | 'modal',
        dropdown_testid?: string, 
        url: string,
    }) => {
    const { page, ref_number, db_entity, popup, dropdown_testid, url } = payload
    
    // click notification icon
    await x.click({ page, test_id: 'notification' })

    await expect(page).toHaveURL(`${url}/notifications`, { timeout: 5000 });

    // approve the item in the table

    if(await x.is_visible({ page, selector: `[data-testid="view-${db_entity}-${ref_number}"]` })) {
        await x.click({ page, test_id: `view-${db_entity}-${ref_number}` })
    } else {
        await x.click({ page, test_id: `view2-${db_entity}-${ref_number}` })
    }

    if(dropdown_testid) {
        console.log('dropdown_testid', dropdown_testid);
        await x.custom_select({ page, test_id: dropdown_testid })
    }

    await x.click({ page, test_id: 'approve' })

    // close popup is a loop. It wil always click ok or confirm
    await x.close_popup({ page })

}

export const approve_signatories = async(
    payload: { 
        page: Page,
        url: string,
        approvers: Approver[],
        ref_number: string, 
        db_entity: DB_ENTITY, 
    }) => {

    const { page, url, approvers, ref_number, db_entity } = payload

    for(let approver of approvers) {

        const username = approver.username
        const password = approver.password

        await login({ page, url, username, password })

        let dropdown_testid = undefined

        if(approver.is_budget_officer) {
            dropdown_testid = 'classification'
        } else if(approver.is_finance_manager) {
            dropdown_testid = 'fund-source'
        }

        await approve_signatory({
            page,
            ref_number: ref_number,
            db_entity: db_entity,
            popup: approver.popup,
            dropdown_testid,
            url,
        })

        await logout({ page, url })
    }

}

export const generate_invoice_number = (): string => {
    const prefix = "INV";
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Format: YYYYMMDD
    const randomPart = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${prefix}-${datePart}-${randomPart}`;
};

export const verify_status = async(payload: { page: Page, status: string }) => {

    console.log('verify_status');

    const { page, status } = payload

    const txt = await x.getText({ page, test_id: 'status' })

    console.log('txt', txt);

    expect(txt.trim()).toBe(status)
    
}