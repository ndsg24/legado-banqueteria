import type { QuoteRequest } from './request'

export const steps = [
  {
    label: 'Evento',
    icon: 'M4 5h16v15H4z M8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2',
    title: '¿Qué celebramos?',
    fields: ['event', 'guests', 'location', 'date'],
  },
  {
    label: 'Carta',
    icon: 'M4 15a8 8 0 0 1 16 0M2 16h20M4 20h16M12 5V3',
    title: '¿Qué servimos?',
    fields: ['items', 'sauces'],
  },
  {
    label: 'Mesa',
    icon: 'M3 11c0-4 18-4 18 0s-18 4-18 0Zm2 2-1 7m15-7 1 7M9 7V4h6v3',
    title: '¿Cómo vestimos la mesa?',
    fields: ['table', 'notes'],
  },
  {
    label: 'Contacto',
    icon: 'M3 5h18v14H3z M3 6l9 7 9-7',
    title: '¿A quién le escribimos?',
    fields: ['name', 'email', 'phone'],
  },
  {
    label: 'Revisión',
    icon: 'M6 3h9l4 4v14H6z M15 3v5h4M9 14l2 2 5-5',
    title: 'Tu celebración, en detalle.',
    fields: [],
  },
] satisfies { label: string; icon: string; title: string; fields: (keyof QuoteRequest)[] }[]
