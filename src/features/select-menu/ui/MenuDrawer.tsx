import { DialogCloseButton } from '../../../shared/ui/DialogCloseButton'
import { useRef, useState, type ReactNode } from 'react'
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { isSingleChoice, mainCourseIds, type Quantities } from '../../../entities/menu'
import type { menuGroups } from '../../../entities/quote'
import { CatalogItemPhoto, CategoryMotif } from '../../../entities/menu/ui'
import { QuantityControl } from '../../../shared/ui/QuantityControl'
import { MainSaucePicker, type SaucePickerProps } from './MainSaucePicker'

type Menu = ReturnType<typeof menuGroups>
type Entry = Menu[number]['groups'][number]['entries'][number]
type Editing = Pick<SaucePickerProps, 'onSauceChange'> & {
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
      className="quote-summary__row quote-summary__row--editable"
      data-revealed={revealed}
      onScroll={(event) => setRevealed(event.currentTarget.scrollLeft >= 44)}
    >
      {children}
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

function DrawerDish({ entry, edit }: { entry: Entry; edit?: Editing }) {
  const { t } = useI18n()
  const { item, name, sauce, quantity, omissions } = entry
  const row = (
    <div className="quote-summary__item">
      <span className="quote-summary__photo">
        <CatalogItemPhoto item={item} alt="" sizes="56px" />
      </span>
      <span>
        {name}
        {omissions && <small className="dish-omissions">{omissions}</small>}
      </span>
      {edit ? (
        isSingleChoice(item.id) ? (
          <button
            className="quote-summary__remove"
            type="button"
            aria-label={t('quote.selection.remove') + ' ' + name}
            onClick={() => edit.onQuantityChange(item.id, 0)}
          >
            {t('quote.selection.remove')}
          </button>
        ) : (
          <QuantityControl
            name={name}
            quantity={edit.selected[item.id]}
            onChange={(value) => edit.onQuantityChange(item.id, value)}
          />
        )
      ) : (
        quantity && <strong className="quote-summary__quantity">{quantity}</strong>
      )}
      {edit && mainCourseIds.has(item.id) ? (
        <MainSaucePicker
          showThumbnail
          main={item}
          current={sauce?.item}
          onSauceChange={edit.onSauceChange}
        />
      ) : (
        sauce && (
          <span className="quote-summary__sauce">
            <span className="quote-sauces__photo">
              <CatalogItemPhoto item={sauce.item} alt="" sizes="36px" />
            </span>
            {sauce.name}
          </span>
        )
      )}
    </div>
  )
  return edit ? (
    <SwipeSelectionRow name={name} onRemove={() => edit.onQuantityChange(item.id, 0)}>
      {row}
    </SwipeSelectionRow>
  ) : (
    <li className="quote-summary__row">{row}</li>
  )
}

type DrawerProps = {
  title: string
  closeLabel: string
  getMenu: () => Menu
  edit?: Editing
}

export function MenuDrawer(props: DrawerProps) {
  return (
    <ModalOverlay className="quote-summary-overlay" isDismissable>
      <Modal className="quote-summary-panel">
        <Dialog className="quote-summary">
          <DrawerContents {...props} />
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}

function DrawerContents({ title, closeLabel, getMenu, edit }: DrawerProps) {
  const menu = getMenu()
  const { t } = useI18n()
  const touchedRow = useRef<HTMLLIElement | null>(null)
  const count = menu.reduce(
    (total, service) => total + service.groups.reduce((n, group) => n + group.entries.length, 0),
    0,
  )
  return (
    <>
      <header className="quote-summary__header">
        <Heading slot="title">{title}</Heading>
        <DialogCloseButton label={closeLabel} />
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
          const row = (event.target as Element).closest<HTMLLIElement>(
            '.quote-summary__row--editable',
          )
          if (touchedRow.current !== row) touchedRow.current?.scrollTo({ left: 0 })
          touchedRow.current = row
        }}
      >
        {menu.map((service) => (
          <section className="quote-summary__group" key={service.name}>
            <h3>
              <CategoryMotif categoryId={service.motif} />
              {service.name}
            </h3>
            {service.groups.map((group) => (
              <div key={group.categoryId} className="quote-summary__course">
                {group.name && <h4>{group.name}</h4>}
                <ul>
                  {group.entries.map((entry) => (
                    <DrawerDish key={entry.item.id} entry={entry} edit={edit} />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
