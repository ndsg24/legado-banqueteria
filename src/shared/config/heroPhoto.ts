// The home document and the table preview use the same candidates so the first download is reused.
export const firstTablePhoto = 'table-encuentro-v1'
export const tablePhotoSizes = [
  '(max-width: 760px) min(520px, 46svh, calc(100vw - 32px))',
  '(max-width: 1100px) min(calc(100svh - 222px), calc(48vw - 31px))',
  '(max-height: 740px) min(430px, calc(100svh - 222px))',
  'min(900px, calc(100svh - 350px), calc(50vw - 42px))',
].join(', ')

export function tablePhotoSources(stem: string) {
  return `${stem}-720.webp 720w, ${stem}.webp 1254w`
}
