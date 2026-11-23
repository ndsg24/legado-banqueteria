import type { MessageKey } from '../i18n/messages'
export const tableParts = ['tablecloth', 'overlay', 'chairCover', 'sash', 'napkin'] as const
export type TablePart = (typeof tableParts)[number]
export type FabricTexture = 'linen' | 'satin' | 'damask'
export type PhotoCenterpiece =
  'harvest' | 'burgundy' | 'sunlight' | 'cascade' | 'fifteen' | 'ribbonBottle'
export type FloralStyle = PhotoCenterpiece | 'white' | 'rose' | 'botanical' | 'none'
export const flowerKinds = ['original', 'rose', 'daisy', 'lily'] as const
export const flowerColors = [
  'original',
  'ivory',
  'yellow',
  'pink',
  'red',
  'violet',
  'blue',
] as const
export const bottleOutfits = ['none', 'pair'] as const
export type FloralOptions = {
  flowerKind: (typeof flowerKinds)[number]
  flowerColor: (typeof flowerColors)[number]
  bottleOutfit: (typeof bottleOutfits)[number]
}
export const overlayStyles = ['traditional', 'runner'] as const
export type OverlayStyle = (typeof overlayStyles)[number]
export const napkinFolds = ['flat', 'doubleV', 'fan', 'crown', 'duo'] as const
export type NapkinFold = (typeof napkinFolds)[number]
export type Dinnerware = 'goldRim' | 'porcelain' | 'stoneware'
export type TableDesign = Record<TablePart, string> &
  FloralOptions & {
    dinnerware: Dinnerware
    overlayStyle: OverlayStyle
    napkinFold: NapkinFold
    chairs: number
    roundTables: number
    roundSeats?: number[]
    headSeats: number
    textures: Record<TablePart, FabricTexture>
    floral: FloralStyle
  }
export type FabricColor = { id: string; label: MessageKey; hex: string }
