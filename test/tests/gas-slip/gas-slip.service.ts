import { expect, Locator, Page } from '@playwright/test'
import * as x from '../../shared/utils'
import { GasSlipData } from './gas-slip.types'


export const goto_create_gas_slip_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'motorpool' })
    await x.click({ page, test_id: 'gas-slip-menu' })
    await x.click({ page, test_id: 'create-gas-slip' })

    await expect(page).toHaveURL(`${url}/motorpool/gas-slip/create`, { timeout: 5000 });
    
}

export const goto_gas_slip_view_page = async(payload: { page: Page, url: string, gas_slip_number: string }) => {

    const { page, url, gas_slip_number } = payload

    await x.click({ page, test_id: 'motorpool' })
    await x.click({ page, test_id: 'gas-slip-menu' })
    
    await x.custom_select({
        page,
        test_id: 'search-gas-slip-number',
        value: gas_slip_number
    })
    
    await x.click({ page, test_id: 'search' })
    await x.click({ page, test_id: `view-details-${gas_slip_number}` })

    const dynamicUrlPattern = new RegExp(`${url}/motorpool/gas-slip/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });
    
}

export const create_gas_slip = async(payload: { page: Page, data: GasSlipData, url: string }): Promise<{ gas_slip_number: string }> => {

    const { page, data, url } = payload 

    console.log('data', data);

    await x.custom_select({
        page,
        test_id: 'vehicle',
        value: data.vehicle,
    })

    await x.input({
        page,
        test_id: 'date',
        value: data.date,
    })

    await x.custom_select({
        page,
        test_id: 'requisitioner',
        value: data.requisitioner,
    })

    await x.custom_select({
        page,
        test_id: 'driver',
        value: data.driver,
    })

    await x.custom_select({
        page,
        test_id: 'gas-station',
        value: data.gas_station,
    })

    await x.custom_select({
        page,
        test_id: 'fuel-type',
        value: data.fuel_type,
    })

    await x.input({
        page,
        test_id: 'no-of-liters',
        value: data.no_of_liters,
    })

    await x.input({
        page,
        test_id: 'purpose',
        value: data.purpose,
    })

    for(const [indx, approver] of data.approvers.entries()) {

        await x.custom_select({
            page,
            test_id: `approver-${ indx }`,
            value: approver,
        })
    }

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/motorpool/gas-slip/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const gas_slip_number = await x.getText({ page, test_id: 'gas-slip-number' })

    return { gas_slip_number }

}

export const add_items = async(payload: { page: Page, btns: Locator[] }) => {

    const { page, btns } = payload 
    
    let ctr = 0

    for(let btn of btns) {

        if(ctr === 1) break 

        await x.click({ page, element: btn})
        ctr++

    }

    await x.click({ page, test_id: 'close-modal' })

}

export const input_qty = async(payload: { inputs: Locator[] }) => {

    const { inputs } = payload 
    
    for(let input of inputs) {

        await x.fill({ element: input, value: '1' })

    }

}