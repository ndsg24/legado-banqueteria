import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from '@legado/brand/controls'

const meta = {
  title: 'Moléculas/Formularios/Campo de texto',
  id: 'componentes-campo-de-texto',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Nombre', icon: 'name', placeholder: 'Nombre de contacto' },
} satisfies Meta<typeof TextField>
export default meta

type Story = StoryObj<typeof meta>
export const Basico: Story = {}
export const ConPrefijo: Story = {
  args: {
    label: 'Teléfono',
    icon: 'phone',
    fixedPrefix: '+56',
    placeholder: '9 0000 0000',
    type: 'tel',
  },
}
export const ConError: Story = {
  args: {
    label: 'Correo',
    icon: 'email',
    error: 'Ingresa un correo válido.',
    type: 'email',
    placeholder: '',
  },
}
