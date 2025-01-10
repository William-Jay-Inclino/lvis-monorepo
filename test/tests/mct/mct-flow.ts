import { DB_ENTITY } from "../../shared/enums";
import { login, logout, approve_signatories, verify_status } from "../../shared/helpers";
import { faker } from '@faker-js/faker';
import { goto } from "../../shared/utils";
import { goto_create_item_page, create_item, item_data, ITEM_TYPE } from "../item";
import { goto_create_mrv_page, create_mrv, mrv_data, mrv_approvers } from "../mrv";
import { mct_data, mct_approvers } from "./mct.data";
import { goto_create_mct_page, create_mct, goto_mct_view_page, click_mrv_number_link, verify_items_to_be_transacted } from "./mct.service";
import { Page } from "@playwright/test";
import dotenv from 'dotenv';

dotenv.config();

export const test_mct = async(page: Page) => {
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

    await verify_status({ page, status: 'Approved' })

    await click_mrv_number_link({ page, url })

    await verify_items_to_be_transacted({ page, url, mct_number: mct.mct_number })

    await logout({ page, url })
    
}