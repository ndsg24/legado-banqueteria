import { z } from 'zod'
import { isEventDateInRange } from './dates'
import { biobioCommunes } from '../config/biobio'
import { isSingleChoice, menuItems } from './quantities'
import { isAllowedSauce, selectedDishName } from './sauces'
import { floralDetails, napkinFoldLabels, layoutDetails, maxRoundTables, maxHeadSeats, isDinnerware, dinnerwareStyles, fabricColor, fabricColors, fabricTextures, floralStyles, fabricPartLabel } from '../config/table'
import { flowerKinds, flowerColors, bottleOutfits, overlayStyles, napkinFolds, tableParts } from '../types/table'

export const eventTypes = ['Matrimonio', 'Encuentro familiar', 'Evento de empresa', 'Otra celebración'] as const
export const guestRange = { min: 30, max: 150 } as const
const color = z.enum(fabricColors.map(item => item.id))
const texture = z.enum(fabricTextures.map(item => item.id))

export const designSchema = z.strictObject({
  tablecloth: color, overlay: color, chairCover: color, sash: color, napkin: color,
  textures: z.record(z.enum(tableParts), texture),
  roundTables: z.number().int().min(0).max(maxRoundTables),
  roundSeats: z.array(z.number().int().min(6).max(10)).max(maxRoundTables).optional(),
  headSeats: z.number().int().min(0).max(maxHeadSeats).refine(n => n !== 1),
  chairs: z.number().int().min(6).max(10),
  flowerKind: z.enum(flowerKinds), flowerColor: z.enum(flowerColors), bottleOutfit: z.enum(bottleOutfits),
  floral: z.enum(floralStyles.map(item => item.id)),
  overlayStyle: z.enum(overlayStyles),
  napkinFold: z.enum(napkinFolds),
  dinnerware: z.custom<keyof typeof dinnerwareStyles>(isDinnerware),
}).refine(design => design.roundTables > 0 || design.headSeats > 0, 'Incluye al menos una mesa.')
  .refine(design => !design.roundSeats || design.roundSeats.length === design.roundTables, 'Revisa los puestos de cada mesa.')

export const quoteSchema = z.strictObject({
  name: z.string().trim().min(2, 'Escribe tu nombre.').max(100, 'Usa hasta 100 caracteres.'),
  email: z.string().trim().max(254, 'Máximo 254 caracteres.').pipe(z.email('Revisa tu correo.')),
  phone: z.string().trim().max(24, 'Máximo 24 caracteres.').refine(v => !v || /^\+?[\d ()-]+$/.test(v) && /^\d{8,15}$/.test(v.replace(/\D/g, '')), 'Ingresa de 8 a 15 dígitos.'),
  event: z.enum(eventTypes, 'Elige el tipo de evento.'),
  date: z.string('Elige una fecha.').min(1, 'Elige una fecha.').pipe(z.iso.date('Revisa la fecha.')).refine(isEventDateInRange, 'Desde hoy hasta un año.'),
  guests: z.number('Indica cuántos asistirán.').int('Usa un número entero.').min(guestRange.min, 'Mínimo 30 invitados.').max(guestRange.max, 'Máximo 150 invitados.'),
  location: z.string('Elige una comuna.').refine(value => biobioCommunes.includes(value), 'Elige una comuna.'),
  items: z.record(z.string().refine(id => menuItems.has(id), 'Opción fuera de la carta.'), z.number().int().positive())
    .refine(counts => Object.entries(counts).every(([id, qty]) => !isSingleChoice(id) || qty === 1), 'Cada plato de menú y cada bebestible se puede seleccionar una sola vez.'),
  table: designSchema.nullable(),
  sauces: z.record(z.string(), z.string()).optional(),
  notes: z.string().trim().max(1500, 'Usa hasta 1500 caracteres.'),
}).refine(quote => Object.entries(quote.sauces ?? {}).every(([main, sauce]) => quote.items[main] && isAllowedSauce(main, sauce)),
  { path: ['sauces'], message: 'Elige una salsa de la carta para un principal seleccionado.' })
export type QuoteRequest = z.infer<typeof quoteSchema>

export function quoteMessage(data: QuoteRequest) {
  const lines = [
    'Solicitud de cotización · Legado', '',
    'Nombre: ' + data.name, 'Correo: ' + data.email, 'Teléfono: ' + (data.phone || 'Sin indicar'),
    'Evento: ' + data.event, 'Fecha: ' + data.date, 'Invitados: ' + data.guests, 'Lugar: ' + data.location,
    '', 'Carta: ' + (Object.entries(data.items).map(([id, quantity]) => isSingleChoice(id) ? selectedDishName(id, menuItems.get(id)!, data.sauces) : quantity + ' × ' + menuItems.get(id)).join(', ') || 'Por definir con el equipo.'),
  ]
  const table = data.table
  if (table) {
    lines.push('', 'Ambientación', ...layoutDetails(table).map(([label, value]) => label + ': ' + value), 'Vajilla: ' + dinnerwareStyles[table.dinnerware].label,
      'Plegado de servilleta: ' + napkinFoldLabels[table.napkinFold], ...floralDetails(table).map(([label, value]) => label + ': ' + value))
    for (const part of tableParts) {
      lines.push(fabricPartLabel(part, table) + ': ' + fabricColor(table[part]).label + ' · ' + fabricTextures.find(t => t.id === table.textures[part])?.label)
    }
  }
  if (data.notes) lines.push('', 'Comentarios: ' + data.notes)
  return lines.join('\n')
}
