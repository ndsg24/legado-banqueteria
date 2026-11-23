import { useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
import { useRef } from 'react'
import { RingLines, WaveLines } from '../../../shared/ui/BackgroundMotifs'
import { AmbientVideo } from '../../../shared/ui/AmbientVideo'
import { useEditorialMotion } from '../model/useEditorialMotion'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

const principles = [
  {
    title: 'home.manifesto.tasteTitle',
    detail: 'home.manifesto.tasteDetail',
    path: 'M9 26h30M12 26a12 12 0 0 0 24 0M17 19c-5-5 5-6 0-11m8 11c-5-5 5-6 0-11m8 11c-5-5 5-6 0-11',
  },
  {
    title: 'home.manifesto.platterTitle',
    detail: 'home.manifesto.platterDetail',
    path: 'M5 32h38M9 28a15 15 0 0 1 30 0H9Zm15-15v-4m-4 0h8M12 38h24',
  },
  {
    title: 'home.manifesto.timeTitle',
    detail: 'home.manifesto.timeDetail',
    path: 'M24 36S8 26 8 16a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 10-16 20-16 20ZM4 8l3 2m34 0 3-2M24 3v3',
  },
] as const

export function Manifesto() {
  const { t } = useI18n()

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
              <span>{t('home.manifesto.ribbonLead')}</span>
              <i>✦</i>
              <span>{t('home.manifesto.ribbonEnd')}</span>
              <i>✦</i>
            </div>
          ))}
        </div>
      </div>
      <div className="manifesto__layout" ref={details}>
        <div className="manifesto__visual">
          <AmbientVideo
            className="manifesto__image manifesto__film"
            name={t('home.manifesto.filmAlt')}
            caption={t('home.manifesto.filmCaption')}
            poster="videos/manifesto-table-v1-poster.webp"
            mp4="videos/manifesto-table-v1.mp4"
            webm="videos/manifesto-table-v1.webm"
            mobileMp4="videos/manifesto-table-v1-mobile.mp4"
            mobileWebm="videos/manifesto-table-v1-mobile.webm"
          />
          <div className="manifesto__footnote" aria-hidden="true">
            <span>{t('home.manifesto.footnote')}</span>
            <svg viewBox="0 0 180 50" fill="none">
              <path className="manifesto__draw" d="M3 19c45 35 105 24 153-7m-17 0 19-4-5 18" />
            </svg>
            <small>{t('home.manifesto.footnoteAccent')}</small>
          </div>
        </div>
        <div className="manifesto__copy">
          <span>{t('common.nav.manifesto')}</span>
          <h2>
            {t('home.manifesto.title')}
            <br />
            {t('home.manifesto.accent')}
          </h2>
          <p>{t('home.manifesto.description')}</p>
          <div className="manifesto__principles">
            {principles.map((principle, index) => (
              <div className="manifesto__principle" key={principle.title}>
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <path className="manifesto__draw" d={principle.path} />
                </svg>
                <div>
                  <h3>{t(principle.title)}</h3>
                  <p>{t(principle.detail)}</p>
                </div>
                <span aria-hidden="true">0{index + 1}</span>
              </div>
            ))}
          </div>
          <Link className="manifesto__invitation" to="/carta.html">
            {t('home.manifesto.explore')} <EditorialArrow direction="up-right" />
          </Link>
        </div>
      </div>
    </section>
  )
}
