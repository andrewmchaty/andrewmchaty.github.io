(() => {
  if (!/^\/(articles|research|gallery)\/.+/.test(location.pathname) || !document.querySelector('main .prose')) return;
  let dialog, enlargedImage, caption, zoom, lastFocus, previousOverflow;
  function setZoom(enlarged) {
    dialog.classList.toggle('image-viewer-zoomed', enlarged);
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? 'Fit to screen' : 'Actual size';
  }
  function setup() {
    dialog = document.createElement('dialog');
    dialog.className = 'image-viewer';
    dialog.setAttribute('aria-label', 'Enlarged image');
    dialog.innerHTML = '<div class="image-viewer-toolbar"><button type="button" class="image-viewer-zoom" aria-pressed="false">Actual size</button><button type="button" class="image-viewer-close" aria-label="Close image viewer">Close <span aria-hidden="true">×</span></button></div><div class="image-viewer-stage"><img class="image-viewer-image" alt=""></div><p class="image-viewer-caption"></p>';
    document.body.append(dialog);
    enlargedImage = dialog.querySelector('img');
    caption = dialog.querySelector('.image-viewer-caption');
    zoom = dialog.querySelector('.image-viewer-zoom');
    zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'));
    dialog.querySelector('.image-viewer-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.classList.contains('image-viewer-stage')) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow;
      lastFocus?.focus({preventScroll:true});
    });
  }
  function open(image) {
    if (!dialog) setup();
    lastFocus = image.closest('a') || image;
    const link = image.closest('a');
    const source = link && /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(link.href) ? link.href : image.currentSrc || image.src;
    enlargedImage.src = source;
    enlargedImage.alt = image.alt || 'Enlarged article image';
    caption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || image.alt || '';
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    setZoom(false);
    dialog.showModal();
    dialog.querySelector('.image-viewer-close').focus();
  }
  const images = document.querySelectorAll('main img');
  images.forEach(image => {
    image.classList.add('can-enlarge');
    image.title = 'Click to enlarge';
    const link = image.closest('a');
    if (link) link.setAttribute('aria-label', 'Enlarge image: ' + (image.alt || 'article figure'));
    else { image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-label', 'Enlarge image: ' + (image.alt || 'article figure')); }
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); open(image); }
    });
  });
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const image = event.target.closest?.('img.can-enlarge') || event.target.closest?.('a')?.querySelector('img.can-enlarge');
    if (!image) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open(image);
  }, true);
})();
