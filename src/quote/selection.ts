export function quoteHref(params = new URLSearchParams()) {
  const query = params.toString()
  return import.meta.env.BASE_URL + 'cotizar.html' + (query ? '?' + query : '')
}
