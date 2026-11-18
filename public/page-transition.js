/* Runs before paint so a cross-page transition retains the selected theme. */
(() => {
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem('legado-theme');
    root.dataset.theme = saved === 'dark' || saved === 'light' ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const ticket = JSON.parse(sessionStorage.getItem('legado-navigation') || 'null');
    sessionStorage.removeItem('legado-navigation');
    if (ticket && ticket.path === location.pathname && Date.now() - ticket.time < 20000) root.dataset.pageTransition = 'pending';
  } catch { /* Storage may be unavailable in private browsing. */ }
  // Never leave the page covered if the app cannot start.
  setTimeout(() => { if (root.dataset.pageTransition === 'pending') delete root.dataset.pageTransition; }, 6000);
})();
