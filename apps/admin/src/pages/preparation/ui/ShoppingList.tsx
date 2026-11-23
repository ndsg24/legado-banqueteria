import { PreparationProduct } from './PreparationProduct'
import { PurchasePackOptions } from './PurchasePackOptions'
import { ingredientAtlasPosition, ingredientPhoto } from '../../../shared/config/ingredient-photo'
import { Fragment, useId, useState } from 'react'
import { downloadCsv, supplyQuantityFormatter } from '../../../shared/lib'
import { dispatchLabels } from '../model/labels'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton } from '@legado/brand/controls'
import type { preparationPlan } from '@legado/domain/operations/preparation'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { purchaseLines } from '../../../entities/preparation'

type Props = {
  number: string
  completeRecipes: boolean
  resources: ReturnType<typeof preparationPlan>['resources']
  packs: Record<string, string>
  loaded: Record<string, string>
  onCheck: (id: string, token: string | null) => void
  onPack: (id: string, value: string) => void
  onReset: () => void
}

export function ShoppingList({
  number,
  completeRecipes,
  resources,
  packs,
  loaded,
  onCheck,
  onPack,
  onReset,
}: Props) {
  const { language, locale, t } = useI18n()
  const c = operations[language]
  const copy = messages[language]
  const labels = dispatchLabels[language]
  const [pendingOnly, setPendingOnly] = useState(false)
  const [openOptions, setOpenOptions] = useState<string | null>(null)
  const optionsId = useId()
  const formatQuantity = supplyQuantityFormatter(locale, c.unit)
  const rows = purchaseLines(resources, packs).map((row) => ({
    ...row,
    resource: row.name,
    name: t(row.name),
    photo: ingredientPhoto(row.name),
    atlasPosition: ingredientAtlasPosition(row.name),
    checked: loaded[row.id] === row.token,
    baseUnit: row.unit,
    unit: row.unit === 'unit' ? c.unit : row.unit,
    display: formatQuantity(row.amount, row.unit),
  }))
  const done = rows.filter((row) => row.checked).length
  const visible = pendingOnly ? rows.filter((row) => !row.checked) : rows
  function download() {
    const csv = [
      [c.supplies, c.quantity, c.measure, c.size, c.packs, labels.dispatch],
      ...visible.map((r) => [
        r.name,
        r.amount,
        r.baseUnit,
        r.packCount === null ? '' : Number(packs[r.id]),
        r.packCount ?? '',
        r.checked ? labels.loaded : labels.pending,
      ]),
    ]
    downloadCsv('legado-' + number + '.csv', csv)
  }
  return (
    <section className="admin-surface op-panel shopping-list">
      <header>
        <h2>{c.buy}</h2>
        <div className="shopping-actions">
          {(Object.values(packs).some(Boolean) || Object.keys(loaded).length > 0) && (
            <ActionButton variant="secondary" onPress={onReset}>
              {c.resetDispatch}
            </ActionButton>
          )}
          {rows.length > 0 && (
            <ActionButton variant="secondary" onPress={download} isDisabled={!visible.length}>
              {copy.exportShopping}
            </ActionButton>
          )}
        </div>
      </header>
      <p>{c.yieldHint}</p>
      {rows.length > 0 && (
        <section className="dispatch-progress" aria-label={labels.dispatch}>
          <div>
            <h3>{done === rows.length && completeRecipes ? labels.ready : labels.dispatch}</h3>
            <span>{labels.tab}</span>
          </div>
          <div className="dispatch-meter">
            <strong aria-hidden="true">
              {done.toLocaleString(locale)} <span>/ {rows.length.toLocaleString(locale)}</span>
            </strong>
            <progress value={done} max={rows.length} aria-label={labels.units} />
          </div>
          <div className="dispatch-view" role="group" aria-label={labels.dispatch}>
            <button type="button" aria-pressed={!pendingOnly} onClick={() => setPendingOnly(false)}>
              {labels.all}
            </button>
            <button type="button" aria-pressed={pendingOnly} onClick={() => setPendingOnly(true)}>
              {labels.pending} · {rows.length - done}
            </button>
          </div>
        </section>
      )}
      {visible.length ? (
        <div className="op-table-wrap">
          <table role="table" aria-label={c.supplies}>
            <thead role="rowgroup">
              <tr role="row">
                {[c.supplies, c.quantity, c.size, c.packs, c.packChoices].map((col) => (
                  <th scope="col" role="columnheader" key={col}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {visible.map((r) => {
                const expanded = openOptions === r.id
                const caption = expanded ? c.closePackOptions : c.packOptions
                return (
                  <Fragment key={r.id}>
                    <tr role="row" data-loaded={r.checked}>
                      <th scope="row" role="rowheader">
                        <label className="dispatch-check">
                          <input
                            type="checkbox"
                            checked={r.checked}
                            aria-label={labels.checklist + ' · ' + r.name}
                            onChange={(e) => onCheck(r.id, e.target.checked ? r.token : null)}
                          />
                          <PreparationProduct
                            name={r.name}
                            photo={r.photo}
                            atlasPosition={r.atlasPosition}
                          />
                        </label>
                      </th>
                      <td role="cell">
                        <span className="supply-cell-label" aria-hidden="true">
                          {c.quantity}
                        </span>
                        {r.display}
                      </td>
                      <td role="cell">
                        <span className="supply-cell-label" aria-hidden="true">
                          {c.size}
                        </span>
                        <label className="op-pack">
                          <input
                            type="number"
                            min="0.001"
                            step="any"
                            aria-label={c.size + ' · ' + r.name + ' (' + r.unit + ')'}
                            value={packs[r.id] ?? ''}
                            placeholder="—"
                            onChange={(e) => onPack(r.id, e.target.value)}
                          />
                          {r.unit}
                        </label>
                      </td>
                      <td role="cell">
                        <span className="supply-cell-label" aria-hidden="true">
                          {c.packs}
                        </span>
                        {r.packCount ?? '—'}
                      </td>
                      <td role="cell" className="purchase-options-cell">
                        <ActionButton
                          variant="secondary"
                          aria-label={caption + ' · ' + r.name}
                          aria-expanded={expanded}
                          aria-controls={expanded ? optionsId : undefined}
                          onPress={() => setOpenOptions(expanded ? null : r.id)}
                        >
                          {caption}
                        </ActionButton>
                      </td>
                    </tr>
                    {expanded && (
                      <tr role="row" className="purchase-options-row">
                        <td role="cell" colSpan={5} id={optionsId}>
                          <PurchasePackOptions
                            key={r.amount}
                            resource={r.resource}
                            amount={r.amount}
                            unit={r.baseUnit}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p role="status">{rows.length ? labels.empty : c.noYields}</p>
      )}
    </section>
  )
}
