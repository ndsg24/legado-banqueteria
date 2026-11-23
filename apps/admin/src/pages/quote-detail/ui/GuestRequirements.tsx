import { useI18n } from '@legado/brand/i18n'
import type { QuoteRequest } from '@legado/domain/quote/request'
import { dietaryMenuGroups } from '@legado/domain/quote/review'
import { quoteStatusCopy } from '../../../entities/quotes'
import { dossierCopy } from '../model/copy'

export function GuestRequirements({ quote }: { quote: QuoteRequest }) {
  const { t, language } = useI18n()
  const groups = dietaryMenuGroups(quote, t)
  const copy = dossierCopy[language]
  return (
    <section id="event-requirements" className="admin-surface dossier-diet">
      <h2>{t('quote.review.dietaryNeeds')}</h2>
      {groups.map((group) => (
        <div key={group.name}>
          <h3>{group.name}</h3>
          <dl>
            {group.entries.map((item) => (
              <div key={item.id}>
                <dt>{item.name}</dt>
                <dd>{item.quantity || t('quote.review.unspecified')}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      {quote.dietaryNeeds && <p>{quote.dietaryNeeds}</p>}
      {!groups.length && !quote.dietaryNeeds && (
        <p className="dossier-empty">{copy.noRequirements}</p>
      )}
      <h3 className="dossier-notes-heading">{quoteStatusCopy[language].notes}</h3>
      <p className={quote.notes ? undefined : 'dossier-empty'}>{quote.notes || copy.noNotes}</p>
    </section>
  )
}
