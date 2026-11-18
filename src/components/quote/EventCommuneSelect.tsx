import { useId, useState, type Ref } from 'react'
import { Button, ComboBox, Group, Input, Label, ListBox, ListBoxItem, Popover } from 'react-aria-components'
import { biobioCommunes } from '../../config/biobio'

type Props = { value: string; onChange: (value: string) => void; onBlur: () => void; inputRef: Ref<HTMLInputElement>; error?: string }

export function EventCommuneSelect({ value, onChange, onBlur, inputRef, error }: Props) {
  const errorId = useId()
  const [query, setQuery] = useState(value)
  return <ComboBox className="quote-field" isRequired isInvalid={!!error} selectedKey={value || null} inputValue={query}
    onInputChange={text => {
      setQuery(text)
      if (value && text !== value) onChange('')
    }}
    onSelectionChange={key => {
      const name = key === null ? '' : String(key)
      setQuery(name)
      onChange(name)
    }} onBlur={onBlur}
    menuTrigger="focus" allowsEmptyCollection validationBehavior="aria">
    <Label>Comuna del Biobío</Label>
    <Group className="quote-commune-search">
      <Input ref={inputRef} placeholder="Buscar comuna…" autoComplete="off" spellCheck={false} aria-describedby={error ? errorId : undefined} />
      <Button aria-label="Mostrar comunas"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg></Button>
    </Group>
    <Popover className="quote-communes" placement="bottom start" offset={6}>
      <ListBox renderEmptyState={() => <span className="quote-communes__empty">Sin coincidencias</span>}>
        {biobioCommunes.map(name => <ListBoxItem key={name} id={name} textValue={name}>{name}</ListBoxItem>)}
      </ListBox>
    </Popover>
    <small className="quote-error" id={errorId} role={error ? 'alert' : undefined}>{error}</small>
  </ComboBox>
}
