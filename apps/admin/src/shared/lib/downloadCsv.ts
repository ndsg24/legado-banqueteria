export function downloadCsv(filename: string, rows: ReadonlyArray<ReadonlyArray<string | number>>) {
  const content = rows
    .map((row) =>
      row
        .map((value) => {
          const text =
            typeof value === 'string' && /^\s*[=+@-]/.test(value) ? "'" + value : String(value)
          return '"' + text.replaceAll('"', '""') + '"'
        })
        .join(';'),
    )
    .join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
