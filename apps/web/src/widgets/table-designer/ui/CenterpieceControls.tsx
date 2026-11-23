import { FloralSample } from '../../../entities/table/ui'
import { useI18n } from '../../../shared/i18n'
import { useId } from 'react'
import {
  floralStyles,
  flowerKindLabels,
  flowerPalette,
  hasBlooms,
  outfitLabels,
  bottleOutfits,
  flowerColors,
  flowerKinds,
  type FloralOptions,
  type FloralStyle,
} from '../../../entities/table'

type Decoration = FloralOptions & { floral: FloralStyle }

function Sample({ id }: { id: string }) {
  return (
    <img
      className="centerpiece-sample"
      width="64"
      height="58"
      alt=""
      src={`${import.meta.env.BASE_URL}images/centerpieces/${id}.webp`}
    />
  )
}

export function CenterpieceControls({
  design,
  onChange,
}: {
  design: Decoration
  onChange: (patch: Partial<Decoration>) => void
}) {
  const { t } = useI18n()

  const group = useId()
  const styleLabel = floralStyles.find((style) => style.id === design.floral)?.label
  return (
    <div className="centerpiece-controls">
      <details name={group}>
        <summary>
          {t('table.flowers.centerpiece')} <small>{styleLabel && t(styleLabel)}</small>
        </summary>
        <div role="group" aria-label={t('table.flowers.centerpieces')}>
          <div className="table-studio__flowers">
            {floralStyles.map((style) => (
              <button
                type="button"
                key={style.id}
                aria-pressed={design.floral === style.id}
                onClick={() =>
                  onChange({
                    floral: style.id,
                    bottleOutfit:
                      style.id === 'ribbonBottle' && design.bottleOutfit === 'none'
                        ? 'pair'
                        : design.bottleOutfit,
                  })
                }
              >
                {style.preview ? <Sample id={style.preview} /> : <FloralSample floral={style.id} />}
                {t(style.label)}
              </button>
            ))}
          </div>
        </div>
      </details>
      {hasBlooms(design.floral) && (
        <details name={group}>
          <summary>
            {t('table.flowers.flowersAndColor')}{' '}
            <small>
              {[
                design.flowerKind !== 'original' && t(flowerKindLabels[design.flowerKind]),
                design.flowerColor !== 'original' && t(flowerPalette[design.flowerColor].label),
              ]
                .filter(Boolean)
                .join(' · ') || t('table.flowers.original')}
            </small>
          </summary>
          <fieldset className="table-studio__folds table-studio__flower-picker">
            <legend>{t('table.flowers.kind')}</legend>
            <div>
              {flowerKinds.map((id) => (
                <button
                  type="button"
                  key={id}
                  aria-pressed={design.flowerKind === id}
                  onClick={() => onChange({ flowerKind: id })}
                >
                  <Sample
                    id={
                      id === 'original'
                        ? design.floral === 'ribbonBottle'
                          ? 'burgundy'
                          : design.floral
                        : `flower-${id}`
                    }
                  />
                  <span>{t(flowerKindLabels[id])}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('table.flowers.flowerColors')}</legend>
            <div className="table-studio__petal-colors">
              {flowerColors.map((id) => (
                <button
                  type="button"
                  key={id}
                  aria-pressed={design.flowerColor === id}
                  onClick={() => onChange({ flowerColor: id })}
                >
                  <i
                    aria-hidden="true"
                    style={{
                      background:
                        flowerPalette[id].hex ??
                        'conic-gradient(#f0c254, #b55b82, #ece2d9, #f0c254)',
                    }}
                  />
                  {t(flowerPalette[id].label)}
                </button>
              ))}
            </div>
          </fieldset>
        </details>
      )}
      <details name={group}>
        <summary>
          {t('table.flowers.wine')} <small>{t(outfitLabels[design.bottleOutfit])}</small>
        </summary>
        <div
          role="group"
          aria-label={t('table.flowers.wine')}
          className="table-studio__flowers table-studio__outfits"
        >
          {bottleOutfits.map((id) => (
            <button
              type="button"
              key={id}
              aria-pressed={design.bottleOutfit === id}
              onClick={() =>
                onChange({
                  bottleOutfit: id,
                  floral:
                    id === 'none' && design.floral === 'ribbonBottle' ? 'burgundy' : design.floral,
                })
              }
            >
              {id === 'pair' && (
                <span className="table-studio__bottle-pair">
                  <Sample id="manta" />
                  <Sample id="huasa" />
                </span>
              )}
              {t(outfitLabels[id])}
            </button>
          ))}
        </div>
      </details>
    </div>
  )
}
