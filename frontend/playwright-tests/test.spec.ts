import { test, expect } from '@playwright/test';

const ROOT = 'http://localhost:3000';

const randomStr = () => Math.random().toString(36).substring(2, 8);

test.describe('Rich Notes & XSS', () => {
  test('sanitizer toggling blocks and allows XSS', async ({ page }) => {
    await page.goto(ROOT);

    /* Create a new user */
    await page.getByTestId('go_to_create_user_button').click();
    const uname = `u_${randomStr()}`;
    const pwd = 'pass1234';
    await page.getByTestId('create_user_form_name').fill('Tester');
    await page.getByTestId('create_user_form_email').fill(`${uname}@example.com`);
    await page.getByTestId('create_user_form_username').fill(uname);
    await page.getByTestId('create_user_form_password').fill(pwd);
    await page.getByTestId('create_user_form_create_user').click();

    /* Go to login */
    await page.getByTestId('go_to_login_button').click();
    await page.getByTestId('login_form_username').fill(uname);
    await page.getByTestId('login_form_password').fill(pwd);
    await page.getByTestId('login_form_login').click();

    /* Add a benign rich note */
    await page.locator('button[name="add_new_note"]').click();
    const richContent = '<b>hello world</b>';
    await page.locator('textarea[name="text_input_new_note"]').fill(richContent);
    await page.locator('button[name="text_input_save_new_note"]').click();
    const lastNote = page.locator('.note-content').last();
    await expect(lastNote).toContainText('hello world');
    await expect(lastNote).toHaveText(/hello world/);
    const html = await lastNote.innerHTML();
    expect(html).toContain('<b>');

    /* Add malicious note */
    await page.locator('button[name="add_new_note"]').click();
    const payload = '<img src=x onerror="document.body.setAttribute(\'xss\',\'1\')">';
    await page.locator('textarea[name="text_input_new_note"]').fill(payload);
    await page.locator('button[name="text_input_save_new_note"]').click();

    // Sanitizer ON (default) -> attribute should NOT be present
    const attrBefore = await page.evaluate(() => document.body.getAttribute('xss'));
    expect(attrBefore).toBeNull();

    // Turn sanitizer OFF
    await page.getByTestId('sanitizer_off').click();

    // Attribute should eventually appear (XSS executed)
    await page.waitForFunction(() => document.body.getAttribute('xss') === '1');
  });
});