/**
 * Publishes the build to the repository root, where GitHub Pages serves it:
 *   index.html                 the live site, https://gulshan-kumar-ai.github.io/wed/
 *   Wedding Invitation.html    the same card, to open with a double-click
 *   + the files the card loads next to it (music, service worker, icons, preview image)
 *
 *   npm run release      then commit and push to publish
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const from = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const to = (p) => fileURLToPath(new URL(`../../${p}`, import.meta.url));

const built = from('dist-standalone/index.html');
const kb = Math.round(statSync(built).size / 1024);
for (const name of ['index.html', 'Wedding Invitation.html']) copyFileSync(built, to(name));

const art = (dir) => (existsSync(from(`public/${dir}`)) ? readdirSync(from(`public/${dir}`)).filter((f) => !f.endsWith('.txt')).map((f) => `${dir}/${f}`) : []);
const assets = [...art('art/events'), 'audio/ambient.mp3', 'sw.js', 'manifest.webmanifest', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-image.jpg'];
const copied = [];
for (const file of assets) {
  if (!existsSync(from(`public/${file}`))) continue;
  mkdirSync(dirname(to(file)), { recursive: true });
  copyFileSync(from(`public/${file}`), to(file));
  copied.push(file);
}

console.log(`\n✓ Card (${kb} KB) copied to index.html and "Wedding Invitation.html" in the repository root,`);
console.log(`  with ${copied.join(', ')}.`);
console.log('  Commit and push to publish it on GitHub Pages.\n');
