import { expect, test as base } from '@playwright/test'
import { readFile } from 'node:fs/promises'

declare global {
  interface Window {
    recordPolicyViolation(rule: string): void
  }
}

const test = base.extend<{ policy: void }>({
  policy: [
    async ({ page }, use) => {
      const violations: string[] = []
      await page.exposeFunction('recordPolicyViolation', (rule: string) => violations.push(rule))
      await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (event) =>
          window.recordPolicyViolation(
            [
              event.effectiveDirective,
              event.blockedURI,
              event.sourceFile,
              event.lineNumber,
              event.columnNumber,
            ].join(' '),
          ),
        )
      })
      await use()
      expect(violations, 'El navegador bloqueó un recurso del sitio').toEqual([])
    },
    { auto: true },
  ],
})

test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort())
})

test('el álbum conserva las flechas y devuelve el foco a la foto', async ({ page }) => {
  await page.goto('./#galeria')
  const opener = page.getByRole('button', { name: 'Ampliar: Cuando cae la noche' })
  await opener.click()
  const album = page.getByRole('dialog', { name: 'Álbum de celebraciones' })
  const next = album.getByRole('button', { name: 'Imagen siguiente' })
  const position = await next.boundingBox()
  for (let i = 0; i < 3; i++) await next.click()
  await expect(album.getByRole('heading', { name: 'Antes de que lleguen.' })).toBeVisible()
  expect(await next.boundingBox()).toEqual(position)
  await page.keyboard.press('Escape')
  await expect(opener).toBeFocused()
})

test('la carta exhibe las salsas y permite volver a la galería', async ({ page }) => {
  await page.goto('carta.html')
  await page.getByRole('button', { name: /Menú & celebración/ }).click()
  await page.getByRole('button', { name: /Salsas/ }).click()
  await expect(page.getByRole('heading', { name: 'Salsa de carne', exact: true })).toBeVisible()
  const menu = page.getByRole('button', { name: 'Abrir menú' })
  if (await menu.isVisible()) {
    await menu.click()
    await page
      .getByRole('navigation', { name: 'Navegación móvil' })
      .getByRole('link', { name: /Galería/ })
      .click()
  } else {
    await page.locator('summary').filter({ hasText: 'Conoce Legado' }).click()
    await page.getByRole('link', { name: /Galería.*Momentos/ }).click()
  }
  await expect(page).toHaveURL(/\/#galeria$/)
  await expect(page.locator('#gallery-title')).toBeInViewport()
})

test('el cotizador valida el evento y conserva los campos al retroceder', async ({ page }) => {
  await page.goto('cotizar.html')
  const next = page.getByRole('button', { name: 'Continuar' })
  await next.click()
  await expect(page.getByText('Elige una comuna.', { exact: true })).toBeVisible()
  await page.getByText('Matrimonio', { exact: true }).click()
  const guests = page.getByLabel('Invitados aproximados')
  await guests.fill('48')
  await page.getByRole('button', { name: /Elegir comuna/ }).click()
  await page.getByPlaceholder('Buscar comuna…').fill('concepcion')
  await page.getByRole('option', { name: 'Concepción' }).click()
  await page.getByRole('button', { name: /Elegir fecha/ }).click()
  const calendar = page.getByRole('dialog', { name: 'Elegir la fecha del evento' })
  await calendar
    .locator('.react-aria-CalendarCell:not([data-disabled]):not([data-outside-month])')
    .first()
    .click()
  await next.click()
  await expect(page.getByRole('heading', { name: '¿Qué servimos?' })).toBeVisible()
  await page.getByRole('button', { name: 'Atrás', exact: true }).click()
  await expect(guests).toHaveValue('48')
  await expect(page.getByRole('button', { name: /Concepción.*Comuna/ })).toBeVisible()
  await next.click()
  await next.click()
  await next.click()
  await page.getByLabel('Nombre', { exact: true }).fill('Prueba Local')
  await page.getByLabel('Correo electrónico').fill('prueba@example.org')
  await page.getByRole('button', { name: 'Revisar mi cotización' }).click()
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Descargar PDF' }).click()
  const download = await downloadEvent
  expect(await download.failure()).toBeNull()
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i)
  const contents = await readFile(await download.path())
  expect(contents.subarray(0, 5).toString()).toBe('%PDF-')
})

