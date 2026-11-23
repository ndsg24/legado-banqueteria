import type { Meta, StoryObj } from '@storybook/react-vite'
import { CatalogExample, GalleryExample, QuoteExample, TableSamples } from './PublicPatterns'

const meta = { title: 'Organismos/Sitio público', id: 'sitio-publico-patrones' } satisfies Meta
export default meta

type Story = StoryObj<typeof meta>
export const Galeria: Story = { render: () => <GalleryExample /> }
export const Carta: Story = { render: () => <CatalogExample /> }
export const Ambientacion: Story = { name: 'Ambientación', render: () => <TableSamples /> }
export const CamposDelCotizador: Story = { render: () => <QuoteExample /> }
