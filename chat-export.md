# Chat Export — Garage Launch / Baez Auto Repair
*Exported: 2026-05-07*

---

## 1. Project Overview

**Garage Launch** is a web/marketing services company founded by Danny Baez (21), co-owner of Baez Auto Repair in Elgin, IL. The business targets independent auto shops (1–3 mechanics) with no online presence.

**Baez Auto Repair** (`baezauto1.com`) is the first client site and proof of concept — a fully custom static HTML/CSS website built from scratch.

**The BZ Template** is the name Danny gave to the design system used for Baez Auto. It will be reused for future Garage Launch clients.

---

## 2. Current State

### Site: baezauto1.com
- **Live at:** `baezauto1.com` (custom domain)
- **Hosting:** GitHub Pages (free, no limits)
- **Repo:** `github.com/dbaezGL/garagelaunch` (public)
- **Deploy:** GitHub Actions workflow on every push to `main` → publishes `clients/baez-auto/website/` to `gh-pages` branch
- **SSL:** Being provisioned by GitHub Pages (Let's Encrypt)

### Pages (English)
All pages use clean URLs (subdirectory structure, no `.html`):
- `/` — Homepage
- `/brakes/` — Brakes service page
- `/ac-service/` — A/C service page
- `/oil-changes/` — Oil changes page
- `/engine/` — Engine service page
- `/tire-service/` — Tire service page
- `/battery/` — Battery service page
- `/suspension/` — Suspension service page
- `/services/` — All services overview
- `/auto-repair/` — Google Ads landing page

### Pages (Spanish — `/es/`)
- `/es/` — Spanish homepage
- `/es/brakes/`, `/es/ac-service/`, `/es/oil-changes/`, `/es/engine/`, `/es/tire-service/`, `/es/battery/`, `/es/suspension/`

### Features
- Bilingual (EN/ES toggle on every page)
- Shared CSS (`/styles.css`) for all service pages
- Homepage has its own inline CSS (different layout)
- Mobile-responsive with hamburger nav
- Calendly booking integration (`calendly.com/baezauto1/30min`)
- Google Maps iframe on contact section
- 220+ Google Reviews, star rating displayed
- Phone: (630) 276-8596

---

## 3. What Was Done This Session

- **Shared CSS extracted** from all 7 service pages into `styles.css`
- **Hero layout** unified across all service pages (two-column grid: content left, service cards right)
- **Spanish homepage** fixed: replaced broken building photo with Google Maps iframe
- **7 Spanish service pages** created with full translations
- **EN/ES toggle buttons** added to every page
- **Spanish homepage service links** fixed (were pointing to English pages)
- **Netlify deployment** set up, hit credit limit (free plan: 300 credits, 15/deploy)
- **Migrated to GitHub Pages** — zero deploy cost, no limits
- **GitHub Actions workflow** created (`.github/workflows/deploy.yml`) to auto-deploy on push
- **DNS updated in Wix** — 4 GitHub Pages A records + www CNAME to `dbaezgl.github.io`
- **Assets moved** into `clients/baez-auto/website/assets/` (were outside publish dir)
- **All image paths** converted to root-relative (`/assets/...`)
- **All internal links** converted to root-relative absolute paths (no `.html` extensions)
- **Clean URLs** implemented via subdirectory structure (`brakes/index.html` → `/brakes/`)
- **Mobile fixes:** nav overlap, hero height, background photo position, scroll lag
- **Scroll performance:** `will-change: transform` on nav, `scroll-behavior: auto` on mobile
- **Calendly links** fixed on homepage (were pointing to `#contact-info`)
- **"Same-Day Service"** replaced with **"Honest Service"** in homepage copy
- **BAEZ logo** on auto-repair page made into a link to homepage
- **Testimonials grid** added to auto-repair landing page (4 real Google reviews)
- **`/export` skill** created at `~/.claude/commands/export.md`
- **BZ template** named — this design system is Garage Launch's first reusable product

---

## 4. Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Hosting | GitHub Pages | Netlify hit free credit limit (300/mo, 15/deploy); GH Pages is unlimited |
| Domain registrar | Keep on Wix | Domain already purchased there, just updated DNS |
| CSS architecture | Shared `styles.css` + inline `<style>` per page for bg only | Clean separation: shared styles external, page-specific background inline |
| URL structure | Subdirectory (`/brakes/index.html`) | GitHub Pages doesn't strip `.html`; directory = clean URL |
| Template name | **BZ** | Danny's choice for the Baez Auto design system |
| Booking | Calendly | Already set up by client |
| Language | Bilingual EN/ES | Core audience is Spanish-speaking community in Elgin, IL |

---

## 5. Open Issues / Next Steps

- **SSL cert** still provisioning on GitHub Pages (up to 15 min) — check and enable "Enforce HTTPS" once done
- **Wix subscription** — Danny considering canceling hosting plan (keep domain registration, don't let it expire June 16, 2026). Consider transferring domain to Namecheap (~$10/yr) before renewal
- **Netlify** — no longer needed; can disconnect or leave idle
- **Spanish homepage footer** — "Servicios" link goes to `/` (English homepage); should probably go to `/es/` or `/services/`
- **`/export` skill** — newly created, test in future sessions
- **Garage Launch own website** — still needs to be moved to its own repo and deployed
- **First paying client** — not yet landed

---

## 6. Key Technical Details

### Repo Structure
```
garagelaunch/
  .github/workflows/deploy.yml     ← GitHub Actions auto-deploy
  clients/
    baez-auto/
      website/                     ← publish root (GitHub Pages serves this)
        index.html                 ← homepage (inline CSS, different from service pages)
        styles.css                 ← shared CSS for all service pages
        assets/                    ← building_back.jpg, jose-baez.jpg, baez-logo.png, etc.
        brakes/index.html
        ac-service/index.html
        oil-changes/index.html
        engine/index.html
        tire-service/index.html
        battery/index.html
        suspension/index.html
        services/index.html
        auto-repair/index.html     ← Google Ads landing page
        es/
          index.html               ← Spanish homepage
          brakes/index.html
          ac-service/index.html
          oil-changes/index.html
          engine/index.html
          tire-service/index.html
          battery/index.html
          suspension/index.html
```

### GitHub Actions Deploy
```yaml
# .github/workflows/deploy.yml
- publish_dir: ./clients/baez-auto/website
- cname: baezauto1.com
- branch: gh-pages
```

### DNS (Wix)
```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  dbaezgl.github.io
```

### Brand / Design Tokens
```css
--yellow: #FFDA0F
--blue:   #203351
--black:  #000000
--dark:   #0d0d0d
Fonts: Oswald (headings), Inter (body)
```

### Business Info
- **Address:** 1919 Larkin Avenue, Elgin, IL 60123
- **Phone:** (630) 276-8596
- **Hours:** Mon–Fri 9am–7pm | Sat 9am–4pm | Sun Closed
- **Calendly:** calendly.com/baezauto1/30min
- **GitHub account:** dbaezGL
