import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import {
  parseTableDesign,
  readTableDesign,
  tableDesignUrl,
  tableStorageKey,
  type TableDesign,
} from '../../../entities/table'

export function useTableDesign(fromIdea = false) {
  const navigate = useNavigate()
  const [design, setDesign] = useState<TableDesign>(() =>
    (fromIdea ? parseTableDesign : readTableDesign)(new URLSearchParams(window.location.search)),
  )
  useEffect(() => {
    try {
      if (!fromIdea) localStorage.setItem(tableStorageKey, JSON.stringify(design))
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
  }, [design, navigate, fromIdea])
  return { design, setDesign }
}
