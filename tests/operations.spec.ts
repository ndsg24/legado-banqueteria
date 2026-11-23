import { expect, test } from '@playwright/test'
import { summarizeLedger } from '@legado/domain/operations/finance'
import { purchasePackOptions } from '@legado/domain/operations/pack-options'
import { preparationPlan, preparationResourceKey } from '@legado/domain/operations/preparation'
import { purchaseReport } from '@legado/domain/operations/purchasing'

test('purchase options enumerate unique combinations covering the smallest possible total', () => {
  const options = purchasePackOptions('menu.ingredients.bread', 'g', 2500)!
  expect(options.total).toBe(2500)
  expect(options.surplus).toBe(0)
  const combinations = [...options.combinations]
  expect(combinations).toHaveLength(14)
  expect(new Set(combinations.map((packs) => JSON.stringify(packs))).size).toBe(14)
  for (const packs of combinations) {
    expect(packs.every(({ count }) => Number.isInteger(count) && count > 0)).toBe(true)
    expect(packs.reduce((sum, { size, count }) => sum + size * count, 0)).toBe(2500)
  }
  expect(combinations).toContainEqual([{ size: 500, count: 5 }])
  expect(combinations).toContainEqual([
    { size: 2000, count: 1 },
    { size: 500, count: 1 },
  ])
})

test('purchase options round up supplier formats and retain exact fractional yields', () => {
  const wine = purchasePackOptions('menu.dishes.bar-8.name', 'ml', 2400)!
  expect(wine.total).toBe(3000)
  expect(wine.surplus).toBe(600)
  expect([...wine.combinations]).toEqual([[{ size: 750, count: 4 }]])
  const butter = purchasePackOptions('menu.ingredients.butter', 'g', 251.5)!
  expect(butter.total).toBe(375)
  expect(butter.surplus).toBe(123.5)
  expect(purchasePackOptions('menu.ingredients.butter', 'g', 250.00000000000006)?.total).toBe(250)
  expect(purchasePackOptions('menu.ingredients.butter', 'g', 0)).toBeNull()
})

test('a deposit changes cash while the earned sale determines operating profit', () => {
  expect(summarizeLedger({ sale: 120000, deposit: 50000, supplies: 22000, staff: 8000 })).toEqual({
    income: 50000,
    expenses: 30000,
    balance: 20000,
    profit: 90000,
    sales: 120000,
  })
})

test('production combines repeated ingredients, alternative mains, sauces and cocktail counts', () => {
  const plan = preparationPlan(
    {
      guests: 31,
      items: { 'principales-1': 1, 'principales-7': 1, 'salados-5': 2, 'extras-1': 1 },
      omittedIngredients: { 'salados-5': ['menu.ingredients.olive'] },
      sauces: { 'principales-1': 'salsas-1', 'principales-7': 'salsas-1' },
    },
    {
      'principales-1': {
        dishId: 'principales-1',
        revision: 1,
        lines: [{ ingredient: 'beef', amount: 250, unit: 'g' }],
      },
    },
  )
  expect(plan.resources).toContainEqual({
    name: 'menu.ingredients.beef',
    unit: 'g',
    amount: 16 * 250 + 15 * 200,
  })
  expect(plan.resources).toContainEqual({
    name: 'menu.dishes.salsas-1.name',
    unit: 'ml',
    amount: 31 * 40,
  })
  expect(plan.resources).toContainEqual({
    name: 'menu.ingredients.cheese',
    unit: 'g',
    amount: 62 * 10,
  })
  expect(plan.resources.some((r) => r.name === 'menu.ingredients.olive')).toBeFalsy()
  expect(plan.dishes.find((d) => d.id === 'extras-1')?.pending).toBeTruthy()
  expect([...plan.sources.get(preparationResourceKey('menu.ingredients.beef', 'g'))!]).toEqual([
    'menu.dishes.principales-1.name',
    'menu.dishes.principales-7.name',
  ])
})

test('omissions affect purchases and surface ingredients without measured quantities', () => {
  const selection = {
    guests: 40,
    items: { 'postres-6': 1, 'aperitivos-1': 1, 'aperitivos-3': 1 },
    omittedIngredients: {
      'postres-6': ['menu.ingredients.fruit'],
      'aperitivos-1': ['menu.ingredients.pisco'],
    },
  }
  const plan = preparationPlan(selection)
  expect(plan.resources).toEqual([
    { name: 'menu.dishes.aperitivos-3.name', amount: 3000, unit: 'ml' },
  ])
  expect(plan.dishes.find((d) => d.id === 'postres-6')?.unmeasured).toEqual([
    'menu.ingredients.ice-cream',
  ])
  expect(plan.dishes.find((d) => d.id === 'aperitivos-1')).toMatchObject({
    pending: true,
    unmeasured: ['menu.ingredients.mango'],
  })
  const withRecipe = preparationPlan(selection, {
    'aperitivos-1': {
      dishId: 'aperitivos-1',
      revision: 1,
      lines: [
        { ingredient: 'mango', amount: 80, unit: 'g' },
        { ingredient: 'pisco', amount: 30, unit: 'ml' },
      ],
    },
  })
  expect(withRecipe.resources).toContainEqual({
    name: 'menu.ingredients.mango',
    amount: 20 * 80,
    unit: 'g',
  })
  expect(withRecipe.resources.some((r) => r.name === 'menu.ingredients.pisco')).toBe(false)
})

test('purchasing preserves event allocations, units, custom yields and missing recipes', () => {
  const orders: Parameters<typeof purchaseReport>[0] = [
    {
      number: '4',
      date: '2027-02-01',
      guests: 30,
      items: { 'salados-1': 2, 'extras-1': 1 },
    },
    {
      number: '12',
      date: '2027-02-02',
      guests: 40,
      items: { 'salados-1': 1, 'salados-2': 1 },
    },
  ]
  const report = purchaseReport(orders, {
    'salados-1': {
      dishId: 'salados-1',
      revision: 2,
      lines: [{ ingredient: 'bread', unit: 'unit', amount: 0.5 }],
    },
  })
  expect(report.guests).toEqual(70)
  expect(report.events.map((e) => e.missingRecipes.length)).toEqual([1, 0])
  expect(report.lines).toEqual([
    {
      name: 'menu.ingredients.bread',
      unit: 'unit',
      amount: 50,
      orders: [
        { number: '4', amount: 30 },
        { number: '12', amount: 20 },
      ],
    },
    {
      name: 'menu.ingredients.bread',
      unit: 'g',
      amount: 480,
      orders: [{ number: '12', amount: 480 }],
    },
  ])
  expect(purchaseReport([], {})).toEqual({ guests: 0, events: [], lines: [] })
})
