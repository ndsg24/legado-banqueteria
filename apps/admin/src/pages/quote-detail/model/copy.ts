import type { Language } from '@legado/brand/i18n'

const es = {
  sections: 'Secciones de la ficha',
  noMenu: 'Esta cotización se envió sin platos ni bebidas seleccionados.',
  noRequirements: 'Sin necesidades alimentarias registradas.',
  noNotes: 'Sin notas adicionales.',
  perGuest: 'por invitado',
}
export const dossierCopy: Record<Language, typeof es> = {
  es,
  en: {
    sections: 'Event sections',
    noMenu: 'This quote was submitted without any dishes or drinks selected.',
    noRequirements: 'No dietary requirements recorded.',
    noNotes: 'No additional notes.',
    perGuest: 'per guest',
  },
  fr: {
    sections: 'Rubriques de la fiche',
    noMenu: 'Ce devis a été envoyé sans sélection de plats ni de boissons.',
    noRequirements: 'Aucun besoin alimentaire renseigné.',
    noNotes: 'Aucune note supplémentaire.',
    perGuest: 'par personne',
  },
  pt: {
    sections: 'Seções da ficha',
    noMenu: 'Este orçamento foi enviado sem pratos ou bebidas selecionados.',
    noRequirements: 'Nenhuma necessidade alimentar registrada.',
    noNotes: 'Nenhuma observação adicional.',
    perGuest: 'por convidado',
  },
}
