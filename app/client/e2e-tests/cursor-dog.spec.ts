import { devices, test, expect } from '@playwright/test';

test.describe('Cursor-following dog', () => {
  test('moves its pupils toward the pointer', async ({ page }) => {
    await page.goto('/');

    const dog = page.getByTestId('cursor-dog');
    const pupils = page.getByTestId('dog-pupils');
    const bounds = await dog.boundingBox();

    await expect(dog).toBeVisible();
    await expect(dog).toHaveAttribute('data-cursor-ready', 'true');
    if (!bounds) {
      throw new Error('Cursor dog must be visible to test pointer tracking');
    }

    await page.mouse.move(bounds.x + 1, bounds.y + bounds.height / 2);
    await expect(pupils).toHaveAttribute('transform', /translate\(-/);

    await page.mouse.move(bounds.x + bounds.width - 1, bounds.y + bounds.height / 2);
    await expect(pupils).toHaveAttribute('transform', /translate\([1-9]/);
  });

  test('keeps its gaze still when reduced motion is enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const dog = page.getByTestId('cursor-dog');
    const pupils = page.getByTestId('dog-pupils');
    const bounds = await dog.boundingBox();

    await expect(dog).toHaveAttribute('data-cursor-ready', 'true');
    if (!bounds) {
      throw new Error('Cursor dog must be visible to test reduced-motion behavior');
    }

    await page.mouse.move(bounds.x + bounds.width - 1, bounds.y + bounds.height / 2);
    await expect(pupils).toHaveAttribute('transform', 'translate(0 0)');
  });

  test('keeps its eyes centered after a touch tap', async ({ browser }) => {
    const context = await browser.newContext(devices['iPhone 13']);
    const page = await context.newPage();

    await page.goto('/');

    const dog = page.getByTestId('cursor-dog');
    await expect(dog).toBeVisible();
    const beforeTouch = await dog.screenshot({ animations: 'disabled' });
    const bounds = await dog.boundingBox();

    if (!bounds) {
      throw new Error('Cursor dog must be visible to test touch behavior');
    }

    await page.touchscreen.tap(bounds.x + bounds.width - 1, bounds.y + bounds.height / 2);
    const afterTouch = await dog.screenshot({ animations: 'disabled' });

    expect(afterTouch).toEqual(beforeTouch);
    await context.close();
  });
});
