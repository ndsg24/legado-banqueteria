import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { test } from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'

const lint = new ESLint()

test('API mappers and presenters export classes with static methods', async () => {
  const root = new URL('../../../src/', import.meta.url)
  const files = (await readdir(root, { recursive: true })).filter((file) =>
    /\.(mapper|presenter)\.ts$/.test(file),
  )
  assert.ok(files.length > 0)
  for (const file of files) {
    const source = await readFile(new URL(file, root), 'utf8')
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest)
    const exported = tree.statements.filter((node) =>
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
    )
    const classes = exported.filter(ts.isClassDeclaration)
    assert.ok(classes.length > 0, file + ' must export a class')
    assert.ok(
      exported.every(
        (node) =>
          ts.isClassDeclaration(node) ||
          ts.isTypeAliasDeclaration(node) ||
          ts.isInterfaceDeclaration(node),
      ),
      file + ' must expose its transformations through the class',
    )
    for (const declaration of classes) {
      const methods = declaration.members.filter(ts.isMethodDeclaration)
      assert.ok(methods.length > 0, file + ' must define a transformation')
      for (const method of methods)
        assert.ok(
          method.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword),
          file + '#' + method.name.getText(tree) + ' must be static',
        )
    }
  }
})

async function violations(file, source) {
  const [result] = await lint.lintText(source, { filePath: 'apps/api/src/' + file })
  return result.messages.filter((message) => message.ruleId === 'api/boundaries')
}

test('use cases import domain ports and only the type of a CQRS message', async () => {
  const file = 'finance/application/use-cases/read-ledger.use-case.ts'
  assert.equal(
    (await violations(file, "import type { Ledger } from '../../domain/ports/output/ledger.port'"))
      .length,
    0,
  )
  const query = '../queries/read-ledger/read-ledger.query'
  assert.equal(
    (await violations(file, 'import type { ReadLedgerQuery } from "' + query + '"')).length,
    0,
  )
  for (const source of [
    'pg',
    '@nestjs/common',
    '../../infrastructure/adapters/ledger.postgres',
    query,
  ]) {
    assert.equal((await violations(file, 'import "' + source + '"')).length, 1, source)
  }
})

test('cross-context dependencies use the public entry and controllers cannot import adapters', async () => {
  const file = 'finance/infrastructure/web/http/controllers/ledger.controller.ts'
  assert.equal(
    (await violations(file, "export * from '../../../adapters/ledger.postgres'")).length,
    1,
  )
  assert.equal(
    (
      await violations(
        file,
        "import('../../../../../kitchen/infrastructure/adapters/recipes.postgres')",
      )
    ).length,
    1,
  )
  assert.equal((await violations(file, "import('../../../../../kitchen')")).length, 0)
})

test('each business action follows the Clerity message, handler, module and use case layout', async () => {
  for (const context of ['identity', 'quotes', 'finance', 'kitchen']) {
    const base = new URL('../../../src/' + context + '/', import.meta.url)
    const app = new URL('application/', base)
    const layers = await readdir(base)
    for (const name of [
      'index.ts',
      context + '.module.ts',
      'application',
      'domain',
      'infrastructure',
    ])
      assert.ok(layers.includes(name), context + '/' + name)
    const useCases = new Set(await readdir(new URL('use-cases/', app)))
    const groups = await readdir(app)
    for (const group of groups.filter((name) => ['commands', 'queries'].includes(name))) {
      const directory = new URL(group + '/', app)
      const entries = await readdir(directory, { withFileTypes: true })
      assert.ok(entries.some((entry) => entry.name === group + '.module.ts'))
      for (const { name } of entries.filter((entry) => entry.isDirectory())) {
        const suffix = group === 'commands' ? 'command' : 'query'
        const files = await readdir(new URL(name + '/', directory))
        for (const ending of [suffix, 'handler', 'module'])
          assert.ok(
            files.includes(name + '.' + ending + '.ts'),
            context + '/' + name + '.' + ending,
          )
        assert.ok(useCases.delete(name + '.use-case.ts'), context + '/' + name)
      }
    }
    assert.equal(useCases.size, 0, context)
  }
})
