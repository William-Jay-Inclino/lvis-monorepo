import test from "@playwright/test";
import { test_mct } from "./mct";


test.skip("MCT Flow", async ({ page }) => {

    await test_mct(page)

});