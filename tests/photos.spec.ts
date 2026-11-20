import { expect, test, type Locator } from '@playwright/test'

async function checkPhoto(locator: Locator, fullSize = false) {
  const failures = await locator.evaluate(async (element, full) => {
    const image = element as HTMLImageElement
    const width = Number(image.getAttribute('width'))
    const height = Number(image.getAttribute('height'))
    const issues: string[] = []
    if (width <= 0 || height <= 0) return [image.src + ' — faltan las dimensiones de referencia']
    const sources = new Map<string, number>()
    const pictureSources = Array.from(image.closest('picture')?.querySelectorAll('source') ?? [])
    const candidates = [image.srcset, ...pictureSources.map((source) => source.srcset)].flatMap(
      (set) => set.split(','),
    )
    for (const source of candidates.filter(Boolean)) {
      const [url, descriptor] = source.trim().split(/\s+/)
      if (!/^\d+w$/.test(descriptor)) issues.push(url + ' — descriptor inválido')
      sources.set(new URL(url, document.baseURI).href, parseInt(descriptor, 10))
    }
    if (!sources.has(image.src)) sources.set(image.src, full || !sources.size ? width : 0)
    for (const [url, expectedWidth] of sources) {
      const path = new URL(url).pathname
      const photo = new Image()
      photo.src = url
      try {
        await photo.decode()
      } catch {
        issues.push(path + ' — archivo ausente o ilegible')
        continue
      }
      const expectedHeight = Math.round(((expectedWidth || photo.naturalWidth) * height) / width)
      if (
        (expectedWidth && photo.naturalWidth !== expectedWidth) ||
        Math.abs(photo.naturalHeight - expectedHeight) > (full ? 0 : 1)
      ) {
        issues.push(
          `${path} — ${photo.naturalWidth}×${photo.naturalHeight}, ` +
            `se esperaba ${expectedWidth || photo.naturalWidth}×${expectedHeight}`,
        )
      }
    }
    return issues
  }, fullSize)
  expect.soft(failures, 'Archivos y dimensiones de las fotografías').toEqual([])
}

test('las fotos de portada y galería se publican con sus variantes y dimensiones', async ({
  page,
}) => {
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort())
  await page.goto('./')
  const covers = page.locator('.cover-photo')
  await expect(covers.first()).toBeAttached()
  for (const cover of await covers.all()) await checkPhoto(cover)
  await page.locator('.memories').scrollIntoViewIfNeeded()
  const thumbnails = page.locator('.memory__open img')
  await expect(thumbnails.first()).toBeAttached()
  for (const thumbnail of await thumbnails.all()) await checkPhoto(thumbnail)
  await page.locator('.memory__open').first().click()
  const fullPhoto = page.locator('.instant-print__image img')
  for (let index = 0; index < (await thumbnails.count()); index++) {
    await expect(fullPhoto).toHaveAttribute(
      'alt',
      (await thumbnails.nth(index).getAttribute('alt'))!,
    )
    await checkPhoto(fullPhoto, true)
    await page.getByRole('button', { name: 'Imagen siguiente' }).click()
  }
})
