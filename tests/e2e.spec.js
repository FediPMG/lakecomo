import { test, expect } from '@playwright/test';

test.describe('Wedding Guest Guide E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the homepage with Venue tab active by default', async ({ page }) => {
        await expect(page).toHaveTitle(/Federica & Max/);
        const venueTab = page.locator('#view-venue');
        await expect(venueTab).toBeVisible();
        await expect(page.locator('#tab-venue')).toHaveClass(/active/);
    });

    test('should switch main tabs correctly', async ({ page }) => {
        // Venue -> Schedule
        await page.click('#tab-schedule');
        await expect(page.locator('#view-venue')).toBeHidden();
        await expect(page.locator('#view-schedule')).toBeVisible();

        // Schedule -> Hotels
        await page.click('#tab-hotels');
        await expect(page.locator('#view-schedule')).toBeHidden();
        await expect(page.locator('#view-hotels')).toBeVisible();

        // Hotels -> FAQ
        await page.click('#tab-faq');
        await expect(page.locator('#view-hotels')).toBeHidden();
        await expect(page.locator('#view-faq')).toBeVisible();
    });

    test('should handle Transport sub-tabs correctly', async ({ page }) => {
        // Go to Transport
        await page.click('#tab-transport');
        await expect(page.locator('#view-transport')).toBeVisible();

        // Default sub-tab should be Parking (or whatever logic sets)
        // Let's explicitly click Taxi
        await page.click('#sub-tab-taxi');
        await expect(page.locator('#view-parking')).toBeHidden();
        await expect(page.locator('#view-taxi')).toBeVisible();

        // Click Airports
        await page.click('#sub-tab-airports');
        await expect(page.locator('#view-taxi')).toBeHidden();
        await expect(page.locator('#view-airports')).toBeVisible();
    });

    test('REGRESSION TEST: Transport sub-tabs should be hidden when switching main tabs', async ({ page }) => {
        // 1. Go to Transport -> Sub-tab Parking
        await page.click('#tab-transport');
        await page.click('#sub-tab-parking');
        await expect(page.locator('#view-parking')).toBeVisible();

        // 2. Switch to FAQ
        await page.click('#tab-faq');

        // 3. Verify Transport container AND Sub-tab Parking are hidden
        await expect(page.locator('#view-transport')).toBeHidden();
        await expect(page.locator('#view-parking')).toBeHidden(); // This failed before the fix
    });

    test('should toggle language (EN/IT)', async ({ page }) => {
        // Default EN
        await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
        await expect(page.locator('#tab-venue span.lang-en')).toBeVisible();
        await expect(page.locator('#tab-venue span.lang-it')).toBeHidden();

        // Switch to IT
        await page.click('#lang-btn-it');
        await expect(page.locator('html')).toHaveAttribute('data-lang', 'it');
        await expect(page.locator('#tab-venue span.lang-en')).toBeHidden();
        await expect(page.locator('#tab-venue span.lang-it')).toBeVisible();

        // Check specific content update
        await expect(page.locator('#tab-schedule span.lang-it')).toHaveText('Programma');
    });

});
