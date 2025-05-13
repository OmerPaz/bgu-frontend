import { test, expect } from '@playwright/test';

const ROOT = 'http://localhost:3000';

test.beforeEach(async ({ page }) => {
  await page.goto(ROOT);
});

test('read notes', async ({ page }) => {
  const n = await page.locator('.note').count();
  expect(n).toBeGreaterThanOrEqual(0);            // may be empty
  await expect(page.locator('button[name="first"]')).toBeVisible();
});

test('add note', async ({ page }) => {
  await page.locator('button[name="add_new_note"]').click();
  await page.locator('textarea[name="text_input_new_note"]').fill('playwright new');
  await page.locator('button[name="text_input_save_new_note"]').click();
  await expect(page.locator('.notification')).toContainText('Added a new note');
});

test('edit note', async ({ page }) => {
  const first = page.locator('.note').first();
  const id = await first.getAttribute('data-testid');
  await page.locator(`button[data-testid="edit-${id}"]`).click();
  await page.locator(`textarea[data-testid="text_input-${id}"]`).fill('edited');
  await page.locator(`button[data-testid="text_input_save-${id}"]`).click();
  await expect(page.locator('.notification')).toContainText('Note updated');
});

test('delete note', async ({ page }) => {
  const first = page.locator('.note').first();
  const id = await first.getAttribute('data-testid');
  await page.locator(`button[data-testid="delete-${id}"]`).click();
  await expect(page.locator('.notification')).toContainText('Note deleted');
});