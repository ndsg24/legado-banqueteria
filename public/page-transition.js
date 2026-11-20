/* Runs before paint so a cross-page transition retains the selected theme. */
;(() => {
  const root = document.documentElement
  let saved
  try {
    saved = localStorage.getItem('legado-theme')
  } catch {
    /* Use the device setting when storage is unavailable. */
  }
  root.dataset.theme = ['light', 'dark', 'garden', 'pool'].includes(saved)
    ? saved
    : matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
})()
