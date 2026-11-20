import { useController, type UseFormReturn } from 'react-hook-form'
import { localMobileDigits, mobilePrefix, type QuoteRequest } from '../../../entities/quote'
import { useI18n } from '../../../shared/i18n'
import { QuoteField } from './QuoteField'

export function QuoteContactStep({ form }: { form: UseFormReturn<QuoteRequest> }) {
  const { t } = useI18n()
  const {
    register,
    formState: { errors, isSubmitting },
  } = form
  const { field: phone } = useController({ control: form.control, name: 'phone' })
  function updatePhone(digits: string) {
    phone.onChange(digits ? mobilePrefix + digits : '')
    if (errors.phone) void form.trigger('phone')
  }
  return (
    <fieldset
      className="quote-contact"
      aria-label={t('quote.form.contact')}
      disabled={isSubmitting}
    >
      <div className="quote-event-details">
        <QuoteField
          icon="name"
          label={t('quote.review.name')}
          error={errors.name?.message}
          autoComplete="name"
          placeholder={t('quote.form.namePlaceholder')}
          maxLength={100}
          required
          {...register('name')}
        />
        <QuoteField
          icon="email"
          label={t('quote.review.email')}
          error={errors.email?.message}
          type="email"
          autoComplete="email"
          placeholder={t('quote.form.emailPlaceholder')}
          required
          {...register('email')}
        />
        <QuoteField
          icon="phone"
          label={t('quote.form.phoneOptional')}
          error={errors.phone?.message}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          fixedPrefix={mobilePrefix}
          maxLength={8}
          placeholder={t('quote.form.phonePlaceholder')}
          {...phone}
          value={phone.value.slice(mobilePrefix.length)}
          onChange={(event) => {
            const value = event.currentTarget.value
            updatePhone(localMobileDigits(value) ?? value.replace(/\D/g, '').slice(0, 8))
          }}
          onPaste={(event) => {
            event.preventDefault()
            const input = event.currentTarget
            const text = event.clipboardData.getData('text')
            const digits = localMobileDigits(text)
            if (!digits) return
            if (text.replace(/[^0-9]/g, '').length > 8) {
              updatePhone(digits)
              return
            }
            const start = input.selectionStart ?? input.value.length
            const end = input.selectionEnd ?? start
            const available = 8 - input.value.length + end - start
            input.setRangeText(digits.slice(0, available), start, end, 'end')
            updatePhone(input.value)
          }}
        />
      </div>
    </fieldset>
  )
}
