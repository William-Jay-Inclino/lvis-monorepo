import { expect, Locator, Page } from "@playwright/test";
import * as x from '../../shared/utils'
import { VehicleData } from "./vehicle.types";


export const goto_create_vehicle_page = async(payload: { page: Page, url: string }) => {

    const { page, url } = payload


    await x.click({ page, test_id: 'motorpool' })
    await x.click({ page, test_id: 'vehicle-dropdown' })
    await x.click({ page, test_id: 'vehicle-management-menu' })
    await x.click({ page, test_id: 'create-vehicle' })

    await expect(page).toHaveURL(`${url}/motorpool/vehicle/create`, { timeout: 5000 });
    
}


export const create_vehicle = async(payload: { page: Page, data: VehicleData, url: string }): Promise<{ vehicle_number: string }> => {

    const { page, data, url } = payload 

    await x.input({
        page,
        test_id: 'name',
        value: data.name,
    })

    await x.input({
        page,
        test_id: 'vehicle-number',
        value: data.vehicle_number,
    })

    await x.input({
        page,
        test_id: 'plate-number',
        value: data.plate_number,
    })

    await x.custom_select({
        page,
        test_id: 'classification',
        value: data.classification,
    })

    await x.custom_select({
        page,
        test_id: 'assignee',
        value: data.assignee,
    })

    await x.input({
        page,
        test_id: 'date-acquired',
        value: data.date_acquired,
    })

    await x.click({ page, test_id: 'save' })

    const dynamicUrlPattern = new RegExp(`${url}/motorpool/vehicle/view/[a-zA-Z0-9-]+`)
    await expect(page).toHaveURL(dynamicUrlPattern, { timeout: 5000 });

    await x.close_popup({ page })

    const vehicle_number = await x.getText({ page, test_id: 'vehicle-number' })

    return { vehicle_number }

}