test('la vajilla y los puestos se conservan al recargar el diseño', async ({ page }) => {
  await page.goto('ambientacion.html')
  const tab = page.getByRole('tab', { name: 'Montaje y vajilla' })
  await tab.click()
  const seat = page
    .getByRole('group', { name: 'Cantidad de sillas' })
    .getByRole('button', { name: '8', exact: true })
  const plate = page.getByRole('button', { name: 'Porcelana blanca' })
  await seat.click()
  await plate.click()
  await expect(page).toHaveURL(/dinnerware=porcelain/)
  await page.reload()
  await tab.click()
  await expect(seat).toHaveAttribute('aria-pressed', 'true')
  await expect(plate).toHaveAttribute('aria-pressed', 'true')
})

test('las cuatro páginas aplican la política antes de cargar recursos', async ({ request }) => {
  for (const path of ['index.html', 'carta.html', 'ambientacion.html', 'cotizar.html']) {
    const response = await request.get(path)
    expect(response.ok()).toBe(true)
    const html = await response.text()
    const canonical =
      'https://ndsg24.github.io/legado-banqueteria/' + (path === 'index.html' ? '' : path)
    expect(html).toContain(`<link rel="canonical" href="${canonical}"`)
    expect(html).toContain(
      `<meta property="og:url" data-route-meta="canonical" content="${canonical}"`,
    )
    const policy = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/i)
    const directives = policy?.[1].replace(/&#39;/g, "'")
    expect(directives).toContain("script-src 'self';")
    expect(directives).toContain("object-src 'none'")
    expect(html.indexOf('Content-Security-Policy')).toBeLessThan(html.search(/<(script|link)\b/i))
  }
})

test('carta, mesa y cotización comparten documento e historial', async ({ page }) => {
  await page.goto('./')
  const documents: string[] = []
  page.on('request', (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documents.push(request.url())
  })
  await page.getByRole('link', { name: 'Descubre la carta' }).click()
  await expect(page).toHaveTitle(/Carta de cóctel/)
  await page.locator('.catalog__studio-invite').click()
  await expect(page).toHaveTitle(/Diseña tu mesa/)
  await page.getByRole('link', { name: 'Consultar esta ambientación' }).click()
  await expect(page).toHaveURL(/cotizar\.html\?.*mesa=1/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cotiza tu')
  await page.goBack()
  await expect(page).toHaveTitle(/Diseña tu mesa/)
  await page.goForward()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /cotizar\.html$/)
  expect(documents).toEqual([])
})

test('los enlaces antiguos al cotizador conservan la selección', async ({ page }) => {
  await page.goto('./?plato=demo#cotizar')
  await expect(page).toHaveURL(/cotizar\.html\?plato=demo$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cotiza tu')
})

test('una ruta en caché abre sin destello del loader', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  await page.getByRole('link', { name: 'Descubre la carta' }).click()
  await expect(page.locator('#catalog-title')).toBeVisible()
  await expect(page.locator('.page-transition')).toBeHidden()
  const activations = await page.evaluate(async () => {
    const root = document.documentElement
    let observed = 0
    const record = new MutationObserver((changes) => {
      observed += changes.length
    })
    record.observe(root, { attributes: true, attributeFilter: ['data-page-transition'] })
    document.querySelector<HTMLAnchorElement>('a.brand')!.click()
    while (!document.getElementById('hero-title')) await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    observed += record.takeRecords().length
    record.disconnect()
    return observed
  })
  expect(activations).toBe(0)
})

