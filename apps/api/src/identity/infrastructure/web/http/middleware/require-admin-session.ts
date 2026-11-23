import type { RequestHandler } from 'express'
import type { QueryBus } from '@nestjs/cqrs'
import { ValidateSessionQuery } from '../../../../application/queries/validate-session/validate-session.query'

export function requireAdminSession(queries: QueryBus): RequestHandler {
  return async (req, res, next) => {
    const token = req.get('authorization')?.match(/^Bearer ([^ ]+)$/i)?.[1]
    const profile = token && (await queries.execute(new ValidateSessionQuery(token)))
    if (profile) {
      res.locals.adminProfile = profile
      return next()
    }
    res.set('WWW-Authenticate', 'Bearer').sendStatus(401)
  }
}
