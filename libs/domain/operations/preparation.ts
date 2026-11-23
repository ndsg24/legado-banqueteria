import { quoteCategories, selectedSauce } from '../menu/for-quote'
import type { IngredientKey } from '../menu/types'
import type { MessageKey } from '../i18n/messages'
import type { RecipeBook, RecipeLine } from './recipes'
import type { QuoteRequest } from '../quote/request'

type Unit = 'g' | 'ml' | 'unit'
type Ingredient = IngredientKey extends `menu.ingredients.${infer Slug}` ? Slug : never
type Portion = [Ingredient, number, Unit]
// Planning yields per serving. Kitchen recipes and supplier pack sizes take precedence.
const portions: Record<string, Portion[]> = {
  'salados-1': [['bread', 20, 'g']],
  'salados-2': [['bread', 12, 'g']],
  'salados-3': [['bread', 15, 'g']],
  'salados-4': [['jack-mackerel', 35, 'g']],
  'salados-5': [
    ['tomato', 10, 'g'],
    ['cheese', 10, 'g'],
    ['olive', 1, 'unit'],
    ['ham', 8, 'g'],
  ],
  'dulces-2': [['seasonal-fruit', 45, 'g']],
  'dulces-5': [
    ['lemon', 6, 'g'],
    ['meringue', 8, 'g'],
  ],
  'entradas-1': [
    ['avocado', 80, 'g'],
    ['shrimp', 50, 'g'],
  ],
  'entradas-2': [
    ['avocado', 80, 'g'],
    ['chicken', 55, 'g'],
  ],
  'entradas-3': [['ham', 50, 'g']],
  'entradas-7': [['tomato', 1, 'unit']],
  'entradas-8': [
    ['chilean-abalone', 80, 'g'],
    ['mayonnaise', 15, 'g'],
  ],
  'entradas-9': [['salmon', 100, 'g']],
  'principales-1': [['beef', 200, 'g']],
  'principales-2': [['pork', 200, 'g']],
  'principales-3': [['pork', 200, 'g']],
  'principales-5': [['turkey', 200, 'g']],
  'principales-6': [['salmon', 180, 'g']],
  'principales-7': [['beef', 200, 'g']],
  'principales-8': [['chicken', 200, 'g']],
  'principales-9': [['beef', 200, 'g']],
  'guarniciones-1': [['potato', 160, 'g']],
  'guarniciones-2': [
    ['potato', 160, 'g'],
    ['parsley', 2, 'g'],
  ],
  'guarniciones-3': [
    ['potato', 150, 'g'],
    ['mayonnaise', 20, 'g'],
  ],
  'guarniciones-4': [['vegetables', 140, 'g']],
  'guarniciones-5': [
    ['rice', 55, 'g'],
    ['vegetables', 35, 'g'],
  ],
  'guarniciones-6': [['potato', 150, 'g']],
  'guarniciones-7': [['potato', 160, 'g']],
  'guarniciones-8': [['potato', 140, 'g']],
  'guarniciones-9': [
    ['rice', 60, 'g'],
    ['curry', 1, 'g'],
  ],
  'postres-1': [
    ['cream', 40, 'ml'],
    ['coffee', 15, 'ml'],
    ['cocoa', 2, 'g'],
  ],
  'postres-4': [
    ['milk', 90, 'ml'],
    ['egg', 0.5, 'unit'],
    ['sugar', 18, 'g'],
  ],
  'postres-5': [
    ['condensed-milk', 50, 'g'],
    ['egg', 0.4, 'unit'],
  ],
  'postres-6': [['fruit', 150, 'g']],
  'postres-7': [
    ['fruit', 90, 'g'],
    ['ice-cream', 40, 'g'],
  ],
  'postres-8': [
    ['sauce', 8, 'ml'],
    ['ice-cream', 90, 'g'],
    ['cookie', 1, 'unit'],
  ],
  'postres-9': [
    ['lemon', 20, 'g'],
    ['meringue', 25, 'g'],
  ],
  'nocturnos-1': [['beef', 45, 'g']],
  'nocturnos-2': [['chicken', 45, 'g']],
  'nocturnos-4': [['conger-eel', 80, 'g']],
}
export function referenceRecipe(id: string): RecipeLine[] {
  return (portions[id] ?? []).map(([ingredient, amount, unit]) => ({ ingredient, amount, unit }))
}
type PlanQuote = Pick<QuoteRequest, 'items' | 'guests' | 'sauces' | 'omittedIngredients'>
// This key also identifies pack sizes and dispatch checks in existing preparation sheets.
export function preparationResourceKey(name: MessageKey, unit: Unit) {
  return name + unit
}

