<div align="center">

# 🍽️ Legado Banquetería

**Landing editorial para una banquetería familiar de Concepción, Chile.**
Cocina casera para matrimonios, encuentros y celebraciones.

[![Ver sitio](https://img.shields.io/badge/Ver_sitio-ndsg24.github.io%2Flegado--banqueteria-C8A24A?style=for-the-badge&logo=githubpages&logoColor=black)](https://ndsg24.github.io/legado-banqueteria/)
[![Deploy](https://github.com/ndsg24/legado-banqueteria/actions/workflows/pages.yml/badge.svg)](https://github.com/ndsg24/legado-banqueteria/actions/workflows/pages.yml)

<a href="https://ndsg24.github.io/legado-banqueteria/"><img src="https://github.com/user-attachments/assets/1984dd8a-36ac-4683-8fd7-58ca68be30f3" alt="Vista previa de Legado Banquetería" width="100%" /></a>

<img src="https://skillicons.dev/icons?i=react,ts,vite,css,githubactions" alt="React, TypeScript, Vite, CSS, GitHub Actions" />

</div>

---

## ✨ Características

- 🎨 **Diseño editorial** con tipografía expresiva, motivos decorativos y una identidad visual propia.
- 🌗 **Modo día / noche** con toggle persistente.
- 🧭 **Navegación por secciones** con indicador lateral de sección activa y soporte para enlaces con `#hash`.
- 🎞️ **Animaciones de entrada al hacer scroll** con IntersectionObserver y transiciones con Framer Motion.
- 📱 **Responsive** con menú móvil dedicado.
- 🔎 **SEO:** metadatos, Open Graph, URL canónica, `sitemap.xml` y `robots.txt`.
- 🚀 **Deploy continuo** a GitHub Pages con GitHub Actions.

## 🧱 Stack

| Área | Tecnologías |
|---|---|
| UI | React, TypeScript |
| Estilos | CSS con design tokens (`tokens.css`), layout y reglas responsive separadas |
| Animación | Framer Motion en secciones; GSAP y Three.js en hero, carta y estudio |
| Build | Vite |
| Calidad | Prettier, ESLint, TypeScript y Playwright |
| CI/CD | GitHub Actions → GitHub Pages |

## Sistema de diseño

Ejecuta `npm run storybook` y abre [Storybook de Legado](http://127.0.0.1:6006/).
Puedes explorar los cuatro temas, los controles compartidos y patrones del sitio y del panel.
`npm run build-storybook` genera el catálogo estático en `dist/design-system/`.
Consulta la [guía del sistema de diseño](docs/sistema-de-diseno.md) para mantener las historias y recorrer los flujos completos.

## Panel privado y piloto local

El repositorio usa Nx y npm workspaces. `apps/web` contiene el sitio público, `apps/admin` contiene el panel privado React, `apps/api` contiene NestJS, y `libs/domain` comparte las reglas de cotización, carta y mesa. `npx nx show projects` muestra los proyectos. GitHub Pages publica exclusivamente `dist/web`. El panel y la API tienen imágenes Docker independientes. El panel protege el HTML, los recursos y las consultas mediante autenticación en la API. Comparte identidad y traducciones con el sitio, con tema e idioma guardados por separado. GitHub Actions comprueba el historial y el acceso al panel.

Con Node 22 y Docker Compose v2, desde la raíz:

```sh
npm ci --ignore-scripts
npm run pilot:init
docker compose up -d --build --wait
npm run dev:pilot
```

`pilot:init` completa las variables que falten en `.env` con permisos privados. Conserva los valores existentes y genera secretos independientes para la base, el acceso al panel y la firma JWT. El volumen conserva las credenciales con las que se inicializó PostgreSQL.

1. Abre [el cotizador piloto](http://127.0.0.1:5185/legado-banqueteria/cotizar.html). Usa datos ficticios, un correo como `prueba@example.test` y el teléfono vacío. Al enviar se registra la solicitud en PostgreSQL.
2. Compose levanta también el panel. Si ejecutas Nest directamente, usa `npm run dev:admin` en otra terminal. `npm run build:admin` genera `dist/admin`. El servidor del panel usa `API_ORIGIN` (por defecto http://127.0.0.1:3000). Abre [el historial privado](http://127.0.0.1:5186/admin/). El [login](http://127.0.0.1:5186/admin/login) usa `ADMIN_EMAIL` y `ADMIN_PASSWORD` de tu `.env`. Ejecuta `npm run pilot:init` para completar un piloto anterior con las claves que falten. Puedes definir `ADMIN_DISPLAY_NAME` en el entorno de la API para personalizar el nombre que se ve junto al avatar. Si queda vacío se usa la parte del correo anterior a @. El JWT de acceso dura 10 minutos y la sesión tiene un plazo absoluto de 7 días. El proxy renueva mediante cookies HttpOnly, SameSite=Strict y Secure cuando `ADMIN_ORIGIN` usa HTTPS. Configura ese origen en el servidor del panel si cambias su dirección. Abre el número de solicitud para ver el detalle.
3. Sobre una base de prueba, ejecuta `npm run test:api` para verificar la recepción de una cotización ficticia y `npm run test:admin` para comprobar el acceso al panel. Con Chromium instalado, `npm run test:admin:ui` comprueba las preferencias independientes.
4. Para detener el piloto, cierra Vite con Ctrl+C y ejecuta `docker compose down`. El volumen conserva la base al reiniciar.

La imagen se construye independientemente mediante `docker build -f apps/api/Dockerfile -t legado-api .`. Las migraciones SQL se aplican al iniciar Nest bajo un bloqueo transaccional. La conexión requiere `DATABASE_URL`. PostgreSQL permanece en la red interna de Compose y el puerto del panel se enlaza a loopback. El modo habitual `npm run dev` conserva el flujo de correo del sitio. El piloto restringe el origen y los correos de prueba, purga solicitudes a los 30 días y carece de integración con el SII. Los plazos y controles para datos reales se deciden antes de habilitar otro entorno. [Privacidad y salida del piloto](docs/privacidad.md)

### Explorar el admin con datos de ejemplo

Con las dependencias instaladas, ejecuta desde la raíz lo siguiente:

```sh
npm run pilot:init
npm run demo:admin
```

Abre el [panel de demostración](http://localhost:5187/admin/) e inicia sesión con el correo y la contraseña del piloto. El perfil aparece como **Equipo demo**. En Calendario puedes abrir un evento confirmado para ver su menú, salsas, necesidades alimentarias y montaje. Compras consolida los ingredientes por evento. Finanzas muestra cobros, saldos y gastos en CLP. La carta, las imágenes y los diseños de mesa provienen del catálogo del sitio.

La demo usa su propia API en el puerto 3017 y la base `legado_admin_demo`. El primer arranque crea ejemplos con fechas relativas al día de Santiago. Los siguientes conservan las ediciones. La retención de cotizaciones del piloto también se aplica a la demo. El [panel habitual](http://127.0.0.1:5186/admin/) sigue recibiendo las solicitudes del cotizador.

Por defecto el comando inicia PostgreSQL con Docker Compose en el puerto local 55448. Si ya tienes PostgreSQL local, crea una base vacía llamada `legado_admin_demo` cuyo propietario sea el usuario de la demo y configura su conexión en `DEMO_DATABASE_URL` en `.env`. Ctrl+C cierra el panel y la API de demostración. Si usaste Docker, `docker compose -f compose.admin-demo.yaml stop` detiene también su base y conserva el volumen.

### API v1

[Swagger UI](http://127.0.0.1:3000/api/v1/docs) y [OpenAPI JSON](http://127.0.0.1:3000/api/v1/openapi.json) describen las operaciones de Nest. En Bruno, abre `apps/api/bruno` y selecciona el entorno **Local**. Para las peticiones privadas configura `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno del proceso o en un `.env` local de la colección. Ejecutar la colección crea una cotización ficticia. El listado pasa su primer número a la consulta de detalle. La ficha devuelve el estado actual para confirmar, cancelar o reabrir la cotización. El calendario del piloto incluye solicitudes pendientes y confirmadas. Cada día del calendario de Santiago admite un solo evento confirmado. Varias solicitudes pueden compartir una fecha libre. Al confirmar una, la fecha queda ocupada para nuevas solicitudes y confirmaciones. Cancelar una cotización vigente o devolverla a pendiente libera ese día. Si el piloto purga los datos de una cotización confirmada antes del evento, solo conserva la fecha reservada. La limpieza la retira después del evento cuando ya no quedan cotizaciones vigentes para ese día.

El Worker de correo también recibe envíos en `/api/v1/quotes`. Si ya está configurado en Pages, coordina la actualización del Worker y de `VITE_QUOTE_ENDPOINT` al publicar esta versión.

### Del evento a la compra

En el historial, abre una cotización y confirma el evento. El calendario permite revisar las fechas por estado y saltar a Compras para un día o un mes. Compras consolida hasta 31 días de eventos confirmados y permite descargar los insumos con su reparto por cotización. El recetario guarda los rendimientos que se usan para el cálculo. En Preparación se ajustan porciones y envases del evento y se marca el despacho en la pestaña de trabajo.

En Finanzas, filtra por el número de cotización para conciliar ventas y cobros. La comparación mensual usa los movimientos registrados y el extracto CSV abarca todas las páginas del filtro.

## 🗂️ Arquitectura

React Router gestiona Inicio, Carta, Diseña tu mesa y Cotizar desde `apps/web/src/app/main.tsx` y un único
`index.html` fuente. Las rutas públicas conservan sus nombres. Al compilar, Vite genera
`carta.html`, `ambientacion.html` y `cotizar.html` con la misma entrada React y los metadatos
de cada página definidos en `apps/web/src/app/routing/metadata.ts`. Así GitHub Pages admite enlaces
directos, recargas y vistas previas al compartir. El enlace anterior `ideas-de-la-casa.html` abre el diseñador con la mesa de domingo.

El frontend sigue Feature-Sliced Design. Cada página compone widgets y funcionalidades
a partir de los modelos de carta, mesa y cotización. La guía de contribución describe
las capas, las APIs públicas y las reglas de importación. [Ver AGENTS.md](AGENTS.md)

## 🚀 Desarrollo local

Los enlaces internos usan `Link`. React Router gestiona el historial, los capítulos por ancla y
la restauración del scroll. La transición usa el tema seleccionado y respeta movimiento reducido.
Los enlaces externos y las descargas usan el comportamiento nativo del navegador.

Usa Node.js 22, la misma versión principal que utiliza GitHub Actions. Si tienes
`nvm`, ejecuta `nvm install` y `nvm use` desde la raíz del proyecto.

```bash
npm ci --ignore-scripts
npm run dev     # servidor de desarrollo
npm run format  # aplica el formato del proyecto
npm run check   # verifica formato, lint, tipos y compilación
npm run build   # build de producción
npm run preview # previsualizar el build
```

Para probar la compilación, ejecuta `npx playwright install chromium` una vez y luego
`npm run test:e2e`. Las pruebas levantan su propio servidor en el puerto 4189 y recorren las
páginas del sitio en escritorio y móvil. El workflow de Pages ejecuta estos controles antes
de desplegar. Para publicar, sube la revisión a `main` y comprueba el resultado en GitHub Actions.

<details>
<summary>📝 Contenido pendiente antes de la publicación definitiva</summary>

- Configurar el número de WhatsApp de atención en la variable de GitHub Actions `VITE_WHATSAPP_NUMBER` con código de país y solo dígitos.
- Confirmar el correo de contacto.
- Sustituir las fotografías referenciales por material propio.
- Revisar textos finales de servicios, ubicación y trayectoria.

</details>

## Cotizaciones por correo

El formulario está en `cotizar.html`. Los enlaces antiguos a `#cotizar` conservan su selección y redirigen a esa página. El calendario de React Aria permite elegir desde hoy hasta la misma fecha del año siguiente en la zona de Santiago. React Hook Form y la función de recepción usan el mismo esquema Zod en `libs/domain/quote/request.ts`. El borrador se guarda en la pestaña y recupera el paso, el evento, el contacto, la carta y la mesa al recargar. El envío confirmado elimina el borrador. El diseño incluye puestos, telas, texturas, flores y vajilla. Las consultas llegan como texto, con el correo del cliente en Reply-To.

Para activar el envío automático:

1. Verificar un dominio remitente en Resend y generar una clave para envío.
2. En Cloudflare, desplegar `worker/quote.ts` con la configuración de `worker/wrangler.jsonc` usando `npx wrangler@4 deploy --config worker/wrangler.jsonc`. Configurar los secretos `RESEND_API_KEY`, `MAIL_FROM` (remitente verificado) y `MAIL_TO` (buzón que recibirá las solicitudes) en el Worker. El origen permitido está en `SITE_ORIGIN`. Configurar `BOOKING_API_ORIGIN` con el origen HTTPS de la API que mantiene la agenda de eventos. El Worker consulta allí las fechas antes de enviar el correo.
3. En las variables de GitHub Actions, establecer `VITE_QUOTE_ENDPOINT` con la URL HTTPS del Worker terminada en `/api/v1/quotes`. Volver a ejecutar el workflow de Pages. La clave de correo pertenece exclusivamente al Worker.
4. Probar desde el sitio publicado y verificar la recepción en el buzón elegido. Para desarrollo local, Vite lee la misma URL desde `apps/web/.env.local`. Configurar el origen del servidor de desarrollo en el Worker de pruebas.

La agenda pública se lee mediante `GET /api/v1/quotes/availability`. Devuelve únicamente días ocupados en formato `YYYY-MM-DD` y usa el mismo calendario de Santiago que el cotizador. El panel protege la confirmación también en PostgreSQL cuando dos operadores eligen el mismo día a la vez.

Para usar «Preparar correo» en GitHub Pages, configura la variable de Actions `VITE_QUOTE_AVAILABILITY_ENDPOINT` con la URL HTTPS completa de esa consulta. También puedes usarla cuando la agenda y el envío están en orígenes distintos. Con `VITE_QUOTE_ENDPOINT` configurado, la web deriva la URL de disponibilidad añadiendo `/availability` al endpoint de cotizaciones. El formulario conserva el borrador si la agenda está fuera de servicio y permite reintentar. Preparar el correo o solicitar la cotización deja la confirmación del evento en manos del equipo.

## 📸 Créditos fotográficos

- Fotografía original del hero (referencia conservada): [Pexels / August de Richelieu](https://www.pexels.com/photo/family-having-dinner-together-4262175/)
- Detalle: [Unsplash](https://unsplash.com/photos/1617295097082-96897a3d23ad)
- Galería: material provisional de Unsplash.
- Galería 01: [Fotógrafo Samuel Cruz / celebración nocturna](https://unsplash.com/photos/outdoor-event-with-illuminated-tables-and-guests-at-night-D-qRkpXR-KE), servida en WebP de 800, 1600 y 3200 px; el visor abre la versión de 3200 px.

Las imágenes se reemplazan desde `apps/web/public/images` sin modificar los componentes. Después de compilar, `npm run test:e2e -- --project=fotos` verifica los archivos y las dimensiones de la portada, las miniaturas y el álbum ampliado. GitHub Actions ejecuta esta prueba antes de publicar.

---

<div align="center">

Hecho por **[Nelson Daniel Silva Gutiérrez](https://github.com/ndsg24)** · [LinkedIn](https://www.linkedin.com/in/nelson-daniel-dev/) · [Portafolio](https://ndsg24.github.io/portfolio/)

</div>

## Carta interactiva

La página `carta.html` presenta fotos, nombres y descripciones en tres colecciones:
Cóctel & bocados, Menú & celebración y Bebestibles & bar. Las categorías e imágenes
provienen de `libs/domain/menu/catalog.ts`. La selección de platos para un evento se hace
en el cotizador (`cotizar.html`).

El selector de categorías se presenta como un recorrido horizontal ilustrado,
encapsulado en `CatalogCategoryPicker` y `CategoryMotif`. Sus botones funcionan
con teclado y declaran su estado mediante `aria-pressed`.

Once imágenes de cóctel conservan la transparencia nativa y se exportan a WebP
sin pérdida, sin añadir fondos ni ampliar los originales. Las 73 imágenes de
banquetería son recreaciones referenciales generadas con ImageGen, con fondo
transparente y versiones WebP de 600 y hasta 1200 píxeles. `CatalogCard` utiliza
`srcSet`, `sizes` y carga diferida para servir una imagen acorde a cada pantalla.
Los prompts están en `docs/catalog-image-prompts.json`; el inventario, las dimensiones
y las huellas SHA-256 de los archivos están en `docs/catalog-generated-assets.json`.

La escala óptica se normaliza con `imageBounds`, conservando las proporciones de
cada producto. `CatalogProductGrid` mantiene un único lienzo WebGL compartido:
`CatalogScene` renderiza cada fotografía con scissor, materiales GLSL y texturas
sRGB. GSAP coordina el fundido de entrada, el enfoque, el barrido de luz y la
entrada de los textos. Al explorar un producto, el resto se suaviza temporalmente.
`catalogAtmosphere` añade vapor a platos calientes, partículas a preparaciones
frescas y burbujas con reflejos de hielo facetado a bebidas, con shaders
procedurales y un cursor propio. El vapor y las burbujas tienen mayor presencia
visual sin ocultar la fotografía.
La atmósfera solo se anima mientras el producto explorado está visible; se apaga
al salir y respeta el movimiento reducido.
No hay balanceo continuo ni duplicación de fotografías para simular volumen.

En la carta, las fotografías HTML se muestran primero. Three.js se descarga cuando la
cuadrícula se acerca al área visible en dispositivos con hover y animaciones habilitadas.
La portada prioriza su primera foto y solicita las demás al avanzar en el carrusel. El renderizado
se solicita solo al cargar, redimensionar, entrar en pantalla o animar. Se liberan
texturas, materiales, observadores y timelines al cambiar de categoría o desmontar.
La preferencia de movimiento reducido muestra los productos sin revelado; si WebGL
no está disponible, se conservan las imágenes HTML accesibles. El fondo usa
la misma textura punteada de la portada mediante la clase compartida `site-texture`, en ambos temas.

El canapé se restauró con ImageGen para completar el borde del plato; su original
se conserva como referencia. La versión activa usa archivos con sufijo `v2`.

## Estudio de ambientación (prototipo)

`ambientacion.html` permite combinar mantel, carpeta, fundas, rosones y servilletas
sobre una mesa 3D de seis a diez puestos. Las paletas y combinaciones de referencia se
definen en `libs/domain/table/options.ts`; no representan un inventario confirmado.
`useTableDesign` valida los colores, conserva el diseño localmente y lo incluye
en la URL para compartirlo. La consulta por correo contiene la combinación actual.

Al abrir la distribución del salón, Three.js se carga la primera vez que se elige «Detalle de la mesa».
`TableScene` construye los muebles, telas con
pliegues, lazos y servicio de mesa mediante geometría procedural. OrbitControls
permite girar y acercarse; las vistas predefinidas también funcionan con teclado.
GSAP interpola colores y cámara respetando movimiento reducido. La escena se
renderiza al interactuar, no en un bucle permanente. Se puede guardar una imagen
PNG; la selección de colores sigue disponible si el dispositivo no admite WebGL.

El montaje adapta el diámetro de la mesa, sillas y servicio a entre 6 y 10
puestos. Cada tela puede usar lino, satén o damasco; el centro se elige entre
blanco clásico, rosa suave, botánico o sin arreglo. Los enlaces antiguos conservan
sus colores y reciben valores por defecto para las opciones nuevas. La descarga
se renderiza aparte a 3840 × 2400 px (o al límite disponible de la GPU), con fondo
opaco, y restaura el tamaño y la cámara del visor incluso si la captura falla.

La navegación principal distingue las herramientas (carta y estudio), el menú
editorial «Conoce Legado» y el contacto. `PagePath` comparte los enlaces de regreso
y su alineación con el contenido. El scroll por secciones queda limitado a la
landing para que no oculte las rutas de navegación de las páginas independientes.

## Hero editorial

La portada presenta tres mesas preparadas en dorado, azul y burdeos. Las fotos
de `apps/web/public/images/hero-place-settings/` se sirven en WebP a 800, 1122, 2244 y
4488 px. El navegador elige la resolución según el espacio disponible y la
densidad de pantalla. El carrusel se desplaza horizontalmente y permite elegir
la mesa o pausar la secuencia. La reproducción automática se detiene fuera de
pantalla y al ocultar la pestaña, y respeta la preferencia de movimiento reducido.

Los materiales de producción de los videos anteriores están documentados en
`docs/video/`. En `apps/web/public/videos/` se distribuye el video de «Nuestra manera».

La cinta de «Nuestra manera» usa dos grupos idénticos para un desplazamiento
continuo con GSAP, con altura y margen para no recortar las letras al inclinarse.
Se pausa al pasar el puntero. «El origen» ordena título y relato en dos columnas
(una en móvil), con una fuente dibujada y vapor sutil. `useEditorialMotion`
coordina ambos efectos y los detiene fuera de pantalla, con la pestaña oculta
o cuando se solicita movimiento reducido.

«Nuestra manera» presenta un video ambiental generado con Runway Gen-4.5 a
partir de `table-detail.jpg`. El marco recto conserva la proporción 1104 × 832,
sin recorte ni inclinación, y se apila sobre el texto en móvil. El bucle de cuatro
segundos se sirve en WebM/MP4 y una variante de 720 px para móvil. `AmbientVideo`
permite pausar y detiene la reproducción fuera de pantalla o con la pestaña
oculta; usa un póster cuando se solicita movimiento reducido o falla el video.
La procedencia y el montaje reproducible están en
`docs/video/manifesto-production.json` y `docs/video/render_manifesto_film.py`.

## Seguridad

El alcance del sitio estático y del Worker, la verificación de dependencias y los controles
operativos están en la [guía de seguridad](docs/seguridad.md). Ejecuta `npm run audit:security`
al modificar dependencias o preparar una publicación.
