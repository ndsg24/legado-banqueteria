import { useMemo, useRef, useState } from 'react'
import { Form, Link, useSearchParams } from 'react-router'
import { ActionButton, TextField, NativeSelect } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { catalogCategories } from '@legado/domain/menu/catalog'
import { messages } from '../../../shared/config/messages'
import { downloadCsv } from '../../../shared/lib'
import { PageHeading } from '../../../shared/ui/PageHeading'
import { Pagination } from '../../../shared/ui/Pagination'
import { reviewCopy } from '../model/copy'
import { reviewCatalog, matchesFilter, publicCategoryUrl, searchText } from '../model/review'
import type { ReviewFilter } from '../model/review'
import { ReviewTable } from './ReviewTable'
import { CatalogPreview } from './CatalogPreview'
import './review.css'

export function CatalogReview() {
  const { language, t } = useI18n()
  const copy = reviewCopy[language]
  const common = messages[language]
  const rows = useMemo(() => reviewCatalog(t), [t])
  const [params] = useSearchParams()
  const [previewId, setPreviewId] = useState<string>()
  const previewHeading = useRef<HTMLHeadingElement>(null)
  const category = params.get('category') ?? ''
  const q = params.get('q') ?? ''
  const term = searchText(q)
  const options = {
    all: copy.all,
    pending: copy.pending,
    complete: copy.complete,
    photo: copy.missingPhoto,
    description: copy.missingDescription,
    ingredients: copy.missingIngredients,
  }
  const raw = params.get('review') ?? 'all'
  const filter: ReviewFilter = Object.hasOwn(options, raw) ? (raw as ReviewFilter) : 'all'
  const scope = rows.filter(
    (row) =>
      (!category || row.category === category) &&
      searchText([row.id, row.name, row.group, ...row.ingredients].join(' ')).includes(term),
  )
  const pending = scope.filter((row) => row.missing.length).length
  const totals = { all: scope.length, pending, complete: scope.length - pending }
  const filtered = scope.filter((row) => matchesFilter(row, filter))
  const selected = filtered.find((row) => row.id === previewId) ?? filtered[0]
  const exportRows = filtered.filter((row) => row.missing.length)
  const pageSize = [5, 10, 25].find((size) => String(size) === params.get('pageSize')) ?? 10
  const page = Math.max(
    1,
    Math.min(Math.floor(Number(params.get('page'))) || 1, Math.ceil(filtered.length / pageSize)),
  )
  function view(target: ReviewFilter) {
    const query = new URLSearchParams(params)
    query.delete('page')
    query.set('review', target)
    return '?' + query
  }
  function exportMissing() {
    downloadCsv('legado-carta-' + language + '.csv', [
      ['ID', copy.dish, copy.category, copy.missing, copy.menu],
      ...exportRows.map((row) => [
        row.id,
        row.name,
        row.group,
        row.missing.map((key) => copy[key]).join(', '),
        publicCategoryUrl(row.category),
      ]),
    ])
  }
  return (
    <section className="catalog-audit" aria-labelledby="catalog-review-title">
      <PageHeading id="catalog-review-title" title={common.content} titleInNavigation>
        <p>{copy.intro}</p>
      </PageHeading>
      <nav className="audit-counts" aria-label={copy.filter}>
        {(['all', 'pending', 'complete'] as const).map((key) => (
          <Link
            key={key}
            to={view(key)}
            data-kind={key}
            aria-current={filter === key ? 'page' : undefined}
          >
            <strong>{totals[key]}</strong>
            <span>{options[key]}</span>
          </Link>
        ))}
      </nav>
      {selected && (
        <CatalogPreview
          headingRef={previewHeading}
          selected={selected}
          singleCategory={Boolean(category)}
          rows={filtered}
          onSelect={setPreviewId}
        />
      )}
      <div className="audit-sheet admin-surface">
        <Form className="audit-search" key={JSON.stringify([q, category, filter])}>
          <TextField label={copy.search} type="search" name="q" defaultValue={q} />
          <label>
            {copy.category}
            <NativeSelect name="category" aria-label={copy.category} defaultValue={category}>
              <option value="">{copy.categories}</option>
              {catalogCategories.map((group) => (
                <option key={group.id} value={group.id}>
                  {t(group.label)}
                </option>
              ))}
            </NativeSelect>
          </label>
          <label>
            {copy.filter}
            <NativeSelect name="review" aria-label={copy.filter} defaultValue={filter}>
              {Object.entries(options).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </label>
          <input type="hidden" name="pageSize" value={pageSize} />
          <ActionButton type="submit" variant="secondary">
            {common.apply}
          </ActionButton>
        </Form>
        <div className="audit-tools">
          <h2>{copy.entries}</h2>
          <ActionButton variant="secondary" onPress={exportMissing} isDisabled={!exportRows.length}>
            {copy.export}
          </ActionButton>
        </div>
        {filtered.length ? (
          <ReviewTable
            rows={filtered.slice((page - 1) * pageSize, page * pageSize)}
            onPreview={(id) => {
              setPreviewId(id)
              previewHeading.current?.focus({ preventScroll: true })
              previewHeading.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
            }}
          />
        ) : (
          <div className="audit-empty" role="status">
            <p>{copy.empty}</p>
            <Link to="/content">{common.clear}</Link>
          </div>
        )}
        <Pagination page={page} pageSize={pageSize} total={filtered.length} allowResize />
      </div>
    </section>
  )
}
