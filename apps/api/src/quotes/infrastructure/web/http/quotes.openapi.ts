import { z } from 'zod'
import { quoteSortFields, quoteStatuses } from '@legado/domain/quote/history'
import {
  eventDateUnavailableCode,
  quoteAvailabilitySchema,
} from '@legado/domain/quote/availability'
import { quoteSchema } from '@legado/domain/quote/request'
import { eventCodes } from '@legado/domain/quote/wire'
import { json, secured, denied, object, number, string, ref } from '../../../../shared'
const event = { type: 'string' as const, enum: Object.values(eventCodes) }
const status = { type: 'string' as const, enum: quoteStatuses }
const statusFilter = {
  in: 'query',
  name: 'status',
  schema: { type: 'string', enum: [...quoteStatuses, 'active'] },
  description: 'Active groups requested and confirmed quotes.',
}
const quote = z.toJSONSchema(quoteSchema, { io: 'input' })
quote.properties!.event = event

export const quoteSchemas = {
  Quote: quote,
  QuoteAvailability: z.toJSONSchema(quoteAvailabilitySchema),
  QuoteSummary: object({
    number,
    event,
    status,
    guests: string,
    location: string,
    date: { type: 'string', format: 'date' },
  }),
  QuoteDetail: {
    ...object({
      number,
      status,
      payload: ref('Quote'),
      dateBookedByAnotherEvent: { type: 'boolean' },
    }),
    required: ['number', 'status', 'payload'],
  },
  QuotePage: object({
    items: { type: 'array', maxItems: 25, items: ref('QuoteSummary') },
    total: { type: 'integer', minimum: 0 },
    page: { type: 'integer', minimum: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 25 },
    nextCursor: { anyOf: [number, { type: 'null' }] },
  }),
}

export const quotePaths = {
  '/quotes': {
    post: {
      operationId: 'receiveQuote',
      summary: 'Submit a quote request',
      description:
        'Reuse the UUID when retrying the same request. Use an @example.test email, an upcoming date, ' +
        'and empty phone and free-text fields. Catalog IDs and place names are stable business data.',
      parameters: [
        {
          in: 'header',
          name: 'Origin',
          required: true,
          schema: string,
          description: 'Pilot website origin (http://127.0.0.1:5185) or local Swagger UI origin.',
        },
      ],
      requestBody: {
        required: true,
        content: json(object({ id: { type: 'string', format: 'uuid' }, quote: ref('Quote') })),
      },
      responses: {
        202: {
          description: 'Accepted, including an identical retry.',
          content: json(object({ accepted: { const: true } })),
        },
        400: { description: 'Malformed JSON.' },
        403: { description: 'Origin is not allowed.' },
        409: {
          description: 'Date already booked or UUID already used for a different payload.',
          content: json({
            oneOf: [
              object({ code: { const: eventDateUnavailableCode }, message: string }),
              object({ statusCode: { const: 409 }, error: string, message: string }),
            ],
          }),
        },
        413: { description: 'Payload exceeds 16 KiB.' },
        415: { description: 'Expected application/json and an uncompressed body.' },
        422: { description: 'Invalid quote or pilot data.' },
        429: { description: 'Request limit exceeded.' },
      },
    },
  },
  '/quotes/availability': {
    get: {
      operationId: 'getQuoteAvailability',
      summary: 'List unavailable event dates',
      description:
        'Confirmed dates from today through one year ahead, inclusive, in America/Santiago.',
      responses: {
        200: {
          description: 'Sorted ISO calendar dates. Pending requests do not reserve dates.',
          content: json(ref('QuoteAvailability')),
        },
        429: { description: 'Request limit exceeded.' },
      },
    },
  },
  '/admin/quotes': {
    get: {
      operationId: 'listQuotes',
      summary: 'Search, sort and paginate retained quotes',
      security: secured,
      parameters: [
        {
          in: 'query',
          name: 'before',
          schema: number,
          description: 'Exclusive quote number. Available with descending number order.',
        },
        {
          in: 'query',
          name: 'search',
          description: 'Exact quote number or part of a municipality name.',
          schema: { type: 'string', maxLength: 80 },
        },
        {
          in: 'query',
          name: 'sort',
          schema: { type: 'string', enum: quoteSortFields, default: 'number' },
        },
        {
          in: 'query',
          name: 'direction',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        },
        ...['from', 'to'].map((name) => ({
          in: 'query',
          name,
          schema: { type: 'string', format: 'date' },
          description: 'Inclusive event date boundary.',
        })),
        { in: 'query', name: 'event', schema: event },
        statusFilter,
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', minimum: 1, maximum: 1000000, default: 1 },
        },
        {
          in: 'query',
          name: 'pageSize',
          schema: { type: 'integer', minimum: 1, maximum: 25, default: 25 },
        },
      ],
      responses: {
        200: { description: 'Quote summaries', content: json(ref('QuotePage')) },
        400: { description: 'Invalid cursor.' },
        ...denied,
      },
    },
  },
  '/admin/quotes/calendar': {
    get: {
      operationId: 'getQuoteCalendar',
      summary: 'Count events and guests by day',
      description: 'Defaults to active quotes. Pass a specific status to narrow the calendar.',
      security: secured,
      parameters: [
        {
          in: 'query',
          name: 'month',
          required: true,
          schema: { type: 'string', pattern: '^[0-9]{4}-(0[1-9]|1[0-2])$' },
        },
        statusFilter,
      ],
      responses: {
        200: {
          description: 'Occupied dates in the selected month',
          content: json({
            type: 'array',
            items: object({
              event,
              date: { type: 'string', format: 'date' },
              count: { type: 'integer' },
              guests: { type: 'integer' },
            }),
          }),
        },
        400: { description: 'Invalid month.' },
        ...denied,
      },
    },
  },
  '/admin/quotes/{number}/status': {
    post: {
      operationId: 'changeQuoteStatus',
      summary: 'Change the operational status of a retained quote',
      description:
        'New quotes are requested. Any status can be changed back. Send the previously observed status ' +
        'to detect concurrent changes. Repeating a change to the current status succeeds. ' +
        'Only one event may be confirmed for each Santiago calendar date. Cancelling or reopening ' +
        'a confirmed quote releases the reservation.',
      security: secured,
      parameters: [{ in: 'path', name: 'number', required: true, schema: number }],
      requestBody: { required: true, content: json(object({ expectedStatus: status, status })) },
      responses: {
        204: { description: 'Status updated or already current.' },
        400: { description: 'Invalid quote number or status change.' },
        404: { description: 'Unknown or expired quote.' },
        409: {
          description:
            'The status changed since it was read, or another event has reserved the date.',
          content: json({
            oneOf: [
              object({ statusCode: { const: 409 }, error: { const: 'Conflict' }, message: string }),
              object({
                statusCode: { const: 409 },
                error: { const: 'Conflict' },
                code: { const: 'EVENT_DATE_UNAVAILABLE' },
                message: string,
              }),
            ],
          }),
        },
        ...denied,
      },
    },
  },
  '/admin/quotes/{number}': {
    get: {
      operationId: 'getQuote',
      summary: 'Read one retained quote',
      security: secured,
      parameters: [{ in: 'path', name: 'number', required: true, schema: number }],
      responses: {
        200: { description: 'Quote details', content: json(ref('QuoteDetail')) },
        400: { description: 'Invalid quote number.' },
        404: { description: 'Unknown or expired quote.' },
        ...denied,
      },
    },
  },
}
