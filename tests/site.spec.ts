import { expect, test as base, type Page } from '@playwright/test'
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

test('el selector de temas muestra sus paletas y conserva Piscina al navegar', async ({ page }) => {
  await page.goto('./')
  const root = page.locator('html')
  const openMenu = page.getByRole('button', { name: 'Abrir menú' })
  const picker = page.getByLabel(/^Tema de color:/).filter({ visible: true })
  const options = page.getByRole('group', { name: 'Tema de color' })

  async function openPicker() {
    await expect(page.locator('.site-header')).toBeVisible()
    if (await openMenu.isVisible()) await openMenu.click()
    await picker.click()
  }

  await openPicker()
  await expect(options.getByRole('button')).toHaveCount(4)
  for (const [label, value] of [
    ['Noche', 'dark'],
    ['Día', 'light'],
    ['Jardín', 'garden'],
    ['Piscina', 'pool'],
  ]) {
    await options.getByRole('button', { name: label, exact: true }).click()
    await expect(root).toHaveAttribute('data-theme', value)
    await expect(picker).toBeFocused()
    await picker.press('Enter')
    await expect(options.getByRole('button', { name: label, pressed: true })).toBeVisible()
  }

  await picker.press('Escape')
  await expect(options).toBeHidden()
  await expect(picker).toBeFocused()
  for (const path of ['carta.html', 'ambientacion.html', 'cotizar.html']) {
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
    await expect(root).toHaveAttribute('data-theme', 'pool')
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(225, 242, 239)')
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#e1f2ef')
  }
  await page.reload()
  await openPicker()
  await expect(options.getByRole('button', { name: 'Piscina', pressed: true })).toBeVisible()
})

async function chooseCatalogFilter(page: Page, name: string) {
  const picker = page.getByRole('button', { name: /Categorías de la carta/ })
  await expect(picker.or(page.getByRole('group', { name: 'Categorías de la carta' }))).toBeVisible()
  if (await picker.isVisible()) {
    await picker.click()
    await page.getByRole('option', { name, exact: true }).click()
  } else {
    await page
      .getByRole('group', { name: 'Categorías de la carta' })
      .getByRole('button', { name, exact: true })
      .click()
  }
}

