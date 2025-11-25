import { expect, Page, Locator } from '@playwright/test';

export async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/список задач/i)).toBeVisible({ timeout: 30_000 });
}

export async function openCreateModal(page: Page) {
  await page.getByRole('banner')
    .getByRole('button', { name: /^Создать задачу$/i })
    .click();

  await expect(page.getByRole('textbox', { name: 'Название' })).toBeVisible({ timeout: 15_000 });
}

export async function getCreateFormScope(page: Page): Promise<Locator> {
  const title = page.getByRole('textbox', { name: 'Название' });
  await expect(title).toBeVisible({ timeout: 15_000 });

  const scope = title.locator('xpath=ancestor::*[.//button[normalize-space()="Создать"]][1]');
  await expect(scope).toBeVisible({ timeout: 15_000 });
  return scope;
}

async function openListbox(page: Page, field: Locator): Promise<Locator> {
  await expect(field).toBeVisible({ timeout: 15_000 });
  await field.click({ force: true });

  const listbox = page.getByRole('listbox').last();
  await expect(listbox).toBeVisible({ timeout: 15_000 });
  return listbox;
}

async function selectByKeyboard(page: Page, field: Locator) {
  const listbox = await openListbox(page, field);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(listbox).toBeHidden({ timeout: 15_000 }).catch(() => {});
}

async function selectOptionByName(page: Page, field: Locator, optionName: string) {
  const listbox = await openListbox(page, field);

  const opt = page.getByRole('option', { name: optionName }).first();
  await expect(opt).toBeVisible({ timeout: 15_000 });
  await opt.click({ force: true });

  await expect(listbox).toBeHidden({ timeout: 15_000 }).catch(() => {});
}

export async function createTask(page: Page, title: string) {
  await openCreateModal(page);

  const scope = await getCreateFormScope(page);

  await scope.getByRole('textbox', { name: 'Название' }).fill(title);
  await scope.getByRole('textbox', { name: 'Описание' }).fill('Создано автотестом');

  const combos = scope.getByRole('combobox');
  await expect(combos).toHaveCount(4, { timeout: 15_000 });

  await selectOptionByName(page, combos.nth(0), 'Редизайн карточки товара');

  await selectByKeyboard(page, combos.nth(1));

  await selectByKeyboard(page, combos.nth(3));

  const createBtn = scope.getByRole('button', { name: /^Создать$/i });
  await expect(createBtn).toBeEnabled({ timeout: 15_000 });
  await createBtn.click();

  await expect(page.getByText(title).first()).toBeVisible({ timeout: 15_000 });
}
