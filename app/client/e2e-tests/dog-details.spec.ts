import { test, expect } from '@playwright/test';

const apiProxyPort = process.env.API_PROXY_PORT || '5101';

test.describe('Dog Details', () => {
  test('should navigate to dog details from homepage', async ({ page }) => {
    await page.goto('/');

    const firstDogCard = page.getByTestId('dog-card').first();
    const dogName = await page.getByTestId('dog-name').first().textContent();

    await firstDogCard.click();

    await expect(page).toHaveURL(/\/dog\/\d+/);
    await expect(page).toHaveTitle(/Dog Details - Tailspin Shelter/);
    await expect(page.getByTestId('dog-details')).toBeVisible();
    await expect(page.getByTestId('dog-name')).toHaveText(dogName!);
  });

  test('should display full dog details for Buddy', async ({ page }) => {
    await page.goto('/dog/1');

    await expect(page.getByTestId('dog-details')).toBeVisible();
    await expect(page.getByTestId('dog-name')).toHaveText('Buddy');
    await expect(page.getByTestId('dog-breed')).toContainText('Golden Retriever');
    await expect(page.getByTestId('dog-age')).toContainText('3');
    await expect(page.getByTestId('dog-gender')).toContainText('Male');
    await expect(page.getByTestId('dog-status')).toHaveText('Available');
    await expect(page.getByTestId('dog-description')).toContainText('friendly and loyal');
  });

  test('should navigate back to homepage from dog details', async ({ page }) => {
    await page.goto('/dog/1');

    await page.getByTestId('back-link').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Shelter' })).toBeVisible();
  });

  test('should handle invalid dog ID gracefully', async ({ page }) => {
    await page.goto('/dog/99999');

    await expect(page).toHaveTitle(/Dog Details - Tailspin Shelter/);
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('back-link')).toBeVisible();
  });

  test('should submit an adoption request and show the pending status', async ({ page }) => {
    await page.goto('/dog/4');

    await expect(page.getByTestId('dog-status')).toHaveText('Available');
    await expect(page.getByTestId('adoption-form')).toBeVisible();
    await expect(page.getByTestId('adoption-form')).toHaveAttribute('data-hydrated', 'true');
    await page.getByLabel('Your name').fill('Alex Example');
    await page.getByLabel('Your email').fill('alex@example.com');
    await page.getByTestId('adoption-submit').click();

    await expect(page.getByTestId('adoption-success')).toHaveText(
      'Your adoption request has been submitted.',
    );
    await expect(page.getByTestId('dog-status')).toHaveText('Pending Adoption');
    await expect(page.getByTestId('adoption-form')).toHaveCount(0);
  });

  test('should show field validation without changing dog status', async ({ page }) => {
    await page.goto('/dog/7');
    await expect(page.getByTestId('adoption-form')).toHaveAttribute('data-hydrated', 'true');
    await page.getByLabel('Your name').fill('A');
    await page.getByLabel('Your email').fill('alex@example.com');
    await page.getByTestId('adoption-submit').click();

    await expect(page.getByText('Enter a name between 2 and 100 characters.')).toBeVisible();
    await expect(page.getByTestId('dog-status')).toHaveText('Available');
    await expect(page.getByTestId('adoption-success')).toHaveCount(0);
  });

  test('should show an API error and keep the dog available', async ({ page }) => {
    const fixtureResponse = await page.request.post(
      `http://127.0.0.1:${apiProxyPort}/__test/adoption-response?dogId=8`,
      { data: { status: 503, payload: { error: 'Adoption service unavailable' } } },
    );
    expect(fixtureResponse.status()).toBe(204);

    await page.goto('/dog/8');
    await expect(page.getByTestId('adoption-form')).toHaveAttribute('data-hydrated', 'true');
    await page.getByLabel('Your name').fill('Alex Example');
    await page.getByLabel('Your email').fill('alex@example.com');
    await page.getByTestId('adoption-submit').click();

    await expect(page.getByTestId('adoption-error')).toHaveText('Adoption service unavailable');
    await expect(page.getByTestId('dog-status')).toHaveText('Available');
    await expect(page.getByTestId('adoption-form')).toBeVisible();
  });

  test('should not offer an adoption request for a pending dog', async ({ page }) => {
    await page.goto('/dog/2');

    await expect(page.getByTestId('dog-status')).toHaveText('Pending Adoption');
    await expect(page.getByTestId('adoption-form')).toHaveCount(0);
  });
});
