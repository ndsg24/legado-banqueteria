// Keep the document preload and the visible photo on the same responsive candidate.
export const tableSettings = ['dorada', 'floral', 'burdeos'] as const
export const tablePhotoDirectory = 'hero-place-settings/'
export const firstTablePhoto = tablePhotoDirectory + tableSettings[0]
export const tablePhotoSizes = [
  '(orientation: landscape) and (max-height: 500px) and (max-width: 980px) min(100vw, 80svh)',
  '(max-width: 620px) min(100vw, 80svh)',
  '(orientation: portrait) and (max-width: 1100px) min(100vw, 80svh)',
  '(any-pointer: coarse) and (max-width: 1440px) min(100vw, 80svh)',
  '80svh',
].join(', ')

export function tablePhotoSources(stem: string, format: 'avif' | 'webp' = 'webp') {
  const widths = format === 'avif' ? [480, 800, 1122, 1600, 2244, 4488] : [800, 1122, 2244, 4488]
  return widths.map((width) => `${stem}-${width}.${format} ${width}w`).join(', ')
}
