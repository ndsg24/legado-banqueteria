export const themes = ['light', 'dark', 'garden', 'pool'] as const
export type Theme = (typeof themes)[number]

export function isTheme(value: string | null | undefined): value is Theme {
  return themes.some((theme) => theme === value)
}
