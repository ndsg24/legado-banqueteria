import type { Meta, StoryObj } from '@storybook/react-vite'
import { NativeSelect } from '@legado/brand/controls'

const meta = {
  title: 'Átomos/Formularios/Selector',
  component: NativeSelect,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Estado de la cotización',
    defaultValue: 'confirmed',
    children: (
      <>
        <option value="requested">Por confirmar</option>
        <option value="confirmed">Confirmada</option>
        <option value="cancelled">Cancelada</option>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Usa NativeSelect con las opciones de HTML. ' +
          'Para búsqueda o contenido en las opciones, usa SelectTrigger dentro de un Select de React Aria.',
      },
    },
  },
} satisfies Meta<typeof NativeSelect>
export default meta

type Story = StoryObj<typeof meta>
export const Estado: Story = {}
export const Deshabilitado: Story = { args: { disabled: true } }
export const Invalido: Story = { args: { 'aria-invalid': true } }
