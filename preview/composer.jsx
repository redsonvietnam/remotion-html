// ---------------------------------------------------------------------------
// Composer — 3-panel project editor (standalone CDN build)
//
// Left: Scene list + operations
// Middle: Inspector (template-specific fields)
// Right: Static preview
//
// No Remotion hooks. No production data mutation. No TTS.
// ---------------------------------------------------------------------------

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "composer_projects";
const CURRENT_PROJECT_KEY = "composer_current_project";
const FPS = 30;
const TAIL = 0.5;
const sceneFrames = (dur) => Math.ceil((dur + TAIL) * FPS);

// ─── Template Capabilities ───────────────────────────────────────────────────

const TEMPLATE_CAPABILITIES = {
  scrapbook: {
    template: "scrapbook",
    label: "Scrapbook Editorial",
    formats: ["16:9"],
    defaultSceneKind: "hero",
    sceneKinds: [
      { kind: "hero", label: "Hero", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "tagline", label: "Tagline", type: "text" },
      ]},
      { kind: "match", label: "Match", fields: [
        { key: "homeTeam", label: "Home Team", type: "text", required: true },
        { key: "awayTeam", label: "Away Team", type: "text" },
        { key: "score", label: "Score", type: "text" },
        { key: "competition", label: "Competition", type: "text" },
        { key: "highlight", label: "Highlight", type: "textarea" },
      ]},
      { kind: "history", label: "History", fields: [
        { key: "year", label: "Year", type: "text" },
        { key: "fact", label: "Fact", type: "text", required: true },
        { key: "detail", label: "Detail", type: "textarea" },
        { key: "annotation", label: "Annotation", type: "text" },
      ]},
      { kind: "photo", label: "Photo", fields: [
        { key: "caption", label: "Caption", type: "text", required: true },
        { key: "annotation", label: "Annotation", type: "text" },
      ]},
      { kind: "timeline", label: "Timeline", fields: [
        { key: "title", label: "Title", type: "text", required: true },
      ]},
      { kind: "closing", label: "Closing", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "reference", label: "Reference", type: "text" },
      ]},
    ],
  },
  cr7: {
    template: "cr7",
    label: "CR7 Typography",
    formats: ["16:9", "9:16"],
    defaultSceneKind: "hero",
    sceneKinds: [
      { kind: "hero", label: "Hero", fields: [
        { key: "name", label: "Name", type: "text", required: true },
        { key: "tagline", label: "Tagline", type: "text" },
        { key: "subtitle", label: "Subtitle", type: "text" },
      ]},
      { kind: "stat", label: "Stat", fields: [
        { key: "label", label: "Label", type: "text" },
        { key: "bigNumber", label: "Big Number", type: "text", required: true },
        { key: "sub", label: "Sub", type: "text" },
        { key: "detail", label: "Detail", type: "textarea" },
        { key: "color", label: "Color", type: "select", options: ["accent1", "accent2", "accent3"] },
      ]},
      { kind: "milestone", label: "Milestone", fields: [
        { key: "title", label: "Title", type: "text", required: true },
      ]},
      { kind: "closing", label: "Closing", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "reference", label: "Reference", type: "text" },
      ]},
    ],
  },
  cosmos: {
    template: "cosmos",
    label: "Cosmos Space",
    formats: ["16:9", "9:16"],
    defaultSceneKind: "title",
    sceneKinds: [
      { kind: "title", label: "Title", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "tagline", label: "Tagline", type: "text" },
      ]},
      { kind: "fact", label: "Fact", fields: [
        { key: "label", label: "Label", type: "text" },
        { key: "bigValue", label: "Big Value", type: "text", required: true },
        { key: "unit", label: "Unit", type: "text" },
        { key: "description", label: "Description", type: "text" },
        { key: "detail", label: "Detail", type: "textarea" },
      ]},
      { kind: "compare", label: "Compare", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "insight", label: "Insight", type: "textarea" },
      ]},
      { kind: "diagram", label: "Diagram", fields: [
        { key: "title", label: "Title", type: "text", required: true },
      ]},
      { kind: "timeline", label: "Timeline", fields: [
        { key: "title", label: "Title", type: "text", required: true },
      ]},
      { kind: "closing", label: "Closing", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "reference", label: "Reference", type: "text" },
      ]},
    ],
  },
  nodeflow: {
    template: "nodeflow",
    label: "NodeFlow",
    formats: ["16:9"],
    defaultSceneKind: "title",
    sceneKinds: [
      { kind: "title", label: "Title", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "tagline", label: "Tagline", type: "text" },
      ]},
      { kind: "flow", label: "Flow", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
      ]},
      { kind: "contribution", label: "Contribution", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
      ]},
      { kind: "benefit", label: "Benefit", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
      ]},
      { kind: "compare", label: "Compare", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
      ]},
      { kind: "end", label: "End", fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "reference", label: "Reference", type: "text" },
      ]},
    ],
  },
};

