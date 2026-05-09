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

Outputs to `web-tools/themes/bz/output/{shop-slug}/`. Move to `clients/{shop-slug}/website/` when done.

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

Each client gets their own repo. Never put a live client site in the garagelaunch monorepo — if the monorepo has any issue, every client goes down at once.

### Step 1 — Create the client repo
1. Go to `github.com/dbaezGL` → New repository
2. Name: `{shop-slug}` (e.g. `barb-city-auto`)
3. Set to **Public** (required for free GitHub Pages + unlimited Actions minutes)
4. No README, no .gitignore — leave it empty

### Step 2 — Push the site to the client repo
Run this from the garagelaunch monorepo root:
```bash
# One-time setup — adds client repo as a remote
git remote add {shop-slug} https://github.com/dbaezGL/{shop-slug}.git

# Push just their subfolder as the root of their repo
git subtree push --prefix=clients/{shop-slug}/website {shop-slug} main
```

### Step 3 — Add the deploy workflow to the client repo
Copy `web-tools/client-deploy-workflow.yml` into the client repo at `.github/workflows/deploy.yml`.
Update the `cname:` line to match their domain. Push it.

### Step 4 — Enable GitHub Pages
1. Go to `github.com/dbaezGL/{shop-slug}/settings/pages`
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)**
4. Save

### Step 5 — Confirm live
Load the `{username}.github.io/{shop-slug}` URL — if it loads, proceed to Phase 5B for the custom domain.

### Pushing updates later
After making changes to a client site in the monorepo:
```bash
git subtree push --prefix=clients/{shop-slug}/website {shop-slug} main
```
This pushes only that client's changes to their repo and triggers a redeploy.

---

## Phase 5B — Domain & DNS Setup

Do this after the site is confirmed live on the default GitHub Pages URL.

### Step 1 — Buy the domain
- Use **Namecheap** (preferred — cheapest, clean UI)
- Search for `{shopname}.com` first, then `.co`, `.net` if taken
- Buy for 1 year minimum, enable auto-renew
- Skip all upsells (privacy protection is free on Namecheap by default)

### Step 2 — Enable GitHub Pages on the repo
1. Go to `github.com/{username}/{repo}/settings/pages`
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)**
4. Save

### Step 3 — Set the custom domain in GitHub Pages
1. Still in Settings → Pages
2. Enter the domain (e.g. `baezauto1.com`) in the Custom domain field
3. Save — GitHub will add a CNAME check

### Step 4 — Add domain to the deploy workflow
In `.github/workflows/deploy.yml`, confirm the `cname:` line matches the domain:
```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./clients/{shop-slug}/website
    cname: theirdomain.com
```
This auto-creates the CNAME file in gh-pages on every deploy so it never gets wiped.

### Step 5 — Point DNS to GitHub Pages
In Namecheap (or wherever domain was bought) → **Advanced DNS**:

**A Records** (for apex domain, e.g. `baezauto1.com`):
| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**CNAME Record** (for www):
| Type | Host | Value |
|------|------|-------|
| CNAME | www | {username}.github.io |

Delete any default A records or parking records that were already there.

### Step 6 — Wait for propagation
- DNS typically propagates in **15 min – 2 hours** (can take up to 48h)
- Test with: `nslookup theirdomain.com` — should return GitHub IPs
- Or check: [dnschecker.org](https://dnschecker.org)

### Step 7 — Enable HTTPS
1. Back in GitHub Settings → Pages
2. Once the domain resolves, the **Enforce HTTPS** checkbox becomes available
3. Check it — always

### Step 8 — Verify
- Load `https://theirdomain.com` on phone and desktop
- Check `https://www.theirdomain.com` redirects correctly
- Confirm no mixed content warnings (all assets on https)

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

Templates live in `web-tools/themes/bz/templates/`.
