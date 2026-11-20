import { FabricSample, PlateSample, FloralSample } from '../../../entities/table/ui'
import type { settingEntries } from '../../../entities/quote'
import { fabricColor, floralStyles, flowerPalette, type TableDesign } from '../../../entities/table'

type Part = ReturnType<typeof settingEntries>[number]['key']

function photo(path: string) {
  return (
    <img
      src={import.meta.env.BASE_URL + 'images/' + path + '.webp'}
      alt=""
      width="48"
      height="48"
      loading="lazy"
    />
  )
}

export function SettingSample({ part, design }: { part: Part; design: TableDesign }) {
  switch (part) {
    case 'dinnerware':
      return <PlateSample plate={design.dinnerware} />
    case 'napkinFold':
      return photo('napkins/' + design.napkinFold)
    case 'floral': {
      const preview = floralStyles.find((style) => style.id === design.floral)?.preview
      return preview ? photo('centerpieces/' + preview) : <FloralSample floral={design.floral} />
    }
    case 'flowerKind':
      return photo('centerpieces/flower-' + design.flowerKind)
    case 'bottleOutfit':
      return (
        <>
          {photo('centerpieces/manta')}
          {photo('centerpieces/huasa')}
        </>
      )
    case 'flowerColor':
      return (
        <i
          className="quote-review__petal"
          style={{ backgroundColor: flowerPalette[design.flowerColor].hex }}
        />
      )
    default:
      return <FabricSample texture={design.textures[part]} color={fabricColor(design[part]).hex} />
  }
}
