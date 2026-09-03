# WS-TEMPLATE-LIBRARY-01 — Template Library & Creator Entry Point

**Status:** PLAN (Phases 0–2 complete, Phase 3 pending)
**Goal:** Transform Preview Studio into a "Template Library → Preview → Create" experience

---

## Phase 0: Cloud Recovery ✅

- Local HEAD: `7cddfa4`, origin `3098450`, ahead 4 commits
- Working tree: clean
- All 386 tests PASS, verify PASS, tsc clean

## Phase 1: Discovery ✅

### Templates (7)
| Template | Formats | Studio Renderer | Scene Kinds | Productions |
|----------|---------|-----------------|-------------|-------------|
| nodeflow | 16:9 | NF_SCENES (6/6) | title, flow, contribution, benefit, compare, end | 1 |
| cr7 | 16:9, 9:16 | CR7_SCENES (4/4) | hero, stat, milestone, closing | 2 |
| cosmos | 16:9, 9:16 | COSMOS_SCENES (6/6) | title, fact, compare, timeline, diagram, closing | 1 |
| scrapbook | 16:9, 9:16 | SCRAPBOOK_SCENES (6/6) | hero, match, history, photo, timeline, closing | 1 |
| nq57 | 16:9 | Fallback | title, quote, roles, pillars, stats, vision, end | 5 |
| stoiclove | 9:16 | Fallback | hook, statement, split, concept, impermanence, ending | 1 |
| blueprint | 16:9 | Fallback | title, pillars, measure, detail, process, seal | 1 |

### Productions (13 compositions, 12 data files)
| Production | Template | Format | Data File |
|------------|----------|--------|-----------|
| NghiQuyet57V2 | nq57 | 16:9 | nq57.ts |
| DeAn06 | nq57 | 16:9 | dean06.ts |
| NghiQuyet79 | nq57 | 16:9 | nghiQuyet79.ts |
| StoicLove | stoiclove | 9:16 | stoicLove.ts |
| CanCuoc | nq57 | 16:9 | canCuoc.ts |
| LuatGTDB | nq57 | 16:9 | luatGTDB.ts |
| LuatBHXH | blueprint | 16:9 | luatBHXH.ts |
| BaoHiem2024 | nodeflow | 16:9 | baoHiem2024.ts |
| CR7Records | cr7 | 16:9 | cr7Records.ts |
| CR7VsMessi | cr7 | 16:9 | cr7VsMessi.ts |
| SolarSystem | cosmos | 16:9 | solarSystem.ts |
| ChampionsLeague | scrapbook | 16:9 | championsLeague.ts |
| ChampionsLeague9x16 | scrapbook | 9:16 | championsLeague.ts |

### Existing Infrastructure
- `TEMPLATE_FORMATS` (studio.jsx) — per-template format declarations
- `TEMPLATE_SCHEMAS` (contract.ts) — 9 schemas with sceneKinds, formats
- `PRODUCTIONS` (studio.jsx) — 13 entries with id, name, template, format, theme, scenes, content
- Preview server: `preview/serve.mjs` with `?studio` mode
- Standalone HTML pattern: React 18 CDN + Babel, no build step

---

## Phase 2: Design Decisions ✅

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Location | New `preview/library.html` | Keeps Studio intact as dev tool |
| Card content | Template + demo productions | Rich enough for discovery, not overwhelming |
| Preview flow | Link to Studio | Click production → `studio.html?production=<id>` |
| Build approach | Standalone HTML (no build) | Follows Studio pattern, consistent |

---

## Phase 3: R1 Challenge — 12 Architecture Questions

### Q1: Data duplication between library.html and studio.jsx
**Problem:** Both pages need the same template metadata and production data.
**Answer:** Duplicate the `PRODUCTIONS` and `TEMPLATE_FORMATS` arrays into `library.html`. Same pattern as Studio: standalone HTML files share no JS modules. The data is small (~2KB) and changes infrequently. When a new production is added, both files must be updated — same as today for Studio.

