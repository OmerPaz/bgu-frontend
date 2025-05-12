import { test, expect } from '@playwright/test';

test('pagination and notes appear correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Check that exactly 10 notes are shown
  const notes = page.locator('.note');
  await expect(notes).toHaveCount(10);

  // Check presence of navigation buttons
  await expect(page.locator('button[name="first"]')).toBeVisible();
  await expect(page.locator('button[name="previous"]')).toBeVisible();
  await expect(page.locator('button[name="next"]')).toBeVisible();
  await expect(page.locator('button[name="last"]')).toBeVisible();

  // Check current page button is disabled (page 1)
  const page1 = page.locator('button[name="page-1"]');
  await expect(page1).toBeDisabled();
  await expect(page1).toHaveText('1');

  // Click on page 2 and validate
  await page.locator('button[name="page-2"]').click();
  await expect(page.locator('button[name="page-2"]')).toBeDisabled();

  // Check we still see 10 notes
  await expect(notes).toHaveCount(10);
});