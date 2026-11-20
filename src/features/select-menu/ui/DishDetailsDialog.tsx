import type { ReactNode } from 'react'
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components'
import type { CatalogCategory, CatalogItem } from '../../../entities/menu'
import { CategoryMotif } from '../../../entities/menu/ui'
import { useI18n } from '../../../shared/i18n'
import { DialogCloseButton } from '../../../shared/ui/DialogCloseButton'
import { AlbumArrows } from '../../../shared/ui/AlbumArrows'
import { DishDialogPhoto } from './DishDialogPhoto'

type Props = {
  item: CatalogItem
  category: CatalogCategory
  onClose: () => void
  onTurn: (direction: -1 | 1) => void
  children?: ReactNode
}

export function DishDetailsDialog({ item, category, onClose, onTurn, children }: Props) {
  const { t } = useI18n()
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
                {t(item.name)}
              </Heading>
              <p className="ingredients-dialog__description">{t(item.description)}</p>
              {!!item.ingredients?.length && (
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
              {item.tastingNote && (
                <section
                  className="ingredients-dialog__ingredients"
                  aria-labelledby="dish-tasting-heading"
                >
                  <h3 id="dish-tasting-heading">{t('menu.tastingGuide')}</h3>
                  <p>{t(item.tastingNote)}</p>
                </section>
              )}
              {children}
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
