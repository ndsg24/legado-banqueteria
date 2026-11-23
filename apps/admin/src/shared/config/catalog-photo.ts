const thumbnails = import.meta.glob<string>('../../../../web/public/images/catalog/**/*-320.webp', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

export function catalogPhoto(path: string | undefined) {
  return path ? thumbnails['../../../../web/public/' + path] : undefined
}
