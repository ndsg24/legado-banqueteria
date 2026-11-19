export function quoteHref(params = new URLSearchParams()) {
  const query = params.toString()
  return '/cotizar.html' + (query ? '?' + query : '')
}
