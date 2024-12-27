import { Page, expect } from '@playwright/test';

export const goto = async ({ page, url }: { page: Page; url: string }) => {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
};

export const input = async (payload: { page: Page, test_id: string, value: string }) => {

    const { page, test_id, value } = payload

    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 }); 
    await element.fill(value);

};

export const click = async (payload: { page: Page, test_id: string }) => {

    const { page, test_id } = payload

    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 }); 
    await element.click();
};

export const click_if_exists = async (payload: { page: Page, selector: string }) => {
    const { page, selector } = payload;

    const button = page.locator(selector);
    if (await button.isVisible()) {
        await button.click();
    }
};

export const custom_select = async (payload: { page: Page, test_id: string, value: string }) => {
    const { page, test_id, value } = payload;

    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 });

    // Open the dropdown
    await element.click();

    const inputField = element.locator('input');
    await inputField.fill(value);

    const optionLocator = element.locator(`text=${value}`);
    await expect(optionLocator).toBeVisible({ timeout: 5000 });
    await optionLocator.click();
};

export const select = async (payload: { page: Page, test_id: string, value: string }) => {

    const { page, test_id, value } = payload

    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 }); 
    
    await element.click()
    
    await element.fill(value);
    await element.press('Enter');

};

export const toContainText = async (payload: { page: Page, test_id: string, value: string }) => {
    const { page, test_id, value } = payload;
    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 });
    await expect(element).toContainText(value);
}

export const getText = async(payload: { page: Page, test_id: string }): Promise<string> => {
    const { page, test_id } = payload 

    const element = page.locator(`[data-test-id="${test_id}"]`);
    await expect(element).toBeVisible({ timeout: 5000 }); 

    const textContent = await element.textContent();

    expect(textContent?.trim()).not.toBe('');
    
    return textContent || ''
}