# SOP: Client Website Build
**Garage Launch — Internal**

---

## Phase 1 — Client Intake

Collect everything before opening Claude Code.

| Info | Notes |
|------|-------|
| Business name | Full + short version (e.g. "Barb City Automotive" / "BARB CITY AUTO") |
| Phone | Formatted + raw digits |
| Address | Street, City, State, ZIP |
| Hours | Weekday, Saturday, Sunday |
| Services | List all (check nav, cards, any service page) |
| Existing website | URL or saved HTML source |
| Photos | Hero image, building photo, team photo |
| Booking link | Calendly, their own system, or none |
| Google review count | Approximate ("220+") |
| Google Ads account? | Yes/No — affects Phase 4 |

**Minimum to start a build:** name, phone, address, hours, services, at least one photo.

---

## Phase 2 — Choose Your Build Path

### Path A — New site, no existing brand
Client has no website or a very basic one. Use the BZ template.

```
/bz-screenshot path/to/screenshot.png
```

Outputs to `tools/themes/bz/output/{shop-slug}/`. Move to `clients/{shop-slug}/website/` when done.

### Path B — Client has an established site/brand to preserve
Client has a real website with recognizable colors, button styles, copy. Use transform.

```
/transform path/to/their-site.html
```

Outputs directly to `clients/{shop-slug}/website/index.html`.

**Rule:** If they have brand colors and real copy → Path B. If starting from scratch → Path A.

---

## Phase 3 — Build Review

After the skill runs, check every item:

- [ ] All `{{PLACEHOLDER}}` tokens replaced — search for `{{` in the output file
- [ ] Phone number correct in nav, hero CTA, contact section, mobile menu, footer
- [ ] Address links to correct Google Maps URL
- [ ] Hours match what client provided
- [ ] All image `src` paths are root-relative (`/assets/filename.jpg`, not `assets/filename.jpg`)
- [ ] Hero background image path matches actual asset filename
- [ ] Mobile menu opens and closes
- [ ] All service page links point to `/{slug}/`
- [ ] Booking button URL is correct (not the Calendly placeholder)
- [ ] Footer copyright year is current

---

## Phase 4 — Assets

Place all images in `clients/{shop-slug}/website/assets/`:

| File | What it is |
|------|------------|
| `hero.jpg` | Hero background — shop exterior or mechanic working |
| `building.jpg` | Building photo — used in Hours section |
| `team.jpg` | Staff photo — used in About section (transform sites) |

Compress images before adding. Hero should be under 400KB. Use squoosh.app if needed.

---

## Phase 5 — Deploy to GitHub Pages

1. Confirm `clients/{shop-slug}/website/` has `index.html` and `assets/`
2. Check if client gets their own repo or stays in the monorepo
3. In GitHub Actions (`.github/workflows/deploy.yml`), set:
   ```yaml
   publish_dir: ./clients/{shop-slug}/website
   ```
4. Push to `main` — Pages deploys automatically
5. Confirm live URL loads correctly on mobile and desktop

If client has a custom domain: add `CNAME` file to the website folder containing their domain, then point their DNS A records to GitHub Pages IPs.

---

## Phase 6 — Google Ads Conversion Tracking

**Only if client is running Google Ads.**

1. In Google Ads: **Goals → Conversions → New conversion action → Website**
2. Category: **Phone call lead**
3. Data source: **Calls from website visits**
4. Copy the global tag (`AW-XXXXXXXXX`) and event snippet
5. Add to the landing page `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>
<!-- Click-to-call conversion -->
<script>
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') { window.location = url; }
  };
  gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXXXXX',
    'value': 1.0,
    'currency': 'USD',
    'event_callback': callback
  });
  return false;
}
</script>
```

6. Add `onclick="return gtag_report_conversion('tel:XXXXXXXXXX');"` to every phone link:
   - Nav phone
   - Mobile menu phone
   - Hero CTA button
   - Contact section phone

7. Push. Google verifies within 24–48 hours. The "No tag found" warning clears on its own.

**Note:** The AW- tag ID and conversion label are public — safe to commit.

---

## Phase 7 — SEO Directory Listings

Submit to these after launch. NAP must match exactly across all of them.

**Tier 1 — Do first:**
- Yelp
- BBB (bbb.org)
- YellowPages (yellowpages.com)
- Angi (angi.com)
- Foursquare
- MapQuest

**Tier 2 — Auto-specific:**
- RepairPal (repairpal.com)
- Carfax Service Shop (carfax.com/shop)
- Mechanic Advisor

**Tier 3 — Local:**
- Local Chamber of Commerce
- Nextdoor

**NAP template:**
```
[Business Name]
[Street Address], [City], [State] [ZIP]
([Area Code]) [Number]
```

Same format. Every listing. No exceptions.

---

## File Structure Reference

```
clients/
  {shop-slug}/
    website/
      index.html          ← homepage
      assets/
        hero.jpg
        building.jpg
        team.jpg
      {service-slug}/
        index.html        ← service page (if built)
```

---

## Tools Reference

| Tool | Command | Use case |
|------|---------|----------|
| BZ Screenshot | `/bz-screenshot path` | New site from screenshot |
| Transform | `/transform path` | Rebuild preserving client brand |

Templates live in `tools/themes/bz/templates/`.
