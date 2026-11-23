import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdminPatterns } from './AdminPatterns'

const meta = {
  title: 'Organismos/Panel administrativo',
  id: 'panel-administrativo-patrones',
  component: AdminPatterns,
  parameters: { interface: 'admin' },
} satisfies Meta<typeof AdminPatterns>
export default meta

export const TablaEstadosYGrafico: StoryObj<typeof meta> = {}
