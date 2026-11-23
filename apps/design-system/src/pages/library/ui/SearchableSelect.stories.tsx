import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchableSelect } from '@legado/brand/controls'

const meta = {
  title: 'Moléculas/Formularios/Selector con búsqueda',
  component: SearchableSelect,
  args: {
    label: 'Estado',
    listLabel: 'Estados',
    defaultValue: 'confirmed',
    options: [
      { id: 'active', label: 'Activas' },
      { id: 'requested', label: 'Por confirmar' },
      { id: 'confirmed', label: 'Confirmada' },
      { id: 'cancelled', label: 'Cancelada' },
    ],
    search: { label: 'Buscar', placeholder: 'Buscar', empty: 'Sin resultados' },
    onChange: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchableSelect>
export default meta

type Story = StoryObj<typeof meta>

export const ConBusqueda: Story = {}

export const BusquedaBloqueada: Story = {
  args: { search: { label: 'Buscar', placeholder: 'Buscar', isDisabled: true } },
}
