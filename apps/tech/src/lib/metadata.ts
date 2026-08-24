export function stableSiteUrl(url: URL, pathname = url.pathname) {
  return `https://${url.host}${pathname}`;
}
