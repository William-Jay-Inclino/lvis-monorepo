import test from "@playwright/test";
import { login } from "./functions/login";


test("Purchase Order Flow", async ({ page }) => {

    await login({ page })

});