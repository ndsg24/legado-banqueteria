import { useCallback, useState } from 'react'
import type { CSSProperties } from 'react'
import { fabricColor, fabricColors, tablePartLabels, tablePresets, fabricTextures, floralStyles } from '../../config/table'
import { siteConfig } from '../../config/site'
import { tableDesignUrl, useTableDesign } from '../../hooks/useTableDesign'
import { useTableScene } from '../../hooks/useTableScene'
import { tableParts } from '../../types/table'
import type { TablePart } from '../../types/table'
import type { TableView } from '../../rendering/table/TableScene'

const views: readonly { id: TableView; label: string }[] = [{ id: 'table', label: 'La mesa' }, { id: 'chairs', label: 'Las sillas' }, { id: 'overhead', label: 'Desde arriba' }]
export function TableConfigurator() {
  const { design, setDesign, activePart, setActivePart, setColor, setTexture } = useTableDesign()
  const [panel, setPanel] = useState<'fabrics' | 'composition'>('fabrics')
  const selectPart = useCallback((part: TablePart) => { setActivePart(part); setPanel('fabrics') }, [setActivePart])
  const { canvasRef, status, setView, saveImage } = useTableScene(design, selectPart)
  const [view, setActiveView] = useState<TableView>('table')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const current = fabricColor(design[activePart])
  const preset = tablePresets.find((item) => tableParts.every((part) => item.design[part] === design[part] && item.design.textures[part] === design.textures[part]) && item.design.floral === design.floral)
  const summary = tableParts.map((part) => `${tablePartLabels[part]}: ${fabricColor(design[part]).label} · ${fabricTextures.find((texture) => texture.id === design.textures[part])?.label}`).join('\n')
  const designUrl = tableDesignUrl(design)
  const email = `Hola Legado, me gustaría consultar por esta ambientación:\n\n${summary}\nPuestos: ${design.chairs}\nArreglo floral: ${floralStyles.find((style) => style.id === design.floral)?.label}\n\nMi diseño: ${designUrl}\n\nFecha del evento:\nCantidad de invitados:\nLugar:\n\nQuedo atento/a para confirmar telas, colores y disponibilidad.`
  async function share() {
    try { await navigator.clipboard.writeText(designUrl); setMessage('Enlace copiado. Tu combinación viaja con él.') }
    catch { setMessage('Puedes copiar la dirección de esta página para compartir tu combinación.') }
  }
  async function download() {
    setSaving(true)
    try { await saveImage(); setMessage('Imagen guardada. Tu mesa empieza a tomar forma.') }
    catch { setMessage('No pudimos guardar la imagen. Puedes compartir el enlace de tu diseño.') }
    finally { setSaving(false) }
  }
  return (
    <section className="table-studio" id="disena" aria-labelledby="table-title">
      <header className="table-studio__header">
        <div><p className="table-studio__eyebrow">El estudio de Legado <span>01 / Ambientación</span></p><h1 id="table-title">Tu mesa. <em>Tu manera.</em></h1></div>
        <p>Una celebración también se cuenta con colores. Combina las telas y empieza a imaginar la tuya.</p>
      </header>
      <div className="table-studio__layout">
        <div className="table-studio__preview">
          <div className="table-studio__scene" data-status={status}>
            <div className="table-studio__scene-label"><span>Mesa redonda · {design.chairs} puestos</span><span>{preset?.label ?? 'Tu combinación'}</span></div>
            <canvas ref={canvasRef} aria-label="Vista tridimensional de tu mesa. Arrastra para girar y usa la rueda o dos dedos para acercarte. Los controles de colores están a continuación." />
            {status !== 'ready' && <p className="table-studio__loading" role="status">{status === 'loading' ? 'Preparando tu mesa…' : 'La vista 3D no está disponible en este dispositivo. Puedes seguir combinando colores y compartir tu diseño.'}</p>}
            <p className="table-studio__gesture">↔ Arrastra para girar <span>·</span> Toca una tela para editarla</p>
            <div className="table-studio__views" role="group" aria-label="Punto de vista">
              {views.map((item) => <button key={item.id} type="button" disabled={status !== 'ready'} aria-pressed={view === item.id} onClick={() => { setActiveView(item.id); setView(item.id) }}>{item.label}</button>)}
            </div>
          </div>
          <div className="table-studio__presets"><span>Un punto de partida</span><div>{tablePresets.map((item) => <button type="button" key={item.id} aria-pressed={preset?.id === item.id} onClick={() => setDesign({ ...item.design, chairs: design.chairs, textures: { ...item.design.textures } })}><span className="table-studio__palette" aria-hidden="true">{['tablecloth', 'overlay', 'sash'].map((part) => <i key={part} style={{ background: fabricColor(item.design[part as TablePart]).hex }} />)}</span><strong>{item.label}</strong><small>{item.caption}</small></button>)}</div></div>
        </div>
        <aside className="table-studio__controls" aria-label="Personaliza las telas">
          <p className="table-studio__eyebrow">Los detalles hacen la mesa</p>
          <h2>Hazla <em>tuya.</em></h2>
          <div className="table-studio__panels" role="group" aria-label="Opciones de ambientación"><button type="button" aria-pressed={panel === 'fabrics'} onClick={() => setPanel('fabrics')}>Telas y colores</button><button type="button" aria-pressed={panel === 'composition'} onClick={() => setPanel('composition')}>Mesa y flores</button></div>
          {panel === 'composition' ? <div className="table-studio__composition">
            <fieldset><legend>Un lugar para cada invitado</legend><div className="table-studio__seat-count" role="group" aria-label="Cantidad de sillas">{[6, 7, 8, 9, 10].map((count) => <button type="button" key={count} aria-pressed={design.chairs === count} onClick={() => setDesign((current) => ({ ...current, chairs: count }))}>{count}</button>)}</div><p>La mesa y los puestos se adaptan a tu elección.</p></fieldset>
            <fieldset><legend>El centro de la celebración</legend><div className="table-studio__flowers">{floralStyles.map((style) => <button type="button" key={style.id} aria-pressed={design.floral === style.id} onClick={() => setDesign((current) => ({ ...current, floral: style.id }))}><i className={`floral-sample floral-sample--${style.id}`} aria-hidden="true">{style.id === 'none' ? '—' : '✿'}</i>{style.label}</button>)}</div></fieldset>
          </div> : <>
          <div className="table-studio__parts" role="group" aria-label="Elemento a personalizar">{tableParts.map((part, index) => <button key={part} type="button" aria-pressed={activePart === part} onClick={() => setActivePart(part)}><span>{String(index + 1).padStart(2, '0')}</span>{tablePartLabels[part]}<i style={{ background: fabricColor(design[part]).hex }} aria-hidden="true" /></button>)}</div>
          <fieldset className="table-studio__colors"><legend>{tablePartLabels[activePart]} <span>{current.label}</span></legend><div>{fabricColors.map((color) => <button key={color.id} type="button" aria-label={color.label} aria-pressed={design[activePart] === color.id} style={{ '--swatch': color.hex } as CSSProperties} onClick={() => setColor(color.id)}><span aria-hidden="true" /> <small>{color.label}</small></button>)}</div></fieldset>
          <fieldset className="table-studio__textures"><legend>Textura de {tablePartLabels[activePart].toLowerCase()}</legend><div>{fabricTextures.map((texture) => <button key={texture.id} type="button" aria-pressed={design.textures[activePart] === texture.id} onClick={() => setTexture(texture.id)}><i className={`fabric-sample fabric-sample--${texture.id}`} style={{ '--swatch': current.hex } as CSSProperties} aria-hidden="true" /><span>{texture.label}<small>{texture.caption}</small></span></button>)}</div></fieldset>
          </>}
          <div className="table-studio__actions"><a className="button--gold" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('Mi mesa · Legado')}&body=${encodeURIComponent(email)}`}>Consultar esta ambientación <span aria-hidden="true">↗</span></a><div><button type="button" onClick={share}>Copiar diseño ↗</button><button type="button" disabled={status !== 'ready' || saving} onClick={download}>{saving ? 'Preparando imagen…' : 'Guardar en 4K ↓'}</button></div></div>
          <p className="table-studio__feedback" role="status" aria-live="polite">{message}</p>
          <p className="table-studio__note">Esta es una visualización de referencia. Telas, tonos y elementos se confirman con nuestro equipo según disponibilidad. Los colores pueden variar en pantalla.</p>
        </aside>
      </div>
    </section>
  )
}
