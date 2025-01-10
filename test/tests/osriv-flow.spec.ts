import test from "@playwright/test";
import { approve_signatories, login, logout, verify_status } from "../shared/helpers";
import dotenv from 'dotenv';
import { goto } from "../shared/utils";
import { create_item, goto_create_item_page, item_data, ITEM_TYPE } from "./item";
import { faker } from '@faker-js/faker';
import { DB_ENTITY } from "../shared/enums";
import { create_osriv, goto_create_osriv_page, goto_osriv_view_page, osriv_approvers, osriv_data, verify_items_to_be_transacted } from "./osriv";

dotenv.config();

test("OSRIV Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await goto({ page, url })

    await login({ page, url, username, password })

    await goto_create_item_page({ page, url })

    const item = await create_item({
        page,
        url,
        data: {
            ...item_data, 
            description: faker.commerce.product(),
            item_type: ITEM_TYPE.OS
        },
    })

    await logout({ page, url })
    await login({ page, url, username, password })

    await goto_create_osriv_page({ page, url })

    const osriv = await create_osriv({ 
        page, data: osriv_data, 
        url,
        item_code: item.item_code
    })

    await logout({ page, url })

    await approve_signatories({
        page,
        url,
        approvers: osriv_approvers,
        ref_number: osriv.osriv_number,
        db_entity: DB_ENTITY.OSRIV
    })

    await login({ page, url, username, password })

    await goto_osriv_view_page({ page, url, osriv_number: osriv.osriv_number })

    await verify_status({ page, status: 'Approved' })

    await verify_items_to_be_transacted({ page, url, osriv_number: osriv.osriv_number })

});