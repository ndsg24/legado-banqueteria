import type { Meta, StoryObj } from '@storybook/react-vite'
import { Brand, LanguagePicker, ThemeToggle } from '@legado/brand/controls'
import { useGlobals } from 'storybook/preview-api'
import { isTheme } from '@legado/brand/theme'
import { Controls } from './Controls'

const meta = {
  title: 'Moléculas/Controles compartidos',
  id: 'componentes-controles-compartidos',
  component: Controls,
} satisfies Meta<typeof Controls>
export default meta

export const Coleccion: StoryObj<typeof meta> = {}

export const MarcaYPreferencias: StoryObj<typeof meta> = {
  render: function Preferences() {
    const [globals, updateGlobals] = useGlobals()
    return (
      <div className="ds-header" data-tone="navigation">
        <Brand />
        <ThemeToggle
          theme={isTheme(globals.theme) ? globals.theme : 'light'}
          onChange={(theme) => updateGlobals({ theme })}
        />
        <LanguagePicker />
      </div>
    )
  },
}
