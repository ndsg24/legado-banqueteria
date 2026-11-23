import { isIdeasPreview, readTableIdea, tableIdeas } from '../../../shared/config/tableIdea'
import { z } from 'zod'
import { readOmissions, readQuantities, readSauceChoices } from '../../../entities/menu'
import {
  designSchema,
  localMobileDigits,
  mobilePrefix,
  quoteSchema,
  type QuoteRequest,
} from '../../../entities/quote'
import { parseTableDesign, type TableDesign } from '../../../entities/table'
import { steps } from './steps'

const standardDraftKey = 'legado-quote-draft-v1'
// Older drafts stored the position in the original five-step flow.
const previousSteps = ['event', 'menu', 'table', 'contact', 'review'] as const
const draftSchema = z.object({
  step: z.union([
    z.enum(steps.map(({ id }) => id)),
    z
      .number()
      .int()
      .min(0)
      .max(previousSteps.length - 1)
      .transform((index) => previousSteps[index]),
  ]),
  design: designSchema,
  included: z.boolean(),
  editingReview: z.boolean().optional(), // Previous drafts only tracked a return from review.
  furthestStep: z.enum(steps.map(({ id }) => id)).optional(),
  values: z.object({
    event: quoteSchema.shape.event.nullish(),
    guests: z.number().nullish(),
    date: z.union([z.iso.date(), z.literal('')]),
    location: z.string(),
    allergens: quoteSchema.shape.allergens,
    dietaryCounts: quoteSchema.shape.dietaryCounts,
    dietaryNeeds: z.string().optional(),
    notes: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    items: quoteSchema.shape.items,
    sauces: quoteSchema.shape.sauces,
    omittedIngredients: quoteSchema.shape.omittedIngredients,
  }),
  attempt: z.object({ payload: z.string(), id: z.uuid() }).nullable(),
})

function readDraft(key: string) {
  try {
    return draftSchema.safeParse(JSON.parse(sessionStorage.getItem(key) ?? 'null')).data
  } catch {
    return undefined
  }
}

export function initialQuote(params: URLSearchParams) {
  const idea = readTableIdea(params)
  const scope = idea ? '-' + tableIdeas[idea].id : ''
  const key = standardDraftKey + (isIdeasPreview ? '-ideas' : '') + scope
  const draft = readDraft(key)
  const saved = draft?.values
  const design = params.has('mesa')
    ? parseTableDesign(params)
    : (draft?.design ?? parseTableDesign())
  const included = params.has('mesa') ? params.get('mesa') === '1' : draft?.included
  const items = params.has('plato')
    ? readQuantities(params)
    : (saved?.items ?? (isIdeasPreview || idea ? {} : readQuantities()))
  const localPhone = localMobileDigits(saved?.phone ?? '')
  const values = {
    event: saved?.event ?? undefined,
    guests: saved?.guests ?? undefined,
    date: saved?.date ?? '',
    location: saved?.location ?? '',
    // Older drafts identified the ingredient but did not record a guest count.
    dietaryCounts: {
      ...Object.fromEntries((saved?.allergens ?? []).map((id) => [id, 0])),
      ...saved?.dietaryCounts,
    },
    dietaryNeeds: saved?.dietaryNeeds ?? '',
    notes: saved?.notes ?? '',
    name: saved?.name ?? '',
    email: saved?.email ?? '',
    phone: localPhone ? mobilePrefix + localPhone : '',
    items,
    sauces:
      params.has('plato') || params.has('salsa')
        ? readSauceChoices(params, items)
        : (saved?.sauces ?? {}),
    omittedIngredients: params.has('plato')
      ? readOmissions(params, items)
      : (saved?.omittedIngredients ?? {}),
    table: included ? design : null,
  }
  const result = quoteSchema.safeParse(values)
  let step = draft ? steps.findIndex(({ id }) => id === draft.step) : 0
  if (localPhone === null)
    step = Math.min(
      step,
      steps.findIndex((part) => part.id === 'contact'),
    )
  if (!result.success) {
    const invalid = new Set(result.error.issues.map((issue) => issue.path[0]))
    const first = steps.findIndex((part) => part.fields.some((field) => invalid.has(field)))
    step = Math.min(step, first >= 0 ? first : 0)
  }
  const review = step === steps.length - 1 ? result.data : undefined
  const furthestStep = draft?.editingReview
    ? steps.length - 1
    : Math.max(
        step,
        steps.findIndex(({ id }) => id === (draft?.furthestStep ?? draft?.step)),
      )
  return {
    key,
    values,
    design,
    step,
    furthestStep,
    review: review ?? null,
    attempt: draft?.attempt ?? null,
  }
}

export function saveDraft(
  key: string,
  step: number,
  { table, ...values }: QuoteRequest,
  design: TableDesign,
  attempt: { id: string; payload: string } | null,
  furthestStep: number,
) {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        step: steps[step].id,
        values,
        design: table ?? design,
        included: !!table,
        furthestStep: steps[furthestStep].id,
        attempt,
      }),
    )
  } catch {
    // The form remains usable with session storage disabled.
  }
}

export function clearDraft(key: string) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // Storage is optional.
  }
}
