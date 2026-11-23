import { useI18n } from '../../../shared/i18n'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { useRef } from 'react'
import { useEditorialMotion } from '../model/useEditorialMotion'

export function Story() {
  const { t } = useI18n()

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
        <span>{t('home.story.eyebrow')}</span>
        <strong>01 — 04</strong>
      </div>
      <div className="story__title">
        <p>
          {t('home.story.introLead')}
          <br />
          {t('home.story.introEnd')}
        </p>
        <h2 id="story-title">
          {t('home.story.titleLead')}
          <br />
          {t('home.story.titleMiddle')}
          <br />
          <em>{t('home.story.titleAccent')}</em>
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
          <span>{t('home.story.illustration')}</span>
        </div>
        <p>{t('home.story.origin')}</p>
        <p>{t('home.story.today')}</p>
        <div className="story__ritual" aria-label={t('home.story.recipe')}>
          <span>
            01 <b>{t('home.story.cook')}</b>
          </span>
          <i>
            <EditorialArrow direction="up-right" />
          </i>
          <span>
            02 <b>{t('home.services.familyNote')}</b>
          </span>
          <i>
            <EditorialArrow direction="up-right" />
          </i>
          <span>
            03 <b>{t('home.services.weddingNote')}</b>
          </span>
        </div>
      </div>
    </section>
  )
}
