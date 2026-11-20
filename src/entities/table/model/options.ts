import { spanish, type MessageKey, type Translate } from '../../../shared/i18n'
import type {
  FloralOptions,
  OverlayStyle,
  NapkinFold,
  Dinnerware,
  FabricColor,
  TableDesign,
  TablePart,
  FabricTexture,
  FloralStyle,
} from './types'

export const fabricColors: readonly FabricColor[] = [
  { id: 'ivory', label: 'table.colors.ivory', hex: '#e8dfcd' },
  { id: 'white', label: 'table.colors.white', hex: '#f4f1e9' },
  { id: 'sand', label: 'table.colors.sand', hex: '#bca789' },
  { id: 'sage', label: 'table.colors.sage', hex: '#82917b' },
  { id: 'forest', label: 'table.colors.forest', hex: '#304a3b' },
  { id: 'rose', label: 'table.colors.dustyRose', hex: '#b28383' },
  { id: 'wine', label: 'table.colors.burgundy', hex: '#682e3d' },
  { id: 'navy', label: 'table.colors.midnightBlue', hex: '#29384b' },
  { id: 'gold', label: 'table.colors.champagne', hex: '#b5955c' },
  { id: 'charcoal', label: 'table.colors.graphite', hex: '#333639' },
]
export const tablePartLabels: Record<TablePart, MessageKey> = {
  tablecloth: 'table.fabrics.tablecloth',
  overlay: 'table.fabrics.overlay',
  chairCover: 'table.fabrics.chairCover',
  sash: 'table.fabrics.sash',
  napkin: 'table.fabrics.napkin',
}
export const overlayStyleLabels: Record<OverlayStyle, MessageKey> = {
  traditional: 'table.fabrics.traditional',
  runner: 'table.fabrics.runner',
}
export function fabricPartLabel(part: TablePart, design: TableDesign) {
  return part === 'overlay' ? overlayStyleLabels[design.overlayStyle] : tablePartLabels[part]
}
export const fabricTextures: readonly {
  id: FabricTexture
  label: MessageKey
  caption: MessageKey
}[] = [
  { id: 'linen', label: 'table.fabrics.linen', caption: 'table.fabrics.linenCaption' },
  { id: 'satin', label: 'table.fabrics.satin', caption: 'table.fabrics.satinCaption' },
  { id: 'damask', label: 'table.fabrics.damask', caption: 'table.fabrics.damaskCaption' },
]
export const floralStyles: readonly { id: FloralStyle; label: MessageKey; preview?: string }[] = [
  { id: 'harvest', label: 'table.flowers.harvest', preview: 'harvest' },
  { id: 'burgundy', label: 'table.flowers.burgundy', preview: 'burgundy' },
  { id: 'sunlight', label: 'table.flowers.sunlight', preview: 'sunlight' },
  { id: 'cascade', label: 'table.flowers.cascade', preview: 'cascade' },
  { id: 'ribbonBottle', label: 'table.flowers.huasoPair', preview: 'ribbonBottle' },
  { id: 'fifteen', label: 'table.flowers.quinceanera', preview: 'fifteen' },
  { id: 'white', label: 'table.flowers.classicWhite', preview: 'white' },
  { id: 'rose', label: 'table.flowers.softPink', preview: 'rose' },
  { id: 'botanical', label: 'table.flowers.botanical' },
  { id: 'none', label: 'table.flowers.none' },
]
export const floralDefaults: FloralOptions = {
  flowerKind: 'original',
  flowerColor: 'original',
  bottleOutfit: 'none',
}
export const flowerKindLabels = {
  original: 'table.flowers.original',
  rose: 'table.flowers.roses',
  daisy: 'table.flowers.daisies',
  lily: 'table.flowers.lilies',
} as const
export const flowerPalette = {
  original: { label: 'table.flowers.original', hex: undefined },
  ivory: { label: 'table.colors.ivory', hex: '#fff6dd' },
  yellow: { label: 'table.flowers.yellow', hex: '#edb323' },
  pink: { label: 'table.flowers.pink', hex: '#d78da0' },
  red: { label: 'table.flowers.red', hex: '#a91d3d' },
  violet: { label: 'table.flowers.violet', hex: '#8655ac' },
  blue: { label: 'table.flowers.blue', hex: '#325abb' },
} as const
export const outfitLabels = {
  none: 'table.flowers.noBottles',
  pair: 'table.flowers.bottlePair',
} as const