### Q2: How does Studio know which production to pre-select?
**Answer:** Add URL param parsing to `studio.jsx`. On load, check `new URLSearchParams(window.location.search).get('production')`. If present, find the matching entry in `PRODUCTIONS` and call `selectProduction(matched)` instead of defaulting to index 0. If not found, fall back to first production. No new state management needed.

### Q3: Library page template status metadata
**Problem:** The task mentions statuses (READY, PREVIEW ONLY, LEGACY, NO DEMO). Where does this live?
**Answer:** Add a `status` field to each template entry in the library page's `TEMPLATES` array. Values: `"ready"` (has demo production + full renderer), `"preview-only"` (has renderer but no demo), `"legacy"` (fallback renderer), `"no-demo"` (no productions). This is library-only metadata — does not need to be in contract.ts.

### Q4: Scene kind display on template cards
**Problem:** How to show scene kinds without cluttering the UI?
**Answer:** Show scene kinds as a compact tag list on the template card. Scene kinds come from `TEMPLATE_SCHEMAS[templateId].sceneKinds`. Display up to 4 visible + "+N more" overflow. Click to expand.

### Q5: Format badges
**Problem:** How to show 16:9 / 9:16 support visually?
**Answer:** Small aspect ratio badges (pill-shaped) on each template card. `16:9` and/or `9:16` based on `TEMPLATE_FORMATS[template]`. Disabled format shown as dimmed.

### Q6: Production cards within template cards
**Problem:** Layout: how do production entries appear?
**Answer:** Each template card has a "Demo Productions" section below the template metadata. Production entries are compact rows: name, format badge, status dot. Clicking a production row navigates to Studio.

### Q7: Responsive layout
**Problem:** How should the library page respond to different screen sizes?
**Answer:** CSS Grid with `auto-fill` and `minmax(340px, 1fr)`. Template cards stack vertically on narrow screens. No media query breakpoints needed — grid handles it.

### Q8: Navigation between Library and Studio
**Problem:** How does the user get back from Studio to Library?
**Answer:** Add a "Library" link/button in Studio's header bar (next to the existing "Preview Studio" title). This is a simple `<a href="library.html">` link. No state persistence needed.

### Q9: Library page serving
**Problem:** How does `serve.mjs` route to the library?
**Answer:** Add a route: when URL is `/` and not in studio mode, serve `library.html` instead of `index.html`. The old `index.html` (MP4 preview) becomes `/index.html` explicitly. Alternatively, add `/library` as a separate route and keep `/` unchanged.

### Q10: Template card visual preview (thumbnails)
**Problem:** Should template cards show a screenshot/thumbnail?
**Answer:** No thumbnails in v1. The library is text-based with rich metadata. Thumbnails would require either: (a) pre-rendered images that must be maintained, or (b) embedded canvas rendering (complex). Text metadata is sufficient for discovery. Thumbnail support can be added later.

