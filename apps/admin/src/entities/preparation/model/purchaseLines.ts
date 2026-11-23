import { preparationResourceKey, type preparationPlan } from '@legado/domain/operations/preparation'

export function purchaseLines(
  resources: ReturnType<typeof preparationPlan>['resources'],
  packs: Readonly<Record<string, string>>,
) {
  return resources.map((resource) => {
    const { name, unit } = resource
    const id = preparationResourceKey(name, unit)
    const amount = unit === 'unit' ? Math.ceil(resource.amount) : resource.amount
    const entered = Number(packs[id])
    const size = Number.isFinite(entered) && entered > 0 ? entered : null
    return {
      id,
      name,
      unit,
      amount,
      size,
      packCount: size === null ? null : Math.ceil(amount / size),
      token: JSON.stringify([amount, size]),
    }
  })
}
