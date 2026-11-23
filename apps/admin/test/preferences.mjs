import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chromium } from '@playwright/test'

async function signIn(page, origin) {
  await page.goto(origin + '/admin/quotes')
  await page.getByLabel('Correo electrónico').fill(process.env.ADMIN_EMAIL)
  await page.getByLabel('Contraseña', { exact: true }).fill(process.env.ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
}

test('el panel conserva sus preferencias sin sobrescribir las del sitio', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({
      viewport: { width: 375, height: 812 },
    })
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.evaluate(() => {
      localStorage.setItem('legado-theme', 'garden')
      localStorage.setItem('legado-language', 'fr')
    })
    await page.reload()
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    assert.notEqual(await page.locator('html').getAttribute('data-theme'), 'garden')
    const settings = page.getByLabel('Configuración', { exact: true })
    await settings.focus()
    await page.keyboard.press('Enter')
    const bar = page.locator('.admin-masthead')
    const palette = () =>
      bar.evaluate((el) => ({
        background: getComputedStyle(el).backgroundColor,
        ink: getComputedStyle(el.querySelector('.admin-name')).color,
        accent: getComputedStyle(el.querySelector('.admin-avatar')).backgroundColor,
      }))
    const palettes = []
    for (const name of ['Día', 'Noche', 'Jardín', 'Piscina']) {
      await page.getByRole('button', { name, exact: true }).click()
      palettes.push(await palette())
    }
    assert.equal(palettes[0].background, 'rgb(255, 255, 255)')
    assert.equal(palettes[0].ink, 'rgb(16, 17, 15)')
    assert.equal(palettes[1].background, 'rgb(8, 8, 8)')
    assert.equal(new Set(palettes.map((p) => p.background)).size, 4)
    assert.equal(new Set(palettes.map((p) => p.accent)).size, 4)
    assert.notEqual(palettes[2].ink, palettes[3].ink)
    await page.getByRole('button', { name: 'English', exact: true }).click()
    await page.getByRole('heading', { name: 'Quote history' }).waitFor()
    await page.keyboard.press('Escape')
    const toggle = page.getByLabel('Settings', { exact: true })
    assert.ok(await toggle.evaluate((el) => el === document.activeElement))
    assert.equal(await page.getByRole('button', { name: 'English', exact: true }).count(), 0)
    await page.reload()
    await page.getByRole('heading', { name: 'Quote history' }).waitFor()
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'pool')
    const publicPreferences = await page.evaluate(() => [
      localStorage.getItem('legado-theme'),
      localStorage.getItem('legado-language'),
    ])
    assert.deepEqual(publicPreferences, ['garden', 'fr'])
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  } finally {
    await browser.close()
  }
})

