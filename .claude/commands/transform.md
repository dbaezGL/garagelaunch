You are running the Transform skill for Garage Launch.

The user will invoke this skill as: `/transform path/to/source.html` or `/transform path/to/screenshot.png`
The argument is either the saved HTML source of the client's existing website, or one or more screenshots.

**Goal:** Rebuild the client's website as a clean, modern, mobile-responsive static page — but preserve their brand identity (colors, button style, section structure, real copy). This is NOT a BZ template conversion. Do not impose Baez Auto's colors or style. The client should recognize their own site.

---

## Step 1 — Read the source

Use the Read tool on every file provided. If it's HTML, read the whole thing. If it's a screenshot, use vision.

## Step 2 — Extract everything

From the source, pull:

**Business info:**
- `SHOP_NAME` — full business name
- `SHOP_SHORT` — logo abbreviation for footer (e.g. "BARB CITY AUTO")
- `CITY`, `STATE`, `ZIP`
- `PHONE` — formatted (e.g. "(815) 756-3898"), raw digits for `PHONE_RAW`
- `ADDRESS` — street address
- `FULL_ADDRESS` — street + city + state + zip
- `HOURS_WEEKDAY`, `HOURS_SAT`, `HOURS_SUN`
- `BOOKING_URL` — their appointment/booking link (not Calendly unless they use it)
- `TAGLINE` — their real slogan/tagline
- `YEAR` — current year

**Brand identity (extract exact values from CSS — do not guess):**
- Primary color (hex)
- Secondary color (hex)
- Any accent or dark variants
- Button style: do they use solid fill, outline, thick border, rounded corners, square?
- Font choices if identifiable

**Sections (in order):** Note every section they have — top bar, nav, hero, about, services, why us, testimonials, amenities, contact, footer, etc. Preserve this order.

**Real copy:** Pull verbatim — hero headline, tagline, about paragraph(s), service names, any bullet lists.

**Testimonials:** Grab real ones from their HTML. Note author name and any time reference.

**Services:** List all services shown (nav, cards, or text). Note any service page URLs if present.

**Amenities / trust signals:** Financing, shuttle, Wi-Fi, warranty, etc.

**Associations:** NAPA, AAA, ASE — any certifications shown.

**Assets needed:** Note hero image slot, team/staff photo slot, any logo files.

## Step 3 — Determine output path

Slug = SHOP_NAME lowercased, spaces → hyphens, remove special chars.
Output goes to: `clients/{shop-slug}/website/`

## Step 4 — Map CSS custom properties

Create CSS variables that match their brand:
```css
:root {
  --primary:    #[their main color];
  --primary-dk: #[darker shade for hover];
  --secondary:  #[their second color];
  --black:      #0a0a0a;
  --dark:       #111111;
  --white:      #FFFFFF;
  --muted:      rgba(255,255,255,0.62);
  --border:     rgba(255,255,255,0.09);
}
```

## Step 5 — Replicate their button style

Look at how their buttons are styled and replicate it. Examples:
- Thick left border: `border-left: 10px solid var(--primary); border: 2px solid ...`
- Rounded pill: `border-radius: 100px`
- Square solid: no border-radius, background fill
- Ghost outline: transparent bg, colored border

Name your button classes to match the variant (`.btn-primary`, `.btn-outline`, `.btn-ghost`, etc.)

## Step 6 — Build the hero section only

**IMPORTANT: Build the hero section only — not the full homepage.**

This is a client preview. The hero is what sells it. Stop after the hero is complete.

Write a single self-contained `index.html` with all CSS inline in a `<style>` block. Structure:

1. `<head>` — charset, viewport, title, meta description, Google Fonts (Oswald + Inter standard), inline `<style>`
2. `#topbar` (if they had one) — phone, address, hours strip
3. `<nav>` — logo, desktop nav links, phone, hamburger for mobile
4. Mobile menu drawer
5. `#hero` — full viewport, background image, headline, subtext, CTA button(s), trust badges
6. Hamburger JS (inline `<script>`)

**Key rules:**
- All image `src` paths use root-relative format: `/assets/filename.jpg`
- Nav fixed at 64px, hamburger on mobile
- Real copy verbatim — headline, tagline, trust badges
- Real colors from their CSS — not the BZ yellow/blue defaults
- Mobile-responsive out of the box

## Step 7 — Note what's missing

After writing the file, list:
- Asset files needed (hero image, logo) and their expected paths under `/assets/`
- Any placeholder URLs that need real values

## Step 8 — Write the file

Write to: `clients/{shop-slug}/website/index.html`

Then report:
```
✓ clients/{shop-slug}/website/index.html (hero preview)

Assets needed:
  /assets/hero.jpg       — [description of what photo goes here]

Placeholders to fill:
  BOOKING_URL — [where to find it]
  [etc.]
```

---

## Notes

- If both HTML source and screenshots are provided, use the HTML as primary source (more complete). Screenshots help identify visual style.
- If only screenshots: do your best, mark unknowable values with `[PLACEHOLDER]`.
- Fonts: default to Oswald (headings) + Inter (body) unless their brand uses something specific.
- Full homepage (all sections) is only built after the client signs. Hero preview is the pitch.
