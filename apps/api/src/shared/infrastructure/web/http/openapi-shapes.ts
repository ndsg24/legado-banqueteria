export const string = { type: 'string' }
export const number = { type: 'string', pattern: '^[1-9][0-9]{0,17}$' }
export function object(properties: Record<string, unknown>) {
  return {
    type: 'object',
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  }
}
export function json(schema: unknown) {
  return { 'application/json': { schema } }
}
export function ref(name: string) {
  return { $ref: '#/components/schemas/' + name }
}
export const secured = [{ adminBearer: [] }]
export const denied = {
  401: { description: 'Missing or incorrect credentials.' },
  429: { description: 'Too many attempts.' },
}
