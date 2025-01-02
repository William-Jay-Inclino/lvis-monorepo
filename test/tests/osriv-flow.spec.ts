import test from "@playwright/test";
import { login } from "../shared/helpers";
import dotenv from 'dotenv';
import { goto } from "../shared/utils";
import { create_item, goto_create_item_page, item_data, ITEM_TYPE } from "./item";
import { faker } from '@faker-js/faker';

dotenv.config();

test("OSRIV Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await goto({ page, url })

    await login({ page, url, username, password })

    await goto_create_item_page({ page, url })

    const item_code = await create_item({
        page,
        url,
        data: {
            ...item_data, 
            description: faker.commerce.product(),
            item_type: ITEM_TYPE.OS
        },
    })

    console.log('item_code', item_code);

});