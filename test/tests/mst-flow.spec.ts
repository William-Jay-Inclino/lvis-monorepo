import test from "@playwright/test";
import { approve_signatories, login, logout, verify_status } from "../shared/helpers";
import dotenv from 'dotenv';
import { goto } from "../shared/utils";
import { DB_ENTITY } from "../shared/enums";
import { create_mst, goto_create_mst_page, goto_mst_view_page, mst_approvers, mst_data } from "./mst";
import { create_item, expect_salvaged_item_created, goto_create_item_page, goto_search_item_page, item_data, ITEM_TYPE } from "./item";
import { faker } from '@faker-js/faker';

dotenv.config();

test("MST Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await goto({ page, url })

    await login({ page, url, username, password })

    await goto_create_item_page({ page, url })

    const item_desc = faker.commerce.product() + '_' + faker.string.uuid()

    const item = await create_item({
        page,
        url,
        data: {
            ...item_data, 
            description: item_desc,
            item_type: ITEM_TYPE.LM
        },
    })

    await logout({ page, url })
    await login({ page, url, username, password })

    await goto_create_mst_page({ page, url })

    const mst = await create_mst({ 
        page, data: mst_data, 
        url,
        item_code: item.item_code
    })

    await logout({ page, url })

    await approve_signatories({
        page,
        url,
        approvers: mst_approvers,
        ref_number: mst.mst_number,
        db_entity: DB_ENTITY.MST
    })

    await login({ page, url, username, password })

    await goto_mst_view_page({ page, url, mst_number: mst.mst_number })

    await verify_status({ page, status: 'Approved' })

    await logout({ page, url })
    await login({ page, url, username, password })

    await goto_search_item_page({ page, url })

    await expect_salvaged_item_created({ page, item_desc })

});