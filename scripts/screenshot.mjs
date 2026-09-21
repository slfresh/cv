// Dev tool: real screenshots of the locally served site (npm run dev or http-server on :8080).
// Uses an installed browser (Chrome or Edge) - no browser download. Output: .shots/ (git-ignored).
import { chromium } from 'playwright-core';
import fs from 'fs';

const base = process.env.SHOT_BASE || 'http://localhost:8080';
const pages = (process.env.SHOT_PAGES || '/').split(',');
const sizes = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const scheme = process.env.SHOT_SCHEME || 'light';

fs.mkdirSync('.shots', { recursive: true });
let browser = null;
for (const channel of ['chrome', 'msedge']) {
  try { browser = await chromium.launch({ channel, headless: true }); break; } catch { /* try the next one */ }
}
if (!browser) throw new Error('No installed Chrome or Edge found.');
for (const size of sizes) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    if (scheme === 'dark') await page.evaluate(() => document.documentElement.classList.add('dark'));
    // scroll through the page once so lazy-loaded images are fetched before the capture
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    const slug = (p.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home');
    const file = `.shots/${slug}-${size.name}-${scheme}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log('wrote', file);
  }
  await context.close();
}
await browser.close();
