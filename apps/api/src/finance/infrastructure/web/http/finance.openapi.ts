import { z } from 'zod'
import { movementSchema, categories } from '@legado/domain/operations/finance'
import { json, secured, denied, object, number } from '../../../../shared'

export const financePaths = {
  '/admin/ledger': {
    get: {
      operationId: 'listLedger',
      summary: 'List CLP sales and cash movements and totals across all matching pages.',
      security: secured,
      parameters: [
        {
          name: 'month',
          in: 'query',
          schema: { type: 'string', pattern: '^[0-9]{4}-(0[1-9]|1[0-2])$' },
        },
        { name: 'quoteNumber', in: 'query', schema: number },
        { name: 'category', in: 'query', schema: { type: 'string', enum: categories } },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100000, default: 1 },
        },
      ],
      responses: {
        200: {
          description: 'Ledger page with filtered totals in CLP.',
          content: json(
            object({
              items: {
                type: 'array',
                items: z.toJSONSchema(movementSchema.extend({ quoteAvailable: z.boolean() })),
              },
              breakdown: { type: 'object', additionalProperties: { type: 'integer' } },
              ...Object.fromEntries(
                [
                  'page',
                  'pageSize',
                  'total',
                  'income',
                  'expenses',
                  'balance',
                  'profit',
                  'sales',
                ].map((k) => [k, { type: 'integer' }]),
              ),
            }),
          ),
        },
        400: { description: 'Invalid filters.' },
        ...denied,
      },
    },
    post: {
      operationId: 'recordMovement',
      summary: 'Record a sale, collection or expense in CLP. Retry with the same ID and body.',
      security: secured,
      requestBody: { required: true, content: json(z.toJSONSchema(movementSchema)) },
      responses: {
        204: { description: 'Recorded or previously recorded.' },
        400: { description: 'Invalid input.' },
        404: { description: 'Unknown quote.' },
        409: { description: 'ID already used for different data.' },
        ...denied,
      },
    },
  },
}
