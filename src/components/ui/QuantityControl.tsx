import { useState } from 'react'
import '../../styles/quantity.css'

type Props = { name: string; quantity: number; onChange: (quantity: number) => void }

export function QuantityControl({ name, quantity, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null)
  return <div className="quantity-control" role="group" aria-label={'Cantidad de ' + name}>
    <button type="button" aria-label={'Restar uno de ' + name} disabled={!quantity} onClick={() => onChange(quantity - 1)}>−</button>
    <input type="text" inputMode="numeric" pattern="[0-9]*" aria-label={'Cantidad de ' + name}
      value={draft ?? quantity} onFocus={event => event.currentTarget.select()}
      onChange={event => {
        const text = event.target.value
        if (text === '') { setDraft(''); return }
        if (/^\d+$/.test(text) && Number.isSafeInteger(Number(text))) {
          setDraft(null)
          onChange(Number(text))
        }
      }}
      onBlur={() => setDraft(null)}
      onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur() } }} />
    <button type="button" aria-label={'Sumar uno de ' + name} disabled={quantity === Number.MAX_SAFE_INTEGER} onClick={() => onChange(quantity + 1)}>+</button>
  </div>
}
