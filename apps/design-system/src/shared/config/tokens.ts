import source from '@legado/brand/styles/tokens.css?raw'

export const tokenNames = [
  ...new Set(Array.from(source.matchAll(/^\s+(--[\w-]+):/gm), ([, name]) => name)),
]

export const themeNames = { light: 'Día', dark: 'Noche', garden: 'Jardín', pool: 'Piscina' }

export const coreColors = [
  '--canvas',
  '--surface',
  '--ink',
  '--muted',
  '--line',
  '--gold',
  '--gold-hot',
  '--error',
]
