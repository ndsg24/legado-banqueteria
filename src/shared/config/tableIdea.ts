import { tableSettings } from './heroPhoto'

export const isIdeasPreview = import.meta.env.DEV && import.meta.env.MODE === 'ideas'
export const ideasPath = '/ideas-de-la-casa.html'
export type TableIdea = (typeof tableSettings)[number]

export const sundayMenu = {
  main: 'principales-6',
  garnish: 'guarniciones-7',
  sauce: 'salsas-8',
} as const

export const tableIdeas = {
  dorada: {
    id: 'domingo',
    setting: {
      tablecloth: 'ivory',
      overlay: 'gold',
      sash: 'gold',
      napkin: 'gold',
      dinnerware: 'goldRim',
      napkinFold: 'duo',
      floral: 'white',
      flowerKind: 'daisy',
      flowerColor: 'ivory',
    },
  },
  floral: {
    id: 'azul-rey',
    setting: {
      tablecloth: 'ivory',
      overlay: 'royalBlue',
      sash: 'royalBlue',
      napkin: 'white',
      dinnerware: 'porcelain',
      napkinFold: 'crown',
      floral: 'cascade',
    },
  },
  burdeos: {
    id: 'burdeos',
    setting: {
      tablecloth: 'wine',
      overlay: 'wine',
      sash: 'wine',
      napkin: 'white',
      dinnerware: 'porcelain',
      napkinFold: 'doubleV',
      floral: 'burgundy',
    },
  },
} as const

export function readTableIdea(params: URLSearchParams) {
  return tableSettings.find((key) => tableIdeas[key].id === params.get('idea'))
}

export function tableIdeaHref(key: TableIdea) {
  const { id, setting } = tableIdeas[key]
  const params = new URLSearchParams({ idea: id, mesa: '1', chairCover: 'white', ...setting })
  if (key === 'dorada') {
    params.append('plato', sundayMenu.main)
    params.append('plato', sundayMenu.garnish)
    params.set('salsa', sundayMenu.main + ':' + sundayMenu.sauce)
  }
  return '/ambientacion.html?' + params
}