test('desktop sidebar and full-screen mobile navigation', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    for (const [width, height, touch] of [
      [1440, 900, false],
      [390, 844, true],
      [834, 1194, true],
      [1366, 1024, true],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height },
        hasTouch: touch,
        colorScheme: 'light',
      })
      await signIn(page, origin)
      await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
      await page.keyboard.press('Tab')
      const shortcut = page.getByRole('link', { name: 'Saltar al contenido' })
      assert.ok(await shortcut.evaluate((el) => el === document.activeElement))
      await page.keyboard.press('Enter')
      assert.ok(await page.locator('main').evaluate((el) => el === document.activeElement))
      const menu = page.getByRole('button', { name: 'Abrir menú' })
      const navbar = page.locator('.admin-masthead')
      const background = (el) => getComputedStyle(el).backgroundColor
      assert.equal(await navbar.locator('.brand').count(), 0)
      assert.equal(await navbar.evaluate(background), 'rgb(255, 255, 255)')
      if (touch) {
        await menu.click()
        const dialog = page.getByRole('dialog', { name: 'Navegación' })
        await dialog.waitFor()
        await dialog.locator('.admin-account strong').waitFor()
        const profile = dialog.getByLabel(/^Mi perfil/)
        await profile.click()
        const logout = dialog.getByRole('button', { name: 'Cerrar sesión' })
        await logout.waitFor()
        assert.ok((await logout.boundingBox()).y < (await profile.boundingBox()).y)
        await logout.focus()
        await page.keyboard.press('Escape')
        await logout.waitFor({ state: 'hidden' })
        assert.ok(await profile.evaluate((el) => el === document.activeElement))
        assert.deepEqual(await dialog.locator('.admin-roadmap li').allTextContents(), [
          'Facturación SII',
        ])
        assert.ok(await dialog.locator('header .brand').isVisible())
        assert.equal(await dialog.evaluate(background), await navbar.evaluate(background))
        const box = await dialog.boundingBox()
        assert.equal(box.width, width)
        assert.equal(box.height, height)
        await page.keyboard.press('Escape')
        assert.equal(await dialog.count(), 0)
        assert.ok(await menu.evaluate((el) => el === document.activeElement))
        await menu.click()
        await dialog.getByRole('link', { name: 'Historial de cotizaciones' }).click()
        await dialog.waitFor({ state: 'hidden' })
      } else {
        assert.equal(await menu.count(), 0)
        const rail = page.locator('.sidebar')
        assert.ok(await rail.locator('.brand').isVisible())
        assert.equal(await rail.evaluate(background), await navbar.evaluate(background))
        const railBox = await rail.boundingBox()
        assert.equal(railBox.y, 0)
        assert.equal(railBox.height, height)
        assert.equal(railBox.width, (await navbar.boundingBox()).x)
        await page.locator('.admin-toolbar .admin-account strong').waitFor()
        assert.deepEqual(await page.locator('.sidebar .admin-roadmap li').allTextContents(), [
          'Facturación SII',
        ])
        await page.getByRole('button', { name: 'Contraer barra lateral' }).click()
        await page.reload()
        const expand = page.getByRole('button', { name: 'Expandir barra lateral' })
        await expand.waitFor()
        assert.equal(await expand.getAttribute('aria-expanded'), 'false')
        await expand.click()
        await page.locator('aside').getByRole('link', { name: 'Historial de cotizaciones' }).click()
      }
      await page.close()
    }
  } finally {
    await browser.close()
  }
})

test('history filters, direct access and sign out', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage()
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.getByRole('searchbox').fill('missing-test-municipality')
    const eventFilters = page.getByRole('navigation', { name: 'Tipo de evento' })
    await eventFilters.getByRole('link', { name: 'Matrimonio', exact: true }).click()
    await page.waitForURL(/event=wedding/)
    await page.getByRole('button', { name: 'Aplicar filtros' }).click()
    await page.getByText('No hay cotizaciones con esos filtros.').waitFor()
    await page.reload()
    assert.equal(await page.getByRole('searchbox').inputValue(), 'missing-test-municipality')
    await page.getByRole('link', { name: 'Limpiar filtros' }).click()
    assert.equal(await page.getByRole('button', { name: 'Cerrar sesión' }).count(), 0)
    const profile = page.locator('.admin-toolbar').getByLabel(/^Mi perfil/)
    const logout = page.getByRole('button', { name: 'Cerrar sesión' })
    await profile.click()
    await logout.waitFor()
    assert.ok((await logout.boundingBox()).y > (await profile.boundingBox()).y)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).click()
    await logout.waitFor({ state: 'hidden' })
    await profile.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    assert.ok(await logout.evaluate((el) => el === document.activeElement))
    await page.route('**/admin/auth/logout', (route) => route.fulfill({ status: 503 }), {
      times: 1,
    })
    await page.keyboard.press('Enter')
    await page.getByRole('alert').waitFor()
    assert.ok(await logout.isVisible())
    await page.keyboard.press('Enter')
    await page.waitForURL('**/admin/login')
    await page.goto(origin + '/admin/1')
    await page.getByRole('heading', { name: 'Iniciar sesión' }).waitFor()
    assert.equal(new URL(page.url()).searchParams.get('next'), '/admin/1')
  } finally {
    await browser.close()
  }
})

