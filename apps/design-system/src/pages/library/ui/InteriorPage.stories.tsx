import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGlobals } from 'storybook/preview-api'
import { isTheme } from '@legado/brand/theme'
import { InteriorPage } from '../../../../../web/src/widgets/site-layout'

const meta = { title: 'Plantillas/Sitio público/Página interior' } satisfies Meta
export default meta

export const ConContenidoDeEjemplo: StoryObj<typeof meta> = {
  render: function Template() {
    const [globals, updateGlobals] = useGlobals()
    return (
      <InteriorPage
        appearance={{
          theme: isTheme(globals.theme) ? globals.theme : 'light',
          setTheme: (theme) => updateGlobals({ theme }),
        }}
        section="carta"
        topHref="#contenido"
        mainId="contenido"
        backHref="/"
        backLabel="Volver al inicio"
        current="Página interior"
      >
        <article className="ds-specimen">
          <h1>Página interior</h1>
          <p>Área principal para el contenido de la ruta.</p>
        </article>
      </InteriorPage>
    )
  },
}
