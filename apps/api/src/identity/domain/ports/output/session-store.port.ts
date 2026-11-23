export interface SessionStore {
  start(id: string, digest: string, expires: Date): Promise<void>
  rotate(presented: string, replacement: string): Promise<string | undefined>
  revoke(presented: string): Promise<void>
  active(id: string): Promise<boolean>
}
