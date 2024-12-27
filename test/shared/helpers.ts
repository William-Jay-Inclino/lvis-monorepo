
import { expect, Page } from '@playwright/test'
import * as x from './utils'
import dotenv from 'dotenv';

dotenv.config();

export const login = async(payload: { page: Page }) => {

    const username = process.env.TEST_USER;
    const password = process.env.TEST_PASSWORD;
    const url = process.env.TEST_URL;

    if (!username || !password || !url) {
        throw new Error('Env variables are not defined in .env file');
    }
    
    const { page } = payload

    await x.goto({ page, url })

    await x.input({
        page,
        test_id: 'username',
        value: username
    })

    await x.input({
        page,
        test_id: 'password',
        value: password
    })

    await x.click({ page, test_id: 'login' })

    await expect(page).toHaveURL(`${url}/home`, { timeout: 5000 });
}