import test from "@playwright/test";
import { test_mct } from "./mct";
import dotenv from 'dotenv';
import { approve_signatories, DB_ENTITY, goto, login, logout, verify_status } from "../shared";
import { create_mcrt, goto_create_mcrt_page, goto_mcrt_view_page, mcrt_approvers, mcrt_data, verify_items_to_be_transacted } from "./mcrt";

dotenv.config();

test("MCRT Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await test_mct(page)

    await goto({ page, url })

    await login({ page, url, username, password })

    await goto_create_mcrt_page({ page, url })

    const mcrt = await create_mcrt({ 
        page, data: mcrt_data, 
        url
    })

    await logout({ page, url })

    await approve_signatories({
        page,
        url,
        approvers: mcrt_approvers,
        ref_number: mcrt.mcrt_number,
        db_entity: DB_ENTITY.MCRT
    })

    await login({ page, url, username, password })

    await goto_mcrt_view_page({ page, url, mcrt_number: mcrt.mcrt_number })

    await verify_status({ page, status: 'Approved' })

    await verify_items_to_be_transacted({ page, url, mcrt_number: mcrt.mcrt_number })

    await logout({ page, url })

});