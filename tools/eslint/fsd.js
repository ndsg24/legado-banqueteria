import path from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('../../src/', import.meta.url))
const layers = ['shared', 'entities', 'features', 'widgets', 'pages', 'app']

function parts(file) {
  return path.relative(sourceRoot, file).split(path.sep)
}

export const boundaries = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      layer: 'Importa desde una capa inferior. Los slices de una misma capa son independientes.',
      api: 'Usa la API pública del slice o segmento de destino.',
      outside: 'El frontend debe depender de módulos dentro de src o de paquetes instalados.',
    },
  },
  create(context) {
    const file = context.filename
    const [layer, slice] = parts(file)
    const from = layers.indexOf(layer)

    function check(node) {
      const specifier = node.source?.value
      if (typeof specifier !== 'string' || !specifier.startsWith('.')) return
      const target = path.resolve(
        path.dirname(file),
        specifier.split('?')[0].replace(/\.tsx?$/, ''),
      )
      const [toLayer, toSlice, ...rest] = parts(target)
      const to = layers.indexOf(toLayer)
      const report = (messageId) => context.report({ node: node.source, messageId })

      if (to < 0) {
        if (from >= 0) report('outside')
        return
      }
      if (layer === toLayer && (slice === toSlice || layer === 'app')) return
      if (layer === 'entities' && toLayer === 'entities' && rest.join('/') === '@x/' + slice) return
      if (from >= 0 && (to > from || (to === from && layer !== 'shared'))) return report('layer')

      if (toLayer === 'shared') {
        if (rest.length === 1 && ['ui', 'config'].includes(toSlice)) return
      } else if (
        toLayer === 'entities' &&
        ['menu', 'table'].includes(toSlice) &&
        rest.join('/') === 'ui'
      ) {
        return
      }
      if (rest.length && rest.join('/') !== 'index') report('api')
    }

    return {
      ImportDeclaration: check,
      ImportExpression: check,
      ExportAllDeclaration: check,
      ExportNamedDeclaration: check,
    }
  },
}
