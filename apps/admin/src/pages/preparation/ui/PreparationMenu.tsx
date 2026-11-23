import { useI18n } from '@legado/brand/i18n'
import { CategoryMotif } from '@legado/brand/catalog'
import type { preparationPlan } from '@legado/domain/operations/preparation'
import type { QuoteRequest } from '@legado/domain/quote/request'
import { menuGroups } from '@legado/domain/quote/review'
import { catalogPhoto } from '../../../shared/config/catalog-photo'
import { operations } from '../../../shared/config/operations'
import { PreparationProduct } from './PreparationProduct'

type Props = { quote: QuoteRequest; dishes: ReturnType<typeof preparationPlan>['dishes'] }

export function PreparationMenu({ quote, dishes }: Props) {
  const { language, locale, t } = useI18n()
  const copy = operations[language]
  const number = new Intl.NumberFormat(locale)
  const portions = new Map(dishes.map((dish) => [dish.id, dish]))
  const courses = menuGroups(quote, t).flatMap((service) =>
    service.id === 'banquet'
      ? service.groups.map((group) => ({
          id: group.categoryId,
          motif: group.categoryId,
          name: group.name ?? service.name,
          entries: group.entries,
        }))
      : [
          {
            id: service.id,
            motif: service.motif,
            name: service.name,
            entries: service.groups.flatMap((group) => group.entries),
          },
        ],
  )

  return (
    <section className="admin-surface op-panel prep-portions">
      <h2>{copy.portions}</h2>
      {courses.length ? (
        <>
          <p>{copy.confirmedPortions}</p>
          <div className="prep-courses">
            {courses.map(({ id, motif, name, entries }) => {
              const planned = entries.flatMap((entry) => {
                const dish = portions.get(entry.item.id)
                return dish ? [{ ...entry, dish }] : []
              })
              const categories = [...new Set(planned.map(({ dish }) => dish.category))]
              return (
                <section
                  className="prep-course"
                  data-layout={
                    planned.length > 2 ? 'wide' : planned.length === 2 ? 'pair' : undefined
                  }
                  key={id}
                >
                  <h3>
                    <CategoryMotif categoryId={motif} />
                    {name}
                  </h3>
                  <div className="prep-course-groups">
                    {categories.map((category) => (
                      <div className="prep-course-group" key={category}>
                        {categories.length > 1 && <h4>{t(category)}</h4>}
                        <ul role="list">
                          {planned
                            .filter(({ dish }) => dish.category === category)
                            .map(({ item, name, sauce, omissions, dish }) => {
                              const details = [sauce?.name, omissions, dish.pending && copy.pending]
                              return (
                                <li key={item.id}>
                                  <PreparationProduct
                                    name={name}
                                    photo={catalogPhoto(item.imageThumbnail)}
                                    details={details.filter(Boolean).join(' · ')}
                                  >
                                    <span className="prep-portion-count">
                                      <b>{number.format(dish.servings)}</b> {copy.servings}
                                    </span>
                                  </PreparationProduct>
                                </li>
                              )
                            })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </>
      ) : (
        <p>{copy.noItems}</p>
      )}
    </section>
  )
}