export function migrateBottleOutfit(value: unknown, floral: unknown) {
  if (value === 'manta' || value === 'huasa') return 'pair'
  return value ?? (floral === 'ribbonBottle' ? 'pair' : 'none')
}
export function hasBlooms(style: FloralStyle) {
  return style !== 'none' && style !== 'botanical'
}
const customizedArrangementLabels: Partial<Record<FloralStyle, MessageKey>> = {
  burgundy: 'table.flowers.roundBouquet',
  sunlight: 'table.flowers.lowArrangement',
  cascade: 'table.flowers.cascadeArrangement',
  fifteen: 'table.flowers.quinceaneraArrangement',
  ribbonBottle: 'table.flowers.huasoArrangement',
  white: 'table.flowers.classicArrangement',
  rose: 'table.flowers.classicArrangement',
}
export function floralEntries(design: TableDesign, t: Translate = spanish) {
  const style = floralStyles.find((style) => style.id === design.floral)!
  const customized = design.flowerKind !== 'original' || design.flowerColor !== 'original'
  type FloralKey = 'floral' | 'flowerKind' | 'flowerColor' | 'bottleOutfit'
  const rows: { key: FloralKey; label: string; value: string }[] = [
    {
      key: 'floral',
      label: t('table.flowers.arrangement'),
      value: t((customized && customizedArrangementLabels[style.id]) || style.label),
    },
  ]
  if (hasBlooms(design.floral)) {
    if (design.flowerKind !== 'original')
      rows.push({
        key: 'flowerKind',
        label: t('table.flowers.kind'),
        value: t(flowerKindLabels[design.flowerKind]),
      })
    if (design.flowerColor !== 'original')
      rows.push({
        key: 'flowerColor',
        label: t('table.flowers.color'),
        value: t(flowerPalette[design.flowerColor].label),
      })
  }
  if (design.bottleOutfit === 'pair') {
    const tables = design.roundTables + Number(design.headSeats > 0)
    rows.push({
      key: 'bottleOutfit',
      label: t('table.flowers.wine'),
      value: t('table.flowers.bottleDescription', { count: tables * 2 }),
    })
  }
  return rows
}
export function floralDetails(design: TableDesign, t: Translate = spanish) {
  return floralEntries(design, t).map(({ label, value }) => [label, value])
}
export const napkinFoldLabels: Record<NapkinFold, MessageKey> = {
  flat: 'table.napkins.flat',
  doubleV: 'table.napkins.doubleV',
  fan: 'table.napkins.fan',
  crown: 'table.napkins.crown',
  duo: 'table.napkins.duo',
}
export const dinnerwareStyles = {
  goldRim: { label: 'table.dinnerware.goldRim', color: '#f7f0df', roughness: 0.22, clearcoat: 0.5 },
  porcelain: {
    label: 'table.dinnerware.porcelain',
    color: '#f9f9f6',
    roughness: 0.16,
    clearcoat: 0.8,
  },
  stoneware: {
    label: 'table.dinnerware.stoneware',
    color: '#403e39',
    roughness: 0.78,
    clearcoat: 0.12,
  },
} as const satisfies Record<
  Dinnerware,
  { label: MessageKey; color: string; roughness: number; clearcoat: number }
>

export function isDinnerware(value: unknown): value is Dinnerware {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(dinnerwareStyles, value)
}
export const defaultTextures: Record<TablePart, FabricTexture> = {
  tablecloth: 'linen',
  overlay: 'linen',
  chairCover: 'linen',
  sash: 'satin',
  napkin: 'linen',
}
export const defaultLayout = { roundTables: 1, headSeats: 0 }
export const maxRoundTables = 25
export const maxHeadSeats = 20

export function seatsByTable(design: TableDesign, count = design.roundTables) {
  return Array.from({ length: count }, (_, index) => design.roundSeats?.[index] ?? design.chairs)
}

