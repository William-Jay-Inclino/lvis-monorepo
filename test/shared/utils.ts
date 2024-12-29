import { Locator, Page, expect } from '@playwright/test';

export const goto = async ({ page, url }: { page: Page; url: string }) => {
    const response = await page.goto(url);
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

export const click = async (payload: { page: Page, test_id: string }) => {

    const { page, test_id } = payload
    console.log('test_id', test_id);

    const element = page.getByTestId(test_id)
    await element.scrollIntoViewIfNeeded({ timeout: 5000 });
    await expect(element).toBeVisible({ timeout: 5000 }); 
    await element.click();
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

export const getText = async(payload: { page: Page, test_id: string }): Promise<string> => {
    const { page, test_id } = payload 

    console.log('test_id', test_id);
    const element = page.getByTestId(test_id)

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

// export const is_popup_visibile = async(payload: { page: Page }): Promise<boolean> => {
//     const { page } = payload 
//     const swalSelector = '.swal2-popup';

//     await page.waitForTimeout(500);

//     if(await is_visible({ page, selector: swalSelector })) {
//         return true 
//     }

//     return false 

// }

export const is_visible = async(payload: { page: Page, selector: string }): Promise<boolean> => {

    const { page, selector } = payload

    await page.waitForTimeout(500);

    if (await page.isVisible(selector)) {
        return true 
    }

    return false
}

export const get_elements_by_selector = async(payload: { page: Page, selector: string }): Promise<Locator[]> => {

    const { page, selector } = payload

    const elements = page.locator(selector);
    const count = await elements.count();
  
    const elementArray: Locator[] = [];
    for (let i = 0; i < count; i++) {
      elementArray.push(elements.nth(i));
    }
  
    return elementArray;
}