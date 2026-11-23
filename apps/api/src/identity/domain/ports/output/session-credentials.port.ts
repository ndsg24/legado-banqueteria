export interface SessionCredentials {
  readonly profile: { displayName: string; email: string }
  matches(email: string, password: string): boolean
  issueAccess(sessionId: string): Promise<string>
  verifyAccess(token: string): Promise<string | undefined>
  newRefresh(): string
  digest(token: string): string
  newId(): string
}
