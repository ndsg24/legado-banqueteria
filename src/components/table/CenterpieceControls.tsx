import { useId } from 'react'
import {
  floralStyles,
  flowerKindLabels,
  flowerPalette,
  hasBlooms,
  outfitLabels,
} from '../../config/table'
import { bottleOutfits, flowerColors, flowerKinds } from '../../types/table'
import type { FloralOptions, FloralStyle } from '../../types/table'

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
  const group = useId()
  const styleLabel = floralStyles.find((style) => style.id === design.floral)?.label
  return (
    <div className="centerpiece-controls">
      <details name={group}>
        <summary>
          Centro de mesa <small>{styleLabel}</small>
        </summary>
        <div role="group" aria-label="Centros de mesa">
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
                {style.preview ? (
                  <Sample id={style.preview} />
                ) : (
                  <i className={`floral-sample floral-sample--${style.id}`} aria-hidden="true">
                    {style.id === 'none' ? '—' : '✿'}
                  </i>
                )}
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </details>
      {hasBlooms(design.floral) && (
        <details name={group}>
          <summary>
            Flores y color{' '}
            <small>
              {[
                design.flowerKind !== 'original' && flowerKindLabels[design.flowerKind],
                design.flowerColor !== 'original' && flowerPalette[design.flowerColor].label,
              ]
                .filter(Boolean)
                .join(' · ') || 'Del arreglo'}
            </small>
          </summary>
          <fieldset className="table-studio__folds table-studio__flower-picker">
            <legend>Tipo de flor</legend>
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
                  <span>{flowerKindLabels[id]}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Color de las flores</legend>
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
                  {flowerPalette[id].label}
                </button>
              ))}
            </div>
          </fieldset>
        </details>
      )}
      <details name={group}>
        <summary>
          Vino de Fiestas Patrias <small>{outfitLabels[design.bottleOutfit]}</small>
        </summary>
        <div
          role="group"
          aria-label="Vino de Fiestas Patrias"
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
              {outfitLabels[id]}
            </button>
          ))}
        </div>
      </details>
    </div>
  )
}
