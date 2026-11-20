import { FabricSample } from '../../../entities/table/ui'
import { ActionLink } from '../../../shared/ui/ActionLink'
import { type MessageKey, useI18n } from '../../../shared/i18n'
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'
import { TableSettingControls } from './TableSettingControls'
import { EditableSeatingPlan } from './EditableSeatingPlan'
import {
  capturePlan,
  SeatingPlan,
  useTableScene,
  type TableView,
} from '../../../features/preview-table'
import { SeatingControls } from './SeatingControls'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { useCallback, useRef, useState, type CSSProperties } from 'react'
import {
  overlayStyleLabels,
  napkinFoldLabels,
  fabricColor,
  fabricColors,
  tablePartLabels,
  tablePresets,
  fabricTextures,
  tableDesignUrl,
  overlayStyles,
  napkinFolds,
  tableParts,
  type TablePart,
  type TableDesign,
} from '../../../entities/table'
import { quoteHref } from '../../../shared/routing'
import { useTableDesign } from '../model/useTableDesign'

import './table.css'

const views: readonly { id: TableView; label: MessageKey }[] = [
  { id: 'table', label: 'table.view.table' },
  { id: 'chairs', label: 'table.view.chairs' },
  { id: 'overhead', label: 'table.view.overhead' },
  { id: 'centerpiece', label: 'table.view.centerpiece' },
  { id: 'setting', label: 'table.view.setting' },
]
export function TableConfigurator() {
  const { design, setDesign } = useTableDesign()
  return <TableEditor design={design} onChange={setDesign} standalone />
}

type TableEditorProps = {
  design: TableDesign
  onChange: (design: TableDesign) => void
  standalone?: boolean
}

