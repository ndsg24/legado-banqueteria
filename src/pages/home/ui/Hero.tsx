import { useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
import { HeroSignature } from './HeroSignature'
import { HeroFoodShowcase } from './HeroFoodShowcase'
import { useRef } from 'react'
import { useHeroExperience } from '../model/useHeroExperience'
import { siteConfig } from '../../../shared/config/site'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

export function Hero() {
  const { t } = useI18n()

  const root = useRef<HTMLElement>(null)
  useHeroExperience(root)
  return (
    <section
      id="inicio"
      className="hero hero--living site-texture"
      ref={root}
      aria-labelledby="hero-title"
    >
      <div className="hero__meta">
        <p>{t('common.nav.brandTagline')}</p>
        <p>{siteConfig.location}</p>
        <p>{t('home.hero.tagline')}</p>
      </div>
      <div className="living-hero__layout">
        <div className="living-hero__content">
          <p className="living-hero__eyebrow">
            <span aria-hidden="true" />
            {t('home.hero.eyebrow')}
          </p>
          <h1 id="hero-title">
            <span className="living-hero__line">
              <span>{t('home.hero.titleLead')}</span>
            </span>
            <span className="living-hero__line">
              <span>{t('home.hero.titleMiddle')}</span>
            </span>
            <span className="living-hero__line living-hero__line--serif">
              <span>
                <em>{t('home.hero.titleAccent')}</em>
              </span>
            </span>
          </h1>
          <p className="living-hero__description">
            {t('home.hero.descriptionLead')}
            <br />
            {t('home.hero.descriptionEnd')}
          </p>
          <div className="living-hero__actions">
            <Link to="#contacto">
              {t('home.hero.contact')} <EditorialArrow direction="up-right" />
            </Link>
            <Link to="/carta.html">
              {t('home.hero.menu')} <EditorialArrow direction="up-right" />
            </Link>
          </div>
        </div>
        <HeroFoodShowcase />
      </div>
      <HeroSignature />
      <Link className="hero__scroll" to="#historia" aria-label={t('home.hero.scrollLabel')}>
        <span>{t('home.hero.scrollHint')}</span>
        <i aria-hidden="true">
          <b />
        </i>
        <span className="hero__scroll-cue" aria-hidden="true">
          <EditorialArrow direction="down" />
        </span>
      </Link>
    </section>
  )
}
