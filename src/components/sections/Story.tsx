import { EditorialArrow } from '../ui/EditorialArrow'
import { useRef } from 'react'
import { useEditorialMotion } from '../../hooks/useEditorialMotion'

export function Story() {
  const root = useRef<HTMLElement>(null)
  useEditorialMotion(root, 'story')
  return (
    <section
      className="story story--editorial"
      id="historia"
      ref={root}
      aria-labelledby="story-title"
    >
      <div className="story__index">
        <span>El origen</span>
        <strong>01 — 04</strong>
      </div>
      <div className="story__title">
        <p>
          Esto no comenzó
          <br />
          como un negocio.
        </p>
        <h2 id="story-title">
          Comenzó
          <br />
          con un “¿quién
          <br />
          <em>va a cocinar?”</em>
        </h2>
      </div>
      <div className="story__body">
        <div className="story__illustration" aria-hidden="true">
          <svg viewBox="0 0 360 155" fill="none">
            <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="story__draw"
                d="M72 110c0-44 35-70 108-70s108 26 108 70M59 110h242M69 119h222M157 40c0-17 46-17 46 0"
              />
              <path
                className="story__draw"
                d="M33 56v69m-6-69v19q6 12 12 0V56M327 55v70m0-70c-14 20-14 36 0 36"
              />
              <path className="story__steam" d="M153 30c-12-11 11-16 0-28" />
              <path className="story__steam" d="M180 25c-12-11 11-16 0-25" />
              <path className="story__steam" d="M207 30c-12-11 11-16 0-28" />
            </g>
          </svg>
          <span>De una pregunta a muchas mesas.</span>
        </div>
        <p>
          Legado nació haciendo lo que nuestra familia siempre ha hecho: cocinar para muchos, servir
          sin medir el cariño y lograr que nadie quiera levantarse de la mesa.
        </p>
        <p>
          Con el tiempo entendimos que eso también era un oficio. Hoy llevamos ese sabor reconocible
          a matrimonios, encuentros y celebraciones, con la calidad que merece un día importante.
        </p>
        <div className="story__ritual" aria-label="Nuestra receta">
          <span>
            01 <b>Cocinar</b>
          </span>
          <i>
            <EditorialArrow direction="up-right" />
          </i>
          <span>
            02 <b>Compartir</b>
          </span>
          <i>
            <EditorialArrow direction="up-right" />
          </i>
          <span>
            03 <b>Celebrar</b>
          </span>
        </div>
      </div>
    </section>
  )
}