export function preparationPlan(quote: PlanQuote, recipes: RecipeBook = {}) {
  const resources = new Map<string, { name: MessageKey; unit: Unit; amount: number }>()
  const sources = new Map<string, Set<MessageKey>>()
  const dishes: {
    id: string
    name: MessageKey
    servings: number
    pending: boolean
    category: MessageKey
    unmeasured: IngredientKey[]
  }[] = []
  function add(name: MessageKey, amount: number, unit: Unit, source: MessageKey) {
    if (!amount) return
    const key = preparationResourceKey(name, unit)
    const prior = resources.get(key)
    resources.set(key, { name, unit, amount: (prior?.amount ?? 0) + amount })
    const contributors = sources.get(key) ?? new Set<MessageKey>()
    contributors.add(source)
    sources.set(key, contributors)
  }
  for (const category of quoteCategories) {
    const selected = category.items.filter((item) => quote.items[item.id] > 0)
    for (const [index, item] of selected.entries()) {
      const shares = selected.length
      const servings =
        category.collection === 'cocktail'
          ? quote.guests * quote.items[item.id]
          : Math.floor(quote.guests / shares) + Number(index < quote.guests % shares)
      const beverage = ['bar', 'aperitivos', 'bajativos'].includes(category.id)
      const recipe = recipes[item.id]?.lines ?? referenceRecipe(item.id)
      const omitted = quote.omittedIngredients?.[item.id] ?? []
      const finishedBeverage = beverage && !recipe.length && !omitted.length
      if (finishedBeverage) {
        const measure =
          category.id === 'bajativos' ? 45 : category.id === 'bar' ? barServing[item.id] : 150
        add(item.name, servings * measure, 'ml', item.name)
      }
      for (const { ingredient: slug, amount: qty, unit } of recipe) {
        const name = `menu.ingredients.${slug}` as const
        if (!omitted.includes(name)) add(name, qty * servings, unit, item.name)
      }
      const sauce = selectedSauce(item.id, quote.sauces ?? {})
      if (sauce) {
        const lines = recipes[sauce.id]?.lines
        if (lines)
          for (const line of lines)
            add(
              `menu.ingredients.${line.ingredient}`,
              servings * line.amount,
              line.unit,
              sauce.name,
            )
        else add(sauce.name, servings * 40, 'ml', item.name)
      }
      const unmeasured =
        finishedBeverage || recipes[item.id]
          ? []
          : (item.ingredients ?? []).filter(
              (key) =>
                !omitted.includes(key) &&
                !recipe.some((line) => key === `menu.ingredients.${line.ingredient}`),
            )
      dishes.push({
        id: item.id,
        name: item.name,
        category: category.label,
        servings,
        pending: (!finishedBeverage && !recipe.length) || unmeasured.length > 0,
        unmeasured,
      })
    }
  }
  return { dishes, resources: [...resources.values()], sources }
}
const barServing: Record<string, number> = {
  'bar-1': 45,
  'bar-2': 45,
  'bar-3': 45,
  'bar-4': 180,
  'bar-5': 330,
  'bar-6': 45,
  'bar-7': 180,
  'bar-8': 150,
  'bar-9': 45,
}
