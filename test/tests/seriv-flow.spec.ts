import test from "@playwright/test";
import { approve_signatories, login, logout, verify_status } from "../shared/helpers";
import dotenv from 'dotenv';
import { goto } from "../shared/utils";
import { create_item, goto_create_item_page, item_data, ITEM_TYPE } from "./item";
import { faker } from '@faker-js/faker';
import { DB_ENTITY } from "../shared/enums";
import { create_seriv, goto_create_seriv_page, goto_seriv_view_page, seriv_approvers, seriv_data, verify_items_to_be_transacted } from "./seriv";

dotenv.config();

test("SERIV Flow", async ({ page }) => {

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
            item_type: ITEM_TYPE.SE
        },
    })

    await logout({ page, url })
    await login({ page, url, username, password })

    await goto_create_seriv_page({ page, url })

    const seriv = await create_seriv({ 
        page, data: seriv_data, 
        url,
        item_code: item.item_code
    })

    await logout({ page, url })

    await approve_signatories({
        page,
        url,
        approvers: seriv_approvers,
        ref_number: seriv.seriv_number,
        db_entity: DB_ENTITY.SERIV
    })

    await login({ page, url, username, password })

    await goto_seriv_view_page({ page, url, seriv_number: seriv.seriv_number })

    await verify_status({ page, status: 'Approved' })

    await verify_items_to_be_transacted({ page, url, seriv_number: seriv.seriv_number })

});