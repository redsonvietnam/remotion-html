# Content Schema

> Content model boundary: what is content, what is presentation, and how they separate.

**Base:** ae55b9f | **Version:** 1.0

---

## 1. Content Boundary

```
Content (WHAT)              Presentation (HOW IT LOOKS)
─────────────               ──────────────────────────
title                       font, color, size
text                        position, alignment
numbers                     animation, transition
labels                      SVG, layout
quotes                      component selection
lists                       motion choreography
facts                       visual hierarchy
metadata                    theme tokens
```

**Rule:** Content MUST NOT contain presentation decisions.

---

## 2. Base Content Model

Minimal generic primitives. Not exhaustive — only types with evidence from NQ57 + hypothetical Template #2.

### TextContent

```typescript
interface TextContent {
  type: "text";
  value: string;
}
```

Use case: titles, subtitles, paragraphs, labels.

### NumberContent

```typescript
interface NumberContent {
  type: "number";
  value: number;
  label?: string;
  unit?: string;
}
```

Use case: statistics, counters, percentages.

### ListContent

```typescript
interface ListContent {
  type: "list";
  items: { title: string; subtitle?: string }[];
}
```

Use case: pillars, roles, bullet points, step sequences.

### QuoteContent

```typescript
interface QuoteContent {
  type: "quote";
  text: string;
  attribution?: string;
}
```

Use case: citations, dialogue, callouts.

### MetricContent

```typescript
interface MetricContent {
  type: "metric";
  value: number;
  max: number;
  label: string;
  unit?: string;
}
```

Use case: gauges, progress bars, scores.

### ChartContent

```typescript
interface ChartContent {
  type: "chart";
  chartType: "area" | "bar" | "line";
  dataPoints: { label: string; value: number }[];
  title?: string;
}
```

Use case: area charts, bar charts, line charts.

---

## 3. Scene Content

### SceneDef (from WS14 Runtime Contract)

```typescript
interface SceneDef {
  id: string;
  dur: number;
}
```

### Scene content block

Content inside a scene is typed per template:

```typescript
// NQ57 example
interface NQ57SceneContent {
  scenes: {
    id: string;
    dur: number;
    audio: string;        // NQ57-specific: TTS audio path
    caption: string;      // NQ57-specific: karaoke caption text
    title?: string;       // optional structured content
    subtitle?: string;
    roles?: ListContent;
    stats?: MetricContent[];
    chart?: ChartContent;
  }[];
}
```

### Template scene = content interpretation

```
SceneDef (content data)
  ↓
Template Scene Component
  ↓
Layout + Motion + Visual Language
```

The template decides HOW to present content. The content does NOT decide how it is rendered.

---

## 4. Audio / Caption Boundary

NQ57 has `audio` and `caption` in its SceneDef. Where do they belong?

| Field | Classification | Reason |
|---|---|---|
| `audio` | Template-specific metadata | Not all templates use TTS. Audio path is media reference, not generic content. |
| `caption` | Template-specific content | Captions are spoken dialogue text — content, but specific to TTS-based templates. |

### Why NOT in base SceneDef

- A kinetic typography template has no audio
- A data visualization template has no captions
- Forcing audio/caption into every template creates unnecessary coupling

### Where they live

```typescript
// NQ57 extends SceneDef with its own fields
interface NQ57Scene extends SceneDef {
  audio: string;    // media reference
  caption: string;  // spoken text content
}
```

Templates that need audio/caption define their own extended types. Templates that don't omit them.

---

## 5. Data vs Theme vs Template

| Layer | Defines | Example |
|---|---|---|
| **Data** | WHAT is shown | "30% GDP", "Người dân & Doanh nghiệp", chart data points |
| **Theme** | VISUAL TOKENS | `accent2: "#f3c969"`, `font: "Be Vietnam Pro"` |
| **Template** | STRUCTURE + PRESENTATION ORCHESTRATION | Which component renders which content, in what layout, with what motion |

### Boundary rules

- Data does NOT import theme
- Data does NOT reference components
- Data does NOT contain font names, colors, sizes, positions
- Theme does NOT reference data content
- Template imports both data and theme, orchestrates presentation

---

## 6. Content Reuse Test

Same content, different templates, different videos:

### Input: 3 statistics

```typescript
const stats: MetricContent[] = [
  { type: "metric", value: 30, max: 100, label: "Digital economy (% GDP)", unit: "%" },
  { type: "metric", value: 80, max: 100, label: "Online public services", unit: "%" },
  { type: "metric", value: 3, max: 10, label: "ASEAN AI ranking", unit: " Top" },
];
```

### Template A: Editorial

- Light background, serif font
- Stats appear as large counter numbers, one per scene
- Fade transition between each
- Karaoke caption below each number

### Template B: Kinetic Typography

- Dark background, bold sans-serif
- All three stats animate in simultaneously
- Numbers count up with staggered delay
- No captions — text IS the visual

### Template C: Infographic

- Dark background, multiple accent colors
- Three gauges side by side
- Area chart above, gauges below
- FlowLine connecting elements
- Karaoke caption at bottom

**Content is identical. Presentation is completely different.**

---

## 7. Anti-Patterns

These MUST NOT appear in content data:

| Anti-pattern | Why it is wrong |
|---|---|
| `fontSize: 48` | Presentation decision, belongs in scene component |
| `color: "#f3c969"` | Theme token, belongs in theme file |
| `position: { x: 100, y: 200 }` | Layout decision, belongs in scene component |
| `animation: "fadeUp"` | Motion decision, belongs in scene component |
| `transition: "slide"` | Transition decision, belongs in template root |
| `component: "CardBlock"` | Component selection, belongs in scene component |
| `renderAs: "Gauge"` | Rendering decision, belongs in scene component |
| `fontFamily: "Be Vietnam Pro"` | Theme token, belongs in theme file |

