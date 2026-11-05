/* Prototipo Vinilos: inclinación 3D al pasar el ratón y vista rápida con giro.
   Sin dependencias. Sin JS cada portada sigue siendo un enlace a su página de detalle. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EASE = 'cubic-bezier(.2,.8,.2,1)';

  // 1) Inclinación hacia el puntero (solo ratón, sin reduced-motion)
  if (fine && !reduce && document.documentElement.dataset.tilt !== 'off') {
    document.querySelectorAll('a.cv').forEach((a) => {
      let raf = 0;
      a.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = a.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          a.style.setProperty('--ry', x * 22 + 'deg');
          a.style.setProperty('--rx', -y * 16 + 'deg');
        });
      });
      a.addEventListener('pointerleave', () => {
        a.style.removeProperty('--rx');
        a.style.removeProperty('--ry');
      });
    });
  }

  // 2) Vista rápida
  let current = null;

  const geometry = (src, S) => {
    const r = src.getBoundingClientRect();
    const dx = r.left + r.width / 2 - innerWidth / 2;
    const dy = r.top + r.height / 2 - innerHeight / 2;
    return `translate(${dx}px,${dy}px) scale(${r.width / S})`;
  };

  function openQuick(a) {
    if (current) return;
    const li = a.closest('li');
    const sleeve = a.querySelector('.sleeve');
    const tpl = li.querySelector('template');
    const S = Math.round(Math.min(innerWidth * 0.9, innerHeight * 0.82, 480));

    const ov = document.createElement('div');
    ov.className = 'qv';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', a.dataset.title + ': vista rápida');
    const scrimEl = document.createElement('div');
    scrimEl.className = 'qv-scrim';
    const cardEl = document.createElement('div');
    cardEl.className = 'qv-card';
    cardEl.dataset.slug = li.dataset.slug;
    cardEl.style.setProperty('--h', S + 'px');
    const front = document.createElement('div');
    front.className = 'qv-face qv-front';
    front.append(sleeve.cloneNode(true));
    const backFace = document.createElement('div');
    backFace.className = 'qv-face qv-back';
    backFace.append(tpl.content.cloneNode(true));
    cardEl.append(front, backFace);
    ov.append(scrimEl, cardEl);
    document.body.append(ov);
    document.body.classList.add('qv-open');

    const card = ov.querySelector('.qv-card');
    const scrim = ov.querySelector('.qv-scrim');
    const from = geometry(sleeve, S) + ' rotateY(0deg)';
    const to = 'translate(0,0) scale(1) rotateY(180deg)';
    a.style.visibility = 'hidden';

    card.animate([{ transform: from }, { transform: to }], { duration: reduce ? 1 : 700, easing: EASE, fill: 'forwards' });
    scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduce ? 1 : 350, fill: 'forwards' });

    const focusables = () => [...ov.querySelectorAll('a[href],button')];
    const first = ov.querySelector('.qv-main');
    setTimeout(() => first && first.focus(), reduce ? 0 : 450);

    const close = () => {
      if (!current) return;
      const src = current.a.querySelector('.sleeve');
      const back = card.animate(
        [{ transform: to }, { transform: geometry(src, S) + ' rotateY(0deg)' }],
        { duration: reduce ? 1 : 520, easing: EASE, fill: 'forwards' }
      );
      scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce ? 1 : 420, fill: 'forwards' });
      const done = () => {
        ov.remove();
        document.body.classList.remove('qv-open');
        a.style.visibility = '';
        a.focus({ preventScroll: true });
        document.removeEventListener('keydown', onKey);
        current = null;
      };
      back.onfinish = done;
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        const f = focusables();
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    scrim.addEventListener('click', close);
    ov.querySelector('[data-close]').addEventListener('click', close);
    current = { a, close };
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.cv');
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openQuick(a);
  });
})();
