# Panel de Legado

El frontend de `apps/admin` debe seguir la [regla FSD del monorepo](../../AGENTS.md#frontend-con-feature-sliced-design)
y la estructura base de [apps/web/src](../web/src/). Por ejemplo, el montaje del panel
corresponde a `app`, la página de historial a `pages` y la navegación lateral a `widgets`.

Aplica la guía raíz. Usa los mismos componentes de `@legado/brand` del sitio para marca, tema, idioma, botones y campos. Mantén cookies de sesión HttpOnly en el servidor del panel. El frontend usa el proxy del mismo origen. Aplica los colores de los cuatro temas y traduce los controles.

Los historiales de cotizaciones y movimientos usan tabla HTML con encabezados, búsqueda o filtros y paginación de servidor. En los índices del catálogo estático, filtra y pagina la colección local compartida con la web. Lleva los parámetros en la URL, reinicia en la primera página al filtrar y conserva el contexto al volver del detalle. Usa la transición compartida de `@legado/brand/page-transition` para la autenticación y la navegación con datos pendientes. Incluye estados de fallo y resultados vacíos. Comprueba los flujos con teclado, móvil, iPad y escritorio.

La cabecera, la barra lateral y el menú móvil comparten el fondo de navegación. La cabecera muestra la sección activa. Si el nombre se repite en el contenido, conserva el encabezado semántico para lectores de pantalla y muestra visualmente solo el contexto propio de la vista. Día usa blanco con texto e iconos oscuros, Noche el negro de marca, Jardín el verde bosque y Piscina el azul petróleo. En escritorio, el sidebar ocupa toda la altura desde el borde superior y contiene el logo. En móvil e iPad, el logo encabeza el menú de pantalla completa. Escritorio y el menú de pantalla completa de iPad y móvil consumen la misma lista de secciones. Los módulos previstos se distinguen de los enlaces operativos. El nombre y el avatar de iniciales proceden del perfil autenticado servido por la API.

## Dirección visual del panel

Selecciona la [skill del proyecto](../../AGENTS.md#skills-del-proyecto) según la tarea. Al aplicar sus sugerencias, contrasta la vista con el control equivalente de `@legado/brand` y verifica el resultado con las preferencias propias del panel.

Todas las vistas del panel ocupan el ancho disponible junto al sidebar. El layout compartido define los márgenes exteriores en escritorio, iPad y móvil para que los bordes del contenido coincidan al navegar.

El admin debe sentirse como una extensión de Legado: creativo en la composición, moderno en los controles y elegante en la lectura. Usa la cuadrícula del resumen para jerarquizar indicadores y gráficos, filas alineadas para comparar cotizaciones y una superficie propia para cada grupo de información del detalle. La textura de la portada pertenece al fondo. Deja espacio entre grupos y usa la escala tipográfica compartida para distinguir títulos, datos y texto auxiliar.

Usa Manrope como única familia tipográfica del admin y de su inicio de sesión.
Conserva la jerarquía mediante tamaño, peso, interlineado y cifras tabulares.
Marca las historias del panel con `parameters.interface = 'admin'`.

En el resumen, el próximo evento abre la pantalla con fecha, estado y acción principal
en una superficie del tema activo. La fotografía de Legado acompaña esa apertura. En ultrawide, los indicadores comparten la fila con el próximo evento.
Los indicadores mantienen una unidad y una etiqueta legible. El seguimiento
comercial y las finanzas conservan superficies de trabajo propias. Usa el acento
para distinguir acciones, filtros activos y estados con significado. Cuando dos paneles
compartan una fila, alinea sus bordes superior e inferior con el grid. Distribuye el
espacio dentro de cada panel entre sus datos y acciones. Si la composición deja huecos
grandes, agrupa contenido de densidad similar o mueve el panel corto a otra fila.

Cada vista y estado responde al tema independiente del admin. Usa los roles de `libs/brand/styles/tokens.css` para fondos, texto, iconos, bordes, gráficos, foco, selección y errores. La navegación usa `data-tone="navigation"` para mantener contraste entre el fondo, el logo y los controles de cada tema. Usa `admin-surface` para tarjetas y paneles con la misma elevación que el resumen. Los iconos heredan la tinta o el acento y los datos conservan etiquetas legibles al cambiar de color.

Al tocar una pantalla, recórrela en Día, Noche, Jardín y Piscina. Comprueba controles, menús desplegados y foco de teclado, además del reflujo en móvil e iPad. Mantén la selección de tema al recargar y usa el idioma activo para etiquetas, fechas y cifras.

Usa ApexCharts para comparar series o explorar desgloses, incluidas las barras y las donas. El componente compartido `ApexChart` registra cada tipo bajo demanda y aplica los colores, la tipografía y el idioma del panel.

Usa Recharts para medidores tipo velocímetro, indicadores de avance y minigráficos de una sola medida. Carga cada motor cuando su visualización esté presente. Conserva el acceso por teclado, una lectura textual de los valores y las unidades del indicador.

## Recorridos operativos

La agenda mensual abre con eventos confirmados y muestra el día elegido o próximo.
Desde la agenda del día se abre la preparación de un confirmado y la cotización
de una solicitud por confirmar. Conserva el filtro y la fecha al volver. Los
demás estados siguen disponibles en el filtro.

La preparación se abre para cotizaciones confirmadas y muestra porciones, despacho
y montaje en una sola ficha. Agrupa los platos según los tiempos de la cotización.
Las porciones se calculan con su menú y número de invitados. Los envases y las marcas
de despacho se gestionan en Compras. Reúne la foto y el nombre de cada plato o insumo
en su fila y conserva la información en la versión impresa.

El inicio, el historial y el calendario consumen el mismo estado de cotización. Solo una cotización por fecha del evento puede estar confirmada. La confirmación habilita el evento en Compras y reserva ese día en la agenda pública. Al cancelar o volver a pendiente se libera la fecha. Desde el pedido se puede rastrear cada cantidad hasta su evento y su preparación. Usa el cálculo de porciones de `@legado/domain/operations` tanto en la ficha individual como en el consolidado.

La edición de recetas y rendimientos ocurre en el Recetario. Preparación usa esos rendimientos para calcular insumos y enlaza al Recetario si falta una receta. Contenido del sitio revisa la información que presenta la carta pública. Los campos de presentación de la carta y las cantidades por porción tienen usos distintos.

La lista de módulos activos en `widgets/navigation/model/sections.ts` alimenta la barra lateral, el menú móvil y el buscador de teclado. Al añadir una ruta, verifica también el acceso por URL, el retorno tras el login y la restauración de sus filtros.
