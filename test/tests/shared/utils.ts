import { Page, expect } from '@playwright/test';

export const goto = async ({ page, url }: { page: Page; url: string }) => {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
};

export const input = async ({ page, test_id, value }: { page: Page; test_id: string; value: string }) => {
    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 }); 
    await element.fill(value);
};

export const click = async ({ page, test_id }: { page: Page; test_id: string }) => {
    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 }); 
    await element.click();
};