function getCap(template) { return TEMPLATE_CAPABILITIES[template] || null; }
function getValidKinds(template) { const c = getCap(template); return c ? c.sceneKinds.map(k => k.kind) : []; }
function getDefaultContent(template, kind) {
  const c = getCap(template);
  if (!c) return { kind };
  const sk = c.sceneKinds.find(k => k.kind === kind);
  if (!sk) return { kind };
  const content = { kind };
  for (const f of sk.fields) content[f.key] = "";
  return content;
}

// ─── Store ───────────────────────────────────────────────────────────────────

function genId() { return `proj_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }
function genSceneId() { return `sc_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }

function loadProjects() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function saveProjects(projects) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch {} }
function loadProject(id) { return loadProjects().find(p => p.id === id) || null; }
function saveProject(project) {
  const projects = loadProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  const updated = { ...project, updatedAt: Date.now() };
  if (idx >= 0) projects[idx] = updated; else projects.push(updated);
  saveProjects(projects);
}
function deleteProject(id) {
  saveProjects(loadProjects().filter(p => p.id !== id));
  if (loadCurrentId() === id) localStorage.removeItem(CURRENT_PROJECT_KEY);
}
function loadCurrentId() { try { return localStorage.getItem(CURRENT_PROJECT_KEY); } catch { return null; } }
function saveCurrentId(id) { try { if (id) localStorage.setItem(CURRENT_PROJECT_KEY, id); else localStorage.removeItem(CURRENT_PROJECT_KEY); } catch {} }
function createProject(name, template, format = "16:9") {
  const now = Date.now();
  return { id: genId(), name, template, format, scenes: [], createdAt: now, updatedAt: now };
}

// ─── Scene Operations ────────────────────────────────────────────────────────

function addScene(project, scene, index) {
  const scenes = [...project.scenes];
  const idx = index !== undefined ? Math.min(index, scenes.length) : scenes.length;
  scenes.splice(idx, 0, scene);
  return { ...project, scenes, updatedAt: Date.now() };
}
function duplicateScene(project, sceneId) {
  const idx = project.scenes.findIndex(s => s.id === sceneId);
  if (idx < 0) return project;
  const o = project.scenes[idx];
  const dup = { ...o, id: genSceneId(), content: { ...o.content }, audio: o.audio ? { ...o.audio } : undefined };
  const scenes = [...project.scenes];
  scenes.splice(idx + 1, 0, dup);
  return { ...project, scenes, updatedAt: Date.now() };
}
function deleteScene(project, sceneId) {
  if (project.scenes.length <= 1) return project;
  return { ...project, scenes: project.scenes.filter(s => s.id !== sceneId), updatedAt: Date.now() };
}
function moveUp(project, sceneId) {
  const idx = project.scenes.findIndex(s => s.id === sceneId);
  if (idx <= 0) return project;
  const scenes = [...project.scenes];
  [scenes[idx-1], scenes[idx]] = [scenes[idx], scenes[idx-1]];
  return { ...project, scenes, updatedAt: Date.now() };
}
function moveDown(project, sceneId) {
  const idx = project.scenes.findIndex(s => s.id === sceneId);
  if (idx < 0 || idx >= project.scenes.length - 1) return project;
  const scenes = [...project.scenes];
  [scenes[idx], scenes[idx+1]] = [scenes[idx+1], scenes[idx]];
  return { ...project, scenes, updatedAt: Date.now() };
}
function updateContent(project, sceneId, content) {
  const scenes = project.scenes.map(s => s.id === sceneId ? { ...s, content: { ...content } } : s);
  return { ...project, scenes, updatedAt: Date.now() };
}
function updateDuration(project, sceneId, duration) {
  if (duration <= 0 || !isFinite(duration)) return project;
  const scenes = project.scenes.map(s => s.id === sceneId ? { ...s, duration } : s);
  return { ...project, scenes, updatedAt: Date.now() };
}
function changeKind(project, sceneId, kind) {
  if (!getValidKinds(project.template).includes(kind)) return project;
  const scenes = project.scenes.map(s => s.id === sceneId ? { ...s, kind, content: getDefaultContent(project.template, kind) } : s);
  return { ...project, scenes, updatedAt: Date.now() };
}
function updateAudio(project, sceneId, audio) {
  const scenes = project.scenes.map(s => s.id === sceneId ? { ...s, audio } : s);
  return { ...project, scenes, updatedAt: Date.now() };
}

