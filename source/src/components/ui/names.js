/** Name helpers for couples in the wedding config (falls back gracefully if fields are missing). */
export const groomFull = (c) => c.groomName || c.groom;
export const brideFull = (c) => c.brideName || c.bride;
export const withTitle = (title, name) => (title ? `${title} ${name}` : name);
export const groomFormal = (c) => withTitle(c.groomTitle, groomFull(c));
export const brideFormal = (c) => withTitle(c.brideTitle, brideFull(c));
