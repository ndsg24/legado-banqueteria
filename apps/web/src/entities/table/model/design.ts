import {
  migrateBottleOutfit,
  fabricColors,
  tablePresets,
  fabricTextures,
  floralStyles,
  defaultTextures,
  isDinnerware,
  defaultLayout,
  maxHeadSeats,
  maxRoundTables,
} from '@legado/domain/table/options'
import {
  flowerKinds,
  flowerColors,
  bottleOutfits,
  overlayStyles,
  napkinFolds,
  tableParts,
  type TableDesign,
  type TablePart,
} from '@legado/domain/table/types'

export const tableStorageKey = 'legado-table-design-v1'
export function readTableDesign(query = new URLSearchParams()): TableDesign {
  let saved: Partial<TableDesign> = {}
  try {
    saved = JSON.parse(localStorage.getItem(tableStorageKey) ?? '{}') ?? {}
  } catch {
    /* A fresh design remains available when storage is blocked. */
  }
  return parseTableDesign(query, saved)
}

export function parseTableDesign(
  query = new URLSearchParams(),
  saved: Partial<TableDesign> = {},
): TableDesign {
  const colors = Object.fromEntries(
    tableParts.map((part) => {
      const candidate = query.get(part) ?? saved[part]
      return [
        part,
        fabricColors.some((color) => color.id === candidate)
          ? candidate
          : tablePresets[0].design[part],
      ]
    }),
  ) as Record<TablePart, string>
  const dinnerware =
    query.get('dinnerware') ?? (query.has('tablecloth') ? 'goldRim' : saved.dinnerware)
  const overlayChoice =
    query.get('overlayStyle') ?? (query.has('tablecloth') ? undefined : saved.overlayStyle)
  const overlayStyle = overlayStyles.find((id) => id === overlayChoice) ?? 'traditional'
  const fold = query.get('napkinFold') ?? (query.has('tablecloth') ? 'flat' : saved.napkinFold)
  const napkinFold = napkinFolds.find((id) => id === fold) ?? 'flat'
  const chairs = Number(query.get('chairs') ?? saved.chairs ?? 6)
  // A shared design predating the floor plan represents a single round table.
  const layout = query.has('tablecloth') ? defaultLayout : saved
  const rounds = Number(query.get('roundTables') ?? layout.roundTables ?? defaultLayout.roundTables)
  const head = Number(query.get('headSeats') ?? layout.headSeats ?? defaultLayout.headSeats)
  const headSeats = Number.isInteger(head) && head >= 2 && head <= maxHeadSeats ? head : 0
  const roundTables =
    Number.isInteger(rounds) && rounds >= (headSeats ? 0 : 1) && rounds <= maxRoundTables
      ? rounds
      : 1
  const counts = query.has('roundSeats')
    ? query.get('roundSeats')!.split(',').map(Number)
    : query.has('tablecloth') || query.has('roundTables') || query.has('chairs')
      ? undefined
      : saved.roundSeats
  const roundSeats =
    Array.isArray(counts) &&
    counts.length === roundTables &&
    counts.every((n) => Number.isInteger(n) && n >= 6 && n <= 10)
      ? counts
      : undefined
  const floral = query.get('floral') ?? saved.floral
  const decoration = query.has('tablecloth') || query.has('floral') ? {} : saved
  const flowerKind =
    flowerKinds.find((id) => id === (query.get('flowerKind') ?? decoration.flowerKind)) ??
    'original'
  const flowerColor =
    flowerColors.find((id) => id === (query.get('flowerColor') ?? decoration.flowerColor)) ??
    'original'
  const bottleChoice = migrateBottleOutfit(
    query.get('bottleOutfit') ?? decoration.bottleOutfit,
    floral,
  )
  const bottleOutfit = bottleOutfits.find((id) => id === bottleChoice) ?? 'none'
  const textures = Object.fromEntries(
    tableParts.map((part) => {
      const candidate = query.get(`${part}Texture`) ?? saved.textures?.[part]
      return [
        part,
        fabricTextures.some((texture) => texture.id === candidate)
          ? candidate
          : defaultTextures[part],
      ]
    }),
  ) as TableDesign['textures']
  return {
    ...colors,
    overlayStyle,
    flowerKind,
    flowerColor,
    bottleOutfit,
    napkinFold,
    roundTables,
    headSeats,
    roundSeats,
    dinnerware: isDinnerware(dinnerware) ? dinnerware : 'goldRim',
    chairs: Number.isInteger(chairs) && chairs >= 6 && chairs <= 10 ? chairs : 6,
    floral: floralStyles.some((style) => style.id === floral)
      ? (floral as TableDesign['floral'])
      : 'white',
    textures,
  }
}
export function tableDesignUrl(design: TableDesign, page = window.location.href): string {
  const url = new URL(page, window.location.href)
  tableParts.forEach((part) => url.searchParams.set(part, design[part]))
  url.searchParams.set('roundTables', String(design.roundTables))
  if (design.roundSeats) url.searchParams.set('roundSeats', design.roundSeats.join(','))
  else url.searchParams.delete('roundSeats')
  url.searchParams.set('headSeats', String(design.headSeats))
  url.searchParams.set('chairs', String(design.chairs))
  url.searchParams.set('napkinFold', design.napkinFold)
  url.searchParams.set('dinnerware', design.dinnerware)
  url.searchParams.set('overlayStyle', design.overlayStyle)
  url.searchParams.set('floral', design.floral)
  url.searchParams.set('flowerKind', design.flowerKind)
  url.searchParams.set('flowerColor', design.flowerColor)
  url.searchParams.set('bottleOutfit', design.bottleOutfit)
  tableParts.forEach((part) => url.searchParams.set(`${part}Texture`, design.textures[part]))
  return url.href
}
