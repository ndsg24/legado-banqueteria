import { useState, type ReactNode } from 'react'

type Props = { children: (onSettled: (loaded: boolean) => void) => ReactNode }

export function SelectionCardPhoto({ children }: Props) {
  const [loaded, setLoaded] = useState<boolean | null>(null)
  return (
    <span className="quote-dish__photo" aria-hidden="true">
      {loaded === null && <span className="quote-dish__skeleton" />}
      {loaded !== false && children(setLoaded)}
    </span>
  )
}
