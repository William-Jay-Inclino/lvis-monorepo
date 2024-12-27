import test from "@playwright/test";
import { login } from "../shared/helpers";
import { canvass_data, create_canvass, goto_create_canvass_page } from "./canvass";


test("Purchase Order Flow", async ({ page }) => {

    await login({ page })
    await goto_create_canvass_page({ page })
    await create_canvass({ page, data: canvass_data})

});