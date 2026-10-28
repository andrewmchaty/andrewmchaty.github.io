# Astrodrews

Astrophotography, astronomy writing, and research by Andrew McHaty.

## Hosting

This repository is a static website. In Settings → Pages, select **Deploy from a branch**, **main**, and **/ (root)**. The preview address is https://andrewmchaty.github.io.

The custom domain is intentionally not configured yet. Keep astrodrews.com on its current host until the GitHub preview has been reviewed.

## Editing

- `index.html`: homepage
- `about-me/index.html`: biography and inline 2026 résumé
- `gallery/`, `articles/`, `research/`: content pages
- `style.css`: shared visual styling
- `app.js`: navigation, search, and résumé enlargement
- `documents/`: résumé PDF and its inline page previews
- `assets/`: optimized images

No build step or server dependencies are required. Preview locally using `python3 -m http.server 8765` from this directory.

The contact form uses the existing Formspree destination. Research and workshop documents continue to use their existing Google Drive links.
