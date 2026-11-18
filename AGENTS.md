# Guía de trabajo de Legado Banquetería

## Desarrollo y verificación

Usa Node.js 22 y el archivo de bloqueo de npm. Desde un checkout nuevo, ejecuta
`npm ci`. `npm run dev` sirve el sitio bajo `/legado-banqueteria/`.

- `npm run format` da formato al código y a las hojas de estilo. Prettier usa
  100 columnas como objetivo, dos espacios, comillas simples en JS/TS y omite el punto y coma final.
- ESLint impone un máximo de **120 caracteres por línea** en JS, TS y TSX,
  incluidos el Worker y las pruebas. Divide props, expresiones o datos largos donde conserven su significado.
- `npm run check` comprueba el formato, ejecuta ESLint y compila con TypeScript y Vite.
- Después de compilar, `npm run test:e2e` sirve el contenido de `dist/` y ejecuta
  Playwright en escritorio y móvil. Para instalar Chromium por primera vez, usa
  `npx playwright install chromium`. Si ya tienes Chrome, puedes ejecutar
  `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`.

## Dónde hacer los cambios

| Cambio | Ubicación |
| --- | --- |
| Rutas y metadatos para buscadores y redes | Los cuatro HTML de la raíz y las entradas de `vite.config.ts` |
| Composición de la portada y las páginas independientes | `src/app/` y `src/pages/` |
| Navegación común, cabecera y pie | `src/components/layout/` y `src/config/navigation.ts` |
| Secciones y piezas de interfaz | `src/components/sections/` y la carpeta de la función en `src/components/` |
| Carta, comunas, opciones de mesa y contenido editorial | `src/config/` |
| Validación, cantidades, salsas, revisión y PDF | `src/quote/` |
| Lectura de diseños guardados y enlaces de mesas | `src/table/design.ts` |
| Efectos de navegador y ciclo de vida de las escenas | `src/hooks/` |
| Geometrías, materiales y captura | `src/rendering/` |
| Temas y estilos | `src/styles/tokens.css` y la hoja de la función en `src/styles/` |
| Recepción de cotizaciones por correo | `worker/quote.ts` |
| Recorridos de regresión sobre el sitio compilado | `tests/` |

Mantén el estado en el componente que coordina el flujo. Extrae una pieza cuando tenga
una responsabilidad identificable, como el visor del álbum o los controles de vajilla.
Usa componentes de `ui/` para piezas compartidas. Mantén los identificadores de platos,
claves de almacenamiento, anclas y parámetros compatibles con los enlaces existentes.

## Flujos que conviene preservar

- **Inicio y galería.** Los enlaces a capítulos funcionan desde las cuatro páginas.
  Las fotos conservan sus proporciones. El visor admite teclado, gestos y cierre con Escape,
  devuelve el foco a la miniatura y mantiene los controles fijos al cambiar de foto.
- **Carta y cotizador.** La carta pública exhibe la oferta. La selección ocurre en el
  cotizador. Las salsas se muestran en la carta y en el cotizador se asocian al principal.
  Mantén las reglas de negocio en los módulos de `src/quote/`. El cliente y el Worker
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
