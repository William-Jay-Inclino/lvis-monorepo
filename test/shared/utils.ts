import { Locator, Page, expect } from '@playwright/test';
import { ToastPayload } from './types';

export const goto = async ({ page, url }: { page: Page; url: string }) => {

    console.log('goto', url);
    console.log('NODE_ENV', process.env.NODE_ENV);
    
    if (process.env.NODE_ENV === 'production') {
        await page.waitForTimeout(2000); 
    }

    const response = await page.goto(url);

    if (process.env.NODE_ENV === 'production') {
        await page.waitForTimeout(2000);
    }

    expect(response?.status()).toBe(200);
};

export const input = async (payload: { page: Page, test_id: string, value: string }) => {

    const { page, test_id, value } = payload

    console.log('test_id', test_id);

    const element = page.getByTestId(test_id)
    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(element).toBeVisible({ timeout: 5000 }); 
    await element.fill(value);

};

export const fill = async (payload: { element: Locator, value: string }) => {

    const { element, value } = payload
    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(element).toBeVisible({ timeout: 5000 }); 
    await element.fill(value);

};

export const click = async (payload: { page: Page, test_id?: string, element?: Locator }) => {

    const { page, test_id, element } = payload
    console.log('test_id', test_id);

    const el = test_id ? page.getByTestId(test_id) : element

    if(!el) {
        console.error('Element not found');
        return 
    }

    await el.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(el).toBeVisible({ timeout: 5000 }); 
    await el.click();
};

export const click_if_exists = async (payload: { page: Page, selector: string }) => {
    const { page, selector } = payload;
    console.log('selector', selector);

    const element = page.locator(selector);
    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    if (await element.isVisible()) {
        await element.click();
    }
};

export const custom_select = async (payload: { page: Page, test_id: string, value?: string }) => {
    const { page, test_id, value } = payload;
    console.log('test_id', test_id);

    const element = page.getByTestId(test_id)
    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(element).toBeVisible({ timeout: 5000 });

     const isDisabled = await element.isDisabled();
     if (isDisabled) {
         console.log(`Element with test_id "${test_id}" is disabled. Skipping input.`);
         return; 
     }

    // Open the dropdown
    await element.click();

    if (value) {
        // If a value is provided, type it into the input field
        const inputField = element.locator('input');
        await inputField.fill(value);

        // Select the matching option
        const optionLocator = element.locator(`text=${value}`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();
    } else {
        // Select the first option if no value is provided
        // const dropdownList = element.locator('#vs1__listbox');
        const dropdownList = element.locator('[role="listbox"]');
        const firstOption = dropdownList.locator('li').first();
        await expect(firstOption).toBeVisible({ timeout: 5000 });
        await firstOption.click();
    }
};

export const select = async (payload: { page: Page, test_id: string, value: string }) => {

    const { page, test_id, value } = payload
    console.log('test_id', test_id);

    const element = page.getByTestId(test_id)
    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(element).toBeVisible({ timeout: 5000 }); 
    
    await element.click()
    
    await element.fill(value);
    await element.press('Enter');

};

export const toContainText = async (payload: { page: Page, test_id: string, value: string }) => {
    const { page, test_id, value } = payload;
    console.log('test_id', test_id);
    const element = page.getByTestId(test_id)
    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(element).toBeVisible({ timeout: 5000 });
    await expect(element).toContainText(value);
}

export const getText = async(payload: { page: Page, test_id?: string, el?: Locator }): Promise<string> => {
    const { page, test_id, el } = payload 

    console.log('test_id', test_id);

    const element = test_id ? page.getByTestId(test_id) : el;

    if(!element) {
        console.error('Element not found');
        return '' 
    }

    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(element).toBeVisible({ timeout: 5000 }); 

    const textContent = await element.textContent();

    expect(textContent?.trim()).not.toBe('');
    
    return textContent || ''
}

export const close_popup = async (payload: { page: Page }) => {
    const { page } = payload;

    while (await is_visible({ page, selector: '.swal2-popup' })) {
        console.log('Swal is visible, attempting to close it.');

        await click_if_exists({
            page,
            selector: '.swal2-confirm',
        });

        // Optional: Wait for a short period to avoid spamming
        await page.waitForTimeout(100);
    }

    console.log('Swal is no longer visible.');
    await page.waitForTimeout(200);
};

export const is_visible = async(payload: { page: Page, selector: string }): Promise<boolean> => {

    const { page, selector } = payload

    await page.waitForTimeout(500);

    if (await page.isVisible(selector)) {
        return true 
    }

    return false
}

export const get_elements_by_selector = async (payload: { page: Page, selector: string }): Promise<Locator[]> => {
    const { page, selector } = payload;

    // Wait for the selector to be visible
    await page.waitForSelector(selector, { timeout: 5000 });

    // Get the locator for the elements matching the selector
    const elements = page.locator(selector);
    const count = await elements.count();

    const elementArray: Locator[] = [];

    // Loop through each element
    for (let i = 0; i < count; i++) {
        const element = elements.nth(i);

        // Scroll the element into view
        await element.scrollIntoViewIfNeeded();

        // Push the element into the array
        elementArray.push(element);
    }

    return elementArray;
};

export async function close_all_toasts({
    page,
    containerSelector = '.Vue-Toastification__container.top-right',
    delay = 0, 
}: ToastPayload): Promise<void> {
    const container = page.locator(containerSelector);
  
    if (!(await container.isVisible())) {
      console.log('Toast container is not visible.');
      return;
    }
  
    const closeButtons = container.getByLabel('close', { exact: true });
    const closeButtonCount = await closeButtons.count();
  
    if (closeButtonCount === 0) {
      console.log('No visible toasts to close.');
      return;
    }
  
    console.log(`Found ${closeButtonCount} toasts to close.`);
  
    for (let i = 0; i < closeButtonCount; i++) {
      const closeButton = closeButtons.nth(i);
  
      if (await closeButton.isVisible()) {
        await closeButton.click();
        console.log(`Closed toast ${i + 1}.`);
  
        await page.waitForTimeout(delay);
      } else {
        console.log(`Close button ${i + 1} is not visible.`);
      }
    }
}

export const go_back = async(payload: { page: Page }) => {
    const { page } = payload 
    await page.goBack()

}