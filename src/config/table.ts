import type { FabricColor, TableDesign, TablePart, FabricTexture, FloralStyle } from '../types/table'

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
export const fabricTextures: readonly { id: FabricTexture; label: string; caption: string }[] = [
  { id: 'linen', label: 'Lino', caption: 'Trama natural' },
  { id: 'satin', label: 'Satén', caption: 'Brillo suave' },
  { id: 'damask', label: 'Damasco', caption: 'Tejido ornamental' },
]
export const floralStyles: readonly { id: FloralStyle; label: string }[] = [
  { id: 'white', label: 'Blanco clásico' }, { id: 'rose', label: 'Rosa suave' },
  { id: 'botanical', label: 'Verde botánico' }, { id: 'none', label: 'Sin arreglo' },
]
export const defaultTextures: Record<TablePart, FabricTexture> = { tablecloth: 'linen', overlay: 'linen', chairCover: 'linen', sash: 'satin', napkin: 'linen' }
export const tablePresets: readonly { id: string; label: string; caption: string; design: TableDesign }[] = [
  { id: 'natural', label: 'Natural', caption: 'Marfil, salvia y luz.', design: { chairs: 6, floral: 'white', textures: { ...defaultTextures }, tablecloth: 'ivory', overlay: 'sage', chairCover: 'ivory', sash: 'sage', napkin: 'ivory' } },
  { id: 'classic', label: 'Clásico', caption: 'Blanco y champagne.', design: { chairs: 6, floral: 'white', textures: { ...defaultTextures }, tablecloth: 'white', overlay: 'ivory', chairCover: 'white', sash: 'gold', napkin: 'gold' } },
  { id: 'night', label: 'Noche', caption: 'Azul profundo y dorado.', design: { chairs: 6, floral: 'white', textures: { ...defaultTextures }, tablecloth: 'navy', overlay: 'navy', chairCover: 'charcoal', sash: 'gold', napkin: 'ivory' } },
  { id: 'romance', label: 'Romance', caption: 'Rosa antiguo y marfil.', design: { chairs: 6, floral: 'rose', textures: { ...defaultTextures }, tablecloth: 'ivory', overlay: 'rose', chairCover: 'ivory', sash: 'rose', napkin: 'rose' } },
]
export function fabricColor(id: string): FabricColor {
  return fabricColors.find((color) => color.id === id) ?? fabricColors[0]
}
