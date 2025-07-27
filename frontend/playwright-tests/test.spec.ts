import { test, expect } from '@playwright/test';

const ROOT = 'http://localhost:3000';
const API = 'http://localhost:3001';

test.beforeEach(async () => {
  await fetch(`${API}/test/wipe`, { method: 'DELETE' });
});

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

    /* Wait for login to complete and redirect */
    await page.waitForURL(ROOT);

    /* Add a benign rich note */
    await page.locator('button[name="add_new_note"]').click();
    const unique = randomStr();
    const richContent = `<b>hello ${unique}</b>`;
    await page.locator('textarea[name="text_input_new_note"]').fill(richContent);
    await page.locator('button[name="text_input_save_new_note"]').click();
    
    /* Wait for the specific note to appear and verify it */
    const newNote = page.locator('.note-content', { hasText: `hello ${unique}` }).first();
    await newNote.waitFor({ state: 'visible' });
    await expect(newNote).toContainText(`hello ${unique}`);
    const html = await newNote.innerHTML();
    expect(html).toContain('<b>');

    /* Add malicious note */
    await page.locator('button[name="add_new_note"]').click();
    const payload = '<img src=x onerror="document.body.setAttribute(\'xss\',\'1\')">';
    await page.locator('textarea[name="text_input_new_note"]').fill(payload);
    await page.locator('button[name="text_input_save_new_note"]').click();

    /* Wait a moment for the note to be processed */
    await page.waitForTimeout(5000);

    // Sanitizer ON (default) -> attribute should NOT be present
    const attrBefore = await page.evaluate(() => document.body.getAttribute('xss'));
    expect(attrBefore).toBeNull();

    // Turn sanitizer OFF
    await page.getByTestId('sanitizer_toggle').click();

    // Attribute should eventually appear (XSS executed)
    await page.waitForFunction(() => document.body.getAttribute('xss') === '1');
  });
});