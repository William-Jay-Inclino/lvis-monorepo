import test from "@playwright/test";
import { approve_signatories, login, logout } from "../shared/helpers";
import dotenv from 'dotenv';
import { goto } from "../shared/utils";
import { create_item, goto_create_item_page, item_data, ITEM_TYPE } from "./item";
import { faker } from '@faker-js/faker';
import { DB_ENTITY } from "../shared/enums";
import { create_mrv, goto_create_mrv_page, mrv_approvers, mrv_data } from "./mrv";
import { click_mrv_number_link, create_mct, goto_create_mct_page, goto_mct_view_page, mct_approvers, mct_data, verify_items_to_be_transacted } from "./mct";

dotenv.config();

test("MCT Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await goto({ page, url })

    // ========================== CREATE MRV ========================== 
    await login({ page, url, username, password })

    await goto_create_item_page({ page, url })

    const item = await create_item({
        page,
        url,
        data: {
            ...item_data, 
            description: faker.commerce.product(),
            item_type: ITEM_TYPE.LM
        },
    })

    await logout({ page, url })
    await login({ page, url, username, password })

    await goto_create_mrv_page({ page, url })

    const mrv = await create_mrv({ 
        page, data: mrv_data, 
        url,
        item_code: item.item_code
    })

    await logout({ page, url })

    await approve_signatories({
        page,
        url,
        approvers: mrv_approvers,
        ref_number: mrv.mrv_number,
        db_entity: DB_ENTITY.MRV
    })


    // ========================== CREATE MCT ========================== 

    await login({ page, url, username, password })

    await goto_create_mct_page({ page, url })

    const mct = await create_mct({ page, url, data: {...mct_data, mrv_number: mrv.mrv_number} })

    await logout({ page, url })

    await approve_signatories({
        page,
        url,
        approvers: mct_approvers,
        ref_number: mct.mct_number,
        db_entity: DB_ENTITY.MCT
    })

    await login({ page, url, username, password })

    await goto_mct_view_page({ page, url, mct_number: mct.mct_number })

    await click_mrv_number_link({ page, url })

    await verify_items_to_be_transacted({ page, url, mct_number: mct.mct_number })

    await logout({ page, url })

});