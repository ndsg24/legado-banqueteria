import { useI18n } from '@legado/brand/i18n'
import type { QuoteRequest } from '@legado/domain/quote/request'
import { menuGroups } from '@legado/domain/quote/review'
import { quoteStatusCopy } from '../../../entities/quotes'
import { catalogPhoto } from '../../../shared/config/catalog-photo'
import { dossierCopy } from '../model/copy'

export function RequestedMenu({ quote }: { quote: QuoteRequest }) {
  const { t, language, locale } = useI18n()
  const sections = menuGroups(quote, t)
  const copy = dossierCopy[language]
  return (
    <section id="event-menu" className="admin-surface dossier-menu">
      <h2>{quoteStatusCopy[language].menu}</h2>
      {!sections.length && <p className="dossier-empty">{copy.noMenu}</p>}
      {sections.map((section) => (
        <section key={section.motif} className="service-course">
          <h3>{section.name}</h3>
          <div className="course-groups">
            {section.groups.map((group) => (
              <div key={group.categoryId}>
                {group.name && <h4>{group.name}</h4>}
                <ul>
                  {group.entries.map(({ item, name, sauce, omissions, quantity }) => {
                    const photo = catalogPhoto(item.imageThumbnail)
                    return (
                      <li key={item.id}>
                        {photo && (
                          <img
                            src={photo}
                            alt=""
                            width="44"
                            height="44"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <div className="menu-entry-copy">
                          <span>{name}</span>
                          {sauce && <small>{sauce.name}</small>}
                          {omissions && <small>{omissions}</small>}
                        </div>
                        {quantity && (
                          <small className="menu-quantity">
                            {quote.items[item.id].toLocaleString(locale)} {copy.perGuest}
                          </small>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}
