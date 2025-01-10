import test from "@playwright/test";
import { approve_signatories, login, logout, verify_status } from "../shared/helpers";
import dotenv from 'dotenv';
import { goto } from "../shared/utils";
import { DB_ENTITY } from "../shared/enums";
import { create_gas_slip, goto_create_gas_slip_page, goto_gas_slip_view_page, gas_slip_approvers, gas_slip_data } from "./gas-slip";
import { create_vehicle, goto_create_vehicle_page, vehicle_data } from "./vehicle";

dotenv.config();

test("GAS SLIP Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await goto({ page, url })

    await login({ page, url, username, password })

    await goto_create_vehicle_page({ page, url })

    const vehicle = await create_vehicle({
        page,
        url,
        data: vehicle_data,
    })

    await logout({ page, url })
    await login({ page, url, username, password })

    await goto_create_gas_slip_page({ page, url })

    const gas_slip = await create_gas_slip({ 
        page, data: {...gas_slip_data, vehicle: vehicle.vehicle_number}, 
        url
    })

    await logout({ page, url })

    await approve_signatories({
        page,
        url,
        approvers: gas_slip_approvers,
        ref_number: gas_slip.gas_slip_number,
        db_entity: DB_ENTITY.GAS_SLIP
    })

    await login({ page, url, username, password })

    await goto_gas_slip_view_page({ page, url, gas_slip_number: gas_slip.gas_slip_number })

    await verify_status({ page, status: 'Unposted' })

    await logout({ page, url })

});