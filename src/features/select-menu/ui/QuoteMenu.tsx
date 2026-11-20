import { SelectionCategory } from './SelectionCategory'
import { useRef, useState } from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import {
  quoteMenuServices,
  courseChoiceCounts,
  courseLimitReached,
  selectedSauce,
  type Quantities,
  type CatalogCategory,
  type CatalogItem,
} from '../../../entities/menu'
import { CatalogItemPhoto, CategoryMotif } from '../../../entities/menu/ui'
import { DishIngredients } from './DishIngredients'
import { QuoteDish } from './QuoteDish'
import type { SaucePickerProps } from './MainSaucePicker'

type ServiceId = (typeof quoteMenuServices)[number]['id']
type Props = SaucePickerProps & {
  selected: Quantities
  onQuantityChange: (id: string, quantity: number, sauceId?: string) => void
}

export function QuoteMenu({ selected, onQuantityChange, ...saucePicker }: Props) {
  const { t } = useI18n()
  const menu = useRef<HTMLDivElement>(null)
  const counts = courseChoiceCounts(selected)
  const overLimit = counts.filter(({ count, max }) => count > max)
  const [serviceId, setServiceId] = useState<ServiceId>(overLimit.length ? 'banquet' : 'cocktail')
  const service = quoteMenuServices.find(({ id }) => id === serviceId)!
  const categories = service.groups.flatMap((group) => group.categories)
  const [detailId, setDetailId] = useState<string | null>(null)
  const dishes = detailId
    ? categories.flatMap((category) => category.items.map((item) => ({ item, category })))
    : []
  const index = dishes.findIndex(({ item }) => item.id === detailId)
  const detail = dishes[index]
  const isBanquet = serviceId === 'banquet'
  const [courseId, setCourseId] = useState(() => {
    const courses = quoteMenuServices.find((option) => option.id === 'banquet')!.groups
    const needsReview = courses.find((group) =>
      group.categories.some((category) =>
        overLimit.some((limit) => limit.category.id === category.id),
      ),
    )
    return (needsReview ?? courses[0]).categories[0].id
  })

  const courses = isBanquet
    ? service.groups.map((group) => {
        const items = group.categories.flatMap((category) => category.items)
        const chosen = items.filter((item) => selected[item.id] > 0)
        return {
          ...group,
          id: group.categories[0].id,
          photo: chosen[0] ?? items[0],
          count: chosen.length,
          summary: chosen.map((item) => t(item.name)).join(' · '),
          options: items.length,
        }
      })
    : []

  function cards(category: CatalogCategory, items: readonly CatalogItem[] = category.items) {
    return items.map((item) => (
      <QuoteDish
        key={item.id}
        item={item}
        category={category}
        onDetails={setDetailId}
        quantity={selected[item.id] ?? 0}
        atLimit={courseLimitReached(item.id, counts)}
        onQuantityChange={onQuantityChange}
        currentSauce={selectedSauce(item.id, saucePicker.sauces)}
        onSauceChange={saucePicker.onSauceChange}
      />
    ))
  }

  return (
    <div className="quote-menu" ref={menu}>
      {detail && (
        <DishIngredients
          {...detail}
          currentSauceId={saucePicker.sauces[detail.item.id]}
          quantity={selected[detail.item.id] ?? 0}
          atLimit={!selected[detail.item.id] && courseLimitReached(detail.item.id, counts)}
          onTurn={(direction) =>
            setDetailId(dishes[(index + direction + dishes.length) % dishes.length].item.id)
          }
          onSave={(count, sauceId) => onQuantityChange(detail.item.id, count, sauceId)}
          onClose={() => setDetailId(null)}
        />
      )}
      <div className="quote-menu__index">
        <div
          className="quote-menu__services"
          role="group"
          aria-label={t('quote.selection.explore')}
        >
          {quoteMenuServices.map((option) => {
            const label = t(option.id === 'banquet' ? 'catalog.collections.menu' : option.label)
            const chosenCount = option.groups
              .flatMap((group) => group.categories)
              .flatMap((category) => category.items)
              .filter((item) => selected[item.id] > 0).length
            return (
              <SelectionCategory
                key={option.id}
                label={label}
                count={chosenCount}
                active={option.id === serviceId}
                icon={<CategoryMotif categoryId={option.motif} />}
                onSelect={() => {
                  if (option.id === serviceId) return
                  setServiceId(option.id)
                  if (menu.current && menu.current.getBoundingClientRect().top < 0)
                    menu.current.scrollIntoView({ block: 'start' })
                }}
              />
            )
          })}
        </div>
      </div>
      <div className="quote-menu__items">
        {overLimit.length > 0 && (
          <p className="quote-error" role="alert">
            {t('quote.validation.courseLimit', {
              categories: overLimit
                .map(({ category }) =>
                  t(
                    category.id === 'aperitivos'
                      ? 'quote.selection.aperitifDrinks'
                      : category.label,
                  ),
                )
                .join(', '),
            })}
          </p>
        )}
        {isBanquet ? (
          <Tabs
            className="quote-menu__courses"
            selectedKey={courseId}
            onSelectionChange={(key) => setCourseId(String(key))}
          >
            <TabList className="quote-menu__course-list" aria-label={t(service.label)}>
              {courses.map((course) => (
                <Tab
                  key={course.id}
                  id={course.id}
                  className="quote-menu__course-tab"
                  aria-label={t(course.label)}
                  aria-description={
                    course.summary || t('quote.selection.courseOptions', { count: course.options })
                  }
                >
                  <span className="quote-menu__course-photo">
                    <CatalogItemPhoto item={course.photo} alt="" sizes="44px" />
                  </span>
                  <span className="quote-menu__course-title">{t(course.label)}</span>
                  {course.count > 0 && <small aria-hidden="true">{course.count}</small>}
                </Tab>
              ))}
            </TabList>
            {courses.map((group) => (
              <TabPanel key={group.id} id={group.id} className="quote-menu__course-panel">
                {group.categories.map((category) => {
                  const limit = counts.find(({ category: limited }) => limited.id === category.id)
                  const aperitif = category.id === 'aperitivos'
                  return (
                    <section
                      className="quote-menu__course-items"
                      key={category.id}
                      aria-label={t(category.label)}
                    >
                      {(limit || group.categories.length > 1) && (
                        <header>
                          <h4>{t(aperitif ? 'quote.selection.aperitifDrinks' : category.label)}</h4>
                          {limit && (
                            <span role="status">
                              {t('quote.selection.courseCount', {
                                count: limit.count,
                                max: limit.max,
                              })}
                            </span>
                          )}
                        </header>
                      )}
                      <div className="quote-menu__grid">
                        {cards(
                          category,
                          aperitif
                            ? category.items.filter((item) => !item.refreshment)
                            : category.items,
                        )}
                      </div>
                      {aperitif && (
                        <>
                          <header className="quote-menu__refreshments">
                            <h4>{t('quote.selection.refreshments')}</h4>
                          </header>
                          <div className="quote-menu__grid">
                            {cards(
                              category,
                              category.items.filter((item) => item.refreshment),
                            )}
                          </div>
                        </>
                      )}
                    </section>
                  )
                })}
              </TabPanel>
            ))}
          </Tabs>
        ) : (
          <div className="quote-menu__grid">
            {categories.flatMap((category) => cards(category))}
          </div>
        )}
      </div>
    </div>
  )
}