test('dashboard, monthly agenda and server-side history navigation', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.getByRole('link', { name: 'Resumen', exact: true }).click()
    await page.getByRole('heading', { name: 'Resumen', exact: true }).waitFor()
    assert.equal(await page.locator('.dash-metrics dd').count(), 4)
    assert.equal(await page.locator('aside').getByRole('heading', { name: 'Gestión' }).count(), 0)
    await page.getByRole('button', { name: 'Invitados', exact: true }).click()
    const demand = page.getByRole('figure', { name: /^Invitados ·/ })
    await demand.locator('.apexcharts-xaxis-label').nth(3).waitFor()
    const bars = demand.locator('path.apexcharts-bar-area')
    await bars.nth(3).waitFor({ state: 'attached' })
    assert.equal(await bars.count(), await demand.locator('.apexcharts-xaxis-label').count())
    await page.locator('main').getByRole('link', { name: 'Calendario de eventos' }).click()
    await page.locator('.month-grid').waitFor()
    assert.equal(await page.locator('.month-grid td').count(), 42)
    await page.locator('.month-toolbar').getByRole('link', { name: 'Siguiente' }).click()
    await page.waitForURL(/month=/)
    await page.locator('.month-grid td[data-outside=false] a').first().click()
    await page.waitForURL(/day=/)
    await page.reload()
    await page.getByRole('link', { name: 'Ver todo el mes' }).waitFor()
    await page.locator('aside').getByRole('link', { name: 'Historial de cotizaciones' }).click()
    await page.locator('thead').getByRole('link', { name: 'Invitados' }).click()
    await page.waitForURL(/sort=guests/)
    const guests = await page.locator('.history-guests').allTextContents()
    const values = guests.map((text) => Number(text.replace(/\D/g, '')))
    assert.deepEqual(
      values,
      [...values].sort((a, b) => a - b),
    )
    await page.getByLabel('Filas por página').selectOption('10')
    await page.waitForURL(/pageSize=10/)
    await page.setViewportSize({ width: 375, height: 812 })
    await page.getByLabel('Ordenar por').selectOption('number:asc')
    await page.waitForURL(/sort=number/)
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  } finally {
    await browser.close()
  }
})

test('la carga de Legado cubre el acceso y las consultas lentas del panel', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    const loader = page.locator('.page-transition')
    async function checkPending(pattern, action) {
      let release
      const gate = new Promise((resolve) => {
        release = resolve
      })
      await page.route(
        pattern,
        async (route) => {
          await gate
          await route.continue()
        },
        { times: 1 },
      )
      try {
        await action()
        await loader.waitFor()
        assert.ok(await page.locator('#root').evaluate((el) => el.inert))
        assert.equal(await loader.locator('.page-transition__orbit').isVisible(), false)
        assert.equal(
          await loader.locator('.page-transition__caption').textContent(),
          'La mesa está por servirse.',
        )
      } finally {
        release()
      }
    }
    await checkPending('**/admin/auth/login', () => signIn(page, origin))
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await checkPending('**/api/v1/profile', () => page.reload({ waitUntil: 'domcontentloaded' }))
    await loader.waitFor({ state: 'hidden' })
    await page.getByRole('searchbox').fill('test-loading')
    await checkPending('**/api/v1/quotes?*', () =>
      page.getByRole('button', { name: 'Aplicar filtros' }).click(),
    )
    await loader.waitFor({ state: 'hidden' })
    assert.equal(await page.locator('#root').evaluate((el) => el.inert), false)
    await page.getByRole('link', { name: 'Limpiar filtros' }).click()
    await page.getByRole('searchbox').waitFor()
  } finally {
    await browser.close()
  }
})

test('el calendario usa la superficie y el acento del tema después de recargar', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await signIn(page, origin)
    await page.locator('aside').getByRole('link', { name: 'Calendario de eventos' }).click()
    for (const theme of ['Día', 'Noche', 'Jardín', 'Piscina']) {
      await page.getByLabel('Configuración', { exact: true }).click()
      await page.getByRole('button', { name: theme, exact: true }).click()
      await page.reload()
      const panel = page.locator('.month-agenda')
      await panel.waitFor()
      const colors = await panel.evaluate((agenda) => {
        const probe = document.createElement('span')
        probe.style.cssText =
          'background:var(--dish-surface);color:var(--ink);border:1px solid var(--gold)'
        document.body.append(probe)
        const reference = getComputedStyle(probe)
        const header = getComputedStyle(agenda.querySelector('header'))
        const today = document.querySelector(".month-grid [aria-current='date'] > span")
        const result = {
          expected: [
            reference.backgroundColor,
            reference.backgroundColor,
            reference.color,
            reference.borderTopColor,
          ],
          actual: [
            getComputedStyle(agenda).backgroundColor,
            header.backgroundColor,
            header.color,
            getComputedStyle(today).backgroundColor,
          ],
        }
        probe.remove()
        return result
      })
      assert.deepEqual(colors.actual, colors.expected, theme)
    }
  } finally {
    await browser.close()
  }
})

