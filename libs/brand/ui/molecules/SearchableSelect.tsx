import type { ReactNode, Ref } from 'react'
import {
  Autocomplete,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SearchField,
  Select,
  SelectValue,
  useFilter,
  type SelectProps,
} from 'react-aria-components'
import { SelectTrigger } from '../atoms/SelectTrigger'
import '../../styles/select-menu.css'

type Option = { id: string; label: string }

type Props = Omit<SelectProps<Option>, 'children' | 'onChange'> & {
  label: ReactNode
  labelClassName?: string
  listLabel: string
  options: readonly Option[]
  onChange: (value: string) => void
  search: { label: string; placeholder?: string; empty?: string; isDisabled?: boolean }
  triggerClassName?: string
  triggerRef?: Ref<HTMLButtonElement>
  children?: ReactNode
}

export function SearchableSelect({
  label,
  labelClassName,
  listLabel,
  options,
  onChange,
  search,
  triggerClassName,
  triggerRef,
  children,
  placeholder,
  ...props
}: Props) {
  const { contains } = useFilter({ sensitivity: 'base' })
  const searchField = (
    <SearchField
      aria-label={search.label}
      className="brand-select-menu__search"
      autoFocus={!search.isDisabled}
      isDisabled={search.isDisabled}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </svg>
      <Input placeholder={search.placeholder} spellCheck={false} autoComplete="off" />
    </SearchField>
  )
  const menu = (
    <ListBox
      aria-label={listLabel}
      renderEmptyState={() => <span className="brand-select-menu__empty">{search.empty}</span>}
    >
      {options.map(({ id, label }) => (
        <ListBoxItem key={id} id={id} textValue={label}>
          {({ isSelected }) => (
            <>
              {label}
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
  )

  return (
    <Select<Option>
      {...props}
      onChange={(key) => onChange(key == null ? '' : String(key))}
      placeholder={placeholder}
    >
      <Label className={labelClassName}>{label}</Label>
      <SelectTrigger ref={triggerRef} className={triggerClassName}>
        <SelectValue>
          {({ selectedText, isPlaceholder }) => (isPlaceholder ? placeholder : selectedText)}
        </SelectValue>
      </SelectTrigger>
      <Popover
        className="brand-select-menu"
        placement="bottom start"
        offset={8}
        containerPadding={12}
      >
        {search.isDisabled ? (
          <>
            {searchField}
            {menu}
          </>
        ) : (
          <Autocomplete filter={contains}>
            {searchField}
            {menu}
          </Autocomplete>
        )}
      </Popover>
      {children}
    </Select>
  )
}
