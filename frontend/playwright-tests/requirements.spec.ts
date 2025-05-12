import { test, expect, APIRequestContext } from '@playwright/test';

const ROOT = 'http://localhost:3000';
const API = 'http://localhost:3001/notes';

/** Seed specified number of notes directly via backend API (idempotent for tests) */
async function seedNotes(request: APIRequestContext, n: number) {
  for (let i = 0; i < n; i++) {
    await request.post(API, {
      data: {
        title: `seed-${Date.now()}-${i}`,
        content: `seed-${i}`,
        author: null,
      },
    });
  }
}

/** Create a single note and return its Mongo _id */
async function createNote(request: APIRequestContext, tag: string) {
  const r = await request.post(API, {
    data: { title: tag, content: tag, author: null },
  });
  return (await r.json())._id as string;
}

test.describe('Frontend full spec without DB assumptions', () => {
  test('pagination rules after seeding 15 notes', async ({ page, request }) => {
    await seedNotes(request, 15); // guarantees >1 page regardless of DB state

    await page.goto(ROOT);

    // Should show 2 numeric buttons for 15 notes (1–10, 11–15)
    await expect(page.locator('button[name^="page-"]')).toHaveCount(2);
    await expect(page.locator('button[name="previous"]')).toBeDisabled();
    await expect(page.locator('button[name="next"]')).toBeEnabled();

    // Navigate to page 2
    await page.getByRole('button', { name: '2' }).click();
    await expect(page.locator('button[name="page-2"]')).toBeDisabled();
    await expect(page.locator('button[name="next"]')).toBeDisabled();
  });

  test('add note flow from any initial state', async ({ page }) => {
    await page.goto(ROOT);
    const before = await page.locator('.note').count();

    await page.getByRole('button', { name: 'Add new note' }).click();
    await page.locator('textarea[name="text_input_new_note"]').fill('play‑add');
    await page.locator('button[name="text_input_save_new_note"]').click();

    await expect(page.locator('.notification')).toHaveText(/Added a new note/);
    await expect(page.locator('.note')).toHaveCount(before + 1);
  });

  test('edit note flow on freshly created note', async ({ page, request }) => {
    const id = await createNote(request, 'tmp-edit');
    await page.goto(ROOT);

    await page.locator(`button[data-testid="edit-${id}"]`).click();
    await page.locator(`textarea[data-testid="text_input-${id}"]`).fill('edited!');
    await page.locator(`button[data-testid="text_input_save-${id}"]`).click();

    await expect(page.locator('.notification')).toHaveText(/Note updated/);
  });

  test('delete note flow on freshly created note', async ({ page, request }) => {
    const id = await createNote(request, 'tmp-delete');
    await page.goto(ROOT);

    const countBefore = await page.locator('.note').count();
    await page.locator(`button[data-testid="delete-${id}"]`).click();
    await expect(page.locator('.notification')).toHaveText(/Note deleted/);
    await expect(page.locator('.note')).toHaveCount(countBefore - 1);
  });
});
