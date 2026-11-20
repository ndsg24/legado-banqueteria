import { ActionButton } from '../../../shared/ui/ActionButton'
import { useEffect, useState } from 'react'
import {
  Button,
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components'
import { FullMenuDialog } from './FullMenuDialog'
import { QuoteStepIcon } from './QuoteStepIcon'
import type { menuGroups } from '../../../entities/quote'
import { CatalogItemPhoto, CategoryMotif } from '../../../entities/menu/ui'
import { fabricColor, type TableDesign } from '../../../entities/table'
import { ServingSurface } from '../../../features/preview-table'
import { useI18n } from '../../../shared/i18n'
import { AlbumArrows } from '../../../shared/ui/AlbumArrows'

type Menu = ReturnType<typeof menuGroups>
const reducedMotion = '(prefers-reduced-motion: reduce)'

// Coordinates within the projected tabletop, ordered from back to front.
const settings = [
  [[50, 50]],
  [
    [29, 41],
    [71, 59],
  ],
  [
    [50, 20],
    [27, 65],
    [73, 65],
  ],
  [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
]

export function MenuTasting({ menu, design }: { menu: Menu; design?: TableDesign | null }) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia(reducedMotion).matches)
  const pages = menu.flatMap((section) =>
    section.groups.flatMap((group) => {
      const count = Math.ceil(group.entries.length / settings.length)
      return Array.from({ length: count }, (_, part) => ({
        section: section.name,
        categoryId: group.categoryId,
        title: group.name ?? section.name,
        part: count > 1 ? ' (' + (part + 1) + '/' + count + ')' : '',
        entries: group.entries.slice(part * settings.length, (part + 1) * settings.length),
      }))
    }),
  )
  const total = pages.length
  const current = index % total
  const page = pages[current]
  const cloth = fabricColor(design?.tablecloth ?? 'forest').hex
  const runner = fabricColor(design?.overlay ?? 'ivory').hex
  useEffect(() => {
    const motion = window.matchMedia(reducedMotion)
    const pauseIfReduced = () => {
      if (motion.matches) setPlaying(false)
    }
    motion.addEventListener('change', pauseIfReduced)
    return () => motion.removeEventListener('change', pauseIfReduced)
  }, [])
  useEffect(() => {
    if (!playing || total < 2) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((previous) => (previous + 1) % total)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [playing, total])
  function show(next: number) {
    setPlaying(false)
    setIndex((next + total) % total)
  }
  return (
    <section className="menu-tasting" aria-labelledby="menu-tasting-title">
      <header className="menu-tasting__header">
        <h3 id="menu-tasting-title">
          <QuoteStepIcon step="menu" />
          {t('quote.tasting.title')}
        </h3>
        <FullMenuDialog menu={menu} onOpen={() => setPlaying(false)} />
      </header>
      <div className="menu-tasting__spread">
        <div className="serving-table" aria-hidden="true">
          <ServingSurface
            key={cloth + runner + design?.overlayStyle}
            cloth={cloth}
            runner={runner}
            overlayStyle={design?.overlayStyle ?? 'runner'}
          >
            <div
              className="serving-table__places"
              key={current}
              data-count={page.entries.length}
              data-course={page.categoryId}
            >
              {page.entries.map(({ item, sauce }, i) => {
                const [left, top] = settings[page.entries.length - 1][i]
                return (
                  <div
                    key={item.id}
                    className="serving-table__place"
                    data-standing={
                      item.imageBounds.height > item.imageBounds.width * 1.15 || undefined
                    }
                    style={{ left: left + '%', top: top + '%' }}
                  >
                    <span className="serving-table__dish">
                      <CatalogItemPhoto item={item} alt="" sizes="(max-width: 600px) 21vw, 170px" />
                    </span>
                    {sauce && (
                      <span className="serving-table__sauce">
                        <CatalogItemPhoto item={sauce.item} alt="" sizes="44px" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </ServingSurface>
        </div>
        <div
          className="menu-tasting__card"
          aria-live={playing ? 'off' : 'polite'}
          aria-atomic="true"
        >
          {total > 1 ? (
            <Select
              aria-label={t('quote.tasting.course')}
              value={current}
              onOpenChange={(open) => {
                if (open) setPlaying(false)
              }}
              onChange={(key) => {
                if (key != null) show(Number(key))
              }}
            >
              <h4>
                <Button className="menu-tasting__field menu-tasting__choose">
                  <CategoryMotif categoryId={page.categoryId} />
                  <SelectValue>
                    {page.title}
                    {page.part}
                  </SelectValue>
                  <svg className="quote-commune-chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
              </h4>
              <Popover className="tasting-picker" placement="bottom end" offset={6}>
                <ListBox aria-label={t('quote.tasting.course')}>
                  {menu.map((section) => (
                    <ListBoxSection key={section.name}>
                      <Header>{section.name}</Header>
                      {pages.map(
                        (option, i) =>
                          option.section === section.name && (
                            <ListBoxItem key={i} id={i} textValue={option.title + option.part}>
                              <CategoryMotif categoryId={option.categoryId} />
                              {option.title}
                              {option.part}
                            </ListBoxItem>
                          ),
                      )}
                    </ListBoxSection>
                  ))}
                </ListBox>
              </Popover>
            </Select>
          ) : (
            <h4>
              {page.title}
              {page.part}
            </h4>
          )}
          {page.section !== page.title && <p>{page.section}</p>}
          <ol>
            {page.entries.map(({ item, name, quantity, sauce, omissions }) => (
              <li key={item.id}>
                <span className="quote-summary__photo" aria-hidden="true">
                  <CatalogItemPhoto item={item} alt="" sizes="48px" />
                </span>
                <span>
                  {name}
                  {sauce && (
                    <small className="quote-review__sauce">
                      <span className="quote-summary__photo">
                        <CatalogItemPhoto item={sauce.item} alt="" sizes="28px" />
                      </span>
                      {sauce.name}
                    </small>
                  )}
                  {omissions && <small>{omissions}</small>}
                </span>
                {quantity && <strong>{quantity}</strong>}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {total > 1 && (
        <div className="menu-tasting__controls">
          <ActionButton
            type="button"
            variant="secondary"
            className="menu-tasting__play"
            aria-label={t(playing ? 'home.hero.pause' : 'home.hero.play')}
            onPress={() => setPlaying(!playing)}
          >
            <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
            <span className="menu-tasting__play-label">
              {t(playing ? 'home.hero.pause' : 'home.hero.play')}
            </span>
          </ActionButton>
          <div className="menu-tasting__progress">
            <span className="menu-tasting__track" aria-hidden="true">
              <span style={{ width: ((current + 1) / total) * 100 + '%' }} />
            </span>
            <span>
              {current + 1} / {total}
            </span>
          </div>
          <AlbumArrows
            className="menu-tasting__arrows"
            label={t('quote.tasting.course')}
            previous={t('quote.tasting.previous')}
            next={t('quote.tasting.next')}
            onTurn={(direction) => show(current + direction)}
          />
        </div>
      )}
    </section>
  )
}
