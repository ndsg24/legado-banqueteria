const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim()

export const siteConfig = {
  brandName: 'Legado',
  email: 'legadobanqueteria@gmail.com',
  location: 'Concepción, Chile',
  themeStorageKey: 'legado-theme',
  whatsappUrl:
    whatsappNumber && /^[1-9]\d{7,14}$/.test(whatsappNumber)
      ? 'https://wa.me/' + whatsappNumber
      : undefined,
} as const
