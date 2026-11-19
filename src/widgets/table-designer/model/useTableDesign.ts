import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import {
  readTableDesign,
  tableDesignUrl,
  tableStorageKey,
  type TableDesign,
  type TablePart,
} from '../../../entities/table'

export function useTableDesign() {
  const navigate = useNavigate()
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
    const url = new URL(tableDesignUrl(design))
    if (url.search !== window.location.search) {
      void navigate(
        { search: url.search, hash: url.hash },
        { replace: true, preventScrollReset: true },
      )
    }
  }, [design, navigate])
  const setColor = (color: string) => setDesign((current) => ({ ...current, [activePart]: color }))
  const setTexture = (texture: TableDesign['textures'][TablePart]) =>
    setDesign((current) => ({
      ...current,
      textures: { ...current.textures, [activePart]: texture },
    }))
  return { setTexture, design, setDesign, activePart, setActivePart, setColor }
}
