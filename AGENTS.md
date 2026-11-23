# Guía de trabajo de Legado Banquetería

## Desarrollo y verificación

Usa Node.js 22 y el archivo de bloqueo de npm. Desde un checkout nuevo, ejecuta
`npm ci --ignore-scripts`. `npm run dev` sirve el sitio bajo `/legado-banqueteria/`.

- `npm run format` da formato al código y a las hojas de estilo. Prettier usa
  100 columnas como objetivo, dos espacios, comillas simples en JS/TS y omite el punto y coma final.
- ESLint impone un máximo de **120 caracteres por línea** en JS, TS y TSX,
  incluidos el Worker y las pruebas. Divide props, expresiones o datos largos donde conserven su significado.
- `npm run check` comprueba el formato, ejecuta ESLint y compila con TypeScript y Vite.
- Después de compilar, `npm run test:e2e` sirve el contenido de `dist/web/` y ejecuta
  Playwright en escritorio y móvil. Para instalar Chromium por primera vez, usa
  `npx playwright install chromium`. Si ya tienes Chrome, puedes ejecutar
  `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`.

## Skills del proyecto

Elige la skill según el cambio y lee su `SKILL.md` desde el catálogo de la sesión.
Estas referencias sirven tanto para el sitio público como para el admin.

| Trabajo | Skills de referencia |
| --- | --- |
| Diseñar una vista o pulir una existente | `frontend-design` para la composición, `impeccable` para revisar y pulir, `ui-ux-pro-max` para resolver decisiones de interacción. Usa las fuentes, los controles y los cuatro temas de Legado. |
| Revisar accesibilidad y experiencia de uso | `web-design-guidelines` para la auditoría y `responsive-design` para los ajustes entre móvil, iPad y escritorio. |
| Refactorizar React o investigar renders | `vercel-composition-patterns` para la API de componentes y `vercel-react-best-practices` para rendimiento. Aplica las pautas compatibles con React, Vite y FSD. |
| Trabajar en transiciones o documentación | `vercel-react-view-transitions` cuando se pidan transiciones entre vistas y `writing-guidelines` al revisar la redacción. |
| Trabajar en Nx o en la API | `nx-workspace` para proyectos y targets. Para Nest, sigue la [guía del backend](apps/api/AGENTS.md). |

## Arquitectura por aplicación

El backend sigue arquitectura hexagonal, DDD y CQRS según la [guía de la API](apps/api/AGENTS.md).
Consulta esa guía al trabajar en Nest o en contratos consumidos por la API. Toda operación se define en inglés, con versión mayor en la URL, documentación Swagger/OpenAPI y una petición Bruno verificable.

### Frontend con Feature-Sliced Design

**Toda aplicación web del monorepo debe usar Feature-Sliced Design (FSD).** Esta regla
aplica al sitio público, al panel administrativo y a cualquier frontend que se incorpore.
Usa [apps/web/src](apps/web/src/) como referencia para organizar las capas, los slices
y sus entradas públicas. Nombra los slices según las funcionalidades propias de cada
aplicación. Al crear o refactorizar una funcionalidad, ubícala en la capa correspondiente.
Las dependencias entre capas apuntan hacia las inferiores según el orden de la tabla.

El monorepo Nx separa `apps/web` (Pages), `apps/api` (Nest), `apps/admin` (panel React privado) y `libs/domain` (modelos compartidos). Ambos frontends consumen el logo, los selectores, las fuentes y las traducciones compartidas desde `@legado/brand` y `@legado/domain`. Las preferencias del panel usan el prefijo `legado-admin-`. Pages publica únicamente `dist/web`. El modo `dev:pilot` usa datos ficticios. Consulta `docs/privacidad.md` al modificar la recolección o el almacenamiento.

React Router monta las rutas desde `apps/web/src/app/main.tsx`. Usa `Link` para navegación interna
y conserva las rutas públicas, sus metadatos y los HTML generados para GitHub Pages. Las capas se ordenan así, de mayor a menor responsabilidad.

