import { SelectTrigger } from '@legado/brand/controls'
import { ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import type { CatalogCategory } from '../../../entities/menu'
import { CategoryMotif } from '../../../entities/menu/ui'

type Props = {
  compact: boolean
  categories: readonly CatalogCategory[]
  activeId?: string
  onSelect: (id: string | null) => void
}

export function CatalogCategoryPicker({ compact, categories, activeId, onSelect }: Props) {
  const { t } = useI18n()
  const label = t('catalog.explorer.categories')
  const options = [
    { id: 'all', label: t('catalog.explorer.all') },
    ...categories.map(({ id, label }) => ({ id, label: t(label) })),
  ]
  const selectedId = activeId ?? 'all'
  const choose = (id: string) => onSelect(id === 'all' ? null : id)
  if (compact) {
    return (
      <Select
        aria-label={label}
        value={selectedId}
        onChange={(id) => id != null && choose(String(id))}
      >
        <SelectTrigger className="catalog-filter-trigger">
          {activeId && <CategoryMotif categoryId={activeId} />}
          <SelectValue>{({ selectedText }) => selectedText}</SelectValue>
        </SelectTrigger>
        <Popover className="catalog-filter-menu" placement="bottom start" offset={5}>
          <ListBox aria-label={label} items={options}>
            {(option) => (
              <ListBoxItem id={option.id} textValue={option.label}>
                {option.id !== 'all' && <CategoryMotif categoryId={option.id} />}
                <span>{option.label}</span>
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </Select>
    )
  }
  return (
    <div className="catalog-filters" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === selectedId}
          aria-controls="catalog-dishes"
          onClick={() => choose(option.id)}
        >
          {option.id !== 'all' && <CategoryMotif categoryId={option.id} />}
          {option.label}
        </button>
      ))}
    </div>
  )
}
