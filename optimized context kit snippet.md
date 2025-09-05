PROJECT: Artists Are Jerks (Hugo + Cloudflare)
GOALS: Clean, fast static site; simple styling; token-efficient collaboration in Cursor.
STACK: Hugo; local dev at http://localhost:1313/; deploy to Cloudflare.
STYLES: Single global CSS file preferred; desktop+mobile in one file for simplicity.
FONTS: Averia Sans Libre and Spicy Rice.
HEADER: Gradient header; custom nav buttons; responsive hamburger menu.
LAYOUT: Using layouts/_default/baseof.html. Moving inline <style> into external CSS.
PREFERENCES: American English; incremental diffs; avoid “whole-repo” edits.
PREVIEW: Use `hugo server -D --disableFastRender --bind 127.0.0.1 --baseURL http://localhost:1313/` and point Cursor Preview to http://localhost:1313/.