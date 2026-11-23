import { useI18n } from '@legado/brand/i18n'
import { SeatingPlan, SettingSample, type SettingPart } from '@legado/brand/table'
import { readQuotedTable, tableEquipment } from '@legado/domain/operations/table-equipment'
import { settingEntries } from '@legado/domain/quote/review'
import { fabricColor, layoutDetails } from '@legado/domain/table/options'
import type { TableDesign } from '@legado/domain/table/types'
import type { ReactNode } from 'react'
import { settingPhoto } from '../../../shared/config/setting-photo'
import { QuotedTablePreview } from './QuotedTablePreview'
import './quote-table.css'

type EquipmentRow = {
  key: string
  label: string
  detail?: string
  count?: number
  sample?: ReactNode
}

function EquipmentGroup({ title, rows }: { title: string; rows: EquipmentRow[] }) {
  return (
    <section className="equipment-group">
      <h4>{title}</h4>
      <ul>
        {rows.map(({ key, label, detail, count, sample }) => (
          <li key={key}>
            {sample && (
              <span className="equipment-sample" aria-hidden="true">
                {sample}
              </span>
            )}
            <span className="equipment-name">
              <strong>{label}</strong>
              {detail && <small>{detail}</small>}
            </span>
            {count !== undefined && <b className="equipment-count">× {count}</b>}
          </li>
        ))}
      </ul>
    </section>
  )
}

const tableParts = new Set<SettingPart>([
  'floral',
  'flowerKind',
  'flowerColor',
  'bottleOutfit',
  'tablecloth',
  'overlay',
])

function QuotedSetup({
  design,
  guests,
  showPreview,
}: {
  design: TableDesign
  guests?: number
  showPreview?: boolean
}) {
  const { t } = useI18n()
  const quantities = tableEquipment(design)
  const tableRows: EquipmentRow[] = []
  const seatRows: EquipmentRow[] = [
    { key: 'chair', label: t('table.equipment.chairs'), count: quantities.chair },
    { key: 'glass', label: t('table.equipment.glasses'), count: quantities.glass },
    {
      key: 'cutlery',
      label: t('table.equipment.cutlery'),
      detail: t('table.equipment.cutleryContents'),
      count: quantities.cutlery,
    },
  ]
  for (const { key, label, value } of settingEntries(design, t)) {
    const rows = tableParts.has(key) ? tableRows : seatRows
    const count = key in quantities ? quantities[key as keyof typeof quantities] : undefined
    rows.push({
      key,
      label,
      detail: value,
      count: key === 'bottleOutfit' || count === 0 ? undefined : count,
      sample: <SettingSample part={key} design={design} imageUrl={settingPhoto} />,
    })
    if (key === 'napkin' && quantities.accentNapkin > 0) {
      const accent = fabricColor(design.napkin === 'gold' ? 'ivory' : 'gold')
      rows.push({
        key: 'accentNapkin',
        label: t('table.equipment.accentNapkin'),
        detail: t(accent.label),
        count: quantities.accentNapkin,
        sample: <span className="equipment-chip" style={{ backgroundColor: accent.hex }} />,
      })
    }
  }
  return (
    <>
      {showPreview && design.roundTables > 0 && <QuotedTablePreview design={design} />}
      {showPreview && <h3>{t('table.view.layout')}</h3>}
      <div className="table-brief">
        <SeatingPlan design={design} />
        <dl className="table-layout-details">
          {layoutDetails(design, t).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {guests !== undefined && quantities.chair !== guests && (
        <p className="table-capacity-note">
          {t('table.equipment.checkSeats', { seats: quantities.chair, guests })}
        </p>
      )}
      <h3>{t('table.equipment.title')}</h3>
      <p>{t('table.equipment.basis')}</p>
      <div className="equipment-groups">
        <EquipmentGroup title={t('table.equipment.perTable')} rows={tableRows} />
        <EquipmentGroup title={t('table.equipment.perSeat')} rows={seatRows} />
      </div>
    </>
  )
}

export function QuoteTableDetail({
  design,
  guests,
  showPreview,
}: {
  design?: TableDesign | null
  guests?: number
  showPreview?: boolean
}) {
  const { t } = useI18n()
  const saved = design && readQuotedTable(design)
  return (
    <section className="admin-surface quoted-table" id="event-setting">
      <h2>{t('quote.review.setting')}</h2>
      {saved ? (
        <QuotedSetup design={saved} guests={guests} showPreview={showPreview} />
      ) : (
        <p>{t(design ? 'table.equipment.incomplete' : 'quote.review.tablePending')}</p>
      )}
    </section>
  )
}
