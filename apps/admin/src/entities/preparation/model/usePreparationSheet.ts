import { useEffect, useState } from 'react'
import { z } from 'zod'

const key = 'legado-admin-preparation-v1'
const draftSchema = z.object({
  packs: z.record(z.string(), z.string()),
  loaded: z.record(z.string(), z.string()),
})
type Sheet = z.infer<typeof draftSchema>
const empty: Sheet = { packs: {}, loaded: {} }

function readSheets(): Record<string, unknown> {
  try {
    const data: unknown = JSON.parse(sessionStorage.getItem(key) || '{}')
    return data && typeof data === 'object' && !Array.isArray(data) ? { ...data } : {}
  } catch {
    return {}
  }
}

export function readPreparationSheet(number: string): Sheet {
  const draft = draftSchema.safeParse(readSheets()[number])
  return draft.success ? draft.data : empty
}

export function usePreparationSheet(number: string) {
  const [sheet, setSheet] = useState<Sheet>(() => readPreparationSheet(number))
  useEffect(() => {
    const sheets = readSheets()
    if (Object.values(sheet).some((fields) => Object.keys(fields).length)) sheets[number] = sheet
    else delete sheets[number]
    try {
      if (Object.keys(sheets).length) sessionStorage.setItem(key, JSON.stringify(sheets))
      else sessionStorage.removeItem(key)
    } catch {
      /* Continue with the current tab's in-memory sheet. */
    }
  }, [number, sheet])
  return { sheet, setSheet }
}
