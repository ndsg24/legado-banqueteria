import { z } from 'zod'
import { recipeSchema } from '@legado/domain/operations/recipes'
import { json, secured, denied } from '../../../../shared'

const purchaseResponse = z.object({
  guests: z.number(),
  events: z.array(
    z.object({
      number: z.string(),
      date: z.iso.date(),
      guests: z.number(),
      missingRecipes: z.array(z.string()),
    }),
  ),
  lines: z.array(
    z.object({
      name: z.string(),
      unit: z.enum(['g', 'ml', 'unit']),
      amount: z.number(),
      orders: z.array(z.object({ number: z.string(), amount: z.number() })),
    }),
  ),
})

export const kitchenPaths = {
  '/admin/purchasing': {
    get: {
      operationId: 'getPurchasingPlan',
      summary: 'Consolidated ingredient estimates for confirmed events.',
      security: secured,
      parameters: ['from', 'to'].map((name) => ({
        name,
        in: 'query',
        required: true,
        schema: { type: 'string', format: 'date' },
      })),
      responses: {
        200: {
          description: 'Confirmed events, missing recipes and totals with per-event allocations.',
          content: json(z.toJSONSchema(purchaseResponse)),
        },
        400: { description: 'Invalid period or more than 31 inclusive days.' },
        ...denied,
      },
    },
  },
  '/admin/recipes': {
    get: {
      operationId: 'listRecipes',
      summary: 'Current kitchen recipes keyed by catalog dish ID.',
      security: secured,
      responses: {
        200: {
          description: 'Saved kitchen yields per serving.',
          content: json({ type: 'object', additionalProperties: z.toJSONSchema(recipeSchema) }),
        },
        ...denied,
      },
    },
    post: {
      operationId: 'saveRecipe',
      summary: 'Save yields for one dish. Use revision zero for a new recipe.',
      security: secured,
      requestBody: { required: true, content: json(z.toJSONSchema(recipeSchema)) },
      responses: {
        204: { description: 'Recipe saved.' },
        400: { description: 'Invalid recipe.' },
        409: { description: 'Stale revision.' },
        ...denied,
      },
    },
  },
}
