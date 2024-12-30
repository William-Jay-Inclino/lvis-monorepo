import { expect, Page } from '@playwright/test'
import * as x from '../../shared/utils'
import { PoData } from './po.types'
import { AwardedSupplier } from '../meqs'


export const goto_create_po_page = async(payload: {page: Page, url: string}) => {

    const { page, url } = payload

    await x.click({ page, test_id: 'purchasing' })
    await x.click({ page, test_id: 'meqs-menu' })
    await x.click({ page, test_id: 'create-meqs' })

    await expect(page).toHaveURL(`${url}/purchase/po/create`, { timeout: 5000 });
    
}


export const create_pos = async(
    payload: { 
        page: Page, 
        data: PoData, 
        url: string,
        awarded_suppliers: AwardedSupplier[], 
    }): Promise<{ po_number: string }> => {
    
    const { page, data, url, awarded_suppliers } = payload


    return { po_number: '' }

}