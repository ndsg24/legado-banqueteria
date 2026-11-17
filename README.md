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
| Animación | Framer Motion en la landing; GSAP y Three.js en la carta |
| Build | Vite |
| Calidad | ESLint, typescript-eslint, `tsc` |
| CI/CD | GitHub Actions → GitHub Pages |

## 🗂️ Arquitectura

```text
src/
├── app/                    # Composición raíz y proveedores globales
├── components/
│   ├── decorative/         # Elementos visuales sin contenido
│   ├── layout/             # Header, footer y navegación transversal
│   ├── sections/           # Secciones editoriales de la landing
│   └── ui/                 # Piezas de interfaz reutilizables
├── config/                 # Navegación, contenido y datos del sitio
├── hooks/                  # Comportamiento reutilizable del navegador
├── styles/                 # Tokens, layout y reglas responsive
└── types/                  # Contratos compartidos
```

### Criterios de diseño

- `app/` compone; no contiene detalles de interacción.
- Las secciones no conocen el estado global.
- La navegación se define una sola vez en `config/navigation.ts`.
- Los datos reemplazables viven en `config/`, no dentro del JSX.
- Los hooks encapsulan efectos del navegador y limpian sus listeners.
- Se usan imports directos para conservar un bundle analizable.

## 🚀 Desarrollo local

Usa Node.js 22, la misma versión principal que utiliza GitHub Actions. Si tienes
`nvm`, ejecuta `nvm install` y `nvm use` desde la raíz del proyecto.

```bash
npm install
npm run dev     # servidor de desarrollo
npm run check   # typecheck + lint + build (control requerido antes de publicar)
npm run build   # build de producción
npm run preview # previsualizar el build
```

<details>
<summary>📝 Contenido pendiente antes de la publicación definitiva</summary>

- Reemplazar el número de WhatsApp en `src/config/site.ts`.
- Confirmar el correo de contacto.
- Sustituir las fotografías referenciales por material propio.
- Revisar textos finales de servicios, ubicación y trayectoria.

</details>

## 📸 Créditos fotográficos

- Hero: [Pexels / August de Richelieu](https://www.pexels.com/photo/family-having-dinner-together-4262175/)
- Detalle: [Unsplash](https://unsplash.com/photos/1617295097082-96897a3d23ad)
- Galería: material provisional de Unsplash.

Las imágenes se reemplazan desde `public/images` sin modificar los componentes.

---

<div align="center">

Hecho por **[Nelson Daniel Silva Gutiérrez](https://github.com/ndsg24)** · [LinkedIn](https://www.linkedin.com/in/nelson-daniel-dev/) · [Portafolio](https://ndsg24.github.io/portfolio/)

</div>

## Carta interactiva

La página independiente `carta.html` reúne tres cartas: Cóctel & bocados (12 productos), Menú & celebración (49)
y Bebestibles & bar (24). Aperitivos, Bajativos y Bar pertenecen a Bebestibles. Los contratos están
 en `src/types/catalog.ts`, los productos y precios en `src/config/catalog.ts`,
 el estado de exploración y favoritos en `src/hooks/useCatalog.ts` y las piezas
 visuales en `src/components/catalog/`. Las fotografías de la carta
 están optimizadas en `public/images/catalog/`; sus rutas respetan la base de GitHub Pages.

Los favoritos se conservan durante la visita al cambiar de categoría. La consulta
 abre el cliente de correo con la selección; no envía mensajes automáticamente.
 Los precios del cóctel son por unidad en CLP. Banquetería requiere cotización.
 La página de promociones del catálogo repite los dulces sin condiciones distintas,
 por lo que no se presenta como una oferta adicional.

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
sRGB. GSAP coordina el revelado con máscara, el enfoque, el barrido de luz y la
entrada de los textos. Al explorar un producto, el resto se suaviza temporalmente.
`catalogAtmosphere` añade vapor a platos calientes, partículas a preparaciones
frescas y burbujas con reflejos de hielo facetado a bebidas, con shaders
procedurales y un cursor propio. El vapor y las burbujas tienen mayor presencia
visual sin ocultar la fotografía.
La atmósfera solo se anima mientras el producto explorado está visible; se apaga
al salir y respeta el movimiento reducido.
No hay balanceo continuo ni duplicación de fotografías para simular volumen.

Three.js se carga de forma diferida, fuera del bundle de la landing. El renderizado
se solicita solo al cargar, redimensionar, entrar en pantalla o animar. Se liberan
texturas, materiales, observadores y timelines al cambiar de categoría o desmontar.
La preferencia de movimiento reducido muestra los productos sin revelado; si WebGL
no está disponible, se conservan las imágenes HTML accesibles. El fondo usa
la misma textura punteada de la portada mediante la clase compartida `site-texture`, en ambos temas.

El canapé se restauró con ImageGen para completar el borde del plato; su original
se conserva como referencia. La versión activa usa archivos con sufijo `v2`.
