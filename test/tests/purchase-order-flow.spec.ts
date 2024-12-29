import test from "@playwright/test";
import { approve_signatory, login } from "../shared/helpers";
import { canvass_data, create_canvass, goto_create_canvass_page } from "./canvass";
import { create_rv, DB_ENTITY, goto_create_rv_page, rv_approvers, rv_data } from "./rv";
import dotenv from 'dotenv';
import { logout } from "../shared/helpers";

dotenv.config();



test("Purchase Order Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await login({ page, url, username, password })

    // create canvass
    await goto_create_canvass_page({ page, url })
    const canvass = await create_canvass({ 
        page, 
        data: canvass_data, 
        url
    })

    // create rv
    await goto_create_rv_page({ page, url })
    const rv = await create_rv({ 
        page, 
        url, 
        data: { ...rv_data, rc_number: canvass.rc_number } 
    });

    await logout({ page, url })

    // approve signatories
    for(let approver of rv_approvers) {

        const username = approver.username
        const password = approver.password

        await login({ page, url, username, password })

        await approve_signatory({
            page,
            ref_number: rv.rv_number,
            db_entity: DB_ENTITY.RV,
            popup: approver.popup,
        })

        await logout({ page, url })
    }

});