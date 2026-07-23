# Legado Banquetería

Landing editorial para una banquetería familiar de Concepción, construida con React, TypeScript, Vite y Framer Motion.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
```

`npm run check` ejecuta typecheck, lint y build. Es el control requerido antes de publicar.

## Arquitectura

```text
src/
├── app/                    # Composición raíz y proveedores globales
├── components/
│   ├── decorative/        # Elementos visuales sin contenido
│   ├── layout/            # Header, footer y navegación transversal
│   └── sections/          # Secciones editoriales de la landing
├── config/                 # Navegación, contenido y datos del sitio
├── hooks/                  # Comportamiento reutilizable del navegador
├── styles/                 # Tokens, layout y reglas responsive
└── types/                  # Contratos compartidos
```

### Criterios

- `app/` compone; no contiene detalles de interacción.
- Las secciones no conocen el estado global.
- La navegación se define una sola vez en `config/navigation.ts`.
- Los datos reemplazables viven en `config/`, no dentro del JSX.
- Los hooks encapsulan efectos del navegador y limpian sus listeners.
- Se usan imports directos para conservar un bundle analizable.

## Contenido pendiente

Antes de la publicación definitiva:

- Reemplazar el número de WhatsApp en `src/config/site.ts`.
- Confirmar el correo de contacto.
- Sustituir las fotografías referenciales por material propio.
- Revisar textos finales de servicios, ubicación y trayectoria.

## Fotografías de muestra

- Hero: [Pexels / August de Richelieu](https://www.pexels.com/photo/family-having-dinner-together-4262175/)
- Detalle: [Unsplash](https://unsplash.com/photos/1617295097082-96897a3d23ad)
- Galería: material provisional de Unsplash.

Los archivos públicos se reemplazan desde `public/images` sin modificar los componentes.
