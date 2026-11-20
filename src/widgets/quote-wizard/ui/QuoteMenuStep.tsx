import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { QuoteMenu, QuoteSelection } from '../../../features/select-menu'
import type { QuoteRequest } from '../../../entities/quote'
import { useI18n } from '../../../shared/i18n'
import {
  saveQuantities,
  withQuantity,
  writeSelectionParams,
  writeSauceChoices,
  writeOmissions,
  type SauceChoices,
} from '../../../entities/menu'

export default function QuoteMenuStep({ form }: { form: UseFormReturn<QuoteRequest> }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const {
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = form
  const [selected, sauces, omissions] = useWatch({
    control,
    name: ['items', 'sauces', 'omittedIngredients'],
  })
  const updateMenuLink = useCallback(
    (items: QuoteRequest['items'], choices: SauceChoices) => {
      const url = new URL(location.href)
      const omitted = getValues('omittedIngredients') ?? {}
      if (
        url.searchParams.has('plato') ||
        Object.keys(choices).length ||
        Object.keys(omitted).length
      ) {
        writeOmissions(url.searchParams, omitted)
        writeSelectionParams(url.searchParams, items)
        writeSauceChoices(url.searchParams, choices)
        void navigate(
          { search: url.search, hash: url.hash },
          { replace: true, preventScrollReset: true },
        )
      }
    },
    [getValues, navigate],
  )

  const setQuantity = useCallback(
    (id: string, quantity: number, sauceId?: string) => {
      const next = withQuantity(getValues('items'), id, quantity)
      const exclusions = { ...getValues('omittedIngredients') }
      if (!next[id] && exclusions[id]) {
        delete exclusions[id]
        setValue('omittedIngredients', exclusions, { shouldDirty: true })
      }
      const choices = { ...getValues('sauces') }
      const nextSauce = next[id] ? (sauceId ?? choices[id]) : undefined
      if (nextSauce !== choices[id]) {
        if (nextSauce) choices[id] = nextSauce
        else delete choices[id]
        setValue('sauces', choices, { shouldDirty: true })
      }
      setValue('items', next, { shouldDirty: true })
      saveQuantities(next)
      updateMenuLink(next, choices)
    },
    [getValues, setValue, updateMenuLink],
  )

  const setSauce = useCallback(
    (main: string, sauce: string) => {
      const choices = { ...getValues('sauces') }
      if (sauce) choices[main] = sauce
      else delete choices[main]
      setValue('sauces', choices, { shouldDirty: true })
      updateMenuLink(getValues('items'), choices)
    },
    [getValues, setValue, updateMenuLink],
  )

  return (
    <>
      <QuoteSelection
        selected={selected}
        omissions={omissions ?? {}}
        onQuantityChange={setQuantity}
        sauces={sauces ?? {}}
        onSauceChange={setSauce}
        isDisabled={isSubmitting}
      />
      <fieldset disabled={isSubmitting} id="quote-menu" aria-label={t('quote.review.dishes')}>
        <QuoteMenu
          selected={selected}
          onQuantityChange={setQuantity}
          sauces={sauces ?? {}}
          onSauceChange={setSauce}
        />
      </fieldset>
    </>
  )
}
