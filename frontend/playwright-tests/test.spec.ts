import { test, expect } from '@playwright/test';

const ROOT = 'http://localhost:3000';

test.beforeEach(async ({ page }) => {
  await page.goto(ROOT);
});

test('read notes', async ({ page }) => {
  const n = await page.locator('.note').count();
});