test('el plan de servicio cruza fin de mes y abre la agenda de la fecha elegida', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage()
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.clock.setFixedTime(new Date('2027-01-29T15:00:00Z'))
    await page.route('**/api/v1/quotes/calendar?month=*', (route) => {
      const month = new URL(route.request().url()).searchParams.get('month')
      const days =
        month === '2027-02' ? [{ date: '2027-02-01', count: 2, guests: 88, event: 'wedding' }] : []
      return route.fulfill({ json: days })
    })
    await page.getByRole('link', { name: 'Resumen', exact: true }).click()
    const plan = page.getByRole('region', { name: 'Plan de servicio' })
    const cells = plan.getByRole('link')
    await cells.first().waitFor()
    assert.equal(await cells.count(), 7)
    assert.match(await cells.nth(3).getAttribute('aria-label'), /2 solicitudes, 88 invitados$/)
    assert.match(await plan.locator('.planner-summary').innerText(), /2 solicitudes · 88 invitados/)
    assert.deepEqual((await page.locator('.dash-metrics dd').allTextContents()).slice(1), [
      '0',
      '0',
      '0',
    ])
    const figures = await page
      .locator('.dash-metrics dd, .service-days time')
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const style = getComputedStyle(node)
          return [style.fontFamily, style.fontVariantNumeric]
        }),
      )
    assert.equal(new Set(figures.map(([family]) => family)).size, 1)
    assert.ok(
      figures.every(
        ([, variant]) => variant.includes('tabular-nums') && variant.includes('lining-nums'),
      ),
    )
    await plan.getByRole('button', { name: '7 días siguientes' }).click()
    assert.equal(
      await cells.first().getAttribute('href'),
      '/admin/calendar?month=2027-02&day=2027-02-05',
    )
    await plan.getByRole('button', { name: 'Próximos 7 días' }).click()
    await cells.nth(3).click()
    await page.waitForURL('**/admin/calendar?month=2027-02&day=2027-02-01')
    await page.getByRole('link', { name: 'Ver todo el mes' }).waitFor()
  } finally {
    await browser.close()
  }
})

