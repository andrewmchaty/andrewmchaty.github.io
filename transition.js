(() => {
  const root = document.documentElement;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nativeTransition = 'onpageswap' in window && 'onpagereveal' in window;
  const key = 'astrodrews-meet-andrew';
  let departing = false;
  let incoming = false;
  try {
    const pending = JSON.parse(sessionStorage.getItem(key) || 'null');
    sessionStorage.removeItem(key);
    incoming = location.pathname === '/about-me/' && pending && Date.now() - pending.time < 15000;
  } catch (_) { /* Navigation still works when storage is unavailable. */ }

  if (incoming && !reducedMotion()) {
    root.classList.add(nativeTransition ? 'slide-to-about' : 'slide-about-enter');
  }
  const reset = () => {
    departing = false;
    root.classList.remove('slide-to-about', 'slide-about-enter', 'slide-about-exit');
  };
  document.addEventListener('animationend', event => {
    if (event.animationName === 'about-fallback-in') root.classList.remove('slide-about-enter');
  });
  addEventListener('pageshow', event => { if (event.persisted) reset(); });
  addEventListener('pagereveal', event => {
    if (!event.viewTransition) return;
    if (!incoming || reducedMotion()) {
      event.viewTransition.skipTransition();
      return;
    }
    root.classList.add('slide-to-about');
    event.viewTransition.finished.then(reset, reset);
    incoming = false;
  });
  addEventListener('pageswap', event => {
    if (!event.viewTransition) return;
    if (!departing || reducedMotion()) event.viewTransition.skipTransition();
    else root.classList.add('slide-to-about');
  });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('.hero-copy .text-link[href="/about-me/"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion()) return;
    if (departing) { event.preventDefault(); return; }
    departing = true;
    try { sessionStorage.setItem(key, JSON.stringify({time: Date.now()})); } catch (_) {}
    if (nativeTransition) return; // Keep real navigation, history, and browser loading behavior.
    event.preventDefault();
    root.classList.add('slide-about-exit');
    setTimeout(() => location.assign(link.href), 220);
  });
})();
