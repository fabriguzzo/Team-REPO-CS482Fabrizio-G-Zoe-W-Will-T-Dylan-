const { test, expect } = require('@playwright/test');

test('nav button goes to chat page with JS/CSS coverage', async ({ page }) => {
//Fake logged in user
  await page.addInitScript(() => {
    localStorage.setItem('currentUser', JSON.stringify({
      username: "PlaywrightUser",
      role: "player"
    }));
  });

  //Go to Landing Page
  await page.goto('/');

  //Click View Game/Chat Button
  await page.click('a[href="/chatRoom"]');

  //Expect correct URL
  await expect(page).toHaveURL('/chatRoom');

  //Check chat UI loads
  await expect(page.locator('#chat-feed')).toBeVisible();
});
