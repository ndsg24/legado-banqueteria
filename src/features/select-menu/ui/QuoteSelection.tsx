import { ActionButton } from '../../../shared/ui/ActionButton'
import { DialogTrigger } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { type Quantities } from '../../../entities/menu'
import { menuGroups } from '../../../entities/quote'
import { CategoryMotif } from '../../../entities/menu/ui'
import { MenuDrawer } from './MenuDrawer'
import type { SaucePickerProps } from './MainSaucePicker'

type Props = SaucePickerProps & {
  isDisabled: boolean
  omissions: Record<string, string[]>
  selected: Quantities
  onQuantityChange: (id: string, quantity: number) => void
}

export function QuoteSelection({
  selected,
  omissions,
  onQuantityChange,
  isDisabled,
  ...saucePicker
}: Props) {
  const { t } = useI18n()

  const count = Object.keys(selected).length
  return (
    <DialogTrigger>
      <ActionButton className="quote-menu__review" isDisabled={isDisabled}>
        <CategoryMotif categoryId="salados" />
        {t('quote.selection.title')}
        <span className="quote-menu__review-count">{count}</span>
      </ActionButton>
      <MenuDrawer
        title={t('quote.selection.title')}
        closeLabel={t('quote.selection.close')}
        getMenu={() =>
          menuGroups(
            { items: selected, sauces: saucePicker.sauces, omittedIngredients: omissions },
            t,
          )
        }
        edit={{ selected, onQuantityChange, onSauceChange: saucePicker.onSauceChange }}
      />
    </DialogTrigger>
  )
}
