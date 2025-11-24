module.exports.fakeLogin = async function(page) {
  await page.addInitScript(() => {
    localStorage.setItem('currentUser', JSON.stringify({
      username: "PlaywrightUser",
      role: "player"
    }));
  });
};
