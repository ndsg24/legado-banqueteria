import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'
import { z } from 'zod'
import { accessSeconds } from '../../domain/constants/session-lifetime'
import type { SessionCredentials } from '../../domain/ports/output/session-credentials.port'

export class PilotCredentials implements SessionCredentials {
  private readonly email = z.email().parse(process.env.ADMIN_EMAIL).trim().toLowerCase()
  readonly profile = {
    email: this.email,
    displayName: process.env.ADMIN_DISPLAY_NAME?.trim() || this.email.split('@')[0],
  }
  private readonly expected = this.hash(process.env.ADMIN_PASSWORD ?? '')
  private readonly key = Buffer.from(process.env.ADMIN_JWT_SECRET ?? '', 'hex')
  // Bind stored refresh digests and access claims to this configured pilot account.
  // Replacing its email, password or signing key invalidates existing sessions.
  private readonly credentialVersion = createHmac('sha256', this.key)
    .update(this.email)
    .update(this.expected)
    .digest('hex')
  constructor() {
    if (this.key.length < 32 || (process.env.ADMIN_PASSWORD?.length ?? 0) < 20)
      throw new Error('Configure a strong admin password and a 32-byte hexadecimal JWT key.')
  }
  private hash(value: string) {
    return createHash('sha256').update(value).digest()
  }
  matches(email: string, password: string) {
    return (
      timingSafeEqual(this.hash(password), this.expected) &&
      email.trim().toLowerCase() === this.email
    )
  }
  newId = randomUUID
  newRefresh = () => randomBytes(32).toString('base64url')
  digest = (value: string) =>
    createHmac('sha256', this.key).update(this.credentialVersion).update(value).digest('hex')
  issueAccess(id: string) {
    return new SignJWT({ sid: id, ver: this.credentialVersion })
      .setProtectedHeader({ alg: 'HS256', typ: 'at+jwt' })
      .setJti(randomUUID())
      .setSubject(this.email)
      .setIssuer('legado-api')
      .setAudience('legado-admin')
      .setIssuedAt()
      .setExpirationTime(accessSeconds + 's')
      .sign(this.key)
  }
  async verifyAccess(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.key, {
        algorithms: ['HS256'],
        issuer: 'legado-api',
        audience: 'legado-admin',
        typ: 'at+jwt',
        requiredClaims: ['exp', 'iat', 'sub', 'sid'],
      })
      if (
        payload.sub === this.email &&
        payload.ver === this.credentialVersion &&
        typeof payload.sid === 'string' &&
        z.uuid().safeParse(payload.sid).success
      )
        return payload.sid
    } catch {
      return undefined
    }
  }
}
