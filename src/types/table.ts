export const tableParts = ['tablecloth', 'overlay', 'chairCover', 'sash', 'napkin'] as const
export type TablePart = typeof tableParts[number]
export type FabricTexture = 'linen' | 'satin' | 'damask'
export type FloralStyle = 'white' | 'rose' | 'botanical' | 'none'
export type Dinnerware = 'goldRim' | 'porcelain' | 'stoneware'
export type TableDesign = Record<TablePart, string> & { dinnerware: Dinnerware; chairs: number; textures: Record<TablePart, FabricTexture>; floral: FloralStyle }
export type FabricColor = { id: string; label: string; hex: string }
