import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionButton } from '@legado/brand/controls'

const meta = {
  title: 'Átomos/Acciones/Botón',
  id: 'componentes-botón-de-acción',
  component: ActionButton,
  tags: ['autodocs'],
  args: { children: 'Guardar cambios', variant: 'primary', isDisabled: false },
  argTypes: { variant: { control: 'inline-radio', options: ['primary', 'secondary'] } },
  parameters: {
    docs: {
      description: {
        component:
          'Usa la variante principal para confirmar y la secundaria para acciones auxiliares.',
      },
    },
  },
} satisfies Meta<typeof ActionButton>
export default meta

type Story = StoryObj<typeof meta>
export const Principal: Story = {}
export const Secundario: Story = { args: { variant: 'secondary', children: 'Descargar' } }
export const Deshabilitado: Story = { args: { isDisabled: true } }
