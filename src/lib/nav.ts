const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/**
 * A section link stays current on its child pages (/work/some-case-study
 * keeps "Work" marked), but "/" only matches itself or it would match everything.
 */
export function isCurrent(pathname: string, href: string): boolean {
  const path = trimSlash(pathname);
  const target = trimSlash(href);
  if (target === '/') return path === '/';
  return path === target || path.startsWith(`${target}/`);
}