// ─── Theme ───────────────────────────────────────────────────────────────────

const T = {
  bg: "#0f1117", bg2: "#161922", card: "#1e2028", border: "#2a2d38",
  ink: "#f0f0f0", muted: "#888", accent: "#4f8ff7", danger: "#e74c3c",
  font: "'Inter','Segoe UI',system-ui,sans-serif",
};

function fmtTime(s) { return Math.floor(s/60) + ":" + String(Math.floor(s%60)).padStart(2,"0"); }

// ─── OpBtn ───────────────────────────────────────────────────────────────────

function OpBtn({ onClick, disabled, title, danger, children }) {
  return <button onClick={e => { e.stopPropagation(); onClick(); }} disabled={disabled} title={title}
    style={{ background: danger ? T.danger+"22" : T.card, color: danger ? T.danger : T.ink,
      border: `1px solid ${T.border}`, borderRadius: 4, padding: "2px 8px",
      cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, opacity: disabled ? 0.4 : 1 }}>
    {children}
  </button>;
}

// ─── SceneList ───────────────────────────────────────────────────────────────

function SceneList({ project, selectedId, onSelect, onChange }) {
  const cap = getCap(project.template);
  const handleAdd = () => {
    const kind = cap?.defaultSceneKind || "hero";
    const scene = { id: genSceneId(), kind, content: getDefaultContent(project.template, kind), duration: 5 };
    onChange(addScene(project, scene));
  };
  return (
    <div style={{ width: 280, background: T.bg, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", fontFamily: T.font, fontSize: 13, color: T.ink }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Scenes ({project.scenes.length})</span>
        <button onClick={handleAdd} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+ Add</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
        {project.scenes.map((scene, idx) => {
          const sel = scene.id === selectedId;
          return (
            <div key={scene.id} onClick={() => onSelect(scene.id)}
              style={{ padding: "8px 12px", marginBottom: 4, borderRadius: 6, cursor: "pointer",
                background: sel ? T.accent+"22" : "transparent", border: `1px solid ${sel ? T.accent : "transparent"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>{idx+1}. {scene.kind}</span>
                <span style={{ color: T.muted, fontSize: 11 }}>{fmtTime(scene.duration)}</span>
              </div>
              {sel && <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
                <OpBtn onClick={() => onChange(moveUp(project, scene.id))} disabled={idx===0} title="Move up">↑</OpBtn>
                <OpBtn onClick={() => onChange(moveDown(project, scene.id))} disabled={idx===project.scenes.length-1} title="Move down">↓</OpBtn>
                <OpBtn onClick={() => onChange(duplicateScene(project, scene.id))} title="Duplicate">⧉</OpBtn>
                <OpBtn onClick={() => onChange(deleteScene(project, scene.id))} disabled={project.scenes.length<=1} title="Delete" danger>✕</OpBtn>
              </div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Inspector ───────────────────────────────────────────────────────────────

const lbl = { display: "block", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 };
const inp = { width: "100%", padding: "6px 10px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 4, color: T.ink, fontSize: 13, fontFamily: T.font, boxSizing: "border-box" };

function Inspector({ project, scene, onChange }) {
  if (!scene) return <div style={{ flex: 1, background: T.bg2, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontFamily: T.font, fontSize: 14 }}>Select a scene to edit</div>;
  const cap = getCap(project.template);
  const kindSchema = cap?.sceneKinds.find(k => k.kind === scene.kind);
  const validKinds = getValidKinds(project.template);
  return (
    <div style={{ flex: 1, background: T.bg2, padding: 16, overflow: "auto", fontFamily: T.font, fontSize: 13, color: T.ink }}>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Scene Kind</label>
        <select value={scene.kind} onChange={e => onChange(changeKind(project, scene.id, e.target.value))} style={inp}>
          {validKinds.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>Duration (seconds)</label>
        <input type="number" value={scene.duration} onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n) && n > 0) onChange(updateDuration(project, scene.id, n)); }} min={0.5} step={0.5} style={inp} />
      </div>
      {kindSchema?.fields.map(f => (
        <div key={f.key} style={{ marginBottom: 12 }}>
          <label style={lbl}>{f.label}{f.required && <span style={{ color: T.danger }}> *</span>}</label>
          {f.type === "textarea" ? (
            <textarea value={String(scene.content[f.key] || "")} onChange={e => onChange(updateContent(project, scene.id, { ...scene.content, [f.key]: e.target.value }))} style={{ ...inp, minHeight: 80, resize: "vertical" }} />
          ) : f.type === "select" ? (
            <select value={String(scene.content[f.key] || "")} onChange={e => onChange(updateContent(project, scene.id, { ...scene.content, [f.key]: e.target.value }))} style={inp}>
              <option value="">— Select —</option>
              {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input type={f.type === "number" ? "number" : "text"} value={String(scene.content[f.key] || "")} onChange={e => onChange(updateContent(project, scene.id, { ...scene.content, [f.key]: e.target.value }))} style={inp} />
          )}
        </div>
      ))}
      <div style={{ marginTop: 16, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
        <label style={lbl}>Audio (optional)</label>
        <input type="text" value={scene.audio?.path || ""} onChange={e => { const p = e.target.value.trim(); onChange(updateAudio(project, scene.id, p ? { path: p, present: true } : undefined)); }} placeholder="e.g. myProject/s1.mp3" style={inp} />
      </div>
    </div>
  );
}

// ─── Preview Themes ──────────────────────────────────────────────────────────

const PREVIEW_THEMES = {
  scrapbook: { bg: "#f5f0e8", ink: "#1a1a1a", muted: "#666", accent: "#c0392b", fd: '"Georgia","Times New Roman",serif', fm: '"Courier New",monospace' },
  cr7: { bg: "#0a0a0a", ink: "#f7f5ef", muted: "#999", accent: "#e23b3b", fd: '"Inter","Segoe UI",system-ui,sans-serif', fm: '"JetBrains Mono","Fira Code",monospace' },
  cosmos: { bg: "#050510", ink: "#f8fafc", muted: "#94a3b8", accent: "#3b82f6", fd: '"Inter","Segoe UI",system-ui,sans-serif', fm: '"JetBrains Mono","Fira Code",monospace' },
  nodeflow: { bg: "#0a0e1a", ink: "#f7f5ef", muted: "#9aa0b5", accent: "#e23b3b", fd: '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif', fm: '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif' },
};

// ─── Scene Preview Renderer ──────────────────────────────────────────────────

function renderPreview(scene, th) {
  const c = scene.content;
  const fade = { opacity: 1 };
  switch (scene.kind) {
    case "hero": case "title":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 24 }}>{c.tagline || ""}</div>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 72, lineHeight: 1.1, textAlign: "center", color: th.ink }}>{c.title || c.name || ""}</div>
        <div style={{ width: 80, height: 2, background: th.accent, margin: "24px 0", opacity: 0.5 }} />
        <div style={{ fontFamily: th.fd, fontSize: 24, color: th.muted, textAlign: "center", maxWidth: 600, lineHeight: 1.5 }}>{c.subtitle || ""}</div>
      </div>;
    case "match":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 24 }}>{c.competition || ""}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 36, color: th.ink, textAlign: "center" }}>{c.homeTeam || ""}</div>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 56, color: th.accent }}>{c.score || ""}</div>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 36, color: th.ink, textAlign: "center" }}>{c.awayTeam || ""}</div>
        </div>
        <div style={{ fontFamily: th.fm, fontSize: 16, color: th.accent, marginTop: 32, transform: "rotate(-1deg)" }}>{c.highlight || ""}</div>
      </div>;
    case "history":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        <div style={{ fontFamily: th.fm, fontSize: 100, fontWeight: 900, color: th.ink, opacity: 0.12, position: "absolute", top: -40, right: -40 }}>{c.year || ""}</div>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 52, color: th.ink, textAlign: "center", maxWidth: 700, lineHeight: 1.2 }}>{c.fact || ""}</div>
        <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5, marginTop: 24 }}>{c.detail || ""}</div>
        <div style={{ fontFamily: th.fm, fontSize: 16, color: th.accent, marginTop: 24, transform: "rotate(-2deg)" }}>{c.annotation || ""}</div>
      </div>;
    case "stat":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 16 }}>{c.label || ""}</div>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 160, color: th.ink, textAlign: "center" }}>{c.bigNumber || ""}</div>
        <div style={{ fontFamily: th.fd, fontSize: 24, color: th.muted, textAlign: "center", maxWidth: 600, lineHeight: 1.5, marginTop: 16 }}>{c.sub || ""}</div>
      </div>;
    case "fact":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 16 }}>{c.label || ""}</div>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 120, color: th.ink, textAlign: "center" }}>{c.bigValue || ""}</div>
        <div style={{ fontFamily: th.fd, fontSize: 20, color: th.muted, marginTop: 8 }}>{c.unit || ""}</div>
        <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5, marginTop: 24 }}>{c.description || ""}</div>
      </div>;
    case "compare":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 42, color: th.ink, textAlign: "center", marginBottom: 32 }}>{c.title || ""}</div>
        <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5 }}>{c.insight || ""}</div>
      </div>;
    case "milestone":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 32 }}>{c.title || ""}</div>
        <div style={{ fontFamily: th.fd, fontSize: 28, color: th.muted }}>Milestone items</div>
      </div>;
    case "closing": case "end":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 56, color: th.ink, textAlign: "center", maxWidth: 700, lineHeight: 1.2 }}>{c.title || ""}</div>
        <div style={{ width: 80, height: 2, background: th.accent, margin: "24px 0", opacity: 0.5 }} />
        <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5 }}>{c.subtitle || ""}</div>
        <div style={{ fontFamily: th.fm, fontSize: 14, color: th.muted, marginTop: 24 }}>{c.reference || ""}</div>
      </div>;
    case "photo":
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 42, color: th.ink, textAlign: "center", marginBottom: 32 }}>{c.caption || ""}</div>
        <div style={{ fontFamily: th.fm, fontSize: 16, color: th.accent, transform: "rotate(-1deg)" }}>{c.annotation || ""}</div>
      </div>;
    default:
      return <div style={{ ...fade, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 42, color: th.ink, textAlign: "center", marginBottom: 24 }}>{c.title || ""}</div>
        <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5 }}>{c.subtitle || ""}</div>
      </div>;
  }
}

// ─── Preview Panel ───────────────────────────────────────────────────────────

function PreviewPanel({ project, selectedId }) {
  const scene = project.scenes.find(s => s.id === selectedId);
  const canvas = project.format === "9:16" ? { w: 1080, h: 1920 } : { w: 1920, h: 1080 };
  const maxW = 400;
  const scale = maxW / canvas.w;
  const cw = Math.round(canvas.w * scale);
  const ch = Math.round(canvas.h * scale);
  if (!scene) return <div style={{ width: cw + 32, background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: T.font, color: T.muted, fontSize: 13 }}>
    <div style={{ border: `1px dashed ${T.border}`, borderRadius: 8, width: cw, height: ch, display: "flex", alignItems: "center", justifyContent: "center" }}>No scene selected</div>
  </div>;
  const th = PREVIEW_THEMES[project.template] || PREVIEW_THEMES.nodeflow;
  const idx = project.scenes.findIndex(s => s.id === selectedId);
  return <div style={{ width: cw + 32, background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: 16, fontFamily: T.font, color: T.ink, fontSize: 13 }}>
    <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: T.muted }}>{project.format}</span>
      <span style={{ fontSize: 11, color: T.muted }}>{scene.kind}</span>
      <span style={{ fontSize: 11, color: T.muted }}>{fmtTime(scene.duration)}</span>
    </div>
    <div style={{ width: cw, height: ch, overflow: "hidden", borderRadius: 4, border: `1px solid ${T.border}`, position: "relative" }}>
      <div style={{ width: canvas.w, height: canvas.h, transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0, background: th.bg }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 }}>
          {renderPreview(scene, th)}
        </div>
      </div>
    </div>
    <div style={{ marginTop: 8, fontSize: 11, color: T.muted }}>Scene {idx+1}/{project.scenes.length}</div>
  </div>;
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [project, setProject] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("project");
    if (pid) {
      const p = loadProject(pid);
      if (p) { setProject(p); setSelectedId(p.scenes[0]?.id || null); saveCurrentId(pid); }
      else { setError(`Project "${pid}" not found.`); }
    } else {
      const cid = loadCurrentId();
      if (cid) {
        const p = loadProject(cid);
        if (p) { setProject(p); setSelectedId(p.scenes[0]?.id || null); }
        else createDefault();
      } else createDefault();
    }
  }, []);

  function createDefault() {
    const p = createProject("New Project", "scrapbook", "16:9");
    p.scenes = [{ id: genSceneId(), kind: "hero", content: getDefaultContent("scrapbook", "hero"), duration: 5 }];
    saveProject(p); saveCurrentId(p.id); setProject(p); setSelectedId(p.scenes[0].id);
  }

  function handleChange(p) {
    setProject(p); setError(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { saveProject(p); saveCurrentId(p.id); }, 1000);
  }

  function handleOpenStudio() {
    if (!project) return;
    saveProject(project); saveCurrentId(project.id);
    window.open(`studio.html?project=${project.id}`, "_blank");
  }

  if (error && !project) return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: T.bg, color: T.ink, fontFamily: T.font, gap: 16 }}>
    <div style={{ fontSize: 18, fontWeight: 600 }}>Composer</div>
    <div style={{ color: T.danger, fontSize: 14 }}>{error}</div>
    <button onClick={() => { setError(null); createDefault(); }} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontSize: 14 }}>Create New Project</button>
  </div>;

  if (!project) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: T.bg, color: T.muted, fontFamily: T.font }}>Loading...</div>;

  const selScene = project.scenes.find(s => s.id === selectedId);

  return <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
    <div style={{ height: 48, background: T.bg2, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 16, flexShrink: 0 }}>
      <input type="text" value={project.name} onChange={e => handleChange({ ...project, name: e.target.value })}
        style={{ background: "transparent", border: "none", color: T.ink, fontSize: 16, fontWeight: 600, fontFamily: T.font, outline: "none", width: 300 }} />
      <span style={{ fontSize: 12, color: T.muted }}>{project.template}</span>
      <span style={{ fontSize: 12, color: T.muted }}>{project.format}</span>
      <div style={{ flex: 1 }} />
      <button onClick={handleOpenStudio} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 4, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: T.font }}>Open in Studio</button>
    </div>
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <SceneList project={project} selectedId={selectedId} onSelect={setSelectedId} onChange={handleChange} />
      <Inspector project={project} scene={selScene} onChange={handleChange} />
      <PreviewPanel project={project} selectedId={selectedId} />
    </div>
    {error && <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", background: T.danger, color: "#fff", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontFamily: T.font, zIndex: 1000 }}>{error}</div>}
  </div>;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
