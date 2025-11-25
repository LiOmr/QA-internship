import { test, expect } from '@playwright/test';
import { gotoHome, createTask, openCreateModal, getCreateFormScope } from './helpers';

test.describe('Task Tracker E2E', () => {
    
    test('TC-01 Создание задачи (позитивный)', async ({ page }) => {
      const title = `E2E Task ${Date.now()}`;
      await gotoHome(page);
      await createTask(page, title);
    });
    

    test('TC-02 Создание задачи без названия (негативный)', async ({ page }) => {
        await gotoHome(page);
        await openCreateModal(page);
      
        const scope = await getCreateFormScope(page);
      
        const combos = scope.getByRole('combobox');
        await expect(combos).toHaveCount(4, { timeout: 15_000 });

        await combos.nth(0).click({ force: true });
        await page.getByRole('option', { name: 'Редизайн карточки товара' }).first().click({ force: true });
      
        await combos.nth(1).click({ force: true });
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
      
        await combos.nth(3).click({ force: true });
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
      
        const createBtn = scope.getByRole('button', { name: /^Создать$/i });
        await expect(createBtn).toBeDisabled();
      });

  test('TC-03 Открытие карточки задачи', async ({ page }) => {
    const title = `E2E Task ${Date.now()}`;
    await gotoHome(page);
    await createTask(page, title);

    await page.getByText(title).first().click();

    await expect(page.getByRole('textbox', { name: 'Название' })).toHaveValue(title);
    await expect(page.getByRole('button', { name: /обновить/i })).toBeVisible();
    await expect(page.getByText(/перейти на доску/i)).toBeVisible();
  });

  test('TC-04 Поиск задачи (позитивный)', async ({ page }) => {
    const title = `E2E Task ${Date.now()}`;
    await gotoHome(page);
    await createTask(page, title);

    await page.getByPlaceholder('Поиск').fill(title);
    await expect(page.getByText(title).first()).toBeVisible();
  });

  test('TC-05 Поиск задачи (негативный)', async ({ page }) => {
    await gotoHome(page);
    await page.getByPlaceholder('Поиск').fill(`E2E_DOES_NOT_EXIST_${Date.now()}`);
    await expect(page.getByText(/задачи не найдены/i)).toBeVisible();
  });

  test('TC-06 Переход на доску проекта (из раздела Проекты)', async ({ page }) => {
    await gotoHome(page);

    await page.getByRole('link', { name: /проекты/i }).click();
    await page.getByText(/перейти к доске/i).first().click();

    await expect(page.getByText(/^To Do$/i)).toBeVisible();
    await expect(page.getByText(/^In Progress$/i)).toBeVisible();
    await expect(page.getByText(/^Done$/i)).toBeVisible();
  });
});