export function roundSeatLayout(seats: number[], chairs: number) {
  if (seats.length && seats.every((count) => count === seats[0])) {
    return { chairs: seats[0], roundSeats: undefined }
  }
  return { chairs, roundSeats: seats.length ? seats : undefined }
}

export function changeRoundSeat(design: TableDesign, index: number, count: number) {
  const seats = seatsByTable(design)
  seats[index] = count
  return roundSeatLayout(seats, design.chairs)
}

export function totalSeats(design: TableDesign) {
  return seatsByTable(design).reduce((sum, seats) => sum + seats, design.headSeats)
}

export function layoutDetails(design: TableDesign, t: Translate = spanish): string[][] {
  const seats = seatsByTable(design)
  const groups = [...new Set(seats)].sort((a, b) => a - b)
  const breakdown =
    groups.length > 1
      ? groups.map((count) => {
          const numbers = seats.flatMap((value, index) => (value === count ? [index + 1] : []))
          return [
            `${count} ${t('table.plan.seatsUnit')}`,
            `${t(numbers.length === 1 ? 'table.plan.table' : 'table.plan.tables')} ${numbers.join(', ')}`,
          ]
        })
      : []
  return [
    [
      t('table.plan.roundTables'),
      groups.length > 1
        ? String(design.roundTables)
        : design.roundTables
          ? `${design.roundTables} × ${seats[0]} ${t('table.plan.seatsUnit')}`
          : t('table.plan.none'),
    ],
    ...breakdown,
    [
      t('table.plan.headTable'),
      design.headSeats
        ? `${design.headSeats} ${t('table.plan.seatsUnit')}`
        : t('table.plan.noHeadTable'),
    ],
    [t('table.plan.totalSeats'), String(totalSeats(design))],
  ]
}

export const tablePresets: readonly {
  id: string
  label: MessageKey
  caption: MessageKey
  design: TableDesign
}[] = [
  {
    id: 'natural',
    label: 'table.presets.natural',
    caption: 'table.presets.naturalCaption',
    design: {
      ...floralDefaults,
      ...defaultLayout,
      overlayStyle: 'traditional',
      napkinFold: 'flat',
      dinnerware: 'goldRim',
      chairs: 6,
      floral: 'white',
      textures: { ...defaultTextures },
      tablecloth: 'ivory',
      overlay: 'sage',
      chairCover: 'ivory',
      sash: 'sage',
      napkin: 'ivory',
    },
  },
  {
    id: 'classic',
    label: 'table.presets.classic',
    caption: 'table.presets.classicCaption',
    design: {
      ...floralDefaults,
      ...defaultLayout,
      overlayStyle: 'traditional',
      napkinFold: 'flat',
      dinnerware: 'goldRim',
      chairs: 6,
      floral: 'white',
      textures: { ...defaultTextures },
      tablecloth: 'white',
      overlay: 'ivory',
      chairCover: 'white',
      sash: 'gold',
      napkin: 'gold',
    },
  },
  {
    id: 'night',
    label: 'table.presets.night',
    caption: 'table.presets.nightCaption',
    design: {
      ...floralDefaults,
      ...defaultLayout,
      overlayStyle: 'traditional',
      napkinFold: 'flat',
      dinnerware: 'goldRim',
      chairs: 6,
      floral: 'white',
      textures: { ...defaultTextures },
      tablecloth: 'navy',
      overlay: 'navy',
      chairCover: 'charcoal',
      sash: 'gold',
      napkin: 'ivory',
    },
  },
  {
    id: 'romance',
    label: 'table.presets.romance',
    caption: 'table.presets.romanceCaption',
    design: {
      ...floralDefaults,
      ...defaultLayout,
      overlayStyle: 'traditional',
      napkinFold: 'flat',
      dinnerware: 'goldRim',
      chairs: 6,
      floral: 'rose',
      textures: { ...defaultTextures },
      tablecloth: 'ivory',
      overlay: 'rose',
      chairCover: 'ivory',
      sash: 'rose',
      napkin: 'rose',
    },
  },
]
export function fabricColor(id: string): FabricColor {
  return fabricColors.find((color) => color.id === id) ?? fabricColors[0]
}
