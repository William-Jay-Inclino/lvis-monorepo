import test from "@playwright/test";
import { approve_signatories, login, verify_status } from "../shared/helpers";
import { canvass_data, create_canvass, goto_create_canvass_page } from "./canvass";
import { create_rv, goto_create_rv_page, goto_rv_view_page, rv_approvers, rv_data } from "./rv";
import dotenv from 'dotenv';
import { logout } from "../shared/helpers";
import { DB_ENTITY } from "../shared/enums";
import { create_meqs, goto_create_meqs_page, goto_meqs_view_page, meqs_approvers, meqs_data } from "./meqs";
import { goto } from "../shared/utils";
import { create_pos, goto_create_po_page, goto_po_view_page, po_approvers, po_data } from "./po";
import { create_rrs, goto_create_rr_page, goto_rr_view_page, rr_approvers, rr_data } from "./rr";

dotenv.config();

test("Purchase Order Flow", async ({ page }) => {

    const url = process.env.TEST_URL || '';
    const username = process.env.TEST_USER || '';
    const password = process.env.TEST_PASSWORD || '';

    await goto({ page, url })

    await login({ page, url, username, password })

    // create Canvass
    await goto_create_canvass_page({ page, url })
    const canvass = await create_canvass({ 
        page, 
        data: canvass_data, 
        url
    })
    await logout({ page, url })
    await login({ page, url, username, password })

    // create RV
    await goto_create_rv_page({ page, url })
    const rv = await create_rv({ 
        page, 
        url, 
        data: { ...rv_data, rc_number: canvass.rc_number } 
    });

    await logout({ page, url })

    // approve RV signatories
    await approve_signatories({
        page,
        url,
        approvers: rv_approvers,
        ref_number: rv.rv_number,
        db_entity: DB_ENTITY.RV
    })

    await login({ page, url, username, password })
    await goto_rv_view_page({ page, url, rv_number: rv.rv_number })
    await verify_status({ page, status: 'Approved' })
    await logout({ page, url })
    

    // create MEQS
    await login({ page, url, username, password })
    await goto_create_meqs_page({ page, url })
    const meqs = await create_meqs({
        page,
        url,
        data: { ...meqs_data, rv_number: rv.rv_number },
        total_canvass_items: 2,
    })

    await logout({ page, url })

    // approve MEQS signatories
    await approve_signatories({
        page,
        url,
        approvers: meqs_approvers,
        ref_number: meqs.meqs_number,
        db_entity: DB_ENTITY.MEQS
    })

    await login({ page, url, username, password })
    await goto_meqs_view_page({ page, url, meqs_number: meqs.meqs_number })
    await verify_status({ page, status: 'Approved' })
    await logout({ page, url })

    // create PO for each awarded supplier
    await login({ page, url, username, password })
    await goto_create_po_page({ page, url })
    const po = await create_pos({
        page,
        url,
        data: {...po_data, supplier_names: meqs.awarded_suppliers}
    })

    await logout({ page, url })
    
    // approve PO signatories for each PO
    for(let po_number of po.po_numbers) {
        await approve_signatories({
            page,
            url,
            approvers: po_approvers,
            ref_number: po_number,
            db_entity: DB_ENTITY.PO
        })

        await login({ page, url, username, password })
        await goto_po_view_page({ page, url, po_number })
        await verify_status({ page, status: 'Approved' })
        await logout({ page, url })
}

    // Create RR for each PO
    await login({ page, url, username, password })
    await goto_create_rr_page({ page, url })

    const rr = await create_rrs({
        page,
        url,
        data: rr_data,
        po_numbers: po.po_numbers,
    })

    await logout({ page, url })

    for(let rr_number of rr.rr_numbers) {
        await approve_signatories({
            page,
            url,
            approvers: rr_approvers,
            ref_number: rr_number,
            db_entity: DB_ENTITY.RR
        })

        await login({ page, url, username, password })
        await goto_rr_view_page({ page, url, rr_number })
        await verify_status({ page, status: 'Approved' })
        await logout({ page, url })
    }

});