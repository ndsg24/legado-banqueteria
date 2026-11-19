/* Runs before paint so a cross-page transition retains the selected theme. */
;(() => {
  const root = document.documentElement
  try {
    const saved = localStorage.getItem('legado-theme')
    root.dataset.theme =
      saved === 'dark' || saved === 'light'
        ? saved
        : matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
})()
