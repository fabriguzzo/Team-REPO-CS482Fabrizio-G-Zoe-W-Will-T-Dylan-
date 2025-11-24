const { test, expect } = require('@playwright/test');
const { fakeLogin } = require('./helpers/auth');

test('nav button goes to Schedule page with JS/CSS coverage', async ({ page }) => {

  //Pretend logged in
  await fakeLogin(page);

  //Go to home page
  await page.goto('/');

  //Click Schedule link
  await page.click('a[href="/schedule"]');

  //URL should update
  await expect(page).toHaveURL('/schedule');

  //Check schedule page UI loaded
  await expect(page.locator('#monthHeader')).toBeVisible();

});
