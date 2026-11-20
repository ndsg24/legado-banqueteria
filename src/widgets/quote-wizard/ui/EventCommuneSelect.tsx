import { QuoteDetailIcon } from './QuoteDetailIcon'
import { validationMessage } from '../model/validationMessage'
import { useI18n } from '../../../shared/i18n'
import { useId, type Ref } from 'react'
import {
  Autocomplete,
  Button,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SearchField,
  Select,
  SelectValue,
  useFilter,
} from 'react-aria-components'
import { biobioCommunes } from '../../../shared/config/biobio'

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
  const { contains } = useFilter({ sensitivity: 'base' })

  return (
    <Select
      className="quote-field"
      value={value || null}
      onChange={(key) => {
        onChange(key == null ? '' : String(key))
        onBlur()
      }}
      onBlur={onBlur}
      isRequired
      isInvalid={!!error}
      validationBehavior="aria"
      placeholder={t('quote.commune.choose')}
      aria-describedby={error ? errorId : undefined}
    >
      <Label className="quote-event-detail-label">
        <QuoteDetailIcon kind="location" />
        {t('quote.commune.label')}
      </Label>
      <Button ref={triggerRef} className="quote-commune-trigger">
        <SelectValue>
          {({ selectedText, isPlaceholder }) =>
            isPlaceholder ? t('quote.commune.choose') : selectedText
          }
        </SelectValue>
        <svg className="quote-commune-chevron" aria-hidden="true" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Button>
      <Popover className="quote-communes" placement="bottom start" offset={8} containerPadding={12}>
        <Autocomplete filter={contains}>
          <SearchField
            aria-label={t('quote.commune.search')}
            className="quote-communes__search"
            autoFocus
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="10" cy="10" r="6" />
              <path d="m15 15 5 5" />
            </svg>
            <Input
              placeholder={t('quote.commune.placeholder')}
              spellCheck={false}
              autoComplete="off"
            />
          </SearchField>
          <ListBox
            aria-label={t('quote.commune.list')}
            renderEmptyState={() => (
              <span className="quote-communes__empty">{t('quote.commune.empty')}</span>
            )}
          >
            {biobioCommunes.map((name) => (
              <ListBoxItem key={name} id={name} textValue={name}>
                {({ isSelected }) => (
                  <>
                    {name}
                    {isSelected && (
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    )}
                  </>
                )}
              </ListBoxItem>
            ))}
          </ListBox>
        </Autocomplete>
      </Popover>
      <small className="quote-error" id={errorId} role={error ? 'alert' : undefined}>
        {validationMessage(error, t)}
      </small>
    </Select>
  )
}
