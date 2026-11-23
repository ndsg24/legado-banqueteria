import { z } from 'zod'
import { json, secured, denied } from '../../../../shared'
import { profileResponse } from './dtos/responses/profile.response.dto'
import { loginRequest } from './dtos/requests/login.request.dto'
import { refreshRequest } from './dtos/requests/refresh.request.dto'
import { sessionResponse } from './dtos/responses/session.response.dto'
function authOperation(
  id: string,
  summary: string,
  input: typeof loginRequest | typeof refreshRequest,
) {
  return {
    operationId: id,
    summary,
    requestBody: { required: true, content: json(z.toJSONSchema(input)) },
    responses: {
      ...(id === 'logout'
        ? { 204: { description: 'Session revoked.' } }
        : {
            200: {
              description: 'Short-lived JWT and single-use refresh token.',
              content: json(z.toJSONSchema(sessionResponse)),
            },
          }),
      400: { description: 'Invalid request body.' },
      ...denied,
    },
  }
}

export const identityPaths = {
  '/auth/login': {
    post: authOperation('login', 'Sign in with email and password', loginRequest),
  },
  '/auth/refresh': {
    post: authOperation('refresh', 'Rotate a single-use refresh token', refreshRequest),
  },
  '/auth/logout': {
    post: authOperation('logout', 'Revoke the session and its tokens', refreshRequest),
  },

  '/admin/profile': {
    get: {
      operationId: 'getAdminProfile',
      summary: 'Read the signed-in administrator profile',
      security: secured,
      responses: {
        200: {
          description: 'Public account fields',
          content: json(z.toJSONSchema(profileResponse)),
        },
        ...denied,
      },
    },
  },
  '/admin/session': {
    get: {
      operationId: 'checkAdminSession',
      summary: 'Verify admin credentials',
      security: secured,
      responses: { 204: { description: 'Authenticated.' }, ...denied },
    },
  },
}
