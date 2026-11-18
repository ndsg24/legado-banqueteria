import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'
import { CenterpieceControls } from './CenterpieceControls'
import { EditableSeatingPlan } from './EditableSeatingPlan'
import { capturePlan } from '../../rendering/table/capturePlan'
import { SeatingControls } from './SeatingControls'
import { EditorialArrow } from '../ui/EditorialArrow'
import { useCallback, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { overlayStyleLabels, napkinFoldLabels, changeRoundSeat, fabricColor, fabricColors, tablePartLabels, tablePresets, fabricTextures, dinnerwareStyles, isDinnerware } from '../../config/table'
import { quoteHref } from '../../quote/selection'
import { tableDesignUrl, useTableDesign } from '../../hooks/useTableDesign'
import { useTableScene } from '../../hooks/useTableScene'
import { overlayStyles, napkinFolds, tableParts } from '../../types/table'
import type { TablePart } from '../../types/table'
import type { TableView } from '../../rendering/table/TableScene'

const views: readonly { id: TableView; label: string }[] = [{ id: 'table', label: 'La mesa' }, { id: 'chairs', label: 'Las sillas' }, { id: 'overhead', label: 'Desde arriba' }, { id: 'centerpiece', label: 'El centro' }, { id: 'setting', label: 'El puesto' }]
export function TableConfigurator() {
  const { design, setDesign, activePart, setActivePart, setColor, setTexture } = useTableDesign()
  const [showPlan, setShowPlan] = useState(() => design.roundTables !== 1 || design.headSeats > 0)
  const planRef = useRef<SVGSVGElement>(null)
  const [panel, setPanel] = useState<'fabrics' | 'composition'>('fabrics')
  const selectPart = useCallback((part: TablePart) => { setActivePart(part); setPanel('fabrics') }, [setActivePart])
  const { canvasRef, status, setView, saveImage } = useTableScene(design, selectPart)
  const [view, setActiveView] = useState<TableView>('table')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const current = fabricColor(design[activePart])
  const preset = tablePresets.find((item) => tableParts.every((part) => item.design[part] === design[part] && item.design.textures[part] === design.textures[part]) && item.design.floral === design.floral)
  const previewChairs = design.roundSeats?.[0] ?? design.chairs
  const designUrl = tableDesignUrl(design)
  const quoteParams = new URL(designUrl).searchParams
  quoteParams.set('mesa', '1')
  const napkinPicker = <fieldset className="table-studio__folds table-studio__napkin-picker">
    <legend>Plegado de la servilleta</legend>
    <div>{napkinFolds.map(fold => <button type="button" key={fold} aria-pressed={design.napkinFold === fold}
      onClick={() => {
        setDesign(current => ({ ...current, napkinFold: fold }))
        setActiveView('setting')
        setView('setting')
      }}>
        <img src={`${import.meta.env.BASE_URL}images/napkins/${fold}.webp`} width="64" height="64" alt="" />
        <span>{napkinFoldLabels[fold]}</span>
      </button>)}</div>
  </fieldset>
  async function share() {
    try { await navigator.clipboard.writeText(designUrl); setMessage('Enlace copiado. Tu combinación viaja con él.') }
    catch { setMessage('Puedes copiar la dirección de esta página para compartir tu combinación.') }
  }
  async function download() {
    setSaving(true)
    try {
      if (showPlan && planRef.current) {
        const link = document.createElement('a')
        link.href = await capturePlan(planRef.current, 3840)
        link.download = 'legado-distribucion-del-salon.png'
        link.click()
      } else { await saveImage() }
      setMessage(showPlan ? 'Plano guardado.' : 'Imagen guardada. Tu mesa empieza a tomar forma.')
    }
    catch { setMessage('No pudimos guardar la imagen. Puedes compartir el enlace de tu diseño.') }
    finally { setSaving(false) }
  }
  return (
    <section className="table-studio" id="disena" aria-labelledby="table-title">
      <header className="table-studio__header">
        <div><p className="table-studio__eyebrow">El estudio de Legado <span>01 / Ambientación</span></p><h1 id="table-title">Tu mesa. <em>Tu manera.</em></h1></div>
        <p>Una celebración también se cuenta con colores. Combina las telas y empieza a imaginar la tuya.</p>
      </header>
      <div className="table-studio__modes" role="group" aria-label="Vista del montaje">
        <button type="button" aria-pressed={!showPlan} onClick={() => setShowPlan(false)}>Detalle de la mesa</button>
        <button type="button" aria-pressed={showPlan} onClick={() => setShowPlan(true)}>Distribución del salón</button>
      </div>
      <div className="table-studio__layout">
        <div className="table-studio__preview">
          {showPlan && <EditableSeatingPlan design={design} planRef={planRef} onChange={patch => setDesign(current => ({ ...current, ...patch }))} />}
          <div className="table-studio__scene" data-status={status} hidden={showPlan}>
            <div className="table-studio__scene-label"><span>{design.roundTables ? `${design.roundTables > 1 ? 'Mesa 1' : 'Mesa redonda'} · ${previewChairs} puestos` : 'Muestra de textiles y vajilla'}</span><span>{preset?.label ?? 'Tu combinación'}</span></div>
            <canvas ref={canvasRef} aria-label="Vista tridimensional de tu mesa. Arrastra para girar y usa la rueda o dos dedos para acercarte. Los controles de colores están a continuación." />
            {status !== 'ready' && <p className="table-studio__loading" role="status">{status === 'loading' ? 'Preparando tu mesa…' : 'La vista 3D no está disponible en este dispositivo. Puedes seguir combinando colores y compartir tu diseño.'}</p>}
            <p className="table-studio__gesture"><EditorialArrow direction="both" /> Arrastra para girar <span>·</span> Toca una tela para editarla</p>
            <div className="table-studio__views" role="group" aria-label="Punto de vista">
              {views.map((item) => <button key={item.id} type="button" disabled={status !== 'ready'} aria-pressed={view === item.id} onClick={() => { setActiveView(item.id); setView(item.id) }}>{item.label}</button>)}
            </div>
          </div>
          <div className="table-studio__presets" hidden={showPlan}><span>Un punto de partida</span><div>{tablePresets.map((item) => <button type="button" key={item.id} aria-pressed={preset?.id === item.id} onClick={() => setDesign({ ...item.design, roundTables: design.roundTables, roundSeats: design.roundSeats, headSeats: design.headSeats, chairs: design.chairs, dinnerware: design.dinnerware, overlayStyle: design.overlayStyle, napkinFold: design.napkinFold, flowerKind: design.flowerKind, flowerColor: design.flowerColor, bottleOutfit: design.bottleOutfit, textures: { ...item.design.textures } })}><span className="table-studio__palette" aria-hidden="true">{['tablecloth', 'overlay', 'sash'].map((part) => <i key={part} style={{ background: fabricColor(item.design[part as TablePart]).hex }} />)}</span><strong>{item.label}</strong><small>{item.caption}</small></button>)}</div></div>
        </div>
        <aside className="table-studio__controls" aria-label="Personaliza tu mesa">
          <p className="table-studio__eyebrow">Los detalles hacen la mesa</p>
          <h2>{showPlan ? <>Arma tu <em>salón.</em></> : <>Hazla <em>tuya.</em></>}</h2>
          {showPlan ? <SeatingControls design={design} onChange={patch => setDesign(current => ({ ...current, ...patch }))} /> : <Tabs selectedKey={panel} onSelectionChange={key => setPanel(key === 'composition' ? 'composition' : 'fabrics')}>

          <TabList className="table-studio__panels" aria-label="Opciones de ambientación">
            <Tab id="fabrics">
              <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                <path d="M4 13 16 6l12 7-12 7z M4 18l12 7 12-7 M4 23l12 7 12-7" />
              </svg>
              Telas y colores
            </Tab>
            <Tab id="composition">
              <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                <circle cx="16" cy="16" r="8" /><circle cx="16" cy="16" r="5.3" />
                <path d="M3 5v7q0 3 2 3t2-3V5 M5 5v22 M29 5q-3 3-3 11h3V5v22" />
              </svg>
              Montaje y vajilla
            </Tab>
          </TabList>
          <TabPanel id="composition" className="table-studio__composition">
            <fieldset><legend>{design.roundSeats ? 'Puestos de la mesa 1' : 'Puestos por mesa'}</legend><div className="table-studio__seat-count" role="group" aria-label="Cantidad de sillas">{[6, 7, 8, 9, 10].map((count) => <button type="button" key={count} aria-pressed={previewChairs === count} onClick={() => setDesign((current) => ({ ...current, ...(current.roundSeats ? changeRoundSeat(current, 0, count) : { chairs: count }) }))}>{count}</button>)}</div></fieldset>
            <fieldset>
              <legend>Vajilla de referencia</legend>
              <div className="table-studio__flowers">
                {Object.keys(dinnerwareStyles).filter(isDinnerware).map((id) => (
                  <button type="button" key={id} aria-pressed={design.dinnerware === id}
                    onClick={() => setDesign((current) => ({ ...current, dinnerware: id }))}>
                    <i className="plate-sample" data-rim={id === 'goldRim'} style={{ backgroundColor: dinnerwareStyles[id].color }} aria-hidden="true" />
                    {dinnerwareStyles[id].label}
                  </button>
                ))}
              </div>
            </fieldset>
            <CenterpieceControls design={design} onChange={patch => {
              setDesign(current => ({ ...current, ...patch }))
              const empty = (patch.floral ?? design.floral) === 'none' && (patch.bottleOutfit ?? design.bottleOutfit) === 'none'
              const nextView = empty ? 'table' : 'centerpiece'
              setActiveView(nextView)
              setView(nextView)
            }} />
          </TabPanel>
          <TabPanel id="fabrics">
          <div className="table-studio__parts" role="group" aria-label="Elemento a personalizar">{tableParts.map((part, index) => <button key={part} type="button" aria-pressed={activePart === part} onClick={() => setActivePart(part)}><span>{String(index + 1).padStart(2, '0')}</span>{tablePartLabels[part]}<i style={{ background: fabricColor(design[part]).hex }} aria-hidden="true" /></button>)}</div>
          {activePart === 'overlay' && <fieldset className="table-studio__folds table-studio__overlay-picker">
            <legend>Formato de la carpeta</legend>
            <div>{overlayStyles.map(style => <button type="button" key={style} aria-pressed={design.overlayStyle === style}
              onClick={() => setDesign(current => ({ ...current, overlayStyle: style }))}>
              <i data-shape={style} aria-hidden="true" />{overlayStyleLabels[style]}
            </button>)}</div>
          </fieldset>}
          <fieldset className="table-studio__colors"><legend>{tablePartLabels[activePart]} <span>{current.label}</span></legend><div>{fabricColors.map((color) => <button key={color.id} type="button" aria-label={color.label} aria-pressed={design[activePart] === color.id} style={{ '--swatch': color.hex } as CSSProperties} onClick={() => setColor(color.id)}><span aria-hidden="true" /> <small>{color.label}</small></button>)}</div></fieldset>
          {activePart === 'napkin' && napkinPicker}
          <fieldset className="table-studio__textures"><legend>Textura de {tablePartLabels[activePart].toLowerCase()}</legend><div>{fabricTextures.map((texture) => <button key={texture.id} type="button" aria-pressed={design.textures[activePart] === texture.id} onClick={() => setTexture(texture.id)}><i className={`fabric-sample fabric-sample--${texture.id}`} style={{ '--swatch': current.hex } as CSSProperties} aria-hidden="true" /><span>{texture.label}<small>{texture.caption}</small></span></button>)}</div></fieldset>
          </TabPanel>
          </Tabs>}
          <div className="table-studio__actions"><a className="button--gold" href={quoteHref(quoteParams)}>Consultar esta ambientación <span aria-hidden="true"><EditorialArrow direction="up-right" /></span></a><div><button type="button" onClick={share}>Copiar diseño <EditorialArrow direction="up-right" /></button><button type="button" disabled={(!showPlan && status !== 'ready') || saving} onClick={download}>{saving ? 'Preparando imagen…' : <>{showPlan ? 'Guardar plano en 4K' : 'Guardar en 4K'} <EditorialArrow direction="down" /></>}</button></div></div>
          <p className="table-studio__feedback" role="status" aria-live="polite">{message}</p>
          <p className="table-studio__note">Esta es una visualización de referencia. Telas, tonos y elementos se confirman con nuestro equipo según disponibilidad. Los colores pueden variar en pantalla.</p>
        </aside>
      </div>
    </section>
  )
}
