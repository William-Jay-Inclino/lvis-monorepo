import { expect, Locator, Page } from "@playwright/test";
import * as x from '../../shared/utils'
import { MeqsData, MeqsSupplier } from "./meqs.types";



export const goto_create_meqs_page = async(payload: {page: Page, url: string}) => {

    const { page, url } = payload

    await x.click({ page, test_id: 'purchasing' })
    await x.click({ page, test_id: 'meqs-menu' })
    await x.click({ page, test_id: 'create-meqs' })

    await expect(page).toHaveURL(`${url}/purchase/meqs/create`, { timeout: 5000 });
    
}


export const create_meqs = async(
    payload: { 
        page: Page, 
        data: MeqsData, 
        url: string,
        total_canvass_items: number, 
    }): Promise<{ meqs_number: string, awarded_suppliers: string[] }> => {
    
        const { page, data, url, total_canvass_items } = payload

    await x.custom_select({
        page,
        test_id: 'rv-number',
        value: data.rv_number
    })

    await x.click({ page, test_id: 'step1-next' })
    
    await add_suppliers({ page, suppliers: data.suppliers })
    
    await x.click({ page, test_id: 'step2-next' })
    
    await award_items({ page, suppliers: data.suppliers, total_canvass_items })

    await x.close_all_toasts({ page })

    await x.click({ page, test_id: 'save-meqs' })

    if(await x.is_visible({ page, selector: '[data-testid="required-notes-modal"]' })) {
        const items_needed_justification = await x.get_elements_by_selector({ page, selector: '[data-test="test-item"]' })
        await add_justification_on_items({ items: items_needed_justification })
        await x.click({ page, test_id: 'modal-notes-save-meqs' })

    }


    const dynamicUrlPattern = new RegExp(`${url}/purchase/meqs/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const meqs_number = await x.getText({ page, test_id: 'meqs-number' })

    const el_awarded_suppliers = await x.get_elements_by_selector({ page, selector: '[data-test="awarded-supplier"]' })

    const awarded_suppliers = await get_awarded_suppliers({ page, items: el_awarded_suppliers })

    return { meqs_number, awarded_suppliers }

}


const add_suppliers = async(payload: { page: Page, suppliers: MeqsSupplier[] }) => {

    const { page, suppliers } = payload

    for(let supplier of suppliers) {
        
        await x.click({ page, test_id: 'add-supplier' })
        await x.custom_select({ page, test_id: 'supplier' })
        await x.input({ page, test_id: 'payment-terms', value: supplier.payment_terms })

        for (const [indx, item] of supplier.items.entries()) {
            await x.input({ page, test_id: `item-price-${indx}`, value: item.price.toString() });
        }
        
        await x.click({ page, test_id: 'modal-add-supplier' })
        
    }

}

const award_items = async(payload: { page: Page, suppliers: MeqsSupplier[], total_canvass_items: number }) => {

    const { page, suppliers, total_canvass_items } = payload

    for(let i = 0; i < total_canvass_items; i++) {

        for(const [supplierIndx, supplier] of suppliers.entries()) {

            for (const [itemIndx, item] of supplier.items.entries()) {
                
                if(itemIndx !== i) {
                    continue
                }
                
                if(item.is_awarded === true) {
                    await x.click({ page, test_id: `award-icon-${ i }-${ itemIndx }` })
                }

            }
            
        }

    }

}

const add_justification_on_items = async(payload: { items: Locator[] }) => {
    const { items } = payload 

    for(let item of items) {
        await x.fill({ element: item, value: 'Tested and proven' })

    }

}

const get_awarded_suppliers = async(payload: { page: Page, items: Locator[] }): Promise<string[]> => {
    const { page, items } = payload 

    const awarded_suppliers = []

    for(let item of items) {
        const supplier_name = await x.getText({ page, el: item })
        awarded_suppliers.push(supplier_name)
    }

    return awarded_suppliers

}