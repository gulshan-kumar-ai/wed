/**
 * Regenerates public/og-image.jpg (1200 × 630, the WhatsApp / social link
 * preview) and public/apple-touch-icon.png from the built hero scene.
 * Uses your installed Chrome or Edge via playwright-core.
 *
 *   npm run og
 */
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

async function launch() {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      /* try the next browser */
    }
  }
  throw new Error('Could not find Chrome or Edge. Install one of them and try again.');
}

const server = await preview({ preview: { port: 4190, strictPort: false } });
const url = server.resolvedUrls.local[0];
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  // Hide the floating music button and the scroll cue
  await page.addStyleTag({ content: '.fixed, [class*="bottom-[max(1.25rem"] { display: none !important; }' });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${publicDir}og-image.jpg`, type: 'jpeg', quality: 84 });

  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(
    `<body style="margin:0;background:#FDF8F0;display:flex;align-items:center;justify-content:center;height:180px"><img src="${url}favicon.svg" style="width:150px;height:150px"></body>`,
  );
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${publicDir}apple-touch-icon.png` });
  console.log('✓ Wrote public/og-image.jpg and public/apple-touch-icon.png');
} finally {
  await browser.close();
  server.httpServer.close();
}
