import { test, expect } from '@playwright/test';

const ROOT = 'http://localhost:3000';
const randomStr = () => Math.random().toString(36).substring(2, 8);

// Utility: create and login a new user, return page and username
async function createAndLogin(page) {
  await page.goto(ROOT);
  await page.getByTestId('go_to_create_user_button').click();
  const uname = `u_${randomStr()}`;
  const pwd = 'pass1234';
  await page.getByTestId('create_user_form_name').fill('Tester');
  await page.getByTestId('create_user_form_email').fill(`${uname}@example.com`);
  await page.getByTestId('create_user_form_username').fill(uname);
  await page.getByTestId('create_user_form_password').fill(pwd);
  await page.getByTestId('create_user_form_create_user').click();
  await page.getByTestId('go_to_login_button').click();
  await page.getByTestId('login_form_username').fill(uname);
  await page.getByTestId('login_form_password').fill(pwd);
  await page.getByTestId('login_form_login').click();
  await page.waitForURL(ROOT);
  return { uname, pwd };
}

test('Rich text rendering preserves <b> and <i> tags', async ({ page }) => {
  await createAndLogin(page);
  const unique = randomStr();
  await page.locator('button[name="add_new_note"]').click();
  const richContent = `<b>bold${unique}</b> <i>italic${unique}</i>`;
  await page.locator('textarea[name="text_input_new_note"]').fill(richContent);
  await page.locator('button[name="text_input_save_new_note"]').click();
  const newNote = page.locator('.note-content', { hasText: `bold${unique}` }).first();
  await newNote.waitFor({ state: 'visible' });
  const html = await newNote.innerHTML();
  expect(html).toContain('<b>');
  expect(html).toContain('<i>');
  await expect(newNote).toContainText(`bold${unique}`);
  await expect(newNote).toContainText(`italic${unique}`);
});

test('XSS/keylogger works when sanitizer is OFF and is blocked when ON', async ({ page }) => {
  await createAndLogin(page);
  // Add malicious note
  await page.locator('button[name="add_new_note"]').click();
  const payload = `<img src=x onerror="if(!window.__xssKeylogInit){window.__xssKeylogInit=1;document.body.setAttribute('xss','1');}">`;
  await page.locator('textarea[name="text_input_new_note"]').fill(payload);
  await page.locator('button[name="text_input_save_new_note"]').click();
  // Sanitizer ON (default): attribute should NOT be present
  await page.waitForTimeout(500); // let DOM update
  let attr = await page.evaluate(() => document.body.getAttribute('xss'));
  expect(attr).toBeNull();
  // Turn sanitizer OFF
  await page.getByTestId('sanitizer_toggle').click();
  // Attribute should eventually appear (XSS executed)
  await page.waitForFunction(() => document.body.getAttribute('xss') === '1');
  // Turn sanitizer ON again, attribute should not be set anymore after reload
  await page.getByTestId('sanitizer_toggle').click();
  await page.reload();
  attr = await page.evaluate(() => document.body.getAttribute('xss'));
  expect(attr).toBeNull();
});

test('CRUD operations: create, edit, and delete a note', async ({ page }) => {
  await createAndLogin(page);
  // Create
  const unique = randomStr();
  await page.locator('button[name="add_new_note"]').click();
  await page.locator('textarea[name="text_input_new_note"]').fill(`note-${unique}`);
  await page.locator('button[name="text_input_save_new_note"]').click();
  const note = page.locator('.note', { hasText: `note-${unique}` }).first();
  await note.waitFor({ state: 'visible' });
  await expect(note).toContainText(`note-${unique}`);
  // Edit
  await note.getByTestId(/edit-/).click();
  const textarea = note.locator('textarea');
  await textarea.fill(`note-edited-${unique}`);
  await note.getByTestId(/text_input_save-/).click();
  await expect(note).toContainText(`note-edited-${unique}`);
  // Delete
  await note.getByTestId(/delete-/).click();
  await expect(note).not.toBeVisible();
});