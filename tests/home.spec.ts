import { test, expect } from '@playwright/test';
import { projectsInfo } from '@/shared/constants';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Three.js projects/);
  await expect(
    page.getByRole('heading', { name: 'My collection Three.js' }),
  ).toBeVisible();
});

test('all projects with video', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#projects video')).toHaveCount(
    projectsInfo.length,
  );
});

test('videos played', async ({ page, browser, browserName }) => {
  if (browserName === 'chromium') {
    test.skip();
  }

  const context = await browser.newContext({ bypassCSP: true });
  page = await context.newPage();

  await page.goto('/');
  const video = page.locator('#projects video').first();
  await page.waitForTimeout(1000);
  const isPlaying = await video.evaluate((video) => {
    const videoElement = video as HTMLVideoElement;
    return !videoElement.paused;
  });
  expect(isPlaying).toBe(true);
});

test('video set pause and play', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projects .js-play-btn').first().click();
  const video = page.locator('#projects video').first();
  const isPlaying = await video.evaluate((video) => {
    const videoElement = video as HTMLVideoElement;
    return !videoElement.paused;
  });
  expect(isPlaying).toBe(false);
});

test('canvas click and return to home, check count canvas', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#projects button.js-show-project').first().click();
  await expect(page.locator('#threejs-app-container')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
  await page.locator('canvas').click({
    position: {
      x: 500,
      y: 500,
    },
  });
  await page.getByRole('link', { name: 'Home' }).click();
});