### Test

If you can change the visual output by modifying only the theme file, it is a theme concern, not content.

If you can change the visual output by modifying only the scene component, it is a presentation concern, not content.

If you can only change the meaning by modifying the data, it is content.

---

## 8. NQ57 Audit

### Current state of `src/data/nq57.ts`

| Field | Classification | Notes |
|---|---|---|
| `id` | Base SceneDef | Correct — scene identifier |
| `dur` | Base SceneDef | Correct — duration in seconds |
| `audio` | NQ57-specific metadata | TTS audio path — template-specific, not generic |
| `caption` | NQ57-specific content | Karaoke text — template-specific, not generic |

### Content hardcoded in scene components

| Location | Content | Should be in data? |
|---|---|---|
| `TitleScene.tsx` line 46 | "NGHỊ QUYẾT 57" | Yes — title content |
| `TitleScene.tsx` line 42 | "BỘ CHÍNH TRỊ · 22/12/2024" | Yes — metadata content |
| `TitleScene.tsx` line 49 | Subtitle text | Yes — subtitle content |
| `TitleScene.tsx` line 52 | "Kỷ nguyên vươn mình..." | Yes — tagline content |
| `RolesScene.tsx` lines 23-27 | ROLES array | Yes — list content |
| `StatsScene.tsx` lines 25-28 | GDP_DATA array | Yes — chart data |
| `StatsScene.tsx` lines 30-34 | GAUGES array | Yes — metric content |
| `StatsScene.tsx` line 50 | "Mục tiêu 2030" | Yes — section title |
| `PillarsScene.tsx` | Pillar labels | Yes — list content |
| `VisionScene.tsx` | Vision text | Yes — text content |
| `EndScene.tsx` | Closing text | Yes — text content |

### Presentation leakage in data

| Item | Issue |
|---|---|
| `nq57.colors.accent2` in ROLES array | Color is a theme concern, not content |
| `nq57.colors.accent1/2/3` in GAUGES | Color is a theme concern, not content |

**Note:** This audit identifies issues. WS15 does NOT migrate NQ57 data — it documents what a correct migration would look like.

---

## 9. Template #2 Test

### Hypothetical: Same NQ57 content, different template

**NQ57 content (extracted):**

```typescript
const nq57Content = {
  title: "NGHỊ QUYẾT 57",
  subtitle: "Đột phá phát triển Khoa học – Công nghệ – Đổi mới sáng tạo & Chuyển đổi số quốc gia",
  roles: [
    { title: "Người dân & Doanh nghiệp", subtitle: "Trung tâm · Chủ thể · Động lực chính" },
    { title: "Nhà khoa học", subtitle: "Nhân tố then chốt" },
    { title: "Nhà nước", subtitle: "Dẫn dắt · Kiến tạo" },
  ],
  stats: [
    { value: 30, max: 100, label: "Kinh tế số (% GDP)", unit: "%" },
    { value: 80, max: 100, label: "Dịch vụ công trực tuyến", unit: "%" },
    { value: 3, max: 10, label: "ASEAN về AI", unit: " Top" },
  ],
};
```

**Template A (NQ57 — infographic):**
- Dark background, 3 accent colors
- RingDraw + FlowLine + Gauges
- KaraokeReveal captions
- CardBlock for roles

**Template B (Editorial — typography-heavy):**
- Light background, 1 accent color
- Large kinetic text, minimal SVG
- Word-by-word reveal
- No gauges, no flow lines
- Roles as simple text list

**Template C (Kinetic — text-only):**
- Dark background, monochrome
- Text is the only visual element
- Title scales from 0 to full size
- Roles appear word-by-word
- Stats count up as large numbers
- No SVG, no charts, no cards

**Content is identical. Each template interprets it completely differently.**

---

## 10. Relation to WS14 (Runtime Contract)

```
SceneDef (id + dur)
  ↓
Content Block (template-specific typed data)
  ↓
Template Scene Component (layout + motion + visual language)
  ↓
Components (CardBlock, SectionLabel, GradientText)
  ↓
Design Primitives (RingDraw, KaraokeReveal, FlowLine)
```

Template-specific helpers (e.g. `fadeUp`) remain inside the template directory (`templates/{id}/helpers.tsx`), not in the Design layer.

### No additional runtime abstraction

The content schema is a documentation boundary, not a runtime layer. There is no `ContentProvider`, no `ContentRenderer`, no generic content-to-component mapper. Templates directly import their data and render it with their chosen components.

The schema exists to:
1. Define what content IS vs what presentation IS
2. Prevent content from leaking presentation decisions
3. Enable content reuse across templates
4. Guide template authors on what belongs in data files vs scene components

---

## 11. Validation

### Documentation-first

No code changes in WS15. This is a schema definition.

### Runtime validation

```bash
npx tsc --noEmit
npx remotion still src/index.ts NghiQuyet57V2 out/ws15-test.png --log=error
```

No behavior change expected. NQ57 continues to work as-is.

---

## 12. Summary

```
Content = WHAT is shown
  → text, numbers, lists, quotes, metrics, charts
  → NO fonts, colors, sizes, positions, animations

Theme = VISUAL TOKENS
  → colors, fonts, spacing
  → NO content values

Template = STRUCTURE + PRESENTATION
  → scene order, transitions, component selection, layout, motion
  → orchestrates content + theme into visual output

Composition = HOW REMOTION RUNS IT
  → registration, dimensions, FPS, duration
```

### The test

If you can swap the theme file and get a different-looking video with the same content → content and theme are correctly separated.

If you can swap the template and get a completely different video with the same content → content and template are correctly separated.

If you can only change the meaning by changing the data → it is content.
