import { DialogCloseButton } from '../../../shared/ui/DialogCloseButton'
import { ActionButton } from '../../../shared/ui/ActionButton'
import { DishDialogPhoto } from './DishDialogPhoto'
import { useState } from 'react'
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { isSingleChoice, type CatalogCategory, type CatalogItem } from '../../../entities/menu'
import { CategoryMotif } from '../../../entities/menu/ui'
import { useI18n } from '../../../shared/i18n'
import { AlbumArrows } from '../../../shared/ui/AlbumArrows'
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
    <ModalOverlay
      className="sauce-overlay ingredients-overlay"
      isOpen
      isDismissable
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Modal className="ingredients-panel">
        <Dialog className="ingredients-dialog" data-category={category.id}>
          <AlbumArrows
            className="ingredients-dialog__arrows"
            label={t('quote.selection.explore')}
            previous={t('quote.selection.previousDish')}
            next={t('quote.selection.nextDish')}
            onTurn={onTurn}
          />
          <div className="ingredients-dialog__card">
            <DishDialogPhoto item={item} />
            <DialogCloseButton label={t('quote.selection.closeIngredients')} onClose={onClose} />
            <div className="ingredients-dialog__body">
              <span className="ingredients-dialog__category">
                <CategoryMotif categoryId={category.id} itemId={item.id} />
                {t(category.label)}
              </span>
              <Heading slot="title" aria-live="polite">
                {name}
              </Heading>
              <p className="ingredients-dialog__description">{t(item.description)}</p>
              {item.ingredients && (
                <section
                  className="ingredients-dialog__ingredients"
                  aria-labelledby="dish-ingredient-heading"
                >
                  <h3 id="dish-ingredient-heading">{t('quote.selection.ingredients')}</h3>
                  <ul>
                    {item.ingredients.map((key) => (
                      <li key={key}>
                        <img
                          width="44"
                          height="44"
                          alt=""
                          src={
                            import.meta.env.BASE_URL +
                            'images/ingredients/' +
                            key.slice('menu.ingredients.'.length) +
                            '.webp'
                          }
                        />
                        <span>{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {main && (
                <section className="ingredients-dialog__sauces">
                  <h3>{t('menu.categories.salsas')}</h3>
                  <SauceOptionsGrid
                    compact
                    selected={sauceId}
                    disabled={atLimit}
                    onChoose={(id) =>
                      setDraftSauces((previous) => ({ ...previous, [item.id]: id }))
                    }
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
                    onChange={(value) =>
                      setCounts((previous) => ({ ...previous, [item.id]: value }))
                    }
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
                  {t(action)} <span aria-hidden="true">↗</span>
                </ActionButton>
              </div>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
