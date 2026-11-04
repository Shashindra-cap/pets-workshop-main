import { test, expect } from '@playwright/test';

test.describe('Homepage listing states', () => {
  test('shows the empty state when the API returns no dogs', async ({ page }) => {
    await page.request.post('http://127.0.0.1:5101/__test/response?page=901', {
      data: {
        payload: { dogs: [], page: 901, total_pages: 1 },
      },
    });
    await page.goto('/?page=901');

    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Shelter' })).toBeVisible();
    await expect(page.getByTestId('empty-state')).toHaveText('No dogs available at the moment.');
    await expect(page.getByTestId('dog-list')).toHaveCount(0);
    await expect(page.getByTestId('pagination')).toHaveCount(0);
  });

  test('shows the exact HTTP error without listing or pagination', async ({ page }) => {
    await page.request.post('http://127.0.0.1:5101/__test/response?page=902', {
      data: {
        status: 503,
        statusText: 'Service Unavailable',
        payload: { error: 'unavailable' },
      },
    });
    await page.goto('/?page=902');

    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Shelter' })).toBeVisible();
    await expect(page.getByTestId('error-message')).toHaveText(
      'Failed to fetch data: 503 Service Unavailable',
    );
    await expect(page.getByTestId('dog-list')).toHaveCount(0);
    await expect(page.getByTestId('pagination')).toHaveCount(0);
  });

  test('shows the request error when the API connection fails', async ({ page }) => {
    await page.request.post('http://127.0.0.1:5101/__test/response?page=903', {
      data: { networkError: true },
    });
    await page.goto('/?page=903');

    await expect(page.getByRole('heading', { name: 'Welcome to Tailspin Shelter' })).toBeVisible();
    await expect(page.getByTestId('error-message')).toHaveText('Error: fetch failed');
    await expect(page.getByTestId('dog-list')).toHaveCount(0);
    await expect(page.getByTestId('pagination')).toHaveCount(0);
  });

  test('uses page 1 for invalid page queries', async ({ page }) => {
    for (const query of ['not-a-number', '0', '-2']) {
      await page.goto(`/?page=${query}`);
      await expect(page.getByTestId('pagination-info')).toHaveText('Page 1 of 2');
      await expect(page.getByTestId('dog-name').first()).toHaveText('Buddy');
      await expect(page.getByTestId('dog-card')).toHaveCount(6);
    }
  });

  test('shows page 2 metadata and returns to page 1 with Previous', async ({ page }) => {
    await page.goto('/?page=2');

    await expect(page.getByTestId('dog-card')).toHaveCount(4);
    await expect(page.getByTestId('pagination-info')).toHaveText('Page 2 of 2');
    await page.getByTestId('pagination-prev').click();

    await expect(page).toHaveURL('/?page=1');
    await expect(page.getByTestId('pagination-info')).toHaveText('Page 1 of 2');
    await expect(page.getByTestId('dog-card')).toHaveCount(6);
  });
});
