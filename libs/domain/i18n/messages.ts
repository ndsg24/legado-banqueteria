import spanishMessages from '@legado/domain/i18n/locales/es'

export const languages = { es: 'Español', en: 'English', fr: 'Français', pt: 'Português' } as const
export type Language = keyof typeof languages
export const locales = { es: 'es-CL', en: 'en-US', fr: 'fr-FR', pt: 'pt-BR' } as const
export type MessageKey = keyof typeof spanishMessages
export type Messages = Readonly<Record<MessageKey, string>>
export type Translate = (key: MessageKey, values?: Record<string, string | number>) => string

export function isMessageKey(value: unknown): value is MessageKey {
  return typeof value === 'string' && Object.hasOwn(spanishMessages, value)
}

export function translator(messages: Messages): Translate {
  return (key, values) => {
    const message = messages[key]
    return values
      ? message.replace(/\{(\w+)\}/g, (token, name: string) => String(values[name] ?? token))
      : message
  }
}

export const spanish = translator(spanishMessages)

export function isLanguage(value: string | null): value is Language {
  return value !== null && Object.hasOwn(languages, value)
}
