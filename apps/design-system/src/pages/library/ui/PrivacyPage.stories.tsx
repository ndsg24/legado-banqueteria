import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGlobals } from 'storybook/preview-api'
import { isTheme } from '@legado/brand/theme'
import { PrivacyPage } from '../../../../../web/src/pages/privacy'

const meta = { title: 'Páginas/Sitio público/Privacidad' } satisfies Meta
export default meta

export const AvisoDePrivacidad: StoryObj<typeof meta> = {
  render: function Privacy() {
    const [globals, updateGlobals] = useGlobals()
    return (
      <PrivacyPage
        appearance={{
          theme: isTheme(globals.theme) ? globals.theme : 'light',
          setTheme: (theme) => updateGlobals({ theme }),
        }}
      />
    )
  },
}
