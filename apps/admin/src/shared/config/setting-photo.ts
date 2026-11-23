const samples = import.meta.glob<string>(
  '../../../../web/public/images/{napkins,centerpieces}/*.webp',
  { eager: true, query: '?url&no-inline', import: 'default' },
)

export const settingPhoto = (path: string) =>
  samples['../../../../web/public/images/' + path + '.webp']
