import test from "@playwright/test";
import { approve_signatories, login } from "../shared/helpers";
import { canvass_data, create_canvass, goto_create_canvass_page } from "./canvass";
import { create_rv, goto_create_rv_page, rv_approvers, rv_data } from "./rv";
import dotenv from 'dotenv';
import { logout } from "../shared/helpers";
import { DB_ENTITY } from "../shared/enums";
import { create_meqs, goto_create_meqs_page, meqs_approvers, meqs_data } from "./meqs";
import { goto } from "../shared/utils";
import { create_pos, goto_create_po_page } from "./po/po.service";
import { po_approvers, po_data } from "./po/po.data";

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

    // create PO
    await login({ page, url, username, password })
    await goto_create_po_page({ page, url })
    const pos = await create_pos({
        page,
        url,
        data: {...po_data, supplier_names: meqs.awarded_suppliers}
    })

    await logout({ page, url })
    
    // approve PO signatories for each PO
    for(let po_number of pos.po_numbers) {
        await approve_signatories({
            page,
            url,
            approvers: po_approvers,
            ref_number: po_number,
            db_entity: DB_ENTITY.PO
        })
    }

    // TODO: Create RR for each PO

});