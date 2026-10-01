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
| Animación | Framer Motion |
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
