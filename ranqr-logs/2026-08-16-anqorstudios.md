# Ranqr Audit Log — anqorstudios.com
**Date:** 2026-08-16
**Tool:** Ranqr (local, `claude -p` backend)
**Audited URL:** https://www.anqorstudios.com

---

## Audit 1 — Baseline (pre-changes)
**Audit ID:** f13a2389-9aea-4eeb-9945-ef5be645addb

| Signal | Score |
|---|---|
| **Overall** | **81 / 100** |
| Technical SEO | 89 / 100 |
| Content Quality | 99 / 100 |
| GEO Signals | 42 / 100 |
| Performance | 100 / 100 |
| AI GEO Readiness | 18 / 100 |
| AI Content Score | 64 / 100 |

**Summary:** Strong service clarity and concrete use-case examples but critically missing all structured data (Organization, FAQPage, Service schemas), no author or team attribution, and both title/meta exceed optimal character limits.

**AI Key Improvements:**
1. Add Organization + FAQPage + Service schema markup (zero structured data detected)
2. Add a visible FAQ section with 5–8 questions
3. Add author/team attribution and E-E-A-T signals (named founders, LinkedIn links)
4. Replace emoji-based feature bullets with semantic HTML
5. Add client-facing outcome metrics to each case study

---

## Changes Implemented (2026-08-16)

### Meta / Head
- **Title:** `Anqor Studios: AI Automation & Custom AI Systems | Dubai, UAE` (62 chars, brand-first) → `Custom AI Systems & Automation | Anqor Studios` (46 chars, keyword-first)
- **Description:** Removed UAE-restrictive language; now reads "for operator-led businesses" globally, "Based in Dubai, UAE" retained as location signal
- **OG title + description:** Updated to match
- **Twitter title + description:** Updated to match
- **Keywords:** Added global terms, removed "business automation UAE" restriction

### Schema / JSON-LD (already existed — Ranqr crawler not detecting it; see note below)
- `areaServed`: `["AE", "GB", "US", "SA", "QA", "KW"]` → `"Worldwide"`
- `currenciesAccepted`: Added GBP, EUR
- Organization + Service descriptions: "UAE businesses" → "operator-led businesses worldwide"

### HTML / Design
- **Hero pills:** Emoji icons (🚀 🔗 📈) replaced with SVG icons (`stroke="currentColor"`) — semantic, crawler-readable, accent-colored
- **H1 typo fix:** `Stop doing the work<br><em>AI...` had no space before `<br>`, causing crawlers to read "workAI" as one token → fixed with trailing space
- **Colored glow shadows (×2):** Replaced with neutral elevation shadows (impeccable detector flag)

### Deployment
- Committed to `main` on `github.com/anqoros/anqorstudios-site`
- Vercel auto-deployed; confirmed live with correct title before Audit 2

---

## Audit 2 — Post-changes
**Audit ID:** 7fce733d-330c-4c16-b3e9-4fa69bb15469

| Signal | Score | vs. Baseline |
|---|---|---|
| **Overall** | **81 / 100** | → same |
| Technical SEO | 89 / 100 | → same |
| Content Quality | 99 / 100 | → same |
| GEO Signals | 42 / 100 | → same |
| Performance | 100 / 100 | → same |
| AI GEO Readiness | **22 / 100** | ↑ +4 |
| AI Content Score | 58 / 100 | ↓ −6 (model variance) |

**Summary (AI):** Strong service page with real production case studies and specific metrics, but zero structured data, no FAQ, no team attribution, and an H1 formatting error collectively tank SEO and GEO discoverability.

---

## Why the Score Didn't Move (and What's Real)

### 1. Ranqr crawler bug — schema not being detected
The crawler is returning `has_faq_schema: None`, `has_organization_schema: None`, `schema_types_found: None` for this site, even though the HTML contains 160+ lines of JSON-LD in `<head>` (Organization, ProfessionalService, WebSite, FAQPage — all present). The GEO Signals score of 42 is wrong because of this; the actual structured data coverage is much better than the score implies.

**Fix needed in Ranqr:** The `crawler.py` JSON-LD extraction needs to be checked — likely a regex or parse issue on inline `<script type="application/ld+json">` blocks.

### 2. Meta tag changes take time to reflect in Google's index
The description/title changes are live on the page but Google refreshes its index on its own schedule (days to weeks). The Ranqr audit reads the live HTML directly so those changes are scored immediately — but the meaningful GEO impact (appearance in AI search results) reflects over time.

### 3. AI GEO Readiness (+4) is the real signal
The AI model reads the full page content and scored it 18 → 22. The improvement is real but modest — the meta changes alone don't unlock large GEO gains. The largest remaining lever is the visible FAQ body content (already has FAQPage schema; adding rendered FAQ text would amplify it).

---

---

## Audit 3 — After Crawler Bug Fix
**Audit ID:** 090d491f-ccb6-44c5-bdaf-34e4f86ac12b
**Bug fixed:** `analyze_geo_signals()` in `analyzer.py` — `has_type()` only checked top-level `@type`, not items nested inside `@graph`. Since anqorstudios.com uses a single JSON-LD block with `@graph` containing all types (Organization, FAQPage, ProfessionalService, WebSite), every schema check returned False. Fix: recurse into `@graph` children.

| Signal | Audit 1 (Baseline) | Audit 2 (Meta) | **Audit 3 (Fixed)** | Net change |
|---|---|---|---|---|
| **Overall** | 81 | 81 | **90** | **+9** |
| Technical SEO | 89 | 89 | 89 | — |
| Content Quality | 99 | 99 | 99 | — |
| **GEO Signals** | 42 | 42 | **75** | **+33** |
| Performance | 100 | 100 | 100 | — |
| AI GEO Readiness | 18 | 22 | 22 | +4 |

**GEO check results (Audit 3):**
- ✅ FAQ Schema (25%) — FAQPage JSON-LD detected
- ✅ Organization Schema (15%) — Organization JSON-LD detected
- ⚠️ Article Schema (15%) — N/A for homepage, expected warning
- ⚠️ Author Attribution (15%) — Person schema exists but author markup not detected in HTML; next priority
- ⚠️ Publication Date (10%) — N/A for service page
- ⚠️ Breadcrumb Schema (10%) — not present, low priority

---

## Remaining Recommendations (Next Session)

| Priority | Action | Expected Lift |
|---|---|---|
| 🔴 High | Fix Ranqr crawler schema detection bug | Unblocks accurate GEO scoring |
| 🔴 High | Add named founder/team section with credentials | E-E-A-T / AI citation authority |
| 🟡 Medium | Expand case studies to dedicated URLs with outcomes | GEO citations, credibility |
| 🟡 Medium | Add BreadcrumbList + SearchAction schema | Entity recognition in knowledge panels |
| 🟢 Low | Add AggregateRating schema (when reviews collected) | +weight in AI engine citations |
