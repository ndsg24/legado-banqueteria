import { FabricSample, PlateSample, FloralSample } from './SettingSamples'
import type { settingEntries } from '@legado/domain/quote/review'
import { fabricColor, floralStyles, flowerPalette } from '@legado/domain/table/options'
import type { TableDesign } from '@legado/domain/table/types'

export type SettingPart = ReturnType<typeof settingEntries>[number]['key']

type Props = {
  part: SettingPart
  design: TableDesign
  imageUrl: (path: string) => string
}

export function SettingSample({ part, design, imageUrl }: Props) {
  function photo(path: string) {
    return (
      <img src={imageUrl(path)} alt="" width="48" height="48" loading="lazy" decoding="async" />
    )
  }
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