test('global search connects the recipe book, filtered calendar and purchasing', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.keyboard.press('Control+k')
    const finder = page.getByRole('dialog', { name: 'Buscar en el panel' })
    const query = finder.getByRole('searchbox')
    await query.fill('#123')
    assert.equal(
      await finder.getByRole('link', { name: /#123$/ }).first().getAttribute('href'),
      '/admin/123',
    )
    await query.fill('recetario')
    await query.press('Enter')
    await page.getByRole('heading', { name: 'Recetario', exact: true }).waitFor()
    await page.getByRole('searchbox').fill('canape')
    await page.getByRole('button', { name: 'Aplicar filtros' }).click()
    await page.getByRole('link', { name: /Canapé/ }).click()
    const editor = page.locator('#recipe-detail').getByRole('button', { name: 'Guardar receta' })
    await editor.waitFor()
    await page.reload()
    await editor.waitFor()
    assert.equal(new URL(page.url()).searchParams.get('dish'), 'salados-2')
    await page.goto(origin + '/admin/calendar?month=2027-01&day=2027-01-13&view=list')
    await page.locator('.work-filter .brand-select').click()
    await page.getByRole('option', { name: 'Confirmada', exact: true }).click()
    await page.waitForURL(/status=confirmed/)
    await page.getByRole('link', { name: 'Compras de esta fecha' }).click()
    await page.getByRole('heading', { name: 'Compras consolidadas' }).waitFor()
    assert.equal(await page.getByLabel('Desde', { exact: true }).inputValue(), '2027-01-13')
    assert.equal(await page.getByLabel('Hasta', { exact: true }).inputValue(), '2027-01-13')
    await page.getByLabel('Hasta', { exact: true }).fill('2027-03-13')
    await page.getByRole('button', { name: 'Consultar período' }).click()
    await page.getByRole('alert').filter({ hasText: '31 días' }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  } finally {
    await browser.close()
  }
})

test('el recetario guarda las cantidades privadas del plato y conserva la página del índice', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    const dishId = 'salados-1'
    let recipe = { dishId, revision: 2, lines: [{ ingredient: 'bread', amount: 20, unit: 'g' }] }
    const writes = []
    await page.route('**/admin/api/v1/recipes', (route) => {
      if (route.request().method() === 'POST') {
        const submitted = route.request().postDataJSON()
        writes.push(submitted)
        recipe = { ...submitted, revision: submitted.revision + 1 }
        return route.fulfill({ status: 204 })
      }
      return route.fulfill({ json: { [dishId]: recipe } })
    })
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.goto(origin + '/admin/recipes?dish=' + dishId)
    const amount = page.locator('#recipe-detail').getByRole('spinbutton').first()
    await amount.waitFor()
    assert.equal(await page.getByRole('button', { name: 'Escritorio', exact: true }).count(), 0)
    await amount.fill('37')
    for (const [width, height] of [
      [834, 1194],
      [375, 812],
    ]) {
      await page.setViewportSize({ width, height })
      assert.equal(await amount.inputValue(), '37')
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    }
    assert.deepEqual(writes, [])
    const saved = page.waitForResponse(
      (response) =>
        response.url().endsWith('/admin/api/v1/recipes') && response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: 'Guardar receta' }).click()
    await saved
    assert.deepEqual(writes, [
      { dishId, revision: 2, lines: [{ ingredient: 'bread', amount: 37, unit: 'g' }] },
    ])
    await page.goto(origin + '/admin/recipes?page=2')
    const before = page.url()
    await page.locator('.cookbook-card').first().click()
    await page.locator('#recipe-detail').waitFor()
    const back = page.getByRole('link', { name: 'Volver al índice' })
    assert.equal(new URL(await back.getAttribute('href'), origin).href, before)
    await page.goBack()
    await page.locator('.cookbook-card').first().waitFor()
    assert.equal(page.url(), before)
  } finally {
    await browser.close()
  }
})

test('Contenido muestra la tarjeta pública de cada dispositivo y abre sus ingredientes', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    })
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.goto(origin + '/admin/content')
    const preview = page.getByRole('region', { name: 'Vista previa de la carta' })
    const frame = preview.frameLocator('iframe')
    const card = frame.getByRole('article')
    const selector = preview.getByRole('combobox', { name: 'Plato o bebida' })

    // Native card sizes in the public catalog, before narrowing the panel to fit a small screen.
    for (const [name, width, height, imageWidth] of [
      ['Escritorio', 382, 171, 169],
      ['iPad', 379, 181, 179],
      ['Móvil', 358, 171, 169],
    ]) {
      const device = preview.getByRole('button', { name, exact: true })
      await device.press('Enter')
      assert.equal(await device.getAttribute('aria-pressed'), 'true')
      await card.getByRole('heading', { name: 'Mini tapadito' }).waitFor()
      await card.getByText('Salados', { exact: true }).waitFor()
      await card.getByText('Un sándwich de un bocado.').waitFor()
      await card.locator('img').evaluate((img) => img.decode())
      const sizes = await card.evaluate(async (element) => {
        await document.fonts.ready
        const box = element.getBoundingClientRect()
        const photo = element.querySelector('.catalog-card__image').getBoundingClientRect()
        return [box.width, box.height, photo.width].map(Math.round)
      })
      assert.deepEqual(sizes, [width, height, imageWidth], name)
    }

    const open = card.getByRole('button', { name: 'Ver ficha de Mini tapadito' })
    await open.press('Enter')
    const details = page.getByRole('dialog', { name: 'Mini tapadito' })
    await details.getByRole('link', { name: 'Consultar ingredientes' }).waitFor()
    await page.keyboard.press('Escape')
    await details.waitFor({ state: 'hidden' })
    assert.ok(await open.evaluate((el) => document.activeElement === el))

    await selector.selectOption('salados-5')
    await card.getByRole('button', { name: 'Ver ficha de Pincho' }).click()
    const skewers = page.getByRole('dialog', { name: 'Pincho' })
    await skewers
      .getByRole('region', { name: 'Ingredientes principales' })
      .getByText('Jamón')
      .waitFor()
    await page.keyboard.press('Escape')
    await page.locator('tr').filter({ hasText: 'Mini tapadito' }).getByText('Vista previa').click()
    await card.getByRole('heading', { name: 'Mini tapadito' }).waitFor()

    const settings = page.getByLabel('Configuración', { exact: true })
    await settings.click()
    const colors = new Set()
    for (const [name, theme] of [
      ['Día', 'light'],
      ['Noche', 'dark'],
      ['Jardín', 'garden'],
      ['Piscina', 'pool'],
    ]) {
      await page.getByRole('button', { name, exact: true }).click()
      await frame.locator('html[data-theme="' + theme + '"]').waitFor()
      colors.add(await card.evaluate((el) => getComputedStyle(el).backgroundColor))
    }
    assert.equal(colors.size, 4)
    await page.getByRole('button', { name: 'English', exact: true }).click()
    await page.keyboard.press('Escape')
    const translated = page.frameLocator('iframe')
    await translated.getByRole('button', { name: 'View details for Mini sandwich' }).waitFor()
    for (const display of [
      { width: 834, height: 1194 },
      { width: 375, height: 812 },
    ]) {
      await page.setViewportSize(display)
      await translated.getByRole('heading', { name: 'Mini sandwich' }).waitFor()
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    }
  } finally {
    await browser.close()
  }
})