async function expectCatalogFilter(page: Page, name: string) {
  const picker = page.getByRole('button', { name: /Categorías de la carta/ })
  await expect(picker.or(page.getByRole('group', { name: 'Categorías de la carta' }))).toBeVisible()
  if (await picker.isVisible()) await expect(picker).toHaveText(name)
  else
    await expect(
      page
        .getByRole('group', { name: 'Categorías de la carta' })
        .getByRole('button', { name, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true')
}

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

test('la carta distingue escritorio de iPad horizontal al mismo ancho', async ({
  page,
}, testInfo) => {
  const touch = testInfo.project.use.hasTouch === true
  await page.setViewportSize({ width: 1194, height: 834 })
  await page.goto('carta.html?categoria=principales')
  const catalog = page.locator('#carta')
  const invite = catalog.getByRole('link', { name: 'Diseña tu mesa' })
  const cards = catalog.locator('.catalog-card')
  if (touch) {
    await expect(catalog.locator('h1')).toHaveText('La carta.')
    await expect(cards.first()).toBeInViewport()
    await expect(cards.first().locator('.quote-dish__tag')).toHaveCount(0)
    await expect(invite).not.toBeInViewport()
    await page.setViewportSize({ width: 834, height: 1194 })
    await expectCatalogFilter(page, 'Principales')
    await expect(cards.first()).toBeInViewport()
  } else {
    await expect(catalog.locator('h1')).toContainText('El sabor de')
    await expect(catalog.locator('header')).toContainText('La mesa también')
    await expect(invite).toBeInViewport()
    await expect(cards.first().locator('.quote-dish__tag')).toHaveText('Principales')
    await expect(catalog.locator('.catalog__toolbar')).toHaveCSS('position', 'static')
  }
})

test('la carta exhibe las salsas y permite volver a la galería', async ({ page }) => {
  await page.goto('carta.html')
  await page
    .getByRole('group', { name: 'Elige una carta' })
    .getByRole('button', { name: /Menú/ })
    .click()
  await chooseCatalogFilter(page, 'Salsas')
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

test('Cóctel reúne todas sus categorías y permite filtrarlas', async ({ page }) => {
  await page.goto('carta.html?origen=portada')
  const cards = page.locator('.catalog-card')
  await expectCatalogFilter(page, 'Todos')
  await expect(
    cards.filter({ has: page.locator('.quote-dish__tag', { hasText: 'Salados' }) }),
  ).toHaveCount(5)
  await expect(
    cards.filter({ has: page.locator('.quote-dish__tag', { hasText: 'Dulces' }) }),
  ).toHaveCount(5)
  await expect(
    cards.filter({ has: page.locator('.quote-dish__tag', { hasText: 'Extras' }) }),
  ).toHaveCount(2)
  await page.getByRole('button', { name: 'Ver ficha de Pincho' }).click()
  await page.getByRole('button', { name: 'Plato siguiente' }).click()
  const cupcake = page.getByRole('dialog', { name: 'Cupcake', exact: true })
  await expect(cupcake.getByText('Dulces', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await chooseCatalogFilter(page, 'Dulces')
  await page.reload()
  await expect(cards).toHaveCount(5)
  await expectCatalogFilter(page, 'Dulces')
  await chooseCatalogFilter(page, 'Todos')
  await expect(cards).toHaveCount(12)
  await expect(page).toHaveURL(/carta\.html\?origen=portada$/)
})

test('Todos muestra únicamente la colección elegida en Menú y Bebestibles', async ({ page }) => {
  await page.goto('carta.html?origen=portada')
  const cards = page.locator('.catalog-card')
  for (const [name, filter] of [
    ['Menú', 'Postres'],
    ['Bebestibles', 'Bar'],
  ]) {
    await page
      .getByRole('group', { name: 'Elige una carta' })
      .getByRole('button', { name: new RegExp(name) })
      .click()
    await expectCatalogFilter(page, 'Todos')
    await expect(page.locator('#catalog-category-title')).toHaveText(name + '.')
    const categories =
      name === 'Menú'
        ? ['Entradas', 'Principales', 'Guarniciones', 'Salsas', 'Postres', 'Nocturnos']
        : ['Aperitivos', 'Bajativos', 'Bar']
    expect(new Set(await cards.locator('.quote-dish__tag').allTextContents())).toEqual(
      new Set(categories),
    )
    const collectionUrl = page.url()
    await chooseCatalogFilter(page, filter)
    await expectCatalogFilter(page, filter)
    await chooseCatalogFilter(page, 'Todos')
    await expect(page).toHaveURL(collectionUrl)
    await page.reload()
    await expect(page.locator('#catalog-category-title')).toHaveText(name + '.')
    await expectCatalogFilter(page, 'Todos')
    await page.goBack()
    await expect(page.locator('#catalog-category-title')).toHaveText(filter + '.')
  }
})

test('la carta abre las fichas con ingredientes y devuelve el foco al plato', async ({ page }) => {
  await page.goto('carta.html?categoria=salados')
  const opener = page.getByRole('button', { name: 'Ver ficha de Pincho' })
  await opener.focus()
  await opener.press('Enter')
  const dish = page.getByRole('dialog', { name: 'Pincho', exact: true })
  const ingredients = dish.getByRole('region', { name: 'Ingredientes principales' })
  await expect(ingredients.getByText('Jamón')).toBeVisible()
  await ingredients
    .locator('li img')
    .first()
    .evaluate((img: HTMLImageElement) => img.decode())
  await expect(dish.getByRole('checkbox')).toHaveCount(0)
  await expect(dish.getByRole('button', { name: /cotización/ })).toHaveCount(0)
  await dish.getByRole('button', { name: 'Plato siguiente' }).click()
  const first = page.getByRole('dialog', { name: 'Mini tapadito', exact: true })
  const guide = first.getByRole('region', { name: 'Referencia de ingredientes y presentación' })
  await expect(guide).toContainText('lechuga')
  const ask = first.getByRole('link', { name: 'Consultar ingredientes' })
  await expect(ask).toBeVisible()
  expect(decodeURIComponent((await ask.getAttribute('href'))!)).toContain(' · Mini tapadito')
  await first.getByRole('button', { name: 'Plato anterior' }).click()
  await expect(dish).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(opener).toBeFocused()
  await expect(page).toHaveURL(/categoria=salados$/)
})

test('la categoría de la carta se comparte, se restaura y respeta el historial', async ({
  page,
  context,
}) => {
  await page.goto('carta.html?origen=portada')
  await page
    .getByRole('group', { name: 'Elige una carta' })
    .getByRole('button', { name: /Menú/ })
    .click()
  await chooseCatalogFilter(page, 'Postres')
  await expect(page.locator('#catalog-category-title')).toHaveText('Postres.')
  const link = page.url()
  expect(new URL(link).searchParams.get('categoria')).toBe('postres')
  expect(new URL(link).searchParams.get('origen')).toBe('portada')
  await page.reload()
  await expect(page.locator('#catalog-category-title')).toHaveText('Postres.')
  const shared = await context.newPage()
  await shared.goto(link)
  await expect(shared.locator('#catalog-category-title')).toHaveText('Postres.')
  await shared.close()
  await chooseCatalogFilter(page, 'Salsas')
  await page.goBack()
  await expect(page.locator('#catalog-category-title')).toHaveText('Postres.')
  await page.goForward()
  await expect(page.locator('#catalog-category-title')).toHaveText('Salsas.')
})

test('la llamada principal de la portada abre el cotizador', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('link', { name: 'Imaginemos tu celebración' }).click()
  await expect(page).toHaveURL(/cotizar\.html$/)
  await expect(page.getByRole('heading', { name: '¿Qué celebramos?' })).toBeVisible()
})

test('la carta permite hasta dos principales y dos guarniciones por separado', async ({ page }) => {
  await page.goto('cotizar.html?plato=principales-1&plato=principales-2&plato=principales-3')
  await page.getByRole('heading', { name: '¿Qué celebramos?' }).waitFor()
  await page.evaluate(() => {
    const key = 'legado-quote-draft-v1'
    const draft = JSON.parse(sessionStorage.getItem(key)!)
    Object.assign(draft.values, { event: 'Matrimonio', location: 'Concepción', guests: 48 })
    draft.values.date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
    draft.step = 'menu'
    sessionStorage.setItem(key, JSON.stringify(draft))
  })
  await page.reload()
  const dishes = page
    .getByRole('region', { name: 'Principales', exact: true })
    .locator('.quote-dish__toggle')
  const next = page.getByRole('button', { name: 'Continuar' })
  await expect(page.getByRole('alert')).toContainText('Principales')
  await next.click()
  await expect(page.locator('.quote-menu')).toBeVisible()
  await dishes.nth(2).click()
  await expect(dishes.nth(2)).toBeDisabled()
  await dishes.nth(1).click()
  await dishes.nth(2).click()
  await expect(dishes.nth(1)).toBeDisabled()
  await expect(page.getByRole('tab', { name: 'Principal', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  const openMain = page.getByRole('button', { name: 'Ver ficha de Medallón de res' })
  const main = page.getByRole('dialog', { name: 'Medallón de res' })
  const sauce = (name: string) =>
    main.getByRole('group', { name: 'Salsas' }).getByRole('button', { name, exact: true })
  await openMain.click()
  await sauce('Salsa de carne').click()
  await main.getByRole('button', { name: 'Guardar cambios' }).click()
  await expect(
    page.getByRole('button', { name: 'Cambiar Salsa de carne de Medallón de res' }),
  ).toBeVisible()
  await openMain.click()
  await sauce('Salsa blanca').click()
  await main.getByRole('button', { name: 'Cerrar ficha' }).click()
  await openMain.click()
  await expect(sauce('Salsa de carne')).toHaveAttribute('aria-pressed', 'true')
  await main.getByRole('button', { name: 'Quitar de mi cotización' }).click()
  await openMain.click()
  await expect(sauce('Sin salsa')).toHaveAttribute('aria-pressed', 'true')
  await sauce('Salsa blanca').click()
  await main.getByRole('button', { name: 'Agregar a mi cotización' }).click()
  await expect(page).toHaveURL(/salsa=principales-1%3Asalsas-2/)
  await openMain.click()
  await sauce('Sin salsa').click()
  await main.getByRole('button', { name: 'Guardar cambios' }).click()
  await page.getByRole('button', { name: 'Añadir salsa a Medallón de res' }).click()
  await page
    .getByRole('dialog', { name: 'Elige tu salsa' })
    .getByRole('button', { name: 'Salsa de carne', exact: true })
    .click()
  await openMain.click()
  await expect(sauce('Salsa de carne')).toHaveAttribute('aria-pressed', 'true')
  await main.getByRole('button', { name: 'Cerrar ficha' }).click()
  const sides = page
    .getByRole('region', { name: 'Guarniciones', exact: true })
    .locator('.quote-dish__toggle')
  await sides.nth(0).click()
  await sides.nth(1).click()
  await expect(sides.nth(2)).toBeDisabled()
  await page.getByRole('tab', { name: 'Aperitivo', exact: true }).click()
  for (const name of ['Mango sour', 'Pisco sour', 'Bebida', 'Jugo natural', 'Agua']) {
    await page.getByRole('button', { name: 'Seleccionar ' + name, exact: true }).click()
  }
  const champagne = page.getByRole('button', { name: 'Seleccionar Champagne', exact: true })
  await expect(champagne).toBeDisabled()
  await page.getByRole('button', { name: 'Ver ficha de Champagne', exact: true }).click()
  const aperitif = page.getByRole('dialog', { name: 'Champagne' })
  await expect(aperitif.getByRole('button', { name: 'Agregar a mi cotización' })).toBeDisabled()
  await aperitif.getByRole('button', { name: 'Cerrar ficha' }).click()
  await page.getByRole('button', { name: 'Quitar Pisco sour', exact: true }).click()
  await expect(champagne).toBeEnabled()
  for (const [course, first, second] of [
    ['Postre', 'Tiramisú', 'Mousse'],
    ['Nocturnos', 'Consomé de carne', 'Consomé de ave'],
  ]) {
    await page.getByRole('tab', { name: course, exact: true }).click()
    await page.getByRole('button', { name: 'Seleccionar ' + first, exact: true }).click()
    const other = page.getByRole('button', { name: 'Seleccionar ' + second, exact: true })
    await expect(other).toBeDisabled()
    await page.getByRole('button', { name: 'Ver ficha de ' + second, exact: true }).click()
    const detail = page.getByRole('dialog', { name: second, exact: true })
    await expect(detail.getByRole('button', { name: 'Agregar a mi cotización' })).toBeDisabled()
    await detail.getByRole('button', { name: 'Cerrar ficha' }).click()
    await page.getByRole('button', { name: 'Quitar ' + first, exact: true }).click()
    await other.click()
  }
  await expect(dishes).toHaveCount(0)
  await page.getByRole('tab', { name: 'Principal', exact: true }).click()
  await expect(sides.nth(2)).toBeDisabled()
  await page.getByRole('button', { name: 'Bar', exact: true }).click()
  const mojito = page.getByRole('button', { name: 'Ver ficha de Mojito' })
  await mojito.click()
  const ficha = page.getByRole('dialog', { name: 'Mojito' })
  await expect(ficha.getByRole('textbox')).toHaveCount(0)
  await ficha.getByRole('button', { name: 'Cerrar ficha' }).click()
  await expect(page.getByRole('button', { name: 'Seleccionar Mojito', exact: true })).toBeEnabled()
  await mojito.click()
  await ficha.getByRole('button', { name: 'Agregar a mi cotización' }).click()
  await expect(page.getByRole('button', { name: 'Quitar Mojito', exact: true })).toBeEnabled()
  await mojito.click()
  await ficha.getByRole('button', { name: 'Quitar de mi cotización' }).click()
  await expect(page.locator('.quote-menu__courses')).toHaveCount(0)
  await page.getByRole('button', { name: 'Cóctel', exact: true }).click()
  const tags = page.locator('.quote-dish__tag')
  for (const name of ['Salados', 'Dulces', 'Extras'])
    await expect(tags.filter({ hasText: name }).first()).toBeVisible()
  await next.click()
  await expect(page.locator('[aria-current="step"]')).toHaveAccessibleName('Paso 3, Alimentación')
})

test('las fotos lentas reservan su espacio y permiten elegir el plato', async ({ page }) => {
  const menuModules: string[] = []
  page.on('request', (request) => {
    if (/\/assets\/QuoteMenuStep-[^/]+\.js$/.test(request.url())) menuModules.push(request.url())
  })
  await page.goto('cotizar.html')
  await page.getByRole('heading', { name: '¿Qué celebramos?' }).waitFor()
  expect(menuModules).toHaveLength(0)
  await page.evaluate(() => {
    const key = 'legado-quote-draft-v1'
    const draft = JSON.parse(sessionStorage.getItem(key)!)
    Object.assign(draft.values, {
      event: 'Matrimonio',
      location: 'Concepción',
      guests: 48,
      date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    })
    draft.step = 'menu'
    sessionStorage.setItem(key, JSON.stringify(draft))
  })
  let release!: () => void
  const delayed = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/images/catalog/salados-1-*.webp', async (route) => {
    await delayed
    await route.continue()
  })
  await page.route('**/images/catalog/salados-3-*.webp', (route) => route.abort())
  let showMenu!: () => void
  const menuDownload = new Promise<void>((resolve) => {
    showMenu = resolve
  })
  await page.route('**/assets/QuoteMenuStep-*.js', async (route) => {
    await menuDownload
    await route.continue()
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  const loading = page
    .locator('.quote-form')
    .getByRole('status')
    .filter({ hasText: 'Cargando · Carta' })
  try {
    await expect(loading).toBeVisible()
  } finally {
    showMenu()
  }
  const card = page
    .locator('.quote-dish')
    .filter({ has: page.getByRole('button', { name: 'Sumar uno de Mini tapadito', exact: true }) })
  try {
    await expect(card.locator('.quote-dish__skeleton')).toBeVisible()
    await expect(loading).toHaveCount(0)
    await card.getByRole('button', { name: 'Sumar uno de Mini tapadito', exact: true }).click()
    await expect(card.getByRole('textbox')).toHaveValue('1')
    const before = await card.boundingBox()
    release()
    await expect(card.locator('.quote-dish__skeleton')).toHaveCount(0)
    expect((await card.boundingBox())?.height).toBe(before?.height)
    const failed = page
      .locator('.quote-dish')
      .filter({ has: page.getByRole('button', { name: 'Ver ficha de Crostini', exact: true }) })
    await failed.scrollIntoViewIfNeeded()
    await expect(failed.locator('.quote-dish__skeleton')).toHaveCount(0)
    await expect(failed.locator('.quote-dish__details')).toBeEnabled()
  } finally {
    release()
  }
})

test('la mesa de revisión recorre solo los platos cotizados, incluso sin la escena 3D', async ({
  page,
}) => {
  await page.route('**/assets/servingSurface-*.js', (route) => route.abort())
  await page.goto('cotizar.html')
  await page.getByRole('heading', { name: '¿Qué celebramos?' }).waitFor()
  await page.evaluate(() => {
    const key = 'legado-quote-draft-v1'
    const draft = JSON.parse(sessionStorage.getItem(key)!)
    Object.assign(draft.values, {
      event: 'Matrimonio',
      guests: 48,
      location: 'Concepción',
      name: 'Prueba',
      email: 'prueba@example.org',
      date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      items: {
        'salados-1': 1,
        'salados-2': 1,
        'salados-3': 1,
        'salados-4': 1,
        'salados-5': 2,
        'principales-1': 1,
        'bar-1': 1,
      },
      sauces: { 'principales-1': 'salsas-1' },
    })
    draft.step = 'review'
    sessionStorage.setItem(key, JSON.stringify(draft))
  })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install()
  await page.reload()
  const table = page.getByRole('region', { name: 'Tu menú en la mesa' })
  await expect(
    table.getByRole('heading', { name: 'Tu menú en la mesa' }).locator('svg'),
  ).toBeVisible()
  await expect(table.locator('.serving-table__fallback')).toBeVisible()
  await expect(table.getByRole('listitem')).toHaveCount(4)
  const picker = table.locator('.menu-tasting__choose')
  const pickerBounds = () =>
    picker.evaluate((button) => {
      const rect = button.getBoundingClientRect()
      const section = button.closest('section')!.getBoundingClientRect()
      return [rect.x - section.x, rect.y - section.y, rect.width, rect.height]
    })
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  const initialBounds = await pickerBounds()
  await expect(table.getByRole('button', { name: 'Pausar secuencia' })).toBeVisible()
  await page.clock.fastForward(6500)
  await expect(table.getByRole('listitem')).toHaveText(/Pincho.*× 2/)
  expect(await pickerBounds()).toEqual(initialBounds)
  await table.getByRole('button', { name: 'Pausar secuencia' }).click()
  await page.clock.fastForward(6500)
  await expect(table.getByRole('listitem')).toHaveText(/Pincho.*× 2/)
  await picker.click()
  await page.getByRole('option', { name: 'Principal', exact: true }).click()
  await expect(table.getByRole('listitem')).toContainText('Salsa de carne')
  await table.getByRole('button', { name: 'Categoría siguiente' }).click()
  await expect(table.getByRole('listitem')).toContainText('Ron')
  expect(await pickerBounds()).toEqual(initialBounds)
  await table.getByRole('button', { name: 'Categoría siguiente' }).click()
  await expect(picker).toContainText('Salados (1/2)')
  const fullMenu = table.getByRole('button', { name: 'Ver el menú completo' })
  await fullMenu.click()
  const dialog = page.getByRole('dialog', { name: 'Menú completo' })
  await expect(dialog.getByRole('heading', { name: 'Menú de banquete' })).toBeVisible()
  await expect(dialog.getByText('Salsa de carne')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(fullMenu).toBeFocused()
})

test('el cotizador valida el evento y conserva los campos al retroceder', async ({ page }) => {
  const studio = await page.context().newPage()
  await studio.goto('ambientacion.html?dinnerware=stoneware')
  await studio.getByRole('tab', { name: 'Montaje y vajilla' }).click()
  await page.route('**/assets/TableScene-*.js', (route) => route.abort())
  await page.goto('cotizar.html')
  const next = page.getByRole('button', { name: 'Continuar' })
  await next.click()
  await expect(page.getByText('Elige una comuna.', { exact: true })).toBeVisible()
  await page.getByText('Matrimonio', { exact: true }).click()
  const guests = page.getByLabel('Invitados aproximados')
  const addGuest = page.getByRole('button', { name: 'Sumar un invitado' })
  const removeGuest = page.getByRole('button', { name: 'Restar un invitado' })
  await guests.fill('')
  await addGuest.press('Enter')
  await expect(guests).toHaveValue('30')
  await expect(removeGuest).toBeDisabled()
  await guests.fill('149')
  await addGuest.click()
  await expect(addGuest).toBeDisabled()
  await removeGuest.click()
  await expect(guests).toHaveValue('149')
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
  await page.reload()
  await expect(page.getByRole('heading', { name: '¿Qué servimos?' })).toBeVisible()
  await page.getByRole('button', { name: 'Atrás', exact: true }).click()
  await expect(guests).toHaveValue('48')
  await expect(page.getByRole('button', { name: /Concepción.*Comuna/ })).toBeVisible()
  await next.click()
  const details = page.getByRole('button', { name: 'Ver ficha de Pincho' })
  await details.click()
  const dish = page.getByRole('dialog', { name: 'Pincho' })
  const ingredients = dish.getByRole('region', { name: 'Ingredientes principales' })
  await expect(ingredients.getByText('Jamón', { exact: true })).toBeVisible()
  await expect(ingredients.getByRole('checkbox')).toHaveCount(0)
  const [previousArrow, nextArrow, card] = await Promise.all([
    dish.getByRole('button', { name: 'Plato anterior' }).boundingBox(),
    dish.getByRole('button', { name: 'Plato siguiente' }).boundingBox(),
    dish.locator('.ingredients-dialog__card').boundingBox(),
  ])
  expect(previousArrow!.x + previousArrow!.width).toBeLessThanOrEqual(card!.x + 1)
  expect(nextArrow!.x).toBeGreaterThanOrEqual(card!.x + card!.width - 1)
  await dish.getByRole('textbox').fill('3')
  await dish.getByRole('button', { name: 'Plato anterior' }).click()
  const ceviche = page.getByRole('dialog', { name: 'Ceviche de jurel' })
  await expect(ceviche.getByText('Jurel', { exact: true })).toBeVisible()
  await ceviche.locator('li img').evaluate((img: HTMLImageElement) => img.decode())
  await ceviche.getByRole('button', { name: 'Plato siguiente' }).click()
  await expect(dish.getByRole('textbox')).toHaveValue('3')
  await dish.getByRole('button', { name: 'Agregar a mi cotización' }).click()
  await page.reload()
  await details.click()
  await expect(dish.getByRole('textbox')).toHaveValue('3')
  await expect(ingredients.getByText('Queso', { exact: true })).toBeVisible()
  await dish.getByRole('button', { name: 'Cerrar ficha' }).click()

  await next.click()
  await expect(page.locator('[aria-current="step"]')).toHaveAccessibleName('Paso 3, Alimentación')
  await expect(page.locator('.quote-chapter textarea')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Frutos secos', exact: true })).toHaveCount(0)
  const counted = (name: string) =>
    page.getByRole('textbox', { name: 'Personas para ' + name, exact: true })
  await counted('Frutos secos').fill('3')
  await page.getByRole('button', { name: 'Sin gluten o lactosa', exact: true }).click()
  await counted('Sin lactosa').fill('2')
  await page.getByRole('button', { name: 'Menús especiales', exact: true }).click()
  await counted('Vegano').fill('4')
  await page.getByRole('button', { name: 'Alergias', exact: true }).click()
  await page.getByRole('button', { name: 'Añadir una persona para Leche', exact: true }).click()
  await expect(counted('Leche')).toHaveValue('1')
  await page
    .getByRole('button', { name: 'Quitar una persona para Leche', exact: true })
    .press('Space')
  await expect(counted('Leche')).toHaveValue('0')
  await page.reload()
  await expect(counted('Frutos secos')).toHaveValue('3')
  await next.click()
  await expect(page.locator('[aria-current="step"]')).toHaveAccessibleName('Paso 4, Mesa')
  await page.evaluate(() => {
    const key = 'legado-quote-draft-v1'
    const draft = JSON.parse(sessionStorage.getItem(key)!)
    sessionStorage.setItem(key, JSON.stringify({ ...draft, step: 2 })) // Mesa in the five-step flow.
  })
  await page.reload()
  await expect(page.locator('[aria-current="step"]')).toHaveAccessibleName('Paso 4, Mesa')
  const include = page.getByRole('checkbox', { name: /Incluir esta ambientación/ })
  await expect(include).toHaveCount(0)
  const scene = page.locator('.quote-montage .table-studio__scene')
  await expect(scene).toBeVisible()
  await expect(scene.getByRole('img')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Detalle de la mesa', exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'Montaje y vajilla' }).click()
  await expect(page.getByRole('button', { name: 'Marfil con filete dorado' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Porcelana blanca' }).click()
  await expect(page).toHaveURL(/dinnerware=porcelain/)
  await expect(studio).toHaveURL(/dinnerware=stoneware/)
  await studio.getByRole('button', { name: 'Marfil con filete dorado' }).click()
  await expect(studio).toHaveURL(/dinnerware=goldRim/)
  await studio.close()
  await expect(page).toHaveURL(/mesa=1/)
  await expect(scene).toBeVisible()
  await next.click()
  await page.getByLabel('Nombre', { exact: true }).fill('Prueba Local')
  await page.getByLabel('Correo electrónico').fill('prueba@example.org')
  const phone = page.getByLabel('Teléfono (opcional)', { exact: true })
  await expect(phone).toHaveAccessibleDescription('+569')
  await expect(phone).toHaveValue('')
  await phone.pressSequentially('abc!123')
  await expect(phone).toHaveValue('123')
  await page.getByRole('button', { name: 'Revisar mi cotización' }).click()
  await expect(phone).toHaveAttribute('aria-invalid', 'true')
  await phone.fill('')
  await phone.pressSequentially('1234567890')
  await expect(phone).toHaveValue('12345678')
  await phone.evaluate((input) => {
    const clipboardData = new DataTransfer()
    clipboardData.setData('text/plain', '+56 9 8765 4321')
    input.dispatchEvent(
      new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }),
    )
  })
  await expect(phone).toHaveValue('87654321')
  await expect(phone).toHaveAttribute('aria-invalid', 'false')
  await page.getByRole('button', { name: 'Revisar mi cotización' }).click()
  await expect(page.locator('.quote-review')).toBeVisible()
  await page.reload()
  const review = page.locator('.quote-review')
  await expect(include).toHaveCount(0)
  await expect(page).toHaveURL(/mesa=1/)
  await expect(review.getByRole('heading', { name: 'Detalle de la mesa' })).toBeVisible()
  await expect(review.getByText('Porcelana blanca', { exact: true })).toBeVisible()
  await expect(review.locator('.seating-plan')).toBeVisible()
  await expect(review.locator('.quote-review__samples .fabric-sample')).toHaveCount(5)
  for (const image of await review.locator('.quote-review__samples img').all()) {
    await image.evaluate((img: HTMLImageElement) => img.decode())
  }
  for (const [name, count, id] of [
    ['Frutos secos', '3 personas', 'nuts'],
    ['Sin lactosa', '2 personas', 'lactose'],
    ['Vegano', '4 personas', 'vegan'],
  ]) {
    const row = review.locator('.quote-review__dietary li').filter({ hasText: name })
    await expect(row).toContainText(count)
    await expect(row.locator('.dietary-model')).toHaveAttribute('src', new RegExp(id + '\\.webp$'))
  }
  await expect(review.locator('.dish-omissions')).toHaveCount(0)
  await expect(review).toContainText('prueba@example.org')
  await expect(review).toContainText('+56987654321')
  expect(page.url()).not.toContain('example.org')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Descargar PDF' }).click()
  const download = await downloadEvent
  expect(await download.failure()).toBeNull()
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i)
  const contents = await readFile(await download.path())
  expect(contents.subarray(0, 5).toString()).toBe('%PDF-')

  const send = page.getByRole('button', { name: 'Enviar solicitud', exact: true })
  if (await send.count()) {
    const attempts: string[] = []
    await page.route('**/cotizaciones', (route) => {
      attempts.push(route.request().postDataJSON().id)
      return route.fulfill({
        status: attempts.length === 1 ? 503 : 202,
        json: { accepted: attempts.length > 1 },
      })
    })
    await send.click()
    await expect(page.getByText(/No pudimos confirmar el envío/)).toBeVisible()
    await page.reload()
    await send.click()
    await expect(page.getByText(/Solicitud recibida/)).toBeVisible()
    expect(attempts).toHaveLength(2)
    expect(attempts[1]).toBe(attempts[0])
    await page.reload()
    await expect(guests).toHaveValue('')
    await expect(page).toHaveURL(/cotizar\.html$/)
  }
})

test('revisión permite corregir un bloque y elegir o quitar la mesa inicial', async ({ page }) => {
  await page.goto('cotizar.html')
  await page.getByRole('heading', { name: '¿Qué celebramos?' }).waitFor()
  await page.evaluate(() => {
    const key = 'legado-quote-draft-v1'
    const draft = JSON.parse(sessionStorage.getItem(key)!)
    Object.assign(draft.values, {
      event: 'Matrimonio',
      guests: 48,
      location: 'Concepción',
      date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      name: 'Prueba',
      email: 'prueba@example.org',
    })
    draft.step = 'review'
    sessionStorage.setItem(key, JSON.stringify(draft))
  })
  await page.reload()
  const edit = (name: string) => page.getByRole('button', { name: 'Editar ' + name, exact: true })
  const save = page.getByRole('button', { name: 'Guardar y volver a revisión' })
  const review = page.locator('.quote-review')
  for (const label of ['Evento', 'Carta', 'Alimentación', 'Mesa', 'Contacto']) {
    await expect(edit(label)).toBeVisible()
  }
  await edit('Contacto').click()
  const email = page.getByLabel('Correo electrónico')
  await email.fill('incorrecto')
  await save.click()
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await email.fill('corregido@example.org')
  await page.reload()
  await save.click()
  await expect(review).toContainText('corregido@example.org')
  await edit('Mesa').click()
  await page.getByRole('button', { name: 'Usar esta mesa' }).click()
  await expect(page).toHaveURL(/mesa=1/)
  await save.click()
  await expect(review.getByRole('heading', { name: 'Detalle de la mesa' })).toBeVisible()
  await edit('Mesa').click()
  await page.getByRole('button', { name: 'Mesa incluida' }).click()
  await expect(page).toHaveURL(/mesa=0/)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Usar esta mesa' })).toBeVisible()
  await save.click()
  await expect(review).toBeVisible()
  await expect(review.getByRole('heading', { name: 'Detalle de la mesa' })).toHaveCount(0)
})

test('el índice recuerda las etapas alcanzadas al retroceder y valida los saltos', async ({
  page,
}) => {
  await page.goto('cotizar.html')
  await page.getByRole('heading', { name: '¿Qué celebramos?' }).waitFor()
  await page.evaluate(() => {
    const key = 'legado-quote-draft-v1'
    const draft = JSON.parse(sessionStorage.getItem(key)!)
    Object.assign(draft.values, {
      event: 'Matrimonio',
      guests: 48,
      location: 'Concepción',
      date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    })
    draft.step = 'menu'
    sessionStorage.setItem(key, JSON.stringify(draft))
  })
  await page.reload()
  const next = page.getByRole('button', { name: 'Continuar' })
  await next.click()
  await expect(page.locator('[aria-current="step"]')).toHaveAccessibleName('Paso 3, Alimentación')
  const index = page.locator('.quote-progress')
  async function openIndex() {
    const toggle = index.getByRole('button', { name: 'Ver etapas' })
    if (await toggle.isVisible()) await toggle.click()
  }
  await openIndex()
  await index.getByRole('button', { name: /Paso 1, Evento/ }).click()
  await page.reload()
  const guests = page.getByLabel('Invitados aproximados')
  await guests.fill('')
  await openIndex()
  await expect(index.getByRole('button', { name: /Paso 4, Mesa/ })).toBeDisabled()
  const dietary = index.getByRole('button', { name: /Paso 3, Alimentación/ })
  await dietary.click()
  await expect(guests).toHaveAttribute('aria-invalid', 'true')
  await guests.fill('50')
  await openIndex()
  await dietary.click()
  await expect(page.locator('[aria-current="step"]')).toHaveAccessibleName('Paso 3, Alimentación')
})

test('el plano abre sin solicitar Three.js hasta ver el detalle', async ({ page }) => {
  const sceneRequests: string[] = []
  page.on('request', (request) => {
    if (/\/(three\.module|TableScene)-[^/]+\.js/.test(request.url()))
      sceneRequests.push(request.url())
  })
  await page.goto('ambientacion.html?roundTables=3')
  await expect(page.locator('.table-studio__plan')).toBeVisible()
  await page.getByLabel('Mesas redondas', { exact: true }).selectOption('4')
  await expect(page).toHaveURL(/roundTables=4/)
  expect(sceneRequests).toEqual([])
  await page.getByRole('button', { name: 'Detalle de la mesa', exact: true }).click()
  await expect.poll(() => sceneRequests.length).toBeGreaterThan(0)
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

test('la mesa de portada lleva su diseño y menú al cotizador habitual', async ({ page }) => {
  await page.goto('./')
  await expect(
    page.locator('#galeria').getByRole('link', { name: 'Ideas de la casa' }),
  ).toHaveCount(0)
  await page.locator('.cover-stage').getByRole('link', { name: 'Cotizar esta mesa' }).click()
  await expect(page).toHaveURL(/ambientacion\.html\?.*idea=domingo/)
  await page.reload()
  await expect(page.getByText(/Prueba local/)).toHaveCount(0)
  await expect(page.locator('.table-studio__idea-menu')).toContainText('Salmón a la plancha')
  await page.getByRole('tab', { name: 'Montaje y vajilla' }).click()
  await page.getByRole('button', { name: 'Porcelana blanca' }).click()
  await page.getByRole('link', { name: 'Cotizar esta mesa' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Cotiza tu')
  await page.reload()
  const params = new URL(page.url()).searchParams
  expect(params.get('dinnerware')).toBe('porcelain')
  expect(params.getAll('plato')).toEqual(['principales-6', 'guarniciones-7'])
  expect(params.get('salsa')).toBe('principales-6:salsas-8')
  await expect(page.getByText(/Prueba local/)).toHaveCount(0)
  const drafts = await page.evaluate(() => ({
    standard: sessionStorage.getItem('legado-quote-draft-v1'),
    idea: JSON.parse(sessionStorage.getItem('legado-quote-draft-v1-domingo') ?? 'null'),
  }))
  expect(drafts.standard).toBeNull()
  expect(drafts.idea.values.items).toEqual({ 'principales-6': 1, 'guarniciones-7': 1 })
  expect(drafts.idea.design.dinnerware).toBe('porcelain')
  const back = page.getByRole('link', { name: 'Volver a la mesa' })
  await expect(back).toHaveAttribute('href', /ambientacion\.html\?.*dinnerware=porcelain/)
})

for (const [color, id, overlay, floral, fold] of [
  ['Azul rey', 'azul-rey', 'royalBlue', 'cascade', 'crown'],
  ['Burdeos', 'burdeos', 'wine', 'burgundy', 'doubleV'],
]) {
  test(`la mesa ${color} se puede cotizar desde la foto`, async ({ page }) => {
    test.slow() // The reload and return trip each initialize a new 3D scene.
    await page.goto('./')
    const stage = page.locator('.cover-stage')
    await stage.getByRole('button', { name: color, exact: true }).click()
    const start = stage.getByRole('link', { name: 'Cotizar esta mesa' })
    await expect(start).toHaveAttribute('href', new RegExp('idea=' + id))
    await start.click()
    await expect(page).toHaveURL(/ambientacion\.html\?/)
    const quote = page.locator('.table-studio').getByRole('link', { name: 'Cotizar esta mesa' })
    await expect(quote).toHaveAttribute('href', new RegExp('overlay=' + overlay))
    await page.reload()
    await quote.click()
    await expect(page).toHaveURL(/cotizar\.html\?/)
    const params = new URL(page.url()).searchParams
    expect(params.get('idea')).toBe(id)
    expect(params.get('floral')).toBe(floral)
    expect(params.get('napkinFold')).toBe(fold)
    expect(params.get('dinnerware')).toBe('porcelain')
    expect(params.has('plato')).toBe(false)
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const value = sessionStorage.getItem('legado-quote-draft-v1-' + key)
          return value && JSON.parse(value).design.overlay
        }, id),
      )
      .toBe(overlay)
    await page.getByRole('link', { name: 'Volver a la mesa' }).click()
    await page.getByRole('link', { name: 'Volver a la foto' }).click()
    await expect(stage.getByRole('button', { name: color, exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
}

test('el enlace anterior a la foto abre directamente su montaje', async ({ page }) => {
  await page.goto('./ideas-de-la-casa.html')
  await expect(page).toHaveURL(/ambientacion\.html\?.*idea=domingo/)
  await expect(page.getByRole('link', { name: 'Cotizar esta mesa' })).toBeVisible()
})

test('las páginas aplican la política antes de cargar recursos', async ({ request }) => {
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
  await page.locator('.catalog').getByRole('link', { name: 'Diseña tu mesa', exact: true }).click()
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

test('las mesas de portada se pueden elegir, avanzar y pausar con teclado', async ({ page }) => {
  await page.goto('./')
  const stage = page.locator('.cover-stage')
  const flowers = stage.getByRole('button', { name: 'Azul rey', exact: true })
  await flowers.focus()
  await flowers.press('Enter')
  await expect(flowers).toHaveAttribute('aria-pressed', 'true')
  await expect(stage.getByText('La mesa de honor')).toBeVisible()
  await flowers.press('ArrowRight')
  await expect(stage.getByText('Después del postre')).toBeVisible()
  await stage.locator('.cover-next').click()
  await expect(stage.getByText('El primer brindis')).toBeVisible()
  const play = stage.getByRole('button', { name: 'Reproducir secuencia' })
  await play.click()
  await stage.getByRole('button', { name: 'Pausar secuencia' }).click()
  await expect(play).toBeVisible()
})

test('la nueva foto cubre el centro y la cotización sigue a la mesa visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const stage = page.locator('.cover-stage')
  const front = stage.locator('.cover-panel[data-front="true"]')
  const gold = stage.getByRole('button', { name: 'Dorado', exact: true })
  const blue = stage.getByRole('button', { name: 'Azul rey', exact: true })
  const wine = stage.getByRole('button', { name: 'Burdeos', exact: true })
  const quote = stage.getByRole('link', { name: 'Cotizar esta mesa' })
  const before = await quote.boundingBox()
  await blue.evaluate(async (button) => {
    if (!(button instanceof HTMLButtonElement)) throw new Error('Se esperaba una miniatura')
    button.click()
    const photos = document.querySelector('.cover-scene-photos')!
    let travel: Animation | undefined
    while (!travel) {
      await new Promise(requestAnimationFrame)
      travel = photos.querySelector('[data-front="true"]')?.getAnimations()[0]
    }
    travel.pause()
    travel.currentTime = 0
  })
  const offset = await front.evaluate((el) => {
    const x = new DOMMatrix(getComputedStyle(el).transform).m41
    return x / el.getBoundingClientRect().width
  })
  expect(offset).toBeGreaterThan(0)
  expect(offset).toBeLessThan(0.07)
  await expect(stage.locator('.cover-panel[data-front="false"]:visible')).toHaveCSS(
    'transform',
    'none',
  )
  await expect(blue).toHaveAttribute('aria-pressed', 'true')
  await expect(stage.locator('.cover-caption')).toHaveText('La mesa de honor')
  await expect(quote).toHaveAttribute('href', /idea=azul-rey/)
  expect(await quote.boundingBox()).toEqual(before)

  await gold.click()
  await wine.click()
  await front.evaluate((el) => el.getAnimations()[0].play())
  await expect(wine).toHaveAttribute('aria-pressed', 'true')
  await expect(quote).toHaveAttribute('href', /idea=burdeos/)
})

test('la portada cambia de mesa en reposo y detiene la secuencia al pausar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install()
  await page.goto('./')
  const caption = page.locator('.cover-caption')
  await expect(caption).toHaveText('El primer brindis')
  await page.clock.fastForward(7600)
  await expect(caption).toHaveText('La mesa de honor')
  await page.getByRole('button', { name: 'Pausar secuencia' }).click()
  await page.clock.fastForward(16000)
  await expect(caption).toHaveText('La mesa de honor')
})

test('la portada usa la foto activa a pantalla completa en tablet y prioriza la actual en ultrawide', async ({
  page,
}) => {
  await page.goto('./')
  await page.setViewportSize({ width: 1024, height: 1366 })
  await expect(page.locator('.cover-preview')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeVisible()
  const scene = page.locator('.cover-scene')
  expect((await scene.boundingBox())!.width).toBe(1024)
  await expect(scene.locator('[data-active="true"]')).toHaveJSProperty('complete', true)
  if (await page.evaluate(() => matchMedia('(any-pointer:fine)').matches)) {
    await page.setViewportSize({ width: 3440, height: 1440 })
    await expect(page.locator('.cover-preview')).toBeVisible()
    await expect
      .poll(() =>
        page.locator('.cover-stage').evaluate((stage) => {
          const width = (selector: string) =>
            stage.querySelector(selector)!.getBoundingClientRect().width
          return width('.cover-scene') - width('.cover-preview')
        }),
      )
      .toBeGreaterThan(0)
    const photo = scene.locator('img[data-active="true"]')
    await photo.evaluate((element: HTMLImageElement) => element.decode())
    // Responsive image decoding and viewport layout can settle on different frames.
    await expect
      .poll(() =>
        photo.evaluate((element: HTMLImageElement) => {
          const { width, height } = element.getBoundingClientRect()
          return width - (height * element.naturalWidth) / element.naturalHeight
        }),
      )
      .toBeLessThanOrEqual(1)
  }
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
    const menu = page.locator('.menu-toggle')
    if (!(await trigger.isVisible())) await menu.click()
    await expect(trigger).toBeVisible()
    await trigger.focus()
    await expect(trigger).toBeFocused()
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
    if (await page.locator('.mobile-menu.open').isVisible()) await menu.click()
    await expect(page.locator('h1')).toContainText('Some tables')
    await page.getByRole('link', { name: 'Discover the menu', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Cocktails.', exact: true })).toBeVisible()
    await choose('Français')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr-FR')
    await expect(page.getByRole('heading', { name: 'Cocktail.', exact: true })).toBeVisible()
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
