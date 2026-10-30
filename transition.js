(() => {
  let busy = false, frame, timer, activeLink;
  let animations = [];
  let previousOverflow = '';
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function reset() {
    clearTimeout(timer);
    animations.forEach(animation => animation.cancel());
    animations = [];
    frame?.remove();
    frame = undefined;
    if (busy) document.documentElement.style.overflow = previousOverflow;
    busy = false;
    activeLink?.removeAttribute('aria-busy');
  }
  addEventListener('pageshow', event => { if (event.persisted) reset(); });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced() || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !destination.pathname.endsWith('/') || destination.hash || destination.pathname === location.pathname) return;
    event.preventDefault();
    if (busy) return;
    busy = true;
    activeLink = link;
    link.setAttribute('aria-busy', 'true');
    previousOverflow = document.documentElement.style.overflow;
    const slide = link.matches('.hero-copy .text-link');
    const navigate = () => location.assign(destination.href);
    document.dispatchEvent(new Event('site:navigate'));
    frame = document.createElement('iframe');
    frame.className = 'page-transition-frame';
    frame.title = 'Next page';
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.inert = true;
    frame.addEventListener('load', async () => {
      clearTimeout(timer);
      try {
        if (!frame.contentDocument?.querySelector('#main')) { navigate(); return; }
        document.documentElement.style.overflow = 'hidden';
        // Preserve the incoming header's layout space, but keep the current
        // navigation visible and stationary above the moving content.
        const incomingHeader = frame.contentDocument.querySelector('body > header');
        if (incomingHeader) incomingHeader.style.visibility = 'hidden';
        const options = {duration: slide ? 650 : 420, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards'};
        animations = [
          ...Array.from(document.querySelectorAll('body > main, body > footer')).map(content => content.animate(slide ? [{transform:'translateX(0)'},{transform:'translateX(-100vw)'}] : [{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-24px)'}], options)),
          frame.animate(slide ? [{opacity:1,transform:'translateX(100vw)'},{opacity:1,transform:'translateX(0)'}] : [{opacity:0,transform:'translateX(40px)'},{opacity:1,transform:'translateX(0)'}], options)
        ];
        await Promise.all(animations.map(animation => animation.finished));
        navigate();
      } catch (_) { navigate(); }
    }, {once:true});
    frame.src = destination.href;
    // Keep the incoming screen independent of the outgoing content's transform.
    document.documentElement.append(frame);
    timer = setTimeout(navigate, 8000);
  });
})();
