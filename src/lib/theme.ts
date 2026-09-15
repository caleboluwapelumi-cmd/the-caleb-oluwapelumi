import themeCss from '../styles/global.css?raw';

/**
 * Reads the @theme block at build time, so code that needs a token as a plain
 * value (the OG renderer, which can't use CSS) still has exactly one source of
 * truth for colour — no second copy of the palette to drift.
 */
export function parseThemeTokens(css: string): Map<string, string> {
  const block = css.match(/@theme[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  const withoutComments = block.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Map<string, string>();
  for (const match of withoutComments.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens.set(match[1], match[2].trim());
  }
  return tokens;
}

const tokens = parseThemeTokens(themeCss);

export function token(name: string): string {
  const value = tokens.get(name);
  if (!value) throw new Error(`Missing theme token: ${name}`);
  return value;
}
