const { test, expect } = require('@playwright/test');
const { fakeLogin } = require('./helpers/auth');

test('nav button goes to Ratings page with JS/CSS coverage', async ({ page }) => {
  //Pretend logged in
  await fakeLogin(page);

  // Go to landing page
  await page.goto('/');

  //Click on Ratings link
  await page.click('a[href="/viewRatings"]');

  //Expect URL match
  await expect(page).toHaveURL('/viewRatings');

  //Confirm the Ratings page loads
  await expect(page.locator('h1, h2, h3').first()).toBeVisible();
});