| Capa | Qué se ubica allí |
| --- | --- |
| `app` | Entradas, montaje React, proveedores, transición de página y cascada CSS global. |
| `pages` | Composición por ruta: home, catalog, table y quote. Las secciones exclusivas de la portada viven en home. |
| `widgets` | Bloques completos: navegación y pie, galería, explorador de carta, diseñador y wizard. |
| `features` | Interacciones de selección de platos y salsas, y previsualización de la mesa. |
| `entities` | Modelos de carta, mesa y cotización, sus reglas y los datos de negocio. |
| `shared` | Controles visuales genéricos, tema, rutas públicas y configuración común. |

Dentro de un slice usa `ui/` para la interfaz, `model/` para estado y reglas, y `lib/`
para funciones y motores internos. Importa desde su `index.ts` al cruzar el límite del slice.
Los imports internos son relativos y directos. ESLint comprueba la dirección entre capas
y las entradas públicas, incluidas las cargas dinámicas.

Las dependencias entre entidades se declaran en la entidad de destino. Los modelos de cotización consumen las entradas `libs/domain/{menu,table}/for-quote.ts`.
Las APIs visuales de carta y mesa están en `entities/menu/ui.ts` y `entities/table/ui.ts`; la entrada de datos se puede importar
desde el Worker. En Shared, `routing` y `theme` tienen un índice público. Cada control de
`shared/ui` y cada módulo en `shared/config` se consume por separado.

El Worker permanece en `worker/` y los recorridos de navegador en `tests/`. Conserva la carga
diferida del PDF y las escenas 3D, el orden de los estilos, las anclas, las claves de
almacenamiento, los identificadores de platos y los parámetros de los diseños compartidos.

### Atomic Design para la interfaz

**La interfaz del sitio, el panel y Storybook se compone con Atomic Design.** FSD
define la responsabilidad y las dependencias de cada slice. Atomic Design define
cómo se compone su interfaz.

- **Fundamentos.** Tokens, fuentes y motivos compartidos de `libs/brand`.
- **Átomos.** Piezas visuales de una responsabilidad, como botones, iconos y etiquetas.
- **Moléculas.** Grupos de piezas que realizan una tarea acotada, como un campo con
  etiqueta y error, un selector o una paginación.
- **Organismos.** Bloques de interfaz completos, como el visor de galería, la ficha
  de plato, el asistente de cotización o la navegación del panel.
- **Plantillas.** Estructuras reutilizables que distribuyen encabezado, navegación
  y áreas de contenido. Viven con el layout que las compone.
- **Páginas.** Instancias de las plantillas con el contenido y los estados de una
  ruta real. Viven en los slices de `pages`.

Clasifica los controles de marca compartidos dentro de `libs/brand/ui` y consúmelos
desde sus entradas públicas. Dentro de las aplicaciones, conserva las capas FSD y
clasifica cada pieza dentro del slice propietario. En Storybook, organiza las
historias por nivel y muestra los estados relevantes del componente real.

## Identidad visual en todo el sitio

- La paleta y la escala tipográfica compartidas viven en `libs/brand/styles/tokens.css`.
  Usa `--canvas` y `--surface` para fondos, `--ink` y `--muted` para texto y `--line`
  para separadores. Usa `--gold` y `--gold-hot` para acentos, `--on-gold` para texto
  sobre dorado y `--error` para validación. Deriva velos y sombras con `color-mix`
  sobre estos colores. Si falta un rol de interfaz, defínelo aquí para Día, Noche, Jardín y Piscina. Jardín combina fondo bosque, superficies laurel,
  texto marfil y acciones champagne. Piscina usa agua clara, tinta azul petróleo y acentos turquesa.
  Los colores elegidos para manteles, vajilla y flores pertenecen al diseño de la mesa.
- Compara cada elemento nuevo con su equivalente en la carta o el diseñador. En el sitio público, usa
  Syne para títulos y opciones, Manrope para texto y controles e Instrument Serif
  para acentos editoriales. Reutiliza la escala `--type-*`, incluidos pesos,
  interlineados y tamaños móviles.
- Usa `ActionButton` para acciones y `ActionLink` para los enlaces de acción principal.
  La variante secundaria de `ActionButton` sirve para descargas y acciones auxiliares.
  Las acciones principales doradas comparten la clase `button--gold`, con esquinas rectas,
  texto en mayúsculas y fondo `--gold` de cada tema. Al pasar el cursor usan `--gold-hot`.
