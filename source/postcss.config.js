import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

/**
 * The scenes are sized in svh (the "small viewport" unit), which keeps them steady
 * while a phone's address bar slides in and out. Older iPhones (iOS 15.0–15.3) don't
 * know svh, so every declaration that uses it gets a vh copy just before it, which
 * those phones use instead (browsers skip values they don't understand).
 */
const svhFallback = () => ({
  postcssPlugin: 'svh-fallback',
  Declaration(decl) {
    if (decl.raws.svhFallback || !/\dsvh\b/.test(decl.value)) return;
    decl.raws.svhFallback = true;
    decl.cloneBefore({ value: decl.value.replace(/(\d*\.?\d+)svh\b/g, '$1vh') });
  },
});
svhFallback.postcss = true;

export default {
  plugins: [tailwindcss(), svhFallback(), autoprefixer()],
};
