(() => {
  let busy = false;
  let frame;
  let animations = [];
  let timer;
  let previousOverflow = '';
  function reset() {
    clearTimeout(timer);
    animations.forEach(animation => animation.cancel());
    animations = [];
    frame?.remove();
    frame = undefined;
    if (busy) document.documentElement.style.overflow = previousOverflow;
    busy = false;
    document.querySelector('.hero-copy .text-link')?.removeAttribute('aria-busy');
  }
  addEventListener('pageshow', event => { if (event.persisted) reset(); });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('.hero-copy .text-link[href="/about-me/"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (busy) return;
    busy = true;
    link.setAttribute('aria-busy', 'true');
    const destination = link.href;
    previousOverflow = document.documentElement.style.overflow;
    const navigate = () => location.assign(destination);
    // Load the real destination before moving either screen. This avoids relying
    // on cross-document view-transition support in embedded browsers.
    frame = document.createElement('iframe');
    frame.className = 'about-slide-frame';
    frame.title = 'About Andrew preview';
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.inert = true;
    frame.addEventListener('load', async () => {
      clearTimeout(timer);
      try {
        if (!frame.contentDocument?.querySelector('.about-prose')) { navigate(); return; }
        document.documentElement.style.overflow = 'hidden';
        const options = {duration: 800, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards'};
        animations = [
          document.body.animate([{transform:'translateX(0)'},{transform:'translateX(-100vw)'}], options),
          frame.animate([{transform:'translateX(100vw)'},{transform:'translateX(0)'}], options)
        ];
        await Promise.all(animations.map(animation => animation.finished));
        navigate();
      } catch (_) { navigate(); }
    }, {once:true});
    frame.src = destination;
    // A sibling of body stays independent of the outgoing body's transform.
    document.documentElement.append(frame);
    timer = setTimeout(navigate, 8000);
  });
})();
