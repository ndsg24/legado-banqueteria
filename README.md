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

## 🗂️ Arquitectura

React Router gestiona Inicio, Carta, Diseña tu mesa y Cotizar desde `src/app/main.tsx` y un único
`index.html` fuente. Las rutas públicas conservan sus nombres. Al compilar, Vite genera
`carta.html`, `ambientacion.html` y `cotizar.html` con la misma entrada React y los metadatos
de cada página definidos en `src/app/routing/metadata.ts`. Así GitHub Pages admite enlaces
directos, recargas y vistas previas al compartir.

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
cuatro páginas en escritorio y móvil. El workflow de Pages ejecuta estos controles antes
de desplegar. Para publicar, sube la revisión a `main` y comprueba el resultado en GitHub Actions.

<details>
<summary>📝 Contenido pendiente antes de la publicación definitiva</summary>

- Configurar el número de WhatsApp de atención en la variable de GitHub Actions `VITE_WHATSAPP_NUMBER` con código de país y solo dígitos.
- Confirmar el correo de contacto.
- Sustituir las fotografías referenciales por material propio.
- Revisar textos finales de servicios, ubicación y trayectoria.

</details>

## Cotizaciones por correo

El formulario está en `cotizar.html`. Los enlaces antiguos a `#cotizar` conservan su selección y redirigen a esa página. El calendario de React Aria permite elegir desde hoy hasta la misma fecha del año siguiente en la zona de Santiago. React Hook Form y la función de recepción usan el mismo esquema Zod en `src/entities/quote/model/request.ts`. La selección de la carta se conserva durante la sesión. El diseño incluye puestos, telas, texturas, flores y vajilla. Las consultas llegan como texto, con el correo del cliente en Reply-To.

Para activar el envío automático:

1. Verificar un dominio remitente en Resend y generar una clave para envío.
2. En Cloudflare, desplegar `worker/quote.ts` con la configuración de `worker/wrangler.jsonc` usando `npx wrangler@4 deploy --config worker/wrangler.jsonc`. Configurar los secretos `RESEND_API_KEY`, `MAIL_FROM` (remitente verificado) y `MAIL_TO` (buzón que recibirá las solicitudes) en el Worker. El origen permitido está en `SITE_ORIGIN`.
3. En las variables de GitHub Actions, establecer `VITE_QUOTE_ENDPOINT` con la URL HTTPS del Worker terminada en `/cotizaciones`. Volver a ejecutar el workflow de Pages. La clave de correo pertenece exclusivamente al Worker.
4. Probar desde el sitio publicado y verificar la recepción en el buzón elegido. Para desarrollo local, Vite lee la misma URL desde `.env.local`. Configurar el origen del servidor de desarrollo en el Worker de pruebas.

Mientras falte el endpoint, el botón «Preparar correo» abre un borrador en la aplicación de correo del visitante. El modo automático confirma la solicitud cuando el proveedor acepta el mensaje.

## 📸 Créditos fotográficos

- Fotografía original del hero (referencia conservada): [Pexels / August de Richelieu](https://www.pexels.com/photo/family-having-dinner-together-4262175/)
- Detalle: [Unsplash](https://unsplash.com/photos/1617295097082-96897a3d23ad)
- Galería: material provisional de Unsplash.
- Galería 01: [Fotógrafo Samuel Cruz / celebración nocturna](https://unsplash.com/photos/outdoor-event-with-illuminated-tables-and-guests-at-night-D-qRkpXR-KE), servida en WebP de 800, 1600 y 3200 px; el visor abre la versión de 3200 px.

Las imágenes se reemplazan desde `public/images` sin modificar los componentes.

---

<div align="center">

Hecho por **[Nelson Daniel Silva Gutiérrez](https://github.com/ndsg24)** · [LinkedIn](https://www.linkedin.com/in/nelson-daniel-dev/) · [Portafolio](https://ndsg24.github.io/portfolio/)

</div>

## Carta interactiva

La página `carta.html` presenta fotos, nombres y descripciones en tres colecciones:
Cóctel & bocados, Menú & celebración y Bebestibles & bar. Las categorías e imágenes
provienen de `src/entities/menu/model/catalog.ts`. La selección de platos para un evento se hace
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
definen en `src/entities/table/model/options.ts`; no representan un inventario confirmado.
`useTableDesign` valida los colores, conserva el diseño localmente y lo incluye
en la URL para compartirlo. La consulta por correo contiene la combinación actual.

`TableScene` se importa de forma diferida y construye los muebles, telas con
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

El hero conserva el mensaje «Hay mesas que se quedan contigo», las llamadas a la
acción y la firma Legado, sobre fondo negro con la textura de puntos compartida
por las páginas del sitio.
GSAP coordina la entrada del texto y de la primera mesa al cargar la portada.
La invitación a deslizar incorpora una flecha y un punto de luz animados y enlaza
con la historia. El movimiento ambiental se pausa fuera de pantalla y al ocultar
la pestaña, y se respeta movimiento reducido. La mitad derecha presenta tres montajes fotorrealistas generados con ImageGen:
lino marfil con ceviche y vino blanco; satén azul con medallones y vino tinto;
lino rosa con tiramisú, café y espumante. Cada montaje cambia textiles, vajilla,
cubiertos, flores y bebestibles manteniendo el encuadre. Las imágenes WebP con
alfa se sirven en dos resoluciones (720 y 1254 px). No representan eventos reales.
Las tres imágenes se alternan con un fundido de opacidad de 1,5 segundos. Las mesas permanecen completas, sin deformaciones ni desenfoque.
La secuencia cambia cada siete segundos, permite elegir y pausar, y se detiene
fuera de pantalla, al ocultar la pestaña o con movimiento reducido.
La grilla adapta la composición de dos columnas a una en móvil.

Los videos descartados del hero se retiraron de `public/videos/`. Su documentación
se conserva en `docs/video/`; solo se despliega el video activo de «Nuestra manera».
La firma SVG pinta el contorno bajo el relleno para evitar las intersecciones
internas de la tipografía. No se carga una foto de fondo.

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

La escena del hero ocupa una columna algo mayor y alinea su borde superior con
el titular. `HeroReactions` añade hojas y destellos al montaje fresco, corazones
al cálido y un brindis al de sobremesa. Sus seis trazos flotan con GSAP sin tapar
la comida; comparten los controles de pausa, visibilidad y movimiento reducido.

## Seguridad

El alcance del sitio estático y del Worker, la verificación de dependencias y los controles
operativos están en la [guía de seguridad](docs/seguridad.md). Ejecuta `npm run audit:security`
al modificar dependencias o preparar una publicación.
