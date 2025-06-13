import { test, expect, APIRequestContext } from '@playwright/test';

const ROOT = 'http://localhost:3000';
const API  = 'http://localhost:3001/notes';

async function seedNotes(request: APIRequestContext, n: number) {
  for (let i = 0; i < n; i++) {
    await request.post(API, {
      data: { title: `seed-${Date.now()}-${i}`, content: `seed-${i}`, author: null },
    });
  }
}
async function createNote(request: APIRequestContext, tag: string) {
  const r = await request.post(API, { data: { title: tag, content: tag, author: null } });
  return (await r.json())._id as string;
}

test.describe('Frontend spec', () => {
  test('pagination rules after seeding 15 notes', async ({ page, request }) => {
    await seedNotes(request, 15);
    await page.goto(ROOT);

    await expect(page.locator('button[name="previous"]')).toBeDisabled();
    await expect(page.locator('button[name="next"]')).toBeEnabled();

    await page.getByRole('button', { name: '2' }).click();
    await expect(page.locator('button[name="page-2"]')).toBeDisabled();
  });

  test('add note flow', async ({ page }) => {
    await page.goto(ROOT);
    await page.getByRole('button', { name: 'Add new note' }).click();
    await page.locator('textarea[name="text_input_new_note"]').fill('play-add');
    await page.locator('button[name="text_input_save_new_note"]').click();
    await expect(page.locator('.notification')).toHaveText(/Added a new note/);
  });

  test('edit note flow', async ({ page, request }) => {
    const id = await createNote(request, 'tmp-edit');
    await page.goto(ROOT);
    await page.locator(`button[data-testid="edit-${id}"]`).click();
    await page.locator(`textarea[data-testid="text_input-${id}"]`).fill('edited!');
    await page.locator(`button[data-testid="text_input_save-${id}"]`).click();
    await expect(page.locator('.notification')).toHaveText(/Note updated/);
  });

  test('delete note flow', async ({ page, request }) => {
    const id = await createNote(request, 'tmp-delete');
    await page.goto(ROOT);
    await page.locator(`button[data-testid="delete-${id}"]`).click();
    await expect(page.locator('.notification')).toHaveText(/Note deleted/);
  });
});