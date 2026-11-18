import { useEffect, useState } from 'react'
import { readTableDesign, tableDesignUrl, tableStorageKey } from '../table/design'
import type { TableDesign, TablePart } from '../types/table'

export function useTableDesign() {
  const [design, setDesign] = useState<TableDesign>(() =>
    readTableDesign(new URLSearchParams(window.location.search)),
  )
  const [activePart, setActivePart] = useState<TablePart>('tablecloth')
  useEffect(() => {
    try {
      localStorage.setItem(tableStorageKey, JSON.stringify(design))
    } catch {
      /* Persistence is optional. */
    }
    window.history.replaceState(null, '', tableDesignUrl(design))
  }, [design])
  const setColor = (color: string) => setDesign((current) => ({ ...current, [activePart]: color }))
  const setTexture = (texture: TableDesign['textures'][TablePart]) =>
    setDesign((current) => ({
      ...current,
      textures: { ...current.textures, [activePart]: texture },
    }))
  return { setTexture, design, setDesign, activePart, setActivePart, setColor }
}