test('la ficha reúne menú, montaje y compras y distingue datos ausentes de un fallo del recetario', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    const number = '900001'
    const payload = {
      event: 'wedding',
      date: '2027-01-17',
      guests: 40,
      location: 'Concepción',
      name: 'Equipo de prueba',
      email: 'example@example.test',
      phone: '',
      notes: '',
      items: { 'salados-5': 2, 'dulces-1': 1, 'principales-1': 1, 'bar-5': 1 },
      sauces: { 'principales-1': 'salsas-2' },
      omittedIngredients: { 'salados-5': ['menu.ingredients.olive'] },
      dietaryCounts: { lactose: 2 },
      table: {
        roundTables: 5,
        chairs: 8,
        headSeats: 0,
        tablecloth: 'ivory',
        overlay: 'sage',
        chairCover: 'ivory',
        sash: 'sage',
        napkin: 'ivory',
        textures: {
          tablecloth: 'linen',
          overlay: 'linen',
          chairCover: 'linen',
          sash: 'satin',
          napkin: 'linen',
        },
        overlayStyle: 'traditional',
        napkinFold: 'flat',
        dinnerware: 'goldRim',
        floral: 'white',
        flowerKind: 'original',
        flowerColor: 'original',
        bottleOutfit: 'none',
      },
    }
    const recipes = {
      'principales-1': {
        dishId: 'principales-1',
        revision: 1,
        lines: [{ ingredient: 'beef', amount: 175, unit: 'g' }],
      },
      'salsas-2': {
        dishId: 'salsas-2',
        revision: 1,
        lines: [{ ingredient: 'milk', amount: 25, unit: 'ml' }],
      },
    }
    let quotePayload = payload
    let recipeStatus = 200
    let recipeRequests = 0
    await page.route('**/admin/api/v1/quotes/' + number, (route) =>
      route.fulfill({ json: { number, status: 'requested', payload: quotePayload } }),
    )
    await page.route('**/admin/api/v1/recipes', (route) => {
      recipeRequests++
      return route.fulfill({ status: recipeStatus, json: recipeStatus === 200 ? recipes : {} })
    })
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.goto(origin + '/admin/' + number)

    const menu = page.locator('#event-menu')
    const setting = page.locator('#event-setting')
    const purchases = page.locator('#event-purchases')
    const skewers = menu.getByRole('listitem').filter({ hasText: 'Pincho' })
    await skewers.getByText('2 por invitado').waitFor()
    await skewers.getByText('Sin Aceituna').waitFor()
    await menu
      .getByRole('listitem')
      .filter({ hasText: 'Medallón de res' })
      .getByText('Salsa blanca')
      .waitFor()
    await page.getByText('2 personas', { exact: true }).waitFor()
    await setting.getByText('5 × 8 puestos').waitFor()
    await setting
      .getByRole('listitem')
      .filter({ has: page.getByText('Servilletas', { exact: true }) })
      .getByText('× 40', { exact: true })
      .waitFor()

    const purchaseRow = (name) =>
      purchases.getByRole('row').filter({ has: page.getByRole('rowheader', { name }) })
    await purchaseRow(/^Queso/)
      .getByRole('cell', { name: '800 g', exact: true })
      .waitFor()
    await purchaseRow(/^Vacuno/)
      .getByRole('cell', { name: '7 kg', exact: true })
      .waitFor()
    await purchaseRow(/^Leche/)
      .getByRole('cell', { name: '1 L', exact: true })
      .waitFor()
    await purchaseRow(/^Cerveza/)
      .getByRole('cell', { name: '13,2 L', exact: true })
      .waitFor()
    await purchases.getByRole('link', { name: 'Cupcake', exact: true }).waitFor()
    assert.equal(await purchaseRow(/^Aceituna/).count(), 0)
    for (const width of [834, 375]) {
      await page.setViewportSize({ width, height: 900 })
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    }

    recipeStatus = 503
    await page.reload()
    await menu.getByText('Pincho', { exact: true }).waitFor()
    await setting.getByText('5 × 8 puestos').waitFor()
    await purchases
      .getByRole('status')
      .getByText(/No se pudo cargar el recetario/)
      .waitFor()
    assert.equal(await purchases.getByRole('table').count(), 0)
    recipeStatus = 200
    await purchases.getByRole('button', { name: 'Reintentar' }).click()
    await purchaseRow(/^Vacuno/)
      .getByRole('cell', { name: '7 kg', exact: true })
      .waitFor()

    quotePayload = {
      ...payload,
      items: {},
      table: null,
      dietaryCounts: {},
      sauces: {},
      omittedIngredients: {},
    }
    const beforeEmpty = recipeRequests
    await page.reload()
    await menu.getByText(/sin platos ni bebidas seleccionados/).waitFor()
    await purchases.getByText(/cuando se defina el menú/).waitFor()
    await setting.getByText(/Mesa por definir/).waitFor()
    assert.equal(await purchases.getByRole('table').count(), 0)
    assert.equal(recipeRequests, beforeEmpty)
  } finally {
    await browser.close()
  }
})

