import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

const root = new URL('../src/shared/i18n/locales/', import.meta.url)
async function catalog(locale) {
  const directory = new URL(locale + '/', root)
  const sections = (await readdir(directory)).filter((name) => name.endsWith('.json')).sort()
  const messages = {}
  for (const file of sections) {
    const entries = JSON.parse(await readFile(new URL(file, directory), 'utf8'))
    for (const [key, value] of Object.entries(entries)) {
      assert(key.startsWith(file.slice(0, -5) + '.'), locale + '/' + file + ': ' + key)
      assert(typeof value === 'string' && value.trim(), locale + ': ' + key)
      messages[key] = [...new Set(value.match(/\{\w+\}/g))].sort()
    }
  }
  return { sections, messages }
}

const source = await catalog('es')
for (const locale of ['en', 'fr', 'pt']) {
  assert.deepEqual(await catalog(locale), source, 'Las claves o los marcadores difieren en ' + locale)
}
console.log(Object.keys(source.messages).length + ' mensajes verificados en cuatro idiomas.')
