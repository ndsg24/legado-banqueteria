import type { Meta, StoryObj } from '@storybook/react-vite'
import { isTheme } from '@legado/brand/theme'
import { Foundations } from './Foundations'

const meta = {
  title: 'Fundamentos/Identidad visual',
  component: Foundations,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Paletas, escala tipográfica, motivos y valores CSS del tema activo.',
      },
    },
  },
} satisfies Meta<typeof Foundations>
export default meta

export const Fundamentos: StoryObj<typeof meta> = {
  args: { theme: 'light' },
  render: (_args, { globals }) => (
    <Foundations theme={isTheme(globals.theme) ? globals.theme : 'light'} />
  ),
}
