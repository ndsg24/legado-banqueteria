import { useState } from 'react'
import { EventCommuneSelect } from '../../../../../web/src/widgets/quote-wizard/ui/EventCommuneSelect'
import { EventDatePicker } from '../../../../../web/src/widgets/quote-wizard/ui/EventDatePicker'
import '../../../../../web/src/pages/quote/ui/quote.css'

const booked = new Set<string>()
const availability = {
  booked,
  status: 'ready' as const,
  refresh: async () => booked,
  markBooked: () => {},
}

export function QuoteFields() {
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  return (
    <div className="ds-field-grid">
      <EventDatePicker
        value={date}
        onChange={setDate}
        onBlur={() => {}}
        triggerRef={null}
        disabled={false}
        availability={availability}
      />
      <EventCommuneSelect
        value={location}
        onChange={setLocation}
        onBlur={() => {}}
        triggerRef={null}
      />
    </div>
  )
}
