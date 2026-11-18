import { useId, type Ref } from 'react'
import { Autocomplete, Button, Input, Label, ListBox, ListBoxItem, Popover, SearchField, Select, SelectValue, useFilter } from 'react-aria-components'
import { biobioCommunes } from '../../config/biobio'

type Props = { value: string; onChange: (value: string) => void; onBlur: () => void; triggerRef: Ref<HTMLButtonElement>; error?: string }

export function EventCommuneSelect({ value, onChange, onBlur, triggerRef, error }: Props) {
  const errorId = useId()
  const { contains } = useFilter({ sensitivity: 'base' })

  return <Select className="quote-field" value={value || null} onChange={key => {
    onChange(key == null ? '' : String(key))
    onBlur()
  }}
    onBlur={onBlur} isRequired isInvalid={!!error} validationBehavior="aria" placeholder="Elegir comuna"
    aria-describedby={error ? errorId : undefined}>
    <Label>Comuna del Biobío</Label>
    <Button ref={triggerRef} className="quote-commune-trigger">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.4" /></svg>
      <SelectValue>{({ selectedText, isPlaceholder }) => isPlaceholder ? 'Elegir comuna' : selectedText}</SelectValue>
      <svg className="quote-commune-chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
    </Button>
    <Popover className="quote-communes" placement="bottom start" offset={8} containerPadding={12}>
      <Autocomplete filter={contains}>
        <SearchField aria-label="Buscar comuna" className="quote-communes__search" autoFocus>
          <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg>
          <Input placeholder="Buscar comuna…" spellCheck={false} autoComplete="off" />
        </SearchField>
        <ListBox aria-label="Comunas del Biobío" renderEmptyState={() => <span className="quote-communes__empty">No se encontraron comunas.</span>}>
          {biobioCommunes.map(name => <ListBoxItem key={name} id={name} textValue={name}>
            {({ isSelected }) => <>{name}{isSelected && <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>}</>}
          </ListBoxItem>)}
        </ListBox>
      </Autocomplete>
    </Popover>
    <small className="quote-error" id={errorId} role={error ? 'alert' : undefined}>{error}</small>
  </Select>
}
