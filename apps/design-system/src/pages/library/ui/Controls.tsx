import { useEffect, useState } from 'react'
import {
  ActionButton,
  ActionLink,
  AlbumArrows,
  DetailIcon,
  EditorialArrow,
  EventIcon,
  TextField,
} from '@legado/brand/controls'
import { PageTransition } from '@legado/brand/page-transition'
import { useSearchParams } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { eventLabels, eventTypes } from '@legado/domain/quote/request'
import { QuantityControl } from '../../../../../web/src/shared/ui/QuantityControl'

export function Controls() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const [quantity, setQuantity] = useState(0)
  const [photo, setPhoto] = useState(0)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!pending) return
    const timer = window.setTimeout(() => setPending(false), 850)
    return () => window.clearTimeout(timer)
  }, [pending])

  return (
    <div id="root">
      <article className="ds-specimen">
        <h2>Acciones</h2>
        <p>Usa un botón para ejecutar una acción y un enlace para navegar.</p>
        <div className="ds-row">
          <ActionButton onPress={() => setPending(true)}>Ver transición</ActionButton>
          <ActionButton variant="secondary" onPress={() => setQuantity(0)}>
            Restablecer cantidad
          </ActionButton>
          <ActionButton isDisabled>Acción deshabilitada</ActionButton>
          <ActionLink to="?detalle=1">Abrir detalle</ActionLink>
        </div>
        {params.has('detalle') && <p role="status">Detalle abierto en la navegación de ejemplo.</p>}
        <PageTransition pending={pending} />
      </article>
      <article className="ds-specimen">
        <h2>Campos y cantidades</h2>
        <div className="ds-field-grid">
          <TextField
            label="Nombre"
            icon="name"
            placeholder="Nombre de contacto"
            autoComplete="off"
          />
          <TextField
            label="Teléfono"
            icon="phone"
            fixedPrefix="+56"
            type="tel"
            placeholder="9 0000 0000"
          />
          <TextField label="Correo" icon="email" type="email" error="Ingresa un correo válido." />
          <TextField label="Fecha reservada" disabled value="12 de diciembre" />
        </div>
        <QuantityControl name="Porciones" quantity={quantity} max={10} onChange={setQuantity} />
      </article>
      <article className="ds-specimen">
        <h2>Iconos y navegación</h2>
        <ul className="ds-icons">
          {eventTypes.map((event) => (
            <li key={event}>
              <EventIcon event={event} />
              {t(eventLabels[event])}
            </li>
          ))}
          {(['name', 'email', 'password', 'phone', 'date', 'guests', 'location'] as const).map(
            (kind) => (
              <li key={kind}>
                <DetailIcon kind={kind} />
                <code>{kind}</code>
              </li>
            ),
          )}
          <li>
            <EditorialArrow direction="up-right" />
            Enlace editorial
          </li>
        </ul>
        <div className="ds-row">
          <AlbumArrows
            className="ds-album-controls"
            label="Navegación de álbum"
            previous="Anterior"
            next="Siguiente"
            onTurn={(direction) => setPhoto((current) => (current + direction + 3) % 3)}
          />
          <output aria-live="polite">Foto {photo + 1} de 3</output>
        </div>
      </article>
    </div>
  )
}
