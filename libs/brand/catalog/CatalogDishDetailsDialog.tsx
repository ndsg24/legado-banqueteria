import { contactEmail } from '@legado/domain/site/contact'
import { useI18n } from '../i18n'
import { EditorialArrow } from '../ui/atoms/EditorialArrow'
import { DishDetailsDialog, type DishDetailsDialogProps } from './DishDetailsDialog'

export function CatalogDishDetailsDialog(props: Omit<DishDetailsDialogProps, 'children'>) {
  const { t } = useI18n()
  const { item } = props
  const subject = t('quote.selection.ingredients') + ' · ' + t(item.name)
  return (
    <DishDetailsDialog {...props}>
      {!item.ingredients?.length && (
        <div className="ingredients-dialog__ingredients">
          <a
            className="button--secondary"
            href={`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`}
          >
            {t('catalog.explorer.askIngredients')} <EditorialArrow direction="up-right" />
          </a>
        </div>
      )}
    </DishDetailsDialog>
  )
}
