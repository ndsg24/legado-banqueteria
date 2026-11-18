import { useEffect, useState } from 'react'
import { fabricColors, tablePresets, fabricTextures, floralStyles, defaultTextures, isDinnerware } from '../config/table'
import { tableParts } from '../types/table'
import type { TableDesign, TablePart } from '../types/table'

export const tableStorageKey = 'legado-table-design-v1'
export function readTableDesign(query = new URLSearchParams()): TableDesign {
  let saved: Partial<TableDesign> = {}
  try { saved = JSON.parse(localStorage.getItem(tableStorageKey) ?? '{}') ?? {} } catch { /* A fresh design remains available when storage is blocked. */ }
  const colors = Object.fromEntries(tableParts.map((part) => {
    const candidate = query.get(part) ?? saved[part]
    return [part, fabricColors.some((color) => color.id === candidate) ? candidate : tablePresets[0].design[part]]
  })) as Record<TablePart, string>
  const dinnerware = query.get('dinnerware') ?? (query.has('tablecloth') ? 'goldRim' : saved.dinnerware)
  const chairs = Number(query.get('chairs') ?? saved.chairs ?? 6)
  const floral = query.get('floral') ?? saved.floral
  const textures = Object.fromEntries(tableParts.map((part) => {
    const candidate = query.get(`${part}Texture`) ?? saved.textures?.[part]
    return [part, fabricTextures.some((texture) => texture.id === candidate) ? candidate : defaultTextures[part]]
  })) as TableDesign['textures']
  return { ...colors, dinnerware: isDinnerware(dinnerware) ? dinnerware : 'goldRim', chairs: Number.isInteger(chairs) && chairs >= 6 && chairs <= 10 ? chairs : 6, floral: floralStyles.some((style) => style.id === floral) ? floral as TableDesign['floral'] : 'white', textures }
}
export function tableDesignUrl(design: TableDesign, page = window.location.href): string {
  const url = new URL(page, window.location.href)
  tableParts.forEach((part) => url.searchParams.set(part, design[part]))
  url.searchParams.set('chairs', String(design.chairs))
  url.searchParams.set('dinnerware', design.dinnerware)
  url.searchParams.set('floral', design.floral)
  tableParts.forEach((part) => url.searchParams.set(`${part}Texture`, design.textures[part]))
  return url.href
}

export function useTableDesign() {
  const [design, setDesign] = useState<TableDesign>(() => readTableDesign(new URLSearchParams(window.location.search)))
  const [activePart, setActivePart] = useState<TablePart>('tablecloth')
  useEffect(() => {
    try { localStorage.setItem(tableStorageKey, JSON.stringify(design)) } catch { /* Persistence is optional. */ }
    window.history.replaceState(null, '', tableDesignUrl(design))
  }, [design])
  const setColor = (color: string) => setDesign((current) => ({ ...current, [activePart]: color }))
  const setTexture = (texture: TableDesign['textures'][TablePart]) => setDesign((current) => ({ ...current, textures: { ...current.textures, [activePart]: texture } }))
  return { setTexture, design, setDesign, activePart, setActivePart, setColor }
}
