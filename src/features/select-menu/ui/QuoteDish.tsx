import { SelectionCardPhoto } from './SelectionCardPhoto'
import { memo } from 'react'
import { useI18n } from '../../../shared/i18n'
import { isSingleChoice, type CatalogCategory, type CatalogItem } from '../../../entities/menu'
import { CatalogItemPhoto } from '../../../entities/menu/ui'
import { SelectionCard } from './SelectionCard'
import { QuantityControl } from '../../../shared/ui/QuantityControl'
import { DishWatermark } from './DishWatermark'
import { MainSaucePicker, type SaucePickerProps } from './MainSaucePicker'

type Props = Pick<SaucePickerProps, 'onSauceChange'> & {
  currentSauce?: CatalogItem
  item: CatalogItem
  onDetails: (id: string) => void
  quantity: number
  category: CatalogCategory
  atLimit: boolean
  onQuantityChange: (id: string, quantity: number) => void
}

export const QuoteDish = memo(function QuoteDish({
  item,
  quantity,
  category,
  atLimit,
  onDetails,
  onQuantityChange,
  currentSauce,
  onSauceChange,
}: Props) {
  const { t } = useI18n()
  const single = isSingleChoice(item.id)
  const sauce = quantity > 0 && currentSauce
  const tagId = category.collection === 'cocktail' ? 'quote-tag-' + item.id : undefined
  const descriptionId = 'quote-description-' + item.id
  const selectedId = quantity > 0 ? 'quote-selected-' + item.id : undefined
  return (
    <SelectionCard
      selected={quantity > 0}
      selectedId={selectedId}
      data-category={category.id}
      watermark={<DishWatermark categoryId={category.id} itemId={item.id} />}
      details={{
        'aria-haspopup': 'dialog',
        'aria-label': t('quote.selection.details', { name: t(item.name) }),
        'aria-describedby': [descriptionId, tagId, selectedId].filter(Boolean).join(' '),
        onClick: () => onDetails(item.id),
      }}
      badge={
        tagId && (
          <span className="quote-dish__tag" id={tagId}>
            {t(category.label)}
          </span>
        )
      }
      photo={
        <SelectionCardPhoto>
          {(onSettled) => (
            <CatalogItemPhoto
              item={item}
              alt=""
              sizes="(max-width: 600px) 37vw, (max-width: 960px) 30vw, 280px"
              onSettled={onSettled}
            />
          )}
        </SelectionCardPhoto>
      }
      companion={
        sauce && (
          <span className="quote-dish__sauce-photo">
            <CatalogItemPhoto item={sauce} alt="" sizes="(max-width: 600px) 10vw, 56px" />
          </span>
        )
      }
      caption={
        <>
          {t(item.name)}
          <small id={descriptionId}>{t(item.description)}</small>
          <span className="quote-dish__details-label">
            {t('quote.selection.viewDetails')} <span aria-hidden="true">↗</span>
          </span>
        </>
      }
    >
      {quantity > 0 && category.id === 'principales' && (
        <MainSaucePicker main={item} current={currentSauce} onSauceChange={onSauceChange} />
      )}
      {single ? (
        <button
          type="button"
          className="quote-dish__toggle"
          aria-label={
            t(quantity ? 'quote.selection.remove' : 'quote.selection.select') + ' ' + t(item.name)
          }
          disabled={!quantity && atLimit}
          onClick={() => onQuantityChange(item.id, quantity ? 0 : 1)}
        >
          <span aria-hidden="true">{quantity ? '−' : '+'}</span>
          {t(quantity ? 'quote.selection.remove' : 'quote.selection.select')}
        </button>
      ) : (
        <div className="quote-dish__units">
          <span>{t('quote.selection.units')}</span>
          <QuantityControl
            name={t(item.name)}
            quantity={quantity}
            onChange={(next) => onQuantityChange(item.id, next)}
          />
        </div>
      )}
    </SelectionCard>
  )
})