export function TableEditor({ design, onChange, standalone = false }: TableEditorProps) {
  const { t } = useI18n()
  const [activePart, setActivePart] = useState<TablePart>('tablecloth')
  const patchDesign = (patch: Partial<TableDesign>) => onChange({ ...design, ...patch })
  const [showPlan, setShowPlan] = useState(() => design.roundTables !== 1 || design.headSeats > 0)
  const [sceneRequested, setSceneRequested] = useState(!showPlan)
  const planRef = useRef<SVGSVGElement>(null)
  const [panel, setPanel] = useState<'fabrics' | 'composition'>('fabrics')
  const selectPart = useCallback(
    (part: TablePart) => {
      setActivePart(part)
      setPanel('fabrics')
    },
    [setActivePart],
  )
  const { canvasRef, status, setView, saveImage } = useTableScene(
    design,
    selectPart,
    sceneRequested,
  )
  const [view, setActiveView] = useState<TableView>('table')
  function changeView(next: TableView) {
    setActiveView(next)
    setView(next)
  }
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<MessageKey | ''>('')
  const current = fabricColor(design[activePart])
  const preset = tablePresets.find(
    (item) =>
      tableParts.every(
        (part) =>
          item.design[part] === design[part] &&
          item.design.textures[part] === design.textures[part],
      ) && item.design.floral === design.floral,
  )
  const previewChairs = design.roundSeats?.[0] ?? design.chairs
  const designUrl = tableDesignUrl(
    design,
    standalone ? undefined : import.meta.env.BASE_URL + 'ambientacion.html',
  )
  const quoteParams = new URL(designUrl).searchParams
  quoteParams.set('mesa', '1')
  const napkinPicker = (
    <fieldset className="table-studio__folds table-studio__napkin-picker">
      <legend>{t('table.napkins.fold')}</legend>
      <div>
        {napkinFolds.map((fold) => (
          <button
            type="button"
            key={fold}
            aria-pressed={design.napkinFold === fold}
            onClick={() => {
              patchDesign({ napkinFold: fold })
              changeView('setting')
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/napkins/${fold}.webp`}
              width="64"
              height="64"
              alt=""
            />
            <span>{t(napkinFoldLabels[fold])}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
  async function share() {
    try {
      await navigator.clipboard.writeText(designUrl)
      setMessage('table.share.copied')
    } catch {
      setMessage('table.share.copyManually')
    }
  }
  async function download() {
    setSaving(true)
    try {
      if (showPlan && planRef.current) {
        const link = document.createElement('a')
        link.href = await capturePlan(planRef.current, 3840)
        link.download = 'legado-distribucion-del-salon.png'
        link.click()
      } else {
        await saveImage()
      }
      setMessage(showPlan ? 'table.share.planSaved' : 'table.share.photoSaved')
    } catch {
      setMessage('table.share.failed')
    } finally {
      setSaving(false)
    }
  }
  return (
    <section
      className="table-studio"
      id={standalone ? 'disena' : undefined}
      aria-label={t('common.nav.yourTable')}
    >
      {standalone && (
        <header className="table-studio__header">
          <div>
            <p className="table-studio__eyebrow">
              {t('table.intro.eyebrow')} <span>{t('table.intro.chapter')}</span>
            </p>
            <h1 id="table-title">
              {t('table.intro.title')} <em>{t('table.intro.accent')}</em>
            </h1>
          </div>
          <p>{t('table.intro.description')}</p>
        </header>
      )}
      <div className="table-studio__modes" role="group" aria-label={t('table.view.label')}>
        <button
          type="button"
          aria-pressed={!showPlan}
          onClick={() => {
            setSceneRequested(true)
            setShowPlan(false)
          }}
        >
          {t('table.view.detail')}
        </button>
        <button type="button" aria-pressed={showPlan} onClick={() => setShowPlan(true)}>
          {t('table.view.layout')}
        </button>
      </div>
      <div className="table-studio__layout">
        <div className="table-studio__preview">
          {showPlan && (
            <EditableSeatingPlan design={design} planRef={planRef} onChange={patchDesign} />
          )}
          <div className="table-studio__scene" data-status={status} hidden={showPlan}>
            <div className="table-studio__scene-label">
              <span>
                {design.roundTables
                  ? t('table.view.seatSummary', {
                      table: t(
                        design.roundTables > 1 ? 'table.view.firstTable' : 'table.view.roundTable',
                      ),
                      count: previewChairs,
                    })
                  : t('table.view.sample')}
              </span>
              <span>{t(preset?.label ?? 'table.view.combination')}</span>
            </div>
            <canvas
              ref={canvasRef}
              aria-label={t('table.view.description') + ' ' + t('table.view.controls')}
            />
            {!showPlan && status !== 'ready' && (
              <>
                <div className="table-studio__fallback-plan">
                  <SeatingPlan design={design} />
                </div>
                <p className="table-studio__loading" role="status">
                  {status === 'loading'
                    ? t('table.view.loading')
                    : t('table.view.unavailable') + ' ' + t('table.view.fallback')}
                </p>
              </>
            )}
            <p className="table-studio__gesture" hidden={status !== 'ready'}>
              <EditorialArrow direction="both" /> {t('table.view.rotate')} <span>·</span>{' '}
              {t('table.view.editFabric')}
            </p>
            <div
              className="table-studio__views"
              hidden={status !== 'ready'}
              role="group"
              aria-label={t('table.view.viewpoint')}
            >
              {views.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={status !== 'ready'}
                  aria-pressed={view === item.id}
                  onClick={() => {
                    changeView(item.id)
                  }}
                >
                  {t(item.label)}
                </button>
              ))}
            </div>
          </div>
          <div className="table-studio__presets" hidden={showPlan}>
            <span>{t('table.designer.presets')}</span>
            <div>
              {tablePresets.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={preset?.id === item.id}
                  onClick={() =>
                    onChange({
                      ...item.design,
                      roundTables: design.roundTables,
                      roundSeats: design.roundSeats,
                      headSeats: design.headSeats,
                      chairs: design.chairs,
                      dinnerware: design.dinnerware,
                      overlayStyle: design.overlayStyle,
                      napkinFold: design.napkinFold,
                      flowerKind: design.flowerKind,
                      flowerColor: design.flowerColor,
                      bottleOutfit: design.bottleOutfit,
                      textures: { ...item.design.textures },
                    })
                  }
                >
                  <span className="table-studio__palette" aria-hidden="true">
                    {['tablecloth', 'overlay', 'sash'].map((part) => (
                      <i
                        key={part}
                        style={{ background: fabricColor(item.design[part as TablePart]).hex }}
                      />
                    ))}
                  </span>
                  <strong>{t(item.label)}</strong>
                  <small>{t(item.caption)}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
        <aside className="table-studio__controls" aria-label={t('table.designer.customize')}>
          <p className="table-studio__eyebrow">{t('table.designer.eyebrow')}</p>
          <h2>
            {showPlan ? (
              <>
                {t('table.designer.roomTitle')} <em>{t('table.designer.roomAccent')}</em>
              </>
            ) : (
              <>
                {t('table.designer.styleTitle')} <em>{t('table.designer.styleAccent')}</em>
              </>
            )}
          </h2>
          {showPlan ? (
            <SeatingControls design={design} onChange={patchDesign} />
          ) : (
            <Tabs
              selectedKey={panel}
              onSelectionChange={(key) =>
                setPanel(key === 'composition' ? 'composition' : 'fabrics')
              }
            >
              <TabList className="table-studio__panels" aria-label={t('table.designer.options')}>
                <Tab id="fabrics">
                  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                    <path d="M4 13 16 6l12 7-12 7z M4 18l12 7 12-7 M4 23l12 7 12-7" />
                  </svg>
                  {t('table.designer.fabrics')}
                </Tab>
                <Tab id="composition">
                  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                    <circle cx="16" cy="16" r="8" />
                    <circle cx="16" cy="16" r="5.3" />
                    <path d="M3 5v7q0 3 2 3t2-3V5 M5 5v22 M29 5q-3 3-3 11h3V5v22" />
                  </svg>
                  {t('table.designer.setting')}
                </Tab>
              </TabList>
              <TabPanel id="composition" className="table-studio__composition">
                <TableSettingControls design={design} onChange={patchDesign} onView={changeView} />
              </TabPanel>
              <TabPanel id="fabrics">
                <div
                  className="table-studio__parts"
                  role="group"
                  aria-label={t('table.designer.element')}
                >
                  {tableParts.map((part, index) => (
                    <button
                      key={part}
                      type="button"
                      aria-pressed={activePart === part}
                      onClick={() => setActivePart(part)}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {t(tablePartLabels[part])}
                      <i style={{ background: fabricColor(design[part]).hex }} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                {activePart === 'overlay' && (
                  <fieldset className="table-studio__folds table-studio__overlay-picker">
                    <legend>{t('table.designer.overlayFormat')}</legend>
                    <div>
                      {overlayStyles.map((style) => (
                        <button
                          type="button"
                          key={style}
                          aria-pressed={design.overlayStyle === style}
                          onClick={() => patchDesign({ overlayStyle: style })}
                        >
                          <i data-shape={style} aria-hidden="true" />
                          {t(overlayStyleLabels[style])}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
                <fieldset className="table-studio__colors">
                  <legend>
                    {t(tablePartLabels[activePart])} <span>{t(current.label)}</span>
                  </legend>
                  <div>
                    {fabricColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        aria-label={t(color.label)}
                        aria-pressed={design[activePart] === color.id}
                        style={{ '--swatch': color.hex } as CSSProperties}
                        onClick={() => patchDesign({ [activePart]: color.id })}
                      >
                        <span aria-hidden="true" /> <small>{t(color.label)}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
                {activePart === 'napkin' && napkinPicker}
                <fieldset className="table-studio__textures">
                  <legend>
                    {t('table.designer.texture')} {t(tablePartLabels[activePart]).toLowerCase()}
                  </legend>
                  <div>
                    {fabricTextures.map((texture) => (
                      <button
                        key={texture.id}
                        type="button"
                        aria-pressed={design.textures[activePart] === texture.id}
                        onClick={() =>
                          patchDesign({
                            textures: { ...design.textures, [activePart]: texture.id },
                          })
                        }
                      >
                        <FabricSample texture={texture.id} color={current.hex} />
                        <span>
                          {t(texture.label)}
                          <small>{t(texture.caption)}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </TabPanel>
            </Tabs>
          )}
          <div className="table-studio__actions">
            {standalone && (
              <ActionLink to={quoteHref(quoteParams)}>
                {t('table.designer.quote')}{' '}
                <span aria-hidden="true">
                  <EditorialArrow direction="up-right" />
                </span>
              </ActionLink>
            )}
            <div>
              <button type="button" onClick={share}>
                {t('table.designer.copy')} <EditorialArrow direction="up-right" />
              </button>
              <button
                type="button"
                disabled={(!showPlan && status !== 'ready') || saving}
                onClick={download}
              >
                {saving ? (
                  t('table.designer.exporting')
                ) : (
                  <>
                    {showPlan ? t('table.designer.savePlan') : t('table.designer.saveImage')}{' '}
                    <EditorialArrow direction="down" />
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="table-studio__feedback" role="status" aria-live="polite">
            {message && t(message)}
          </p>
          <p className="table-studio__note">{t('table.designer.disclaimer')}</p>
        </aside>
      </div>
    </section>
  )
}
