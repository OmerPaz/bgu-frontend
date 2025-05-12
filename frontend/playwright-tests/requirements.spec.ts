import { test, expect } from '@playwright/test';

const ROOT = 'http://localhost:3000';

test.beforeEach(async ({ page }) => {
  await page.goto(ROOT);
});

test('add note flow', async ({ page }) => {
  await page.getByRole('button', { name: 'Add new note' }).click();
  await page.locator('textarea[name="text_input_new_note"]').fill('play add');
  await page.locator('button[name="text_input_save_new_note"]').click();
  await expect(page.locator('.notification')).toHaveText(/Added a new note/);
});

test('edit note flow', async ({ page }) => {
  const first = page.locator('.note').first();
  const id = await first.getAttribute('data-testid');
  await page.locator(`button[data-testid="edit-${id}"]`).click();
  await page.locator(`textarea[data-testid="text_input-${id}"]`).fill('edited');
  await page.locator(`button[data-testid="text_input_save-${id}"]`).click();
  await expect(page.locator('.notification')).toHaveText(/Note updated/);
});

test('delete note flow', async ({ page }) => {
  const first = page.locator('.note').first();
  const id = await first.getAttribute('data-testid');
  await page.locator(`button[data-testid="delete-${id}"]`).click();
  await expect(page.locator('.notification')).toHaveText(/Note deleted/);
});