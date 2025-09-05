# Art Wheel (Portable Component)

Minimal, self-contained SVG wheel component that you can reuse outside Hugo.

## Files (this folder)
- `art-wheel.css`
- `art-wheel.js`
- `art-elements.json` (default data)

Hugo shortcode that wires these up with Hugo Pipes (minify + fingerprint):
- `layouts/shortcodes/artwheel.html`

## Copy‑paste HTML snippet (for non‑Hugo sites)
Place the three files in the same folder and reference them as below.

```html
<link rel="stylesheet" href="./art-wheel.css">

<div class="artwheel attn-card" data-src="./art-elements.json" tabindex="0">
  <div class="wheel-wrap">
    <svg class="wheel" width="360" height="360" viewBox="0 0 360 360" aria-label="art wheel">
      <g id="wheel"></g>
      <circle cx="180" cy="180" r="175" fill="none" stroke="#ddd" />
      <circle cx="180" cy="180" r="6" fill="#333" />
    </svg>
    <div class="wheel-btns">
      <button class="aw-left" aria-label="rotate left">◀</button>
      <button class="aw-right" aria-label="rotate right">▶</button>
    </div>
  </div>
  <div class="panel">
    <h3 class="aw-title"></h3>
    <p class="aw-desc"></p>
    <p class="aw-prompt attn-center"><em></em></p>
  </div>
</div>

<script defer src="./art-wheel.js"></script>
```

- To embed data inline instead of a separate JSON request, omit `data-src` and add a sibling inline script:

```html
<script type="application/json" class="artwheel-data">
{ "items": [ { "title":"Value", "desc":"…", "prompt":"…" } ] }
</script>
```

## Using in Hugo
- Shortcode: add `{{< artwheel >}}` in any Markdown content.
- Assets are piped (minified + fingerprinted) automatically by the shortcode.

## Where these files live in this project
- CSS: `/Users/alanjust/Desktop/artists-are-jerks-test/hugo-test-site/assets/components/art-wheel/art-wheel.css`
- JS: `/Users/alanjust/Desktop/artists-are-jerks-test/hugo-test-site/assets/components/art-wheel/art-wheel.js`
- JSON: `/Users/alanjust/Desktop/artists-are-jerks-test/hugo-test-site/assets/components/art-wheel/art-elements.json`
- Shortcode: `/Users/alanjust/Desktop/artists-are-jerks-test/hugo-test-site/layouts/shortcodes/artwheel.html`
