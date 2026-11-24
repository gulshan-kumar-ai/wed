import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { wedding } from './src/config/wedding.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Builds <title>, description and OpenGraph / Twitter tags from the wedding
 * config, so WhatsApp link previews always match the names and dates.
 * Crawlers need absolute image URLs: set VITE_SITE_URL (see .env.example).
 */
function socialMeta(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  const site = (env.VITE_SITE_URL || '').replace(/\/+$/, '');
  const [a, b] = wedding.couples;
  const names = `${a.groom} & ${a.bride} · ${b.groom} & ${b.bride}`;
  const title = `${wedding.subtitle} · ${names}`;
  const description = `With the blessings of Lord Ganesha, you are warmly invited to the double wedding of twin brothers in ${wedding.location} · ${wedding.dates}`;
  const image = `${site}/og-image.jpg`;

  const tags = [
    `<title>${esc(title)} · ${esc(wedding.location)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(wedding.subtitle)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    site && `<meta property="og:url" content="${esc(site)}/" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    site.startsWith('https') && `<meta property="og:image:secure_url" content="${esc(image)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(`${names}, ${wedding.location}`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ].filter(Boolean);

  return {
    name: 'social-meta',
    transformIndexHtml(html) {
      if (!site && mode === 'production') {
        console.warn('\n⚠  VITE_SITE_URL is not set, so WhatsApp link previews will show no thumbnail. See .env.example.\n');
      }
      return html.replace('<!-- __SOCIAL_META__ -->', tags.join('\n    '));
    },
  };
}

export default defineConfig(({ mode }) => {
  // `npm run standalone`: one self-contained HTML file that opens with a double-click (no server needed)
  if (mode === 'standalone') {
    return {
      base: './',
      plugins: [react(), socialMeta(mode), viteSingleFile()],
      build: { outDir: 'dist-standalone', assetsInlineLimit: 100000000 },
    };
  }
  return { plugins: [react(), socialMeta(mode)] };
});
