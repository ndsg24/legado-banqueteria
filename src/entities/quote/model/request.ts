import { type MessageKey } from '../../../shared/i18n'
import { z } from 'zod'
import { isEventDateInRange } from './dates'
import { biobioCommunes } from '../../../shared/config/biobio'
import {
  isSingleChoice,
  menuItems,
  isAllowedSauce,
  validOmissions,
  courseChoiceCounts,
} from '../../menu/@x/quote'
import {
  maxRoundTables,
  maxHeadSeats,
  isDinnerware,
  dinnerwareStyles,
  fabricColors,
  fabricTextures,
  floralStyles,
  flowerKinds,
  flowerColors,
  bottleOutfits,
  overlayStyles,
  napkinFolds,
  tableParts,
} from '../../table/@x/quote'

// Both the static site and Cloudflare validate without dynamic code generation.
z.config({ jitless: true })

export const eventTypes = [
  'Matrimonio',
  'Encuentro familiar',
  'Evento de empresa',
  'Otra celebración',
] as const
export const eventLabels = {
  Matrimonio: 'quote.events.wedding',
  'Encuentro familiar': 'quote.events.family',
  'Evento de empresa': 'quote.events.corporate',
  'Otra celebración': 'quote.events.other',
} as const satisfies Record<(typeof eventTypes)[number], MessageKey>

export const allergens = ['wheat', 'milk', 'egg', 'nuts', 'peanut', 'crustaceans'] as const

export const dietaryGroups = [
  { id: 'allergies', options: [...allergens, 'molluscs', 'fish', 'soy', 'sesame'] },
  { id: 'exclusions', options: ['gluten', 'lactose'] },
  { id: 'menus', options: ['vegan', 'vegetarian', 'light'] },
] as const

export const dietaryOptions = dietaryGroups.flatMap<DietaryOption>((group) => group.options)
export type DietaryOption = (typeof dietaryGroups)[number]['options'][number]

export const guestRange = { min: 30, max: 150 } as const
const color = z.enum(fabricColors.map((item) => item.id))
const texture = z.enum(fabricTextures.map((item) => item.id))

export const designSchema = z
  .strictObject({
    tablecloth: color,
    overlay: color,
    chairCover: color,
    sash: color,
    napkin: color,
    textures: z.record(z.enum(tableParts), texture),
    roundTables: z.number().int().min(0).max(maxRoundTables),
    roundSeats: z.array(z.number().int().min(6).max(10)).max(maxRoundTables).optional(),
    headSeats: z
      .number()
      .int()
      .min(0)
      .max(maxHeadSeats)
      .refine((n) => n !== 1),
    chairs: z.number().int().min(6).max(10),
    flowerKind: z.enum(flowerKinds),
    flowerColor: z.enum(flowerColors),
    bottleOutfit: z.enum(bottleOutfits),
    floral: z.enum(floralStyles.map((item) => item.id)),
    overlayStyle: z.enum(overlayStyles),
    napkinFold: z.enum(napkinFolds),
    dinnerware: z.custom<keyof typeof dinnerwareStyles>(isDinnerware),
  })
  .refine(
    (design) => design.roundTables > 0 || design.headSeats > 0,
    'quote.validation.tableRequired',
  )
  .refine(
    (design) => !design.roundSeats || design.roundSeats.length === design.roundTables,
    'quote.validation.seatsMismatch',
  )

export const quoteSchema = z
  .strictObject({
    name: z
      .string()
      .trim()
      .min(2, 'quote.validation.nameRequired')
      .max(100, 'quote.validation.nameLength'),
    email: z
      .string()
      .trim()
      .max(254, 'quote.validation.emailLength')
      .pipe(z.email('quote.validation.emailInvalid')),
    phone: z.string().regex(/^(?:\+569[0-9]{8})?$/, 'quote.validation.phoneInvalid'),
    event: z.enum(eventTypes, 'quote.validation.eventRequired'),
    date: z
      .string('quote.validation.dateRequired')
      .min(1, 'quote.validation.dateRequired')
      .pipe(z.iso.date('quote.validation.dateInvalid'))
      .refine(isEventDateInRange, 'quote.validation.dateRange'),
    guests: z
      .number('quote.validation.guestsRequired')
      .int('quote.validation.guestsInteger')
      .min(guestRange.min, 'quote.validation.guestsMinimum')
      .max(guestRange.max, 'quote.validation.guestsMaximum'),
    location: z
      .string('quote.validation.communeRequired')
      .refine((value) => biobioCommunes.includes(value), 'quote.validation.communeRequired'),
    items: z
      .record(
        z.string().refine((id) => menuItems.has(id), 'quote.validation.unknownDish'),
        z.number().int().positive(),
      )
      .refine(
        (counts) => Object.entries(counts).every(([id, qty]) => !isSingleChoice(id) || qty === 1),
        'quote.validation.singleChoice',
      ),
    table: designSchema.nullable(),
    sauces: z.record(z.string(), z.string()).optional(),
    omittedIngredients: z.record(z.string(), z.array(z.string())).optional(),
    allergens: z.array(z.enum(allergens)).max(allergens.length).optional(),
    dietaryCounts: z
      .partialRecord(z.enum(dietaryOptions), z.number().int().nonnegative())
      .optional(),
    dietaryNeeds: z
      .string()
      .trim()
      .max(1500, 'quote.validation.notesLength')
      .transform((value) => value || undefined)
      .optional(),
    notes: z.string().trim().max(1500, 'quote.validation.notesLength'),
  })
  .refine((quote) => validOmissions(quote.items, quote.omittedIngredients ?? {}), {
    path: ['omittedIngredients'],
    message: 'quote.validation.invalidIngredients',
  })
  .refine((quote) => courseChoiceCounts(quote.items).every(({ count, max }) => count <= max), {
    path: ['items'],
    message: 'quote.validation.courseLimit',
  })
  .refine(
    (quote) => Object.values(quote.dietaryCounts ?? {}).every((n) => n >= 1 && n <= quote.guests),
    { path: ['dietaryCounts'], message: 'quote.validation.dietaryCount' },
  )
  .refine(
    (quote) =>
      Object.entries(quote.sauces ?? {}).every(
        ([main, sauce]) => quote.items[main] && isAllowedSauce(main, sauce),
      ),
    { path: ['sauces'], message: 'quote.validation.invalidSauce' },
  )
export type QuoteRequest = z.infer<typeof quoteSchema>
