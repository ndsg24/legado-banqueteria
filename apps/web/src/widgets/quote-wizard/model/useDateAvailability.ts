import { useCallback, useEffect, useRef, useState } from 'react'
import { quoteAvailabilitySchema } from '@legado/domain/quote/availability'
import { availabilityEndpoint } from '../../../shared/config/quoteService'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export function useDateAvailability() {
  const [status, setStatus] = useState<Status>('idle')
  const [booked, setBooked] = useState<ReadonlySet<string>>(() => new Set())
  const pending = useRef<{
    cancel: AbortController
    result: Promise<ReadonlySet<string> | null>
  } | null>(null)

  useEffect(() => () => pending.current?.cancel.abort(), [])

  const refresh = useCallback(() => {
    if (pending.current) return pending.current.result
    const cancel = new AbortController()
    const timer = window.setTimeout(() => cancel.abort('timeout'), 8000)
    setStatus('loading')
    async function load() {
      try {
        const response = await fetch(availabilityEndpoint, {
          signal: cancel.signal,
          cache: 'no-store',
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
          redirect: 'error',
        })
        if (!response.ok) throw new Error('Availability request failed')
        const { unavailableDates } = quoteAvailabilitySchema.parse(await response.json())
        const dates = new Set<string>(unavailableDates)
        setBooked(dates)
        setStatus('ready')
        return dates
      } catch {
        if (!cancel.signal.aborted || cancel.signal.reason === 'timeout') setStatus('error')
        return null
      } finally {
        window.clearTimeout(timer)
        pending.current = null
      }
    }
    const result = load()
    pending.current = { cancel, result }
    return result
  }, [])

  function markBooked(date: string) {
    setBooked((previous) => new Set(previous).add(date))
  }
  return { booked, status, refresh, markBooked }
}

export type DateAvailability = ReturnType<typeof useDateAvailability>
