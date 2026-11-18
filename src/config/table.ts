import type { FloralOptions, OverlayStyle, NapkinFold, Dinnerware, FabricColor, TableDesign, TablePart, FabricTexture, FloralStyle } from '../types/table'

export const fabricColors: readonly FabricColor[] = [
  { id: 'ivory', label: 'Marfil', hex: '#e8dfcd' },
  { id: 'white', label: 'Blanco', hex: '#f4f1e9' },
  { id: 'sand', label: 'Arena', hex: '#bca789' },
  { id: 'sage', label: 'Salvia', hex: '#82917b' },
  { id: 'forest', label: 'Bosque', hex: '#304a3b' },
  { id: 'rose', label: 'Rosa antiguo', hex: '#b28383' },
  { id: 'wine', label: 'Borgoña', hex: '#682e3d' },
  { id: 'navy', label: 'Azul noche', hex: '#29384b' },
  { id: 'gold', label: 'Champagne', hex: '#b5955c' },
  { id: 'charcoal', label: 'Grafito', hex: '#333639' },
]
export const tablePartLabels: Record<TablePart, string> = {
  tablecloth: 'Mantel', overlay: 'Carpeta', chairCover: 'Fundas', sash: 'Rosones', napkin: 'Servilletas',
}
export const overlayStyleLabels: Record<OverlayStyle, string> = {
  traditional: 'Carpeta tradicional', runner: 'Camino de mesa',
}
export function fabricPartLabel(part: TablePart, design: TableDesign) {
  return part === 'overlay' ? overlayStyleLabels[design.overlayStyle] : tablePartLabels[part]
}
export const fabricTextures: readonly { id: FabricTexture; label: string; caption: string }[] = [
  { id: 'linen', label: 'Lino', caption: 'Trama natural' },
  { id: 'satin', label: 'Satén', caption: 'Brillo suave' },
  { id: 'damask', label: 'Damasco', caption: 'Tejido ornamental' },
]
export const floralStyles: readonly { id: FloralStyle; label: string; preview?: string }[] = [
  { id: 'harvest', label: 'Ramo de otoño', preview: 'harvest' },
  { id: 'burgundy', label: 'Margaritas blanco y burdeos', preview: 'burgundy' },
  { id: 'sunlight', label: 'Centro amarillo y blanco', preview: 'sunlight' },
  { id: 'cascade', label: 'Cascada azul y blanca', preview: 'cascade' },
  { id: 'ribbonBottle', label: 'Flores y pareja de huasos', preview: 'ribbonBottle' },
  { id: 'fifteen', label: 'Quince años en violeta', preview: 'fifteen' },
  { id: 'white', label: 'Blanco clásico', preview: 'white' }, { id: 'rose', label: 'Rosa suave', preview: 'rose' },
  { id: 'botanical', label: 'Verde botánico' }, { id: 'none', label: 'Sin arreglo' },
]
export const floralDefaults: FloralOptions = { flowerKind: 'original', flowerColor: 'original', bottleOutfit: 'none' }
export const flowerKindLabels = { original: 'Del arreglo', rose: 'Rosas', daisy: 'Margaritas', lily: 'Lirios' } as const
export const flowerPalette = {
  original: { label: 'Del arreglo', hex: undefined },
  ivory: { label: 'Marfil', hex: '#fff6dd' }, yellow: { label: 'Amarillo', hex: '#edb323' },
  pink: { label: 'Rosa', hex: '#d78da0' }, red: { label: 'Rojo', hex: '#a91d3d' },
  violet: { label: 'Violeta', hex: '#8655ac' }, blue: { label: 'Azul', hex: '#325abb' },
} as const
export const outfitLabels = { none: 'Sin botellas', pair: 'Pareja por mesa' } as const

