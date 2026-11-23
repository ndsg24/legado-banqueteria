const images = import.meta.glob<string>(
  '../../../../../web/public/images/{catalog,ingredients}/**/*.webp',
  { eager: true, query: '?url&no-inline', import: 'default' },
)

export function previewImage(path: string) {
  return images['../../../../../web/public/' + path]
}
