import { SelectionCard, SelectionCardPhoto, SelectionCategory } from '../../../features/select-menu'
import { DietaryModel } from './DietaryModel'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { useState } from 'react'
import { QuantityControl } from '../../../shared/ui/QuantityControl'
import {
  dietaryGroups,
  dietaryOptions,
  guestRange,
  type DietaryOption,
  type QuoteRequest,
} from '../../../entities/quote'
import { useI18n } from '../../../shared/i18n'

const groupIcons = {
  allergies: 'M32 9 59 54H5ZM30 23h4l-1 14h-2ZM32 41a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5Z',
  exclusions: `M13 51 49 15M21 42C10 42 8 33 9 25c9 1 14 7 12 17Z
     m10-12c-9-3-12-11-9-18 8 4 11 11 9 18Zm3-2c-1-11 5-17 14-19 0 9-5 16-14 19Z
     M22 42c5-10 14-12 24-9-6 9-15 12-24 9ZM7 8l49 49`,
  menus: 'M8 46h48M12 40a20 20 0 0 1 40 0ZM30 19c-5-11 1-15 13-16-2 8-6 13-13 16ZM18 52h28',
} as const

function DietaryGroupIcon({ group }: { group: keyof typeof groupIcons }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={groupIcons[group]} fillRule="evenodd" />
    </svg>
  )
}

export function QuoteDietaryStep({ form }: { form: UseFormReturn<QuoteRequest> }) {
  const { t } = useI18n()
  const counts = useWatch({ control: form.control, name: 'dietaryCounts' }) ?? {}
  const guests = useWatch({ control: form.control, name: 'guests' }) ?? guestRange.max
  const [category, setCategory] = useState<(typeof dietaryGroups)[number]>(dietaryGroups[0])
  const invalid = dietaryOptions.filter(
    (id) => counts[id] !== undefined && (counts[id]! < 1 || counts[id]! > guests),
  )

  function changeCount(id: DietaryOption, count: number) {
    const next = { ...form.getValues('dietaryCounts') }
    if (count === 0) delete next[id]
    else next[id] = count
    form.setValue('dietaryCounts', next, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <div className="quote-event-preferences">
      <fieldset
        className="allergen-picker"
        aria-label={t('quote.form.allergensTitle')}
        disabled={form.formState.isSubmitting}
      >
        <p className="quote-preferences-note">{t('quote.form.preferencesOptional')}</p>
        <div className="quote-menu">
          <div className="quote-menu__index">
            <div
              className="quote-menu__services"
              role="group"
              aria-label={t('quote.form.allergensTitle')}
            >
              {dietaryGroups.map((group) => {
                const chosen = group.options.filter((id) => (counts[id] ?? 0) > 0).length
                const label = t(`quote.dietary.group.${group.id}`)
                return (
                  <SelectionCategory
                    key={group.id}
                    label={label}
                    active={group.id === category.id}
                    count={chosen}
                    icon={<DietaryGroupIcon group={group.id} />}
                    onSelect={() => setCategory(group)}
                  />
                )
              })}
            </div>
          </div>
          <div className="quote-menu__items">
            {invalid.length > 0 && (
              <p className="quote-error" role="alert">
                {t('quote.validation.dietaryCount', { max: guests })}{' '}
                {invalid.map((id) => t(`quote.allergen.${id}`)).join(', ')}
              </p>
            )}
            <div className="quote-menu__grid">
              {category.options.map((id) => {
                const count = counts[id]
                const checked = (count ?? 0) > 0
                const label = t(`quote.allergen.${id}`)
                return (
                  <SelectionCard
                    key={id}
                    aria-label={label}
                    data-category={category.id}
                    selected={checked}
                    caption={label}
                    badge={
                      <span className="quote-dish__tag">
                        <DietaryGroupIcon group={category.id} />
                        <span>{t(`quote.dietary.group.${category.id}`)}</span>
                      </span>
                    }
                    photo={
                      <SelectionCardPhoto>
                        {(onSettled) => <DietaryModel id={id} onSettled={onSettled} />}
                      </SelectionCardPhoto>
                    }
                    watermark={
                      <span className="quote-dish__motif" aria-hidden="true">
                        <DietaryGroupIcon group={category.id} />
                      </span>
                    }
                  >
                    <div className="quote-dish__units">
                      <span>{t('quote.dietary.people')}</span>
                      <QuantityControl
                        name={label}
                        labels={{
                          quantity: t('quote.dietary.quantity', { name: label }),
                          add: t('quote.dietary.add', { name: label }),
                          subtract: t('quote.dietary.subtract', { name: label }),
                        }}
                        quantity={count ?? 0}
                        max={guests}
                        onChange={(n) => changeCount(id, n)}
                      />
                    </div>
                  </SelectionCard>
                )
              })}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )
}
