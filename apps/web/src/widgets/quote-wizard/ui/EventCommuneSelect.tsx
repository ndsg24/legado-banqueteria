import { DetailIcon, SearchableSelect } from '@legado/brand/controls'
import { validationMessage } from '../model/validationMessage'
import { useI18n } from '../../../shared/i18n'
import { useId, type Ref } from 'react'
import { biobioCommunes } from '@legado/domain/quote/biobio'

const communeOptions = biobioCommunes.map((name) => ({ id: name, label: name }))

type Props = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  triggerRef: Ref<HTMLButtonElement>
  error?: string
}

export function EventCommuneSelect({ value, onChange, onBlur, triggerRef, error }: Props) {
  const { t } = useI18n()

  const errorId = useId()
  return (
    <SearchableSelect
      className="quote-field"
      value={value || null}
      onChange={(next) => {
        onChange(next)
        onBlur()
      }}
      onBlur={onBlur}
      isRequired
      isInvalid={!!error}
      validationBehavior="aria"
      placeholder={t('quote.commune.choose')}
      aria-describedby={error ? errorId : undefined}
      label={
        <>
          <DetailIcon kind="location" />
          {t('quote.commune.label')}
        </>
      }
      labelClassName="quote-event-detail-label"
      listLabel={t('quote.commune.list')}
      options={communeOptions}
      search={{
        label: t('quote.commune.search'),
        placeholder: t('quote.commune.placeholder'),
        empty: t('quote.commune.empty'),
      }}
      triggerRef={triggerRef}
      triggerClassName="quote-commune-trigger"
    >
      <small className="quote-error" id={errorId} role={error ? 'alert' : undefined}>
        {validationMessage(error, t)}
      </small>
    </SearchableSelect>
  )
}
