# Sistema de diseño de Legado

Storybook reúne el lenguaje visual del sitio público y del panel administrativo. Los ejemplos usan componentes y estilos del monorepo. La documentación del catálogo está en español y el selector de idiomas permite comprobar el contenido localizado de los componentes.

## Abrir y compilar

Con Node.js 22 y las dependencias del lockfile instaladas mediante `npm ci --ignore-scripts`:

```sh
npm run storybook
```

Abre [Storybook local](http://127.0.0.1:6006/). Cada historia tiene una URL que puedes compartir. Cambia el tema en la barra de herramientas para recorrer los ejemplos en Día, Noche, Jardín y Piscina.

Para generar una versión estática ejecuta `npm run build-storybook`. El resultado queda en `dist/design-system/` y se puede servir con `npm run preview:design-system` o con un servidor estático. El sitio público sigue su publicación habitual desde `dist/web/`.

## Fundamentos

| Decisión | Uso | Fuente |
| --- | --- | --- |
| Superficies | `--canvas` para el lienzo, `--surface` para áreas secundarias y `--dish-surface` o `--quote-surface` para superficies del flujo correspondiente | [Tokens](../libs/brand/styles/tokens.css) |
| Texto y divisiones | `--ink` para lectura, `--muted` para texto auxiliar y `--line` para separadores | [Tokens](../libs/brand/styles/tokens.css) |
| Acción y validación | `--gold`, `--gold-hot` y `--on-gold` para acciones. `--error` con texto asociado al campo | [Acciones](../libs/brand/styles/actions.css), [campos](../libs/brand/styles/fields.css) |
| Tipografía | La web usa Syne para títulos y opciones, Manrope para lectura y controles e Instrument Serif para acentos. El admin usa Manrope en toda la interfaz. Elige el rol `--type-*` según la jerarquía | [Fuentes](../libs/brand/styles/fonts.css), [escala](../libs/brand/styles/tokens.css) |
| Marca y motivos | Usa el logo enlazado, la trama de puntos y el sello de mesa con los roles del tema. El sello aparece detrás del contenido | [Marca](../libs/brand/ui/atoms/Brand.tsx), [trama](../libs/brand/ui/atoms/DottedTexture.tsx), [sello](../libs/brand/styles/table-watermark.css) |
| Movimiento | La transición compartida informa esperas perceptibles del router. Respeta la preferencia de movimiento reducido | [Transición](../libs/brand/ui/organisms/PageTransition.tsx), [estilos](../libs/brand/styles/page-transition.css) |
| Fotografía y materiales | Conserva las proporciones de las fotos. Telas, vajilla y flores toman sus opciones del modelo de ambientación | [Galería](../apps/web/src/widgets/gallery), [muestras](../libs/brand/table), [opciones](../libs/domain/table/options.ts) |

Día usa fondos claros y tinta oscura. Noche usa negro de marca y texto claro. Jardín combina bosque, laurel, marfil y champaña. Piscina usa agua clara, tinta azul petróleo y turquesa. La navegación incorpora los roles de `data-tone="navigation"`. Los colores del montaje se eligen en el diseñador y pertenecen al diseño de mesa.

## Atomic Design y FSD

| Nivel | Ejemplos en Legado | Ubicación |
| --- | --- | --- |
| Fundamentos | Paletas, escala tipográfica y motivos | `libs/brand/styles` y `libs/brand/fonts` |
| Átomos | Botón, enlace, logo e iconos | `libs/brand/ui/atoms` o el slice propietario |
| Moléculas | Campo de texto, selector de preferencias, cantidad y paginación | `libs/brand/ui/molecules` o el slice propietario |
| Organismos | Transición, galería, diálogo de plato, cotizador y gráficos del panel | Biblioteca de marca o el slice que compone el bloque |
| Plantillas | Página interior de la web y estructura de navegación del panel | Layout del sitio y shell del panel |
| Páginas | Carta, ambientación, privacidad, historial y calendario | `pages` de la aplicación correspondiente |

FSD determina dónde vive cada pieza y qué dependencias puede tener. Usa el nivel
atómico para describir cómo se compone y para ubicar su historia en Storybook.
La plantilla de página interior y la página de privacidad muestran la diferencia
entre una estructura que recibe contenido y una ruta con su contenido real.

## Componentes y patrones

| Área | Qué reutilizar | Dónde ver el contexto completo |
| --- | --- | --- |
| Marca y preferencias | `Brand`, `ThemeToggle`, `ThemeOptions`, `LanguagePicker` y `LanguageOptions` | [Controles de marca](../libs/brand/ui/index.ts), [layout web](../apps/web/src/widgets/site-layout), [navegación admin](../apps/admin/src/widgets/navigation) |
| Acciones, campos e iconos | `ActionButton` para acciones, `ActionLink` para navegación, `TextField` para etiqueta, prefijo y error. Flechas editoriales para navegación de galería y `DialogCloseButton` para cierre con etiqueta accesible | [Controles de marca](../libs/brand/ui/index.ts), [cantidades](../apps/web/src/shared/ui/QuantityControl.tsx) |
| Portada, carta y galería | Capítulos con navegación por anclas, fotos con visor, tarjeta de plato, motivo por categoría y diálogo de ingredientes | [Portada](../apps/web/src/pages/home), [carta](../apps/web/src/widgets/catalog-browser), [galería](../apps/web/src/widgets/gallery), [componentes de plato](../libs/brand/catalog) |
| Mesa | Preajustes, muestras, plano de asientos y visor 3D compartido con carga diferida y alternativa HTML | [Diseñador](../apps/web/src/widgets/table-designer), [muestras y plano](../libs/brand/table), [visor 3D](../libs/brand/table/scene) |
| Cotización | Progreso por pasos, calendario, comuna, platos y salsas, restricciones alimentarias, montaje, contacto y revisión. Reserva la selección para este flujo | [Asistente](../apps/web/src/widgets/quote-wizard), [selección de menú](../apps/web/src/features/select-menu), [reglas](../libs/domain/quote) |
| Administración | Encabezados y superficies, tablas semánticas, filtros y paginación en URL, estado de cotizaciones, vacíos y gráficos con lectura textual | [Guía del admin](../apps/admin/AGENTS.md), [historial](../apps/admin/src/pages/quote-history), [resumen](../apps/admin/src/pages/dashboard), [controles del panel](../apps/admin/src/shared/ui) |

El catálogo incluye muestras interactivas. Para probar transiciones entre páginas o recorridos con persistencia y datos de operaciones, inicia los entornos locales descritos en el [README](../README.md#panel-privado-y-piloto-local). El filtro y la paginación de la muestra administrativa operan sobre datos ficticios con un router en memoria dentro de la historia. En el panel, los listados con datos de negocio filtran y paginan en la API.

En **Páginas → Panel administrativo → Resumen**, el dashboard real se puede recorrer
con datos ficticios y con la variante sin eventos próximos. La portada concentra
la fecha y la acción del siguiente servicio. Los indicadores, el seguimiento
comercial y las finanzas se leen como bloques de trabajo relacionados. Este ejemplo
usa la navegación, los componentes y los estilos del admin.

Para un selector de opciones simples usa `NativeSelect` de `@legado/brand/controls`.
Usa `SearchableSelect` para el menú con buscador y `SelectTrigger` cuando se
requiera una composición propia de React Aria. Para listas cortas que comparten
el diseño del menú, como el filtro de estado, bloquea el buscador con
`search.isDisabled`. Los controles comparten altura, superficie, borde, flecha,
foco y estados. Mantén la etiqueta y la lógica de selección en el formulario o filtro.

## Mantener el catálogo

1. Ubica la fuente de la pieza según su alcance. La biblioteca de marca sirve a ambas aplicaciones, y los patrones específicos viven en los slices FSD de su aplicación.
2. Extiende primero el componente o el token existente. Si agregas un rol de color, verifica su valor en los cuatro temas. La tabla del catálogo lee los nombres directamente de la hoja de tokens.
3. Añade o actualiza su historia en [los archivos `.stories.tsx`](../apps/design-system/src/pages/library/ui). Usa Args para exponer las variantes que convenga ajustar desde Controls. Documenta cuándo usarlo y muestra los estados que cambian su comportamiento, como error, vacío, deshabilitado o carga. Usa datos públicos o ficticios.
4. Recorre el ejemplo en escritorio, iPad y móvil. Comprueba foco visible, orden de tabulación, retorno de foco, movimiento reducido y etiquetas en los cuatro idiomas cuando corresponda.
5. Ejecuta `npm run check`. Incluye la compilación estática del catálogo además de las verificaciones del monorepo.
