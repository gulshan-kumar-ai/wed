/**
 * Copies the single-file card (built by `vite build --mode standalone`) to the
 * repository root, where GitHub Pages serves it:
 *   index.html                 the live site, https://gulshan-kumar-ai.github.io/wed/
 *   Wedding Invitation.html    the same card, to open with a double-click
 *
 *   npm run release      then commit and push to publish
 */
import { copyFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const built = fileURLToPath(new URL('../dist-standalone/index.html', import.meta.url));
const kb = Math.round(statSync(built).size / 1024);
for (const name of ['index.html', 'Wedding Invitation.html']) {
  copyFileSync(built, fileURLToPath(new URL(`../../${name}`, import.meta.url)));
}
console.log(`\n✓ Card (${kb} KB) copied to index.html and "Wedding Invitation.html" in the repository root.`);
console.log('  Commit and push to publish it on GitHub Pages.\n');
