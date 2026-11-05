// Interacciones globales: modo oscuro, idioma recordado y flechas de los carruseles.
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Tema ('dark' | 'light'): misma clave que usan las páginas legales
const setTheme = (t, save) => {
  root.dataset.theme = t;
  if (save) { try { localStorage.setItem('theme', t); } catch {} }
  document.querySelectorAll('.theme-toggle').forEach((b) => {
    b.setAttribute('aria-label', t === 'dark' ? b.dataset.toLight : b.dataset.toDark);
    b.setAttribute('aria-pressed', String(t === 'dark'));
  });
};
setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
document.addEventListener('click', (e) => {
  if (e.target.closest('.theme-toggle')) setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  const l = e.target.closest('[data-setlang]');
  if (l) { try { localStorage.setItem('lang', l.dataset.setlang); } catch {} }
});

// Carruseles: flechas solo si queda contenido por ver en esa dirección
document.querySelectorAll('.scroller').forEach((sc) => {
  const row = sc.querySelector('[data-scroll]');
  const prev = sc.querySelector('.arrow.prev');
  const next = sc.querySelector('.arrow.next');
  if (!row || !prev || !next) return;
  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    prev.hidden = max < 8 || row.scrollLeft < 8;
    next.hidden = max < 8 || row.scrollLeft > max - 8;
  };
  const go = (dir) => row.scrollBy({ left: dir * Math.max(240, row.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  row.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(row);
  update();
});

// Galería: visor ampliado con <dialog> nativo (Esc y clic fuera cierran; el foco vuelve a la miniatura)
document.querySelectorAll('dialog.lightbox').forEach((dlg) => {
  const img = dlg.querySelector('img');
  let opener = null;
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.thumb');
    if (!t || !dlg.parentElement.contains(t)) return;
    opener = t; img.src = t.dataset.full; img.alt = t.dataset.alt; dlg.showModal();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('.lb-close')) dlg.close(); });
  dlg.addEventListener('close', () => { opener?.focus(); });
});