### Q11: "Create" entry point
**Problem:** The task mentions "Template Library → Preview → Create". What is "Create"?
**Answer:** "Create" is a future Composer feature (DEFERRED per PROJECT-KNOWLEDGE.md entry #23). For this workstream, "Create" means: the library page clearly shows which template to use and links to Studio for preview. A placeholder "Create Production" button can be added to each template card that shows a toast/tooltip: "Coming soon — Composer integration". No actual creation flow is built.

### Q12: Testing strategy
**Problem:** How to verify the library page works?
**Answer:**
- **Manual:** Open `http://localhost:4321/library.html` → verify all 7 template cards render, all 13 productions listed, links to Studio work
- **Automated:** Add a test file `src/__tests__/templateLibrary.vitest.ts` that validates the data model (template names, formats, production mappings) matches contract.ts
- **Regression:** Run full test suite (`npm test`), `npm run verify`, `npx tsc --noEmit`

---

## Phase 4: Implementation Plan

### Step 1: Create `preview/library.html`
- Standalone HTML page (React 18 CDN + Babel standalone)
- Inline `<style>` block with library-specific CSS (dark theme, grid layout, cards)
- Inline `<script>` block with:
  - `TEMPLATES` array — template metadata (id, name, description, formats, sceneKinds, status, demoProductions)
  - `PRODUCTIONS` array — production entries (same structure as studio.jsx)
  - React components: `TemplateCard`, `ProductionRow`, `FormatBadge`, `SceneTagList`, `LibraryApp`
- CSS Grid layout: `auto-fill, minmax(340px, 1fr)`
- Each template card shows:
  - Template name (bold)
  - Format badges (16:9 / 9:16 pills)
  - Scene kind tags (compact, up to 4 + overflow)
  - Status badge (READY / PREVIEW ONLY / LEGACY)
  - Demo Productions section (list of production rows)
  - Each production row: name + format + click → Studio
- Header: "Template Library" title + link to Studio
- Footer: project info

### Step 2: Update `preview/serve.mjs`
- Change default route (`/`) from `index.html` to `library.html`
- Keep `index.html` accessible at `/index.html` explicitly
- Add comment explaining the routing change

### Step 3: Update `preview/studio.jsx`
- Add URL param parsing at top of app initialization:
  ```js
  const urlProduction = new URLSearchParams(window.location.search).get('production');
  ```
- If `urlProduction` matches a `PRODUCTIONS[].id`, auto-select it on load
- Add "Library" link in header: `<a href="library.html" style="...">Library</a>`

### Step 4: Update `preview/index.html`
- Add a link to library in the header: "Browse Template Library →"

### Step 5: Create `src/__tests__/templateLibrary.vitest.ts`
- Test: template metadata matches TEMPLATE_SCHEMAS from contract.ts
- Test: all productions in library data match PRODUCTIONS from studio.jsx
- Test: format declarations are consistent

### Step 6: Update documentation
- `docs/PROJECT-KNOWLEDGE.md`: Add entry for Template Library architecture
- `docs/PROJECT-RULES.md`: Add rule for library data consistency with contract.ts

### Files Changed
| File | Action | Description |
|------|--------|-------------|
| `preview/library.html` | NEW | Template library page |
| `preview/serve.mjs` | EDIT | Route `/` → library.html |
| `preview/studio.jsx` | EDIT | URL param + Library link |
| `preview/index.html` | EDIT | Add library link |
| `src/__tests__/templateLibrary.vitest.ts` | NEW | Data consistency tests |
| `docs/PROJECT-KNOWLEDGE.md` | EDIT | Add library entry |
| `docs/PROJECT-RULES.md` | EDIT | Add library rule |

### Files NOT Changed
- `src/data/contract.ts` — no new types needed
- `src/Root.tsx` — no new compositions
- `src/templates/*` — no template changes
- `src/data/*` — no data file changes

---

## Phase 5: Implementation

(Execute Steps 1–6 from Phase 4)

## Phase 6: Testing

- `npx tsc --noEmit` — typecheck
- `npm test` — all 386+ tests pass
- `npm run verify` — verification passes
- New test file passes

## Phase 7: Visual QA

- Open `http://localhost:4321/library.html`
- Verify: 7 template cards render correctly
- Verify: all 13 productions listed
- Verify: format badges correct per template
- Verify: scene kind tags correct
- Click a production → Studio opens with correct production selected
- Click "Library" in Studio → returns to library page
- Test responsive layout at various widths
- Test dark theme consistency with Studio

## Phase 8: Documentation

- Update PROJECT-KNOWLEDGE.md with Template Library entry
- Update PROJECT-RULES.md if new constraints needed

## Phase 9: Closeout

- All tests pass
- No console errors in browser
- Links work (library ↔ studio)
- Documentation updated

## Phase 10: Git

- Commit: `feat: add Template Library entry point (WS-TEMPLATE-LIBRARY-01)`
- Push to `feat/creative-template-nodeflow`

## Phase 11: Archive

- Mark WS-TEMPLATE-LIBRARY-01 as COMPLETE
- Update workstream tracker
