# Guía de trabajo de Legado Banquetería

## Desarrollo y verificación

Usa Node.js 22 y el archivo de bloqueo de npm. Desde un checkout nuevo, ejecuta
`npm ci --ignore-scripts`. `npm run dev` sirve el sitio bajo `/legado-banqueteria/`.

- `npm run format` da formato al código y a las hojas de estilo. Prettier usa
  100 columnas como objetivo, dos espacios, comillas simples en JS/TS y omite el punto y coma final.
- ESLint impone un máximo de **120 caracteres por línea** en JS, TS y TSX,
  incluidos el Worker y las pruebas. Divide props, expresiones o datos largos donde conserven su significado.
- `npm run check` comprueba el formato, ejecuta ESLint y compila con TypeScript y Vite.
- Después de compilar, `npm run test:e2e` sirve el contenido de `dist/` y ejecuta
  Playwright en escritorio y móvil. Para instalar Chromium por primera vez, usa
  `npx playwright install chromium`. Si ya tienes Chrome, puedes ejecutar
  `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`.

## Arquitectura Feature-Sliced Design

React Router monta las cuatro rutas desde `src/app/main.tsx`. Usa `Link` para navegación interna
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

Las dependencias entre entidades se declaran en la entidad de destino. Por ejemplo,
`entities/menu/@x/quote.ts` expone al modelo de cotización las reglas de carta que necesita.
La API visual de carta está en `entities/menu/ui.ts`; la entrada de datos se puede importar
desde el Worker. En Shared, `routing` y `theme` tienen un índice público. Cada control de
`shared/ui` y cada módulo en `shared/config` se consume por separado.

El Worker permanece en `worker/` y los recorridos de navegador en `tests/`. Conserva la carga
diferida del PDF y las escenas 3D, el orden de los estilos, las anclas, las claves de
almacenamiento, los identificadores de platos y los parámetros de los diseños compartidos.

## Flujos que conviene preservar

- **Inicio y galería.** Los enlaces a capítulos funcionan desde las cuatro páginas.
  Las fotos conservan sus proporciones. El visor admite teclado, gestos y cierre con Escape,
  devuelve el foco a la miniatura y mantiene los controles fijos al cambiar de foto.
- **Carta y cotizador.** La carta pública exhibe la oferta. La selección ocurre en el
  cotizador. Las salsas se muestran en la carta y en el cotizador se asocian al principal.
  Mantén las reglas de negocio en `src/entities/menu/` y `src/entities/quote/`. El cliente y el Worker
  comparten el esquema Zod. Los campos usan React Hook Form y los controles interactivos, React Aria.
- **Mesa.** Comprueba que las opciones editadas sobrevivan a una recarga y viajen al
  cotizador. Mantén la carga diferida de Three.js y del PDF, libera recursos al desmontar
  y conserva la alternativa HTML si WebGL falla.
- **Presentación.** Reutiliza los colores de tema. Comprueba teclado, foco, modo claro,
  modo oscuro y movimiento reducido cuando cambies una interacción.

## Publicación

GitHub Actions compila y prueba la revisión de `main` antes de desplegar `dist/` en Pages.
Las rutas de recursos del cliente usan `import.meta.env.BASE_URL`. Las vistas previas
sociales necesitan una URL pública absoluta en los HTML.

La configuración de correo del Worker y las variables públicas de Vite se detallan
en el README. Guarda la clave del proveedor únicamente en los secretos del Worker.
Incluye en `public/` los recursos que consume el sitio y deja los videos promocionales
fuera del despliegue.

## Seguridad

El alcance del sitio estático y del Worker, la verificación de dependencias y los controles
operativos están en la [guía de seguridad](docs/seguridad.md). Ejecuta `npm run audit:security`
al modificar dependencias o preparar una publicación.

## Idiomas

El catálogo de español de Chile define el idioma inicial y el tipo `MessageKey`.
En `src/shared/i18n/locales/{es,en,fr,pt}/` cada archivo JSON reúne una página
(`home`, `catalog`, `table`, `quote`) o contenido compartido (`common`, `menu`).
Usa claves estables por sección, como `home.hero.titleLead` o
`menu.dishes.salados-1.name`. Añade cada clave a los cuatro idiomas.
En componentes usa `useI18n()` y traduce al presentar el contenido.
Conserva los mismos marcadores con nombre, como `{count}`, en todas las versiones.
Ejecuta `npm run check:i18n` para verificar los catálogos.

Formatea las fechas con la configuración regional activa y conserva la zona horaria
de Santiago para los eventos. Los identificadores, los valores que valida el Worker
y los textos escritos por los visitantes deben conservarse al cambiar de idioma.
