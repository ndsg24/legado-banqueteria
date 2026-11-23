import '../../web/src/app/styles/index.css'
import '../../admin/src/app/styles.css'
import '@legado/brand/styles/dish-dialog.css'
import '../src/app/library.css'

import { isTheme } from '@legado/brand/theme'
import type { Preview } from '@storybook/react-vite'
import { themeNames } from '../src/shared/config/tokens'

import { PreviewFrame } from '../src/app/PreviewFrame'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Tema de Legado',
      toolbar: {
        title: 'Tema',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: Object.entries(themeNames).map(([value, title]) => ({ value, title })),
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    options: {
      storySort: {
        order: ['Fundamentos', 'Átomos', 'Moléculas', 'Organismos', 'Plantillas', 'Páginas'],
      },
    },
    backgrounds: { disable: true },
  },
  decorators: [
    (Story, { globals, id, parameters }) => (
      <PreviewFrame
        key={id}
        theme={isTheme(globals.theme) ? globals.theme : 'light'}
        isAdmin={parameters.interface === 'admin'}
      >
        <Story />
      </PreviewFrame>
    ),
  ],
}

export default preview
