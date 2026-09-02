# Eason Logistics — Website

A complete, responsive corporate website for **Eason Logistics**, built with plain HTML5, CSS3 and vanilla JavaScript (no frameworks, no libraries).

## File Structure

```
eason-logistics/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── logo.png
│   ├── favicon.png
│   └── images/            ← add real photography here (see below)
└── README.md
```

## Design language

The site uses a "manifest & route" visual system: a navy/paper palette pulled
from the Eason Logistics mark, a dashed route line motif that reappears in the
hero and the process timeline, and stat/contact blocks styled like shipment
manifest tags (mono type, corner tags, dashed dividers).

- **Display type:** Big Shoulders Display (condensed, signage-like — used for headings)
- **Body type:** Inter
- **Mono/data type:** JetBrains Mono (stats, tags, labels)

All three are loaded from Google Fonts in `index.html`. If you need the site
to work fully offline, download the font files and swap the `<link>` tags for
local `@font-face` rules.

## Adding real photography

No stock photography is bundled. Every photographic slot (`hero.jpg`,
`about.jpg`, `transportation.jpg`, `freight.jpg`, `warehouse.jpg`,
`delivery.jpg`, `fleet-truck.jpg`, `fleet-container.jpg`, `safety.jpg`) is
already wired up in `index.html` and expects a file at `assets/images/`.

Until a real photo is added, each `<img>` automatically falls back to an
on-brand generated illustration (handled in `js/script.js` →
`ImageFallback`), so the layout never shows a broken image. Simply drop a
correctly named `.jpg` into `assets/images/` to replace the illustration with
a real photo — no code changes required.

## Contact details

Phone and email in the Contact section and footer are **placeholders**
(`+91 XXXXX XXXXX`, `info@easonlogistics.com`) — replace them with the real
numbers once available. Social links (Facebook, Instagram, LinkedIn,
YouTube) are placeholder `#` links for the same reason.

## Contact form

The form validates on the client (required fields, email/phone format,
minimum message length) and shows a success message on valid submission.
It is **not** wired to a backend — see the `ContactForm.handleSubmit` method
in `js/script.js` for the exact spot to add a `fetch()` call to your API once
one exists.

## Map

The location block under Contact is a styled placeholder (no invented
coordinates). Replace `.map-frame` in `index.html` with a Google Maps
`<iframe>` once you have a confirmed embed URL for:

> No. 58 B, Inno Geo City, Agaram, Varanasi, Oragadam (P.O), Kanchipuram District, Tamil Nadu, India.

## Browser support

Built for modern evergreen browsers (Chrome, Edge, Firefox, Safari — last 2
versions). Uses `IntersectionObserver` for scroll animations and
`color-mix()` for a couple of icon backgrounds; both degrade gracefully
(icons simply keep their base color, and reveal animations no-op showing
content immediately) in older engines.
