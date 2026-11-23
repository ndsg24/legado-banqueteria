import { useState } from 'react'
import { ActionButton } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import type { MessageKey } from '@legado/domain/i18n/messages'
import { purchasePackOptions } from '@legado/domain/operations/pack-options'
import type { RecipeLine } from '@legado/domain/operations/recipes'
import { operations } from '../../../shared/config/operations'
import { supplyQuantityFormatter } from '../../../shared/lib'

const pageSize = 6

type Props = {
  resource: MessageKey
  amount: number
  unit: RecipeLine['unit']
}

export function PurchasePackOptions({ resource, amount, unit }: Props) {
  const { language, locale } = useI18n()
  const copy = operations[language]
  const display = supplyQuantityFormatter(locale, copy.unit)
  const number = new Intl.NumberFormat(locale)
  const [limit, setLimit] = useState(pageSize)
  const plan = purchasePackOptions(resource, unit, amount)
  if (!plan) return null

  const lines: string[] = []
  for (const combination of plan.combinations) {
    lines.push(
      combination
        .map(({ size, count }) => number.format(count) + ' × ' + display(size, unit))
        .join(' + '),
    )
    if (lines.length > limit) break
  }
  return (
    <div className="purchase-options__body">
      <p className="purchase-options__total">
        <strong>{display(plan.total, unit)}</strong>
        <span>
          {plan.surplus > 0
            ? copy.packSurplus.replace('{amount}', display(plan.surplus, unit))
            : copy.packExact}
        </span>
      </p>
      <ul role="list">
        {lines.slice(0, limit).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {lines.length > limit && (
        <ActionButton variant="secondary" onPress={() => setLimit(limit + pageSize)}>
          {copy.morePackOptions}
        </ActionButton>
      )}
      <p className="purchase-options__hint">{copy.packOptionsHint}</p>
    </div>
  )
}
