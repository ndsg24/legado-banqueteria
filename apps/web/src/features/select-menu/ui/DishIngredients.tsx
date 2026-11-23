import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { ActionButton } from '../../../shared/ui/ActionButton'
import { useState } from 'react'
import { DishDetailsDialog } from './DishDetailsDialog'
import { Button } from 'react-aria-components'
import { isSingleChoice, type CatalogCategory, type CatalogItem } from '../../../entities/menu'
import { useI18n } from '../../../shared/i18n'
import { QuantityControl } from '../../../shared/ui/QuantityControl'
import { SauceOptionsGrid } from './SauceOptionsGrid'

type Props = {
  item: CatalogItem
  category: CatalogCategory
  quantity: number
  atLimit: boolean
  onTurn: (direction: -1 | 1) => void
  onClose: () => void
  currentSauceId?: string
  onSave: (quantity: number, sauceId?: string) => void
}

export function DishIngredients({
  item,
  category,
  quantity,
  atLimit,
  currentSauceId = '',
  onSave,
  onClose,
  onTurn,
}: Props) {
  const { t } = useI18n()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [draftSauces, setDraftSauces] = useState<Record<string, string>>({})
  const main = category.id === 'principales'
  const sauceId = draftSauces[item.id] ?? currentSauceId
  const editingMain = main && quantity > 0
  const single = isSingleChoice(item.id)
  const count = single ? Number(editingMain || !quantity) : (counts[item.id] ?? (quantity || 1))
  const action = !count
    ? 'quote.selection.removeDish'
    : quantity
      ? 'quote.selection.saveDish'
      : 'quote.selection.addDish'
  const name = t(item.name)
  return (
    <DishDetailsDialog item={item} category={category} onClose={onClose} onTurn={onTurn}>
      {main && (
        <section className="ingredients-dialog__sauces">
          <h3>{t('menu.categories.salsas')}</h3>
          <SauceOptionsGrid
            compact
            selected={sauceId}
            disabled={atLimit}
            onChoose={(id) => setDraftSauces((previous) => ({ ...previous, [item.id]: id }))}
          />
        </section>
      )}
      {atLimit && (
        <p role="status">
          {t(
            category.id === 'aperitivos'
              ? 'quote.selection.aperitifLimit'
              : 'quote.selection.limitReached',
          )}
        </p>
      )}
      <div className="ingredients-dialog__footer">
        {editingMain && (
          <Button
            className="ingredients-dialog__remove"
            onPress={() => {
              onSave(0)
              onClose()
            }}
          >
            {t('quote.selection.removeDish')}
          </Button>
        )}
        {!single && (
          <QuantityControl
            key={item.id}
            name={name}
            quantity={count}
            onChange={(value) => setCounts((previous) => ({ ...previous, [item.id]: value }))}
          />
        )}
        <ActionButton
          className="ingredients-dialog__save"
          isDisabled={
            atLimit || (!count && !quantity) || (editingMain && sauceId === currentSauceId)
          }
          onPress={() => {
            onSave(count, main ? sauceId : undefined)
            onClose()
          }}
        >
          {t(action)} <EditorialArrow direction="up-right" />
        </ActionButton>
      </div>
    </DishDetailsDialog>
  )
}