export function migrateBottleOutfit(value: unknown, floral: unknown) {
  if (value === 'manta' || value === 'huasa') return 'pair'
  return value ?? (floral === 'ribbonBottle' ? 'pair' : 'none')
}
export function hasBlooms(style: FloralStyle) { return style !== 'none' && style !== 'botanical' }
const customizedArrangementLabels: Partial<Record<FloralStyle, string>> = {
  burgundy: 'Ramo redondo', sunlight: 'Centro bajo', cascade: 'Arreglo en cascada', fifteen: 'Arreglo de quince años',
  ribbonBottle: 'Ramo con pareja de huasos', white: 'Centro clásico', rose: 'Centro clásico',
}
export function floralDetails(design: TableDesign): string[][] {
  const style = floralStyles.find(style => style.id === design.floral)!
  const customized = design.flowerKind !== 'original' || design.flowerColor !== 'original'
  const rows = [['Arreglo floral', (customized && customizedArrangementLabels[style.id]) || style.label]]
  if (hasBlooms(design.floral)) {
    if (design.flowerKind !== 'original') rows.push(['Tipo de flor', flowerKindLabels[design.flowerKind]])
    if (design.flowerColor !== 'original') rows.push(['Color de flor', flowerPalette[design.flowerColor].label])
  }
  if (design.bottleOutfit === 'pair') {
    const tables = design.roundTables + Number(design.headSeats > 0)
    rows.push(['Vino de Fiestas Patrias', `Una con manta y sombrero y otra con vestido de huasa por mesa · ${tables * 2} botellas en total`])
  }
  return rows
}
export const napkinFoldLabels: Record<NapkinFold, string> = {
  flat: 'Clásica sobre el plato', doubleV: 'Doble pico en V', fan: 'Abanico en copa', crown: 'Corona en copa', duo: 'Corona bicolor',
}
export const dinnerwareStyles = {
  goldRim: { label: 'Marfil con filete dorado', color: '#f7f0df', roughness: 0.22, clearcoat: 0.5 },
  porcelain: { label: 'Porcelana blanca', color: '#f9f9f6', roughness: 0.16, clearcoat: 0.8 },
  stoneware: { label: 'Gres grafito', color: '#403e39', roughness: 0.78, clearcoat: 0.12 },
} as const satisfies Record<Dinnerware, { label: string; color: string; roughness: number; clearcoat: number }>

export function isDinnerware(value: unknown): value is Dinnerware {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(dinnerwareStyles, value)
}
export const defaultTextures: Record<TablePart, FabricTexture> = { tablecloth: 'linen', overlay: 'linen', chairCover: 'linen', sash: 'satin', napkin: 'linen' }
export const defaultLayout = { roundTables: 1, headSeats: 0 }
export const maxRoundTables = 25
export const maxHeadSeats = 20

export function seatsByTable(design: TableDesign, count = design.roundTables) {
  return Array.from({ length: count }, (_, index) => design.roundSeats?.[index] ?? design.chairs)
}

export function roundSeatLayout(seats: number[], chairs: number) {
  if (seats.length && seats.every(count => count === seats[0])) {
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

export function layoutDetails(design: TableDesign): string[][] {
  const seats = seatsByTable(design)
  const groups = [...new Set(seats)].sort((a, b) => a - b)
  const breakdown = groups.length > 1 ? groups.map(count => {
    const numbers = seats.flatMap((value, index) => value === count ? [index + 1] : [])
    return [`${count} puestos`, `${numbers.length === 1 ? 'Mesa' : 'Mesas'} ${numbers.join(', ')}`]
  }) : []
  return [
    ['Mesas redondas', groups.length > 1 ? String(design.roundTables) : design.roundTables ? `${design.roundTables} × ${seats[0]} puestos` : 'Ninguna'],
    ...breakdown,
    ['Cabecera rectangular', design.headSeats ? `${design.headSeats} puestos` : 'Sin cabecera'],
    ['Puestos en total', String(totalSeats(design))],
  ]
}

export const tablePresets: readonly { id: string; label: string; caption: string; design: TableDesign }[] = [
  { id: 'natural', label: 'Natural', caption: 'Marfil, salvia y luz.', design: { ...floralDefaults, ...defaultLayout, overlayStyle: 'traditional', napkinFold: 'flat', dinnerware: 'goldRim', chairs: 6, floral: 'white', textures: { ...defaultTextures }, tablecloth: 'ivory', overlay: 'sage', chairCover: 'ivory', sash: 'sage', napkin: 'ivory' } },
  { id: 'classic', label: 'Clásico', caption: 'Blanco y champagne.', design: { ...floralDefaults, ...defaultLayout, overlayStyle: 'traditional', napkinFold: 'flat', dinnerware: 'goldRim', chairs: 6, floral: 'white', textures: { ...defaultTextures }, tablecloth: 'white', overlay: 'ivory', chairCover: 'white', sash: 'gold', napkin: 'gold' } },
  { id: 'night', label: 'Noche', caption: 'Azul profundo y dorado.', design: { ...floralDefaults, ...defaultLayout, overlayStyle: 'traditional', napkinFold: 'flat', dinnerware: 'goldRim', chairs: 6, floral: 'white', textures: { ...defaultTextures }, tablecloth: 'navy', overlay: 'navy', chairCover: 'charcoal', sash: 'gold', napkin: 'ivory' } },
  { id: 'romance', label: 'Romance', caption: 'Rosa antiguo y marfil.', design: { ...floralDefaults, ...defaultLayout, overlayStyle: 'traditional', napkinFold: 'flat', dinnerware: 'goldRim', chairs: 6, floral: 'rose', textures: { ...defaultTextures }, tablecloth: 'ivory', overlay: 'rose', chairCover: 'ivory', sash: 'rose', napkin: 'rose' } },
]
export function fabricColor(id: string): FabricColor {
  return fabricColors.find((color) => color.id === id) ?? fabricColors[0]
}
