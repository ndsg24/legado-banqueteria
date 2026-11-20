import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

import { firstTablePhoto, tablePhotoSizes, tablePhotoSources } from './src/shared/config/heroPhoto'
import metadata from './src/app/routing/metadata'
import { isMessageKey, spanish } from './src/shared/i18n/messages'

type PageMeta = (typeof metadata)[keyof typeof metadata]

function renderRoute(html: string, page: PageMeta) {
  const escape = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
  const title = escape(spanish(page.title))
  const desc = escape(spanish(page.description))
  const url = escape(page.canonical)
  const schema = JSON.stringify(page.schema, (_, value: unknown) =>
    isMessageKey(value) ? spanish(value) : value,
  ).replaceAll('<', '\\u003c')
  const head = [
    page === metadata['/']
      ? '<link rel="preload" as="image" type="image/avif" fetchpriority="high" ' +
        `imagesrcset="${tablePhotoSources('./images/' + firstTablePhoto, 'avif')}" imagesizes="${tablePhotoSizes}" />`
      : '',
    `<title>${title}</title>`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="description" data-route-meta="description" content="${desc}" />`,
    `<meta property="og:title" data-route-meta="title" content="${title}" />`,
    `<meta property="og:description" data-route-meta="description" content="${desc}" />`,
    `<meta property="og:url" data-route-meta="canonical" content="${url}" />`,
    `<meta name="twitter:title" data-route-meta="title" content="${title}" />`,
    `<meta name="twitter:description" data-route-meta="description" content="${desc}" />`,
    `<script type="application/ld+json" id="route-schema">${schema}</script>`,
  ].join('\n')
  return html
    .replace(
      /<!--route-head-->[\s\S]*?<!--\/route-head-->/,
      () => `<!--route-head-->\n${head}\n<!--/route-head-->`,
    )
    .replace(
      /<!--route-intro-->[\s\S]*?<!--\/route-intro-->/,
      () =>
        `<!--route-intro--><h1>${escape(spanish(page.heading))}</h1><p>${desc}</p><!--/route-intro-->`,
    )
}

function routeDocuments(): Plugin {
  return {
    name: 'legado-static-routes',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        const path = new URL(context.originalUrl ?? context.path, 'http://localhost').pathname
        const page =
          metadata[('/' + path.split('/').pop()) as keyof typeof metadata] ?? metadata['/']
        return renderRoute(html, page)
      },
    },
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset' || typeof index.source !== 'string')
        this.error('Falta index.html')
      const template = index.source
      const routeModules: Record<string, string> = {
        '/': '/app/routing/HomeRoute.tsx',
        '/carta.html': '/pages/catalog/index.ts',
        '/ambientacion.html': '/pages/table/index.ts',
        '/cotizar.html': '/pages/quote/index.ts',
      }
      const chunks = Object.values(bundle).filter((file) => file.type === 'chunk')
      for (const [path, page] of Object.entries(metadata)) {
        const route = chunks.find((chunk) =>
          chunk.moduleIds.some((id) => id.endsWith(routeModules[path])),
        )
        const files = route ? [route.fileName, ...route.imports] : []
        const preloads = files
          .filter((file) => !chunks.some((chunk) => chunk.isEntry && chunk.fileName === file))
          .map((file) => `<link rel="modulepreload" crossorigin href="./${file}" />`)
        const styles = new Set<string>()
        for (const file of files) {
          const chunk = bundle[file]
          if (chunk?.type === 'chunk') {
            for (const css of chunk.viteMetadata?.importedCss ?? []) styles.add(css)
          }
        }
        for (const css of styles) {
          if (!template.includes(`/${css}"`)) {
            preloads.push(`<link rel="preload" as="style" crossorigin href="./${css}" />`)
          }
        }
        const source = renderRoute(template, page).replace(
          '</head>',
          preloads.join('\n') + '\n</head>',
        )
        if (path === '/') index.source = source
        else
          this.emitFile({
            type: 'asset',
            fileName: path.slice(1),
            source,
          })
      }
    },
  }
}

function browserPolicy(endpoint: string): Plugin {
  let quoteOrigin = ''
  if (endpoint) {
    const url = new URL(endpoint)
    if (
      url.protocol !== 'https:' ||
      url.pathname !== '/cotizaciones' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error('VITE_QUOTE_ENDPOINT debe ser una URL HTTPS del servicio /cotizaciones.')
    }
    quoteOrigin = url.origin
  }

  return {
    name: 'legado-browser-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler() {
        const connections = ["'self'"]
        if (quoteOrigin) connections.push(quoteOrigin)
        const content = [
          "default-src 'none'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self'",
          "img-src 'self' data: blob:",
          "media-src 'self'",
          'connect-src ' + connections.join(' '),
          "base-uri 'none'",
          "form-action 'none'",
          "object-src 'none'",
        ].join('; ')
        return [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content },
            injectTo: 'head-prepend',
          },
          {
            tag: 'meta',
            attrs: { name: 'referrer', content: 'no-referrer' },
            injectTo: 'head-prepend',
          },
        ]
      },
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    routeDocuments(),
    browserPolicy(loadEnv(mode, process.cwd(), 'VITE_').VITE_QUOTE_ENDPOINT?.trim() ?? ''),
  ],
  base: '/legado-banqueteria/',
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  optimizeDeps: { include: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'] },
}))
