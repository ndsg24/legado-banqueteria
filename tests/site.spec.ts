import { expect, test } from '@playwright/test'

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