test('la ficha avisa si otra cotización acaba de reservar el día y permite cancelar la pendiente', async () => {
  const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
  try {
    const page = await browser.newPage()
    const number = '900002'
    const path = '**/admin/api/v1/quotes/' + number
    const detail = {
      number,
      status: 'requested',
      dateBookedByAnotherEvent: false,
      payload: {
        name: 'Equipo de prueba',
        email: 'ejemplo@example.test',
        phone: '',
        event: 'wedding',
        location: 'Concepción',
        guests: 40,
        date: '2027-01-15',
        items: {},
        table: null,
        notes: '',
      },
    }
    await page.route(path, (route) => route.fulfill({ json: detail }))
    await page.route(path + '/status', (route) => {
      const { status, expectedStatus } = route.request().postDataJSON()
      assert.equal(expectedStatus, 'requested')
      if (status === 'confirmed') {
        detail.dateBookedByAnotherEvent = true
        return route.fulfill({ status: 409, json: { code: 'EVENT_DATE_UNAVAILABLE' } })
      }
      assert.equal(status, 'cancelled')
      detail.status = status
      return route.fulfill({ status: 204 })
    })
    await signIn(page, origin)
    await page.getByRole('heading', { name: 'Historial de cotizaciones' }).waitFor()
    await page.goto(origin + '/admin/' + number)
    const select = page.getByRole('combobox', { name: 'Estado', exact: true })
    const save = page.getByRole('button', { name: 'Guardar estado' })
    await select.selectOption('confirmed')
    await save.click()
    await page
      .getByRole('alert')
      .filter({ hasText: /fecha ya tiene un evento confirmado/ })
      .waitFor()
    assert.ok(await select.locator('[value=confirmed]').isDisabled())
    assert.equal(await select.inputValue(), 'requested')
    await select.selectOption('cancelled')
    await save.click()
    await page.getByText('Estado actualizado.', { exact: true }).waitFor()
    assert.equal(await select.inputValue(), 'cancelled')
  } finally {
    await browser.close()
  }
})
