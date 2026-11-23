import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../apps/api/src/', import.meta.url))
const segments = (filename) => path.relative(root, filename).split(path.sep)
const framework = /^(?:@nestjs\/|@prisma\/|express(?:\/|$)|pg(?:\/|$)|jose(?:\/|$))/

export const apiBoundaries = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      dependency: 'Usa los puertos del dominio. La infraestructura se enlaza en los módulos Nest.',
      context: 'Cruza a otro contexto mediante su index.ts público.',
    },
  },
  create(context) {
    const [area, layer, group] = segments(context.filename)
    const module = context.filename.endsWith('.module.ts')
    const domain = layer === 'domain'
    const useCase = layer === 'application' && group === 'use-cases'
    const application = layer === 'application' && !module
    function check(node) {
      const source = node.source?.value
      if (typeof source !== 'string') return
      const deny = (messageId) => context.report({ node: node.source, messageId })
      if (!source.startsWith('.')) {
        if ((useCase || domain) && framework.test(source)) deny('dependency')
        return
      }
      const target = path
        .resolve(path.dirname(context.filename), source)
        .replace(/\.(?:js|ts)$/, '')
      const [other, targetLayer, targetGroup] = segments(target)
      if (other !== area) {
        if (targetLayer && targetLayer !== 'index') return deny('context')
        if (domain || useCase) return deny('dependency')
        return
      }
      if (domain && targetLayer !== 'domain') return deny('dependency')
      if (application && !['application', 'domain'].includes(targetLayer)) return deny('dependency')
      if (useCase && targetLayer === 'application' && targetGroup !== 'use-cases') {
        if (node.importKind !== 'type') return deny('dependency')
      }
      if (layer === 'infrastructure' && group === 'web' && targetGroup === 'adapters')
        return deny('dependency')
    }
    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    }
  },
}
