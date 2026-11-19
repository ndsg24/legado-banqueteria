import { useI18n } from '../../../shared/i18n'
import { useRef, useState, type ReactNode } from 'react'
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { quoteCategories, isSingleChoice, type Quantities } from '../../../entities/menu'
import { CatalogItemPhoto } from '../../../entities/menu/ui'
import { QuantityControl } from '../../../shared/ui/QuantityControl'
import { MainSaucePicker, type SaucePickerProps } from './MainSaucePicker'

type Props = SaucePickerProps & {
  selected: Quantities
  onQuantityChange: (id: string, quantity: number) => void
}

function SwipeSelectionRow({
  name,
  onRemove,
  children,
}: {
  name: string
  onRemove: () => void
  children: ReactNode
}) {
  const { t } = useI18n()

  const [revealed, setRevealed] = useState(false)
  return (
    <li
      className="quote-summary__row"
      data-revealed={revealed}
      onScroll={(event) => setRevealed(event.currentTarget.scrollLeft >= 44)}
    >
      <div className="quote-summary__item">{children}</div>
      <button
        className="quote-summary__swipe-remove"
        type="button"
        aria-label={t('quote.selection.remove') + ' ' + name}
        inert={!revealed}
        onClick={onRemove}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />
        </svg>
        {t('quote.selection.remove')}
      </button>
    </li>
  )
}

export function QuoteSelection({ selected, onQuantityChange, ...saucePicker }: Props) {
  const { t } = useI18n()

  const touchedRow = useRef<HTMLLIElement | null>(null)
  const count = Object.keys(selected).length
  return (
    <DialogTrigger>
      <Button className="quote-menu__review">
        {t('quote.selection.title')} <span>({count})</span>
      </Button>
      <ModalOverlay className="quote-summary-overlay" isDismissable>
        <Modal className="quote-summary-panel">
          <Dialog className="quote-summary">
            <header className="quote-summary__header">
              <Heading slot="title">{t('quote.selection.title')}</Heading>
              <Button
                slot="close"
                className="quote-summary__close"
                aria-label={t('quote.selection.close')}
              >
                ×
              </Button>
            </header>
            <p className="quote-summary__count" role="status">
              {count
                ? count +
                  (count === 1
                    ? ' ' + t('quote.selection.chosenOne')
                    : ' ' + t('quote.selection.chosenMany'))
                : t('quote.selection.empty')}
            </p>
            <div
              className="quote-summary__list"
              onTouchStartCapture={(event) => {
                const row = (event.target as Element).closest<HTMLLIElement>('.quote-summary__row')
                if (touchedRow.current !== row) touchedRow.current?.scrollTo({ left: 0 })
                touchedRow.current = row
              }}
            >
              {quoteCategories.map((category) => {
                const chosen = category.items.filter((item) => selected[item.id])
                if (!chosen.length) return null
                return (
                  <section key={category.id} className="quote-summary__group">
                    <h3>{t(category.label)}</h3>
                    <ul>
                      {chosen.map((item) => (
                        <SwipeSelectionRow
                          key={item.id}
                          name={t(item.name)}
                          onRemove={() => onQuantityChange(item.id, 0)}
                        >
                          <span className="quote-summary__photo">
                            <CatalogItemPhoto item={item} alt="" sizes="48px" />
                          </span>
                          <span>{t(item.name)}</span>
                          {isSingleChoice(item.id) ? (
                            <button
                              className="quote-summary__remove"
                              type="button"
                              aria-label={t('quote.selection.remove') + ' ' + t(item.name)}
                              onClick={() => onQuantityChange(item.id, 0)}
                            >
                              {t('quote.selection.remove')}
                            </button>
                          ) : (
                            <QuantityControl
                              name={t(item.name)}
                              quantity={selected[item.id]}
                              onChange={(quantity) => onQuantityChange(item.id, quantity)}
                            />
                          )}
                          {category.id === 'principales' && (
                            <MainSaucePicker showThumbnail main={item} {...saucePicker} />
                          )}
                        </SwipeSelectionRow>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
