import type { MessageKey } from '../i18n/messages'
import type { QuoteRequest } from '../quote/request'
import type { RecipeBook } from './recipes'
import { preparationPlan } from './preparation'

export type ProductionOrder = Pick<
  QuoteRequest,
  'guests' | 'items' | 'sauces' | 'omittedIngredients'
> & {
  number: string
  date: string
}
export type PurchaseLine = {
  name: MessageKey
  unit: 'g' | 'ml' | 'unit'
  amount: number
  orders: { number: string; amount: number }[]
}
export function purchaseReport(orders: ProductionOrder[], book: RecipeBook) {
  const lines = new Map<string, PurchaseLine>()
  const events = orders.map((order) => {
    const plan = preparationPlan(order, book)
    for (const resource of plan.resources) {
      const key = resource.name + ':' + resource.unit
      const line = lines.get(key) ?? { ...resource, amount: 0, orders: [] }
      line.amount += resource.amount
      line.orders.push({ number: order.number, amount: resource.amount })
      lines.set(key, line)
    }
    return {
      number: order.number,
      date: order.date,
      guests: order.guests,
      missingRecipes: plan.dishes
        .filter((dish) => dish.pending && dish.servings > 0)
        .map((dish) => dish.name),
    }
  })
  return {
    events,
    lines: [...lines.values()],
    guests: orders.reduce((n, order) => n + order.guests, 0),
  }
}
export type PurchaseReport = ReturnType<typeof purchaseReport>
