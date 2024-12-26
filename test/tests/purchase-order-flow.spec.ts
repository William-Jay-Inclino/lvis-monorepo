import test from "@playwright/test";
import { login } from "../login";


test("Purchase Order Flow", async ({ page }) => {

    await login({ page })

});