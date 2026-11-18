import { EditorialArrow } from '../ui/EditorialArrow'
import { useRef } from 'react'
import { useCatalogIntro } from '../../hooks/useCatalogIntro'
import { useCatalog } from '../../hooks/useCatalog'
import { CatalogProductGrid } from './CatalogProductGrid'
import { CatalogCategoryPicker } from './CatalogCategoryPicker'

export function CatalogExperience() {
  const catalog = useCatalog()
  const headerRef = useRef<HTMLElement>(null)
  useCatalogIntro(headerRef)

  return (
    <section className="catalog" id="carta" aria-labelledby="catalog-title">
      <header className="catalog__header" ref={headerRef}>
        <div className="catalog__eyebrow" data-intro-meta>
          <span>La carta de Legado</span>
          <span>De la bienvenida al último brindis</span>
        </div>
        <div className="catalog__introduction"><div>
        <h1 id="catalog-title">
          <span className="catalog__title-line"><span data-title-line>El sabor de</span></span>
          <span className="catalog__title-line"><span data-title-line><em>cada momento.</em></span></span>
        </h1>
        <p data-intro-copy>
          Pequeños bocados, una gran mesa y todo lo que sucede entre ambos.
          Explora nuestra cocina y empieza a imaginar tu celebración.
        </p>
        </div><a className="catalog__studio-invite" href={`${import.meta.env.BASE_URL}ambientacion.html`}>
          <span>Del sabor a la atmósfera <i aria-hidden="true"><EditorialArrow direction="up-right" /></i></span>
          <strong>La mesa también<br /><em>se diseña.</em></strong>
          <small>Explora colores, telas y flores para tu celebración.</small>
          <span className="catalog__studio-swatches" aria-hidden="true"><i /><i /><i /><i /></span>
          <b>Diseña tu mesa <EditorialArrow direction="up-right" /></b>
        </a></div>
      </header>

      <div className="catalog__collections" role="group" aria-label="Elige una carta">
        <button
          type="button"
          aria-pressed={catalog.collection === 'cocktail'}
          onClick={() => catalog.changeCollection('cocktail')}
        >
          <small>01 / Para compartir</small>
          <span>Cóctel <em>& bocados</em></span>
          <i aria-hidden="true"><EditorialArrow direction="up-right" /></i>
        </button>
        <button
          type="button"
          aria-pressed={catalog.collection === 'banquet'}
          onClick={() => catalog.changeCollection('banquet')}
        >
          <small>02 / Para sentarse a la mesa</small>
          <span>Menú <em>& celebración</em></span>
          <i aria-hidden="true"><EditorialArrow direction="up-right" /></i>
        </button>
        <button
          type="button"
          aria-pressed={catalog.collection === 'drinks'}
          onClick={() => catalog.changeCollection('drinks')}
        >
          <small>03 / Para brindar</small>
          <span>Bebestibles <em>& bar</em></span>
          <i aria-hidden="true"><EditorialArrow direction="up-right" /></i>
        </button>
      </div>

      <div className="catalog__explorer">
        <CatalogCategoryPicker
          categories={catalog.categories}
          activeId={catalog.activeCategory.id}
          onSelect={catalog.setCategoryId}
        />
        <div id="catalog-dishes" className="catalog__dishes" aria-labelledby="catalog-category-title">
          <div className="catalog__category-heading">
            <h2 id="catalog-category-title">{catalog.activeCategory.label}<em>.</em></h2>
          </div>
          <CatalogProductGrid items={catalog.activeCategory.items} />
        </div>
      </div>

      <p className="catalog__note">
        Imágenes referenciales. La presentación puede variar según el evento y servicio contratado.
        Frutas sujetas a temporada. Consulta por alternativas vegetarianas, veganas, sin gluten
        y requerimientos alimentarios especiales.
      </p>
    </section>
  )
}
