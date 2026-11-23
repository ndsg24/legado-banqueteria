import { contactEmail } from '@legado/domain/site/contact'

export const isQuotePilot = import.meta.env.DEV && import.meta.env.MODE === 'pilot'

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim()

export const siteConfig = {
  brandName: 'Legado',
  email: contactEmail,
  location: 'Concepción, Chile',
  whatsappUrl:
    whatsappNumber && /^[1-9]\d{7,14}$/.test(whatsappNumber)
      ? 'https://wa.me/' + whatsappNumber
      : undefined,
} as const