- Reutiliza `DottedTexture` de `apps/web/src/shared/ui/` para los fondos de puntos. La clase
  compartida `table-watermark` aplica el sello de la mesa en tinta tenue del tema.
  El pie común lo presenta en todas las páginas y el cotizador lo incorpora al formulario.
  Ajusta su posición o tamaño con `--table-mark-position` y `--table-mark-size`.
  Comprueba que el motivo quede detrás del contenido y que las etiquetas, el foco y
  los mensajes de error se lean en los cuatro temas, también en celular.

## Flujos que conviene preservar

- **Inicio y galería.** Los enlaces a capítulos funcionan desde todas las páginas.
  Las fotos conservan sus proporciones. El visor admite teclado, gestos y cierre con Escape,
  devuelve el foco a la miniatura y mantiene los controles fijos al cambiar de foto.
- **Carta y cotizador.** La carta pública exhibe la oferta. La selección ocurre en el
  cotizador. Las salsas se muestran en la carta y en el cotizador se asocian al principal.
  Mantén las reglas de negocio en `libs/domain/menu/` y `libs/domain/quote/`. El cliente, Nest y el Worker
  comparten el esquema Zod. Los campos usan React Hook Form y los controles interactivos, React Aria.
- **Mesa.** Comprueba que las opciones editadas sobrevivan a una recarga y viajen al
  cotizador. Mantén la carga diferida de Three.js y del PDF, libera recursos al desmontar
  y conserva la alternativa HTML si WebGL falla.
- **Presentación.** Reutiliza los colores de tema. Comprueba teclado, foco, modo claro,
  modo oscuro, Jardín, Piscina y movimiento reducido cuando cambies una interacción.

## Publicación

GitHub Actions compila y prueba la revisión de `main` antes de desplegar `dist/web/` en Pages.
Las rutas de recursos del cliente usan `import.meta.env.BASE_URL`. Las vistas previas
sociales necesitan una URL pública absoluta en los HTML.

La configuración de correo del Worker y las variables públicas de Vite se detallan
en el README. Guarda la clave del proveedor únicamente en los secretos del Worker.
Incluye en `apps/web/public/` los recursos que consume el sitio y deja los videos promocionales
fuera del despliegue.

## Seguridad

El alcance del sitio estático y del Worker, la verificación de dependencias y los controles
operativos están en la [guía de seguridad](docs/seguridad.md). Ejecuta `npm run audit:security`
al modificar dependencias o preparar una publicación.

## Idiomas

El catálogo de español de Chile define el idioma inicial y el tipo `MessageKey`.
En `libs/domain/i18n/locales/{es,en,fr,pt}/` cada archivo JSON reúne una página
(`home`, `catalog`, `table`, `quote`) o contenido compartido (`common`, `menu`).
Usa claves estables por sección, como `home.hero.titleLead` o
`menu.dishes.salados-1.name`. Añade cada clave a los cuatro idiomas.
En componentes usa `useI18n()` y traduce al presentar el contenido.
Conserva los mismos marcadores con nombre, como `{count}`, en todas las versiones.
Ejecuta `npm run check:i18n` para verificar los catálogos.

Formatea las fechas con la configuración regional activa y conserva la zona horaria
de Santiago para los eventos. Los identificadores, los valores que valida el Worker
y los textos escritos por los visitantes deben conservarse al cambiar de idioma.

## Panel administrativo

Aplica la [dirección visual del panel](apps/admin/AGENTS.md#dirección-visual-del-panel) a cada pantalla administrativa. La tipografía, las superficies, los iconos y los estados interactivos usan el sistema de marca y responden al tema elegido en el admin.

Web y admin importan los mismos componentes de marca y de formulario desde `@legado/brand/controls` y sus estilos compartidos. Si un control existente se necesita en ambas apps, muévelo a la biblioteca y conserva su API pública en el sitio. Mantén idioma, tema y preferencias independientes. Las tablas de gestión son semánticas, paginadas y ofrecen búsqueda y filtros aplicados en la API, con estado en la URL, acceso por teclado y navegación de vuelta al resultado. Verifica escritorio, iPad y móvil. Sigue la guía de DTO de request y response, mappers, presenters y autenticación del backend en `apps/api/AGENTS.md`.
