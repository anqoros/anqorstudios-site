# Anqor Brand Assets

**Look at `ASSET-SHEET.png` first** — one image showing every asset in this folder with its filename. Fastest way to find what you need.

Then open **`index.html`** in a browser for the full brand guide (wordmark options, favicon sizing tests, colors, type, voice).

## The two files you'll reach for most

| I need… | Use this |
|---|---|
| **The logo** (wordmark) | `logo/anqor-wordmark-black.svg` — or `-white.svg` on dark backgrounds |
| **A profile photo** | `social/anqor-square-wordmark-white-on-black-1000.png` |

> **Note on the transparent files:** `logo/*.svg` and `logo/*-1200.png` / `*-2400.png` have transparent backgrounds. That's correct for placing on any color — but it means the white versions look *invisible* in Finder or a white-background viewer, and SVGs often don't generate a Finder thumbnail at all. If you just want to see or hand someone the logo, use `logo/anqor-wordmark-on-white-2400.png` or `on-black-2400.png` — same mark, with a background baked in.

**Status: the wordmark direction is not finally signed off.** Everything here uses the current live wordmark — the same one already on the site and in the nav. If a different option from the guide gets picked, these files get regenerated; the mark itself is a five-minute swap.

## What's here

```
brand/
├── ASSET-SHEET.png               ← visual index of everything (start here)
├── index.html                    ← the brand guide
├── logo/
│   ├── anqor-wordmark-black.svg          ← THE LOGO. vector, transparent
│   ├── anqor-wordmark-white.svg          vector, transparent, dark bg
│   ├── anqor-wordmark-on-white-2400.png  logo w/ white bg baked in
│   ├── anqor-wordmark-on-black-2400.png  logo w/ black bg baked in
│   ├── anqor-wordmark-black-1200.png     transparent PNG
│   ├── anqor-wordmark-black-2400.png     transparent PNG, 2x
│   ├── anqor-wordmark-white-1200.png
│   └── anqor-wordmark-white-2400.png
├── icon/
│   ├── anqor-mark-on-black.svg           "A" monogram, dark tile
│   ├── anqor-mark-on-white.svg           "A" monogram, light tile
│   ├── anqor-mark-transparent.svg        mark only, inherits currentColor
│   ├── favicon.svg                       browser tab (primary)
│   ├── favicon-32x32.png
│   ├── favicon-512.png                   PWA / app stores
│   └── apple-touch-icon.png              iOS home screen, 180px
├── social/
│   ├── anqor-og-image-1200x630.png       link preview card
│   ├── anqor-square-wordmark-white-on-black-1000.png  ← PROFILE PHOTO (default)
│   ├── anqor-square-wordmark-black-on-white-1000.png  ← same, light version
│   ├── anqor-square-wordmark-white-on-black-400.png
│   ├── anqor-square-wordmark-black-on-white-400.png
│   ├── anqor-square-wordmark-white-on-black.svg       source
│   ├── anqor-square-wordmark-black-on-white.svg       source
│   ├── anqor-avatar-white-on-black-1000.png   monogram version (tiny contexts)
│   ├── anqor-avatar-black-on-white-1000.png   monogram, light version
│   ├── anqor-avatar-white-on-black-400.png
│   ├── anqor-avatar-black-on-white-400.png
│   ├── anqor-avatar-white-on-black.svg        source
│   └── anqor-avatar-black-on-white.svg        source
└── _reference/                   internal only — do not publish (see below)
```

## Profile photos

Use **`anqor-square-wordmark-white-on-black-1000.png`** as the default everywhere — LinkedIn, Instagram, X, YouTube, WhatsApp Business. Switch to the black-on-white version only on platforms with a dark UI, where a black avatar visually merges into the page background.

Grab the 400px files only if an uploader rejects the 1000px one.

### Wordmark vs. monogram

The wordmark is the stronger brand signal, and it stays legible at the sizes that actually matter — roughly 104px (profile page header) and 56px (feed and comment avatars). Below about 40px it gets tight, which is a real limit of a 3.6:1 word inside a circle, not a flaw in the file.

The `anqor-avatar-*` monogram files are still here for genuinely small contexts — favicon, app icon, anywhere the avatar renders under ~40px. Same brand, built to survive that size.

These are **square and full-bleed on purpose.** Every major platform crops a profile photo to a circle and applies its own mask — supplying a pre-rounded tile just leaves background slivers showing at the corners. The mark sits well inside the safe circle — 32.8 of a possible 50 units from centre, leaving **34% clear margin**, so there's room to zoom or reposition in a profile uploader without clipping.

## The wordmark SVGs are real vector outlines

The text was converted to actual vector paths using the Bricolage Grotesque font file, not left as a `<text>` element. That means they render identically everywhere — a printer, a client's laptop, a signage vendor — with no font file needed and no risk of falling back to Arial.

Use SVG wherever the tool accepts it. The PNGs exist only for tools that can't take SVG (Word, some social profile uploaders).

## Usage rules

- **Clear space:** keep at least the height of the "A" free on all sides of the wordmark.
- **Minimum size:** don't set the wordmark below 90px wide. Below that, use the monogram instead — "Anqor" stops being legible before the "A" does.
- **Don't:** recolor, outline, stretch, rotate, add shadows/glows/gradients, or place either mark on a busy photo without a solid backing shape.
- **Accent colors are per-product and reserved** — Usetta teal `#267870`, Outlia coral `#FA5051`, Ranqr green `#3FA66B`. Never use them decoratively or on the Anqor mark itself.

## `_reference/` — internal only

Holds Runway's actual icon file, downloaded from runway.com, used as the construction reference for the monogram (thick monoline stroke, rounded caps and joins). Fine for internal comparison; **do not publish it or deploy this folder to a public URL** — it would show visitors exactly which competitor's icon the mark was modeled on. It's gitignored for that reason.