test('una carga lenta muestra el loader opaco y después la página', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const overlay = page.locator('.page-transition')
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/assets/*.js', async (route) => {
    await gate
    await route.continue()
  })
  await page.getByRole('link', { name: 'Descubre la carta' }).click()
  try {
    await expect(overlay).toBeVisible()
    await expect(overlay).toHaveCSS('opacity', '1')
    await expect(page.locator('#root')).toHaveCSS('opacity', '0')
    await expect(page.locator('#root')).toHaveJSProperty('inert', true)
  } finally {
    release()
  }
  await expect(overlay).toBeHidden()
  await expect(page.locator('#root')).toHaveCSS('opacity', '1')
  await expect(page.locator('#root')).toHaveJSProperty('inert', false)
  await expect(page.locator('#catalog-title')).toBeInViewport()
})

test('la firma queda debajo del contenido y las franjas del tríptico se amplían en reposo', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const scene = page.locator('.hero-triptych[data-idle]')
  await expect(scene).toBeVisible()
  const middle = scene.locator('.hero-triptych__cut').nth(1)
  const readEdges = () => middle.evaluate((item) => getComputedStyle(item).clipPath)
  const initial = await readEdges()
  await expect.poll(readEdges).not.toEqual(initial)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(scene).toHaveCSS('animation-name', 'none')
  const signature = await page.locator('.hero__signature').boundingBox()
  for (const selector of ['.living-hero__content', '.hero-triptych']) {
    const box = await page.locator(selector).boundingBox()
    expect(box!.y + box!.height).toBeLessThan(signature!.y)
  }
  if (page.viewportSize()!.width > 760) {
    await page.setViewportSize({ width: 1676, height: 959 })
    await expect(page.locator('.hero__scroll')).toBeInViewport({ ratio: 1 })
    await expect(page.locator('.hero__signature')).toBeInViewport({ ratio: 1 })
  }
})

test('el tríptico permite explorar cada mesa y volver con teclado', async ({ page }) => {
  await page.goto('./')
  const triptych = page.locator('.hero-triptych')
  await expect(triptych).toHaveAttribute('data-ready', 'true')
  await expect(triptych.getByRole('img')).toHaveCount(3)
  const chapter = triptych.getByRole('button', { name: 'Explorar «Brindis»' })
  const label = chapter.locator('.hero-triptych__label')
  if (await page.evaluate(() => matchMedia('(hover: hover)').matches)) {
    await expect(label).toHaveCSS('opacity', '0')
    await chapter.getByText('Brindis').hover()
  }
  await expect(label).toHaveCSS('opacity', '1')
  await chapter.getByText('Brindis').click()
  const back = triptych.getByRole('button', { name: 'Volver al tríptico' })
  await expect(back).toHaveAttribute('aria-expanded', 'true')
  await expect(back).toContainText('Medallón y vino tinto')
  await back.press('Escape')
  await expect(chapter).toBeFocused()
  await expect(chapter).toHaveAttribute('aria-expanded', 'false')
  await chapter.press('Enter')
  await back.click()
  await expect(chapter).toBeVisible()
})

test('la carta carga los efectos 3D solo donde hay hover y movimiento', async ({ page }) => {
  const effects: string[] = []
  page.on('request', (request) => {
    if (/\/assets\/three\.module-/.test(request.url())) effects.push(request.url())
  })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('carta.html')
  const grid = page.locator('.catalog__grid')
  await grid.scrollIntoViewIfNeeded()
  const first = grid.locator('.catalog-card__image').first()
  await expect(first).toHaveAttribute('data-image-settled', 'true')
  if (await page.evaluate(() => matchMedia('(any-hover: hover)').matches)) {
    await expect.poll(() => effects.length).toBeGreaterThan(0)
  } else {
    await expect(grid).toHaveAttribute('data-visuals', 'fallback')
    expect(effects).toHaveLength(0)
  }
})

test.describe('idiomas del sitio', () => {
  test.use({ locale: 'en-US' })

  test('empieza en español, recuerda el idioma y mantiene la cotización al cambiarlo', async ({
    page,
  }) => {
    await page.goto('./')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-CL')
    await expect(page.locator('h1')).toContainText('Hay mesas')
    const picker = page.locator('.language-picker')
    const trigger = picker.locator('summary')
    await trigger.focus()
    await page.keyboard.press('Enter')
    for (const [name, flag] of Object.entries({
      Español: 'cl',
      English: 'us',
      Français: 'fr',
      Português: 'br',
    })) {
      const option = picker.getByRole('button', { name, exact: true })
      await expect(option.locator('img')).toHaveAttribute('src', new RegExp('/' + flag + '[-.]'))
      await expect(option).toHaveAttribute('aria-pressed', String(flag === 'cl'))
    }
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(picker.getByRole('button', { name: 'English' })).toBeHidden()
    const choose = async (name: string) => {
      await page.locator('.language-picker summary').click()
      await page.getByRole('button', { name, exact: true }).click()
    }
    await choose('English')
    await expect(page.locator('h1')).toContainText('Some tables')
    await page.getByRole('link', { name: 'Discover the menu', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Savory bites.' })).toBeVisible()
    await choose('Français')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR')
    await expect(page.getByRole('heading', { name: 'Bouchées salées.' })).toBeVisible()
    await page.goto('ambientacion.html')
    await expect(page.locator('h1')).toContainText('Votre table.')
    await page.goto('cotizar.html')
    await page.getByRole('button', { name: 'Continuer', exact: true }).click()
    await expect(page.getByText('Choisissez une commune.', { exact: true })).toBeVisible()
    await page.getByLabel('Nombre approximatif d’invités').fill('62')
    await choose('Português')
    await expect(page.getByLabel('Estimativa de convidados')).toHaveValue('62')
    await expect(page.getByText('Escolha um município.', { exact: true })).toBeVisible()
    await choose('Español')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-CL')
    await expect(page.getByLabel('Invitados aproximados')).toHaveValue('62')
  })
})
