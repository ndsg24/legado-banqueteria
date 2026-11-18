import { useRef } from 'react'
import { RingLines, WaveLines } from '../decorative/BackgroundMotifs'
import { AmbientVideo } from '../ui/AmbientVideo'
import { useEditorialMotion } from '../../hooks/useEditorialMotion'
import { EditorialArrow } from '../ui/EditorialArrow'

const principles = [
  {
    title: 'Sabor que reconoces.',
    detail: 'Recetas que invitan a repetir.',
    path: 'M9 26h30M12 26a12 12 0 0 0 24 0M17 19c-5-5 5-6 0-11m8 11c-5-5 5-6 0-11m8 11c-5-5 5-6 0-11',
  },
  {
    title: 'La fuente al centro.',
    detail: 'Servir, acercar y compartir.',
    path: 'M5 32h38M9 28a15 15 0 0 1 30 0H9Zm15-15v-4m-4 0h8M12 38h24',
  },
  {
    title: 'Que nadie mire la hora.',
    detail: 'La mejor parte es la sobremesa.',
    path: 'M24 36S8 26 8 16a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 10-16 20-16 20ZM4 8l3 2m34 0 3-2M24 3v3',
  },
] as const

export function Manifesto() {
  const ribbon = useRef<HTMLDivElement>(null)
  const details = useRef<HTMLDivElement>(null)
  useEditorialMotion(ribbon, 'ribbon')
  useEditorialMotion(details, 'manifesto')
  return (
    <section className="manifesto manifesto--film" id="manera">
      <svg
        className="manifesto__motif manifesto__motif--rings"
        viewBox="0 0 220 220"
        aria-hidden="true"
      >
        <RingLines />
      </svg>
      <svg
        className="manifesto__motif manifesto__motif--waves"
        viewBox="0 0 300 180"
        aria-hidden="true"
      >
        <WaveLines />
      </svg>
      <div className="manifesto__ticker" ref={ribbon} aria-hidden="true">
        <div className="ribbon__track">
          {[0, 1].map((copy) => (
            <div className="ribbon__group" key={copy}>
              <span>Casero no significa simple</span>
              <i>✦</i>
              <span>Casero significa nuestro</span>
              <i>✦</i>
            </div>
          ))}
        </div>
      </div>
      <div className="manifesto__layout" ref={details}>
        <div className="manifesto__visual">
          <AmbientVideo
            className="manifesto__image manifesto__film"
            name="Fuente de comida casera al centro de una mesa iluminada por velas"
            caption="Fuente al centro / como debe ser"
            poster="videos/manifesto-table-v1-poster.webp"
            mp4="videos/manifesto-table-v1.mp4"
            webm="videos/manifesto-table-v1.webm"
            mobileMp4="videos/manifesto-table-v1-mobile.mp4"
            mobileWebm="videos/manifesto-table-v1-mobile.webm"
          />
          <div className="manifesto__footnote" aria-hidden="true">
            <span>De la cocina a la mesa.</span>
            <svg viewBox="0 0 180 50" fill="none">
              <path className="manifesto__draw" d="M3 19c45 35 105 24 153-7m-17 0 19-4-5 18" />
            </svg>
            <small>El cariño también se sirve.</small>
          </div>
        </div>
        <div className="manifesto__copy">
          <span>Nuestra manera</span>
          <h2>
            Alta calidad.
            <br />
            Cero distancia.
          </h2>
          <p>
            No queremos platos que haya que explicar. Queremos ver fuentes que se vacían,
            conversaciones que se alargan y personas que preguntan quién cocinó.
          </p>
          <div className="manifesto__principles">
            {principles.map((principle, index) => (
              <div className="manifesto__principle" key={principle.title}>
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <path className="manifesto__draw" d={principle.path} />
                </svg>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.detail}</p>
                </div>
                <span aria-hidden="true">0{index + 1}</span>
              </div>
            ))}
          </div>
          <a className="manifesto__invitation" href={`${import.meta.env.BASE_URL}carta.html`}>
            Encuentra tu próximo favorito <EditorialArrow direction="up-right" />
          </a>
        </div>
      </div>
    </section>
  )
}
