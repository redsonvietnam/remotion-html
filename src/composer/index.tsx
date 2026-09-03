// ---------------------------------------------------------------------------
// Composer — 3-panel project editor with static preview
//
// Left: Scene list + operations
// Middle: Scene inspector (template-specific fields)
// Right: Static preview
//
// No Remotion hooks. No production data mutation. No TTS.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { sceneFrames } from "../data/contract";
import type { ComposerProject, ComposerScene, ComposerAudio } from "./types";
import {
  addScene,
  duplicateScene,
  deleteScene,
  moveSceneUp,
  moveSceneDown,
  updateSceneContent,
  updateSceneDuration,
  changeSceneKind,
  updateSceneAudio,
} from "./scenes";
import { generateSceneId } from "./store";
import { getDefaultContent, getValidKinds, getTemplateCapability } from "./templates";
import { validateProject } from "./validation";

// ─── Theme ───────────────────────────────────────────────────────────────────

const THEME = {
  bg: "#0f1117",
  bg2: "#161922",
  card: "#1e2028",
  border: "#2a2d38",
  ink: "#f0f0f0",
  muted: "#888",
  accent: "#4f8ff7",
  accentHover: "#3a7ae0",
  danger: "#e74c3c",
  success: "#27ae60",
  font: "'Inter','Segoe UI',system-ui,sans-serif",
  mono: "'JetBrains Mono','Fira Code',monospace",
};

// ─── Helper: format time ─────────────────────────────────────────────────────

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Scene List Panel ────────────────────────────────────────────────────────

type SceneListProps = {
  project: ComposerProject;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onProjectChange: (p: ComposerProject) => void;
};

const SceneList: React.FC<SceneListProps> = ({
  project,
  selectedId,
  onSelect,
  onProjectChange,
}) => {
  const cap = getTemplateCapability(project.template);

  const handleAdd = () => {
    const kind = cap?.defaultSceneKind ?? "title";
    const scene: ComposerScene = {
      id: generateSceneId(),
      kind,
      content: getDefaultContent(project.template, kind),
      duration: 5,
    };
    onProjectChange(addScene(project, scene));
  };

  const handleDuplicate = (id: string) => {
    onProjectChange(duplicateScene(project, id));
  };

  const handleDelete = (id: string) => {
    onProjectChange(deleteScene(project, id));
  };

  const handleMoveUp = (id: string) => {
    onProjectChange(moveSceneUp(project, id));
  };

  const handleMoveDown = (id: string) => {
    onProjectChange(moveSceneDown(project, id));
  };

  return (
    <div
      style={{
        width: 280,
        background: THEME.bg,
        borderRight: `1px solid ${THEME.border}`,
        display: "flex",
        flexDirection: "column",
        fontFamily: THEME.font,
        fontSize: 13,
        color: THEME.ink,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>Scenes ({project.scenes.length})</span>
        <button
          onClick={handleAdd}
          style={{
            background: THEME.accent,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          + Add
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
        {project.scenes.map((scene, idx) => {
          const isSelected = scene.id === selectedId;
          return (
            <div
              key={scene.id}
              onClick={() => onSelect(scene.id)}
              style={{
                padding: "8px 12px",
                marginBottom: 4,
                borderRadius: 6,
                cursor: "pointer",
                background: isSelected ? THEME.accent + "22" : "transparent",
                border: `1px solid ${isSelected ? THEME.accent : "transparent"}`,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500 }}>{idx + 1}. {scene.kind}</span>
                <span style={{ color: THEME.muted, fontSize: 11 }}>{fmtTime(scene.duration)}</span>
              </div>

              {isSelected && (
                <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <OpBtn onClick={() => handleMoveUp(scene.id)} disabled={idx === 0} title="Move up">↑</OpBtn>
                  <OpBtn onClick={() => handleMoveDown(scene.id)} disabled={idx === project.scenes.length - 1} title="Move down">↓</OpBtn>
                  <OpBtn onClick={() => handleDuplicate(scene.id)} title="Duplicate">⧉</OpBtn>
                  <OpBtn
                    onClick={() => handleDelete(scene.id)}
                    disabled={project.scenes.length <= 1}
                    title="Delete"
                    danger
                  >
                    ✕
                  </OpBtn>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OpBtn: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, title, danger, children }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    disabled={disabled}
    title={title}
    style={{
      background: danger ? THEME.danger + "22" : THEME.card,
      color: danger ? THEME.danger : THEME.ink,
      border: `1px solid ${THEME.border}`,
      borderRadius: 4,
      padding: "2px 8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 12,
      opacity: disabled ? 0.4 : 1,
    }}
  >
    {children}
  </button>
);

// ─── Inspector Panel ─────────────────────────────────────────────────────────

type InspectorProps = {
  project: ComposerProject;
  scene: ComposerScene | null;
  onProjectChange: (p: ComposerProject) => void;
};

const Inspector: React.FC<InspectorProps> = ({ project, scene, onProjectChange }) => {
  if (!scene) {
    return (
      <div
        style={{
          flex: 1,
          background: THEME.bg2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME.muted,
          fontFamily: THEME.font,
          fontSize: 14,
        }}
      >
        Select a scene to edit
      </div>
    );
  }

  const cap = getTemplateCapability(project.template);
  const kindSchema = cap?.sceneKinds.find((k) => k.kind === scene.kind);
  const validKinds = getValidKinds(project.template);

  const handleFieldChange = (key: string, value: string) => {
    const newContent = { ...scene.content, [key]: value };
    onProjectChange(updateSceneContent(project, scene.id, newContent));
  };

  const handleDurationChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      onProjectChange(updateSceneDuration(project, scene.id, num));
    }
  };

  const handleKindChange = (kind: string) => {
    onProjectChange(changeSceneKind(project, scene.id, kind));
  };

  return (
    <div
      style={{
        flex: 1,
        background: THEME.bg2,
        padding: 16,
        overflow: "auto",
        fontFamily: THEME.font,
        fontSize: 13,
        color: THEME.ink,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Scene Kind</label>
        <select
          value={scene.kind}
          onChange={(e) => handleKindChange(e.target.value)}
          style={selectStyle}
        >
          {validKinds.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Duration (seconds)</label>
        <input
          type="number"
          value={scene.duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          min={0.5}
          step={0.5}
          style={inputStyle}
        />
      </div>

      {kindSchema?.fields.map((field) => (
        <div key={field.key} style={{ marginBottom: 12 }}>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: THEME.danger }}> *</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              value={String(scene.content[field.key] ?? "")}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            />
          ) : field.type === "select" ? (
            <select
              value={String(scene.content[field.key] ?? "")}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              style={selectStyle}
            >
              <option value="">— Select —</option>
              {field.options?.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === "number" ? "number" : "text"}
              value={String(scene.content[field.key] ?? "")}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              style={inputStyle}
            />
          )}
        </div>
      ))}

      <div style={{ marginTop: 16, borderTop: `1px solid ${THEME.border}`, paddingTop: 12 }}>
        <label style={labelStyle}>Audio (optional)</label>
        <input
          type="text"
          value={scene.audio?.path ?? ""}
          onChange={(e) => {
            const path = e.target.value.trim();
            onProjectChange(
              updateSceneAudio(project, scene.id, path ? { path, present: true } : undefined)
            );
          }}
          placeholder="e.g. myProject/s1.mp3"
          style={inputStyle}
        />
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: THEME.muted,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  background: THEME.card,
  border: `1px solid ${THEME.border}`,
  borderRadius: 4,
  color: THEME.ink,
  fontSize: 13,
  fontFamily: THEME.font,
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

// ─── Preview Panel ───────────────────────────────────────────────────────────

type PreviewProps = {
  project: ComposerProject;
  selectedId: string | null;
};

const Preview: React.FC<PreviewProps> = ({ project, selectedId }) => {
  const selectedScene = project.scenes.find((s) => s.id === selectedId);
  const canvas = project.format === "9:16" ? { w: 1080, h: 1920 } : { w: 1920, h: 1080 };
  const maxW = 400;
  const scale = maxW / canvas.w;
  const cw = Math.round(canvas.w * scale);
  const ch = Math.round(canvas.h * scale);

  if (!selectedScene) {
    return (
      <div
        style={{
          width: cw + 32,
          background: THEME.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          fontFamily: THEME.font,
          color: THEME.muted,
          fontSize: 13,
        }}
      >
        <div style={{ border: `1px dashed ${THEME.border}`, borderRadius: 8, width: cw, height: ch, display: "flex", alignItems: "center", justifyContent: "center" }}>
          No scene selected
        </div>
      </div>
    );
  }

  const totalFrames = project.scenes.reduce((acc, s) => acc + sceneFrames(s.duration), 0);
  const sceneIdx = project.scenes.findIndex((s) => s.id === selectedId);
  const elapsedBefore = project.scenes
    .slice(0, sceneIdx)
    .reduce((acc, s) => acc + sceneFrames(s.duration), 0);
  const sceneDuration = sceneFrames(selectedScene.duration);
  const midFrame = elapsedBefore + Math.floor(sceneDuration / 2);

  return (
    <div
      style={{
        width: cw + 32,
        background: THEME.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
        fontFamily: THEME.font,
        color: THEME.ink,
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: THEME.muted }}>{project.format}</span>
        <span style={{ fontSize: 11, color: THEME.muted }}>{selectedScene.kind}</span>
        <span style={{ fontSize: 11, color: THEME.muted }}>{fmtTime(selectedScene.duration)}</span>
      </div>

      <div
        style={{
          width: cw,
          height: ch,
          overflow: "hidden",
          borderRadius: 4,
          border: `1px solid ${THEME.border}`,
        }}
      >
        <StaticPreview
          project={project}
          scene={selectedScene}
          frame={midFrame}
          fps={30}
          W={canvas.w}
          H={canvas.h}
        />
      </div>

      <div style={{ marginTop: 8, fontSize: 11, color: THEME.muted }}>
        Scene {sceneIdx + 1}/{project.scenes.length} · Frame {midFrame}/{totalFrames}
      </div>
    </div>
  );
};

// ─── Static Preview Renderer ─────────────────────────────────────────────────

type StaticPreviewProps = {
  project: ComposerProject;
  scene: ComposerScene;
  frame: number;
  fps: number;
  W: number;
  H: number;
};

const StaticPreview: React.FC<StaticPreviewProps> = ({
  project,
  scene,
  frame,
  fps,
  W,
  H,
}) => {
  const th = getPreviewTheme(project.template);
  const progress = Math.min(1, frame / Math.max(1, sceneFrames(scene.duration) - 1));

  const fadeIn = Math.min(1, progress * 4);
  const slideY = (1 - fadeIn) * 30;

  return (
    <div
      style={{
        width: W,
        height: H,
        background: th.bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: th.fd,
        transform: `scale(${400 / W})`,
        transformOrigin: "top left",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          opacity: fadeIn,
          transform: `translateY(${slideY}px)`,
        }}
      >
        {renderScenePreview(scene, th)}
      </div>
    </div>
  );
};

function renderScenePreview(scene: ComposerScene, th: ReturnType<typeof getPreviewTheme>): React.ReactNode {
  const c = scene.content;
  switch (scene.kind) {
    case "hero":
    case "title":
      return (
        <>
          <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 24 }}>
            {String(c.tagline || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 72, lineHeight: 1.1, textAlign: "center", color: th.ink }}>
            {String(c.title || c.name || "")}
          </div>
          <div style={{ width: 80, height: 2, background: th.accent, margin: "24px 0", opacity: 0.5 }} />
          <div style={{ fontFamily: th.fd, fontSize: 24, color: th.muted, textAlign: "center", maxWidth: 600, lineHeight: 1.5 }}>
            {String(c.subtitle || "")}
          </div>
        </>
      );
    case "match":
      return (
        <>
          <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 24 }}>
            {String(c.competition || "")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 36, color: th.ink, textAlign: "center" }}>
              {String(c.homeTeam || "")}
            </div>
            <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 56, color: th.accent }}>
              {String(c.score || "")}
            </div>
            <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 36, color: th.ink, textAlign: "center" }}>
              {String(c.awayTeam || "")}
            </div>
          </div>
          <div style={{ fontFamily: th.fm, fontSize: 16, color: th.accent, marginTop: 32, transform: "rotate(-1deg)" }}>
            {String(c.highlight || "")}
          </div>
        </>
      );
    case "history":
      return (
        <>
          <div style={{ fontFamily: th.fm, fontSize: 100, fontWeight: 900, color: th.ink, opacity: 0.12, position: "absolute", top: 60, right: 80 }}>
            {String(c.year || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 52, color: th.ink, textAlign: "center", maxWidth: 700, lineHeight: 1.2 }}>
            {String(c.fact || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5, marginTop: 24 }}>
            {String(c.detail || "")}
          </div>
          <div style={{ fontFamily: th.fm, fontSize: 16, color: th.accent, marginTop: 24, transform: "rotate(-2deg)" }}>
            {String(c.annotation || "")}
          </div>
        </>
      );
    case "stat":
      return (
        <>
          <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 16 }}>
            {String(c.label || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 160, color: th.ink, textAlign: "center" }}>
            {String(c.bigNumber || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontSize: 24, color: th.muted, textAlign: "center", maxWidth: 600, lineHeight: 1.5, marginTop: 16 }}>
            {String(c.sub || "")}
          </div>
        </>
      );
    case "milestone":
      return (
        <>
          <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 32 }}>
            {String(c.title || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontSize: 28, color: th.muted, textAlign: "center" }}>
            Milestone items
          </div>
        </>
      );
    case "fact":
      return (
        <>
          <div style={{ fontFamily: th.fm, fontSize: 14, letterSpacing: 6, textTransform: "uppercase", color: th.accent, marginBottom: 16 }}>
            {String(c.label || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 120, color: th.ink, textAlign: "center" }}>
            {String(c.bigValue || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontSize: 20, color: th.muted, marginTop: 8 }}>
            {String(c.unit || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5, marginTop: 24 }}>
            {String(c.description || "")}
          </div>
        </>
      );
    case "compare":
      return (
        <>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 42, color: th.ink, textAlign: "center", marginBottom: 32 }}>
            {String(c.title || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5 }}>
            {String(c.insight || "")}
          </div>
        </>
      );
    case "closing":
    case "end":
      return (
        <>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 56, color: th.ink, textAlign: "center", maxWidth: 700, lineHeight: 1.2 }}>
            {String(c.title || "")}
          </div>
          <div style={{ width: 80, height: 2, background: th.accent, margin: "24px 0", opacity: 0.5 }} />
          <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5 }}>
            {String(c.subtitle || "")}
          </div>
          <div style={{ fontFamily: th.fm, fontSize: 14, color: th.muted, marginTop: 24 }}>
            {String(c.reference || "")}
          </div>
        </>
      );
    case "photo":
      return (
        <>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 42, color: th.ink, textAlign: "center", marginBottom: 32 }}>
            {String(c.caption || "")}
          </div>
          <div style={{ fontFamily: th.fm, fontSize: 16, color: th.accent, transform: "rotate(-1deg)" }}>
            {String(c.annotation || "")}
          </div>
        </>
      );
    case "timeline":
    case "flow":
    case "contribution":
    case "benefit":
    default:
      return (
        <>
          <div style={{ fontFamily: th.fd, fontWeight: 900, fontSize: 42, color: th.ink, textAlign: "center", marginBottom: 24 }}>
            {String(c.title || "")}
          </div>
          <div style={{ fontFamily: th.fd, fontSize: 22, color: th.muted, textAlign: "center", maxWidth: 500, lineHeight: 1.5 }}>
            {String(c.subtitle || "")}
          </div>
        </>
      );
  }
}

function getPreviewTheme(template: string) {
  const themes: Record<string, { bg: string; ink: string; muted: string; accent: string; fd: string; fm: string }> = {
    scrapbook: { bg: "#f5f0e8", ink: "#1a1a1a", muted: "#666", accent: "#c0392b", fd: '"Georgia","Times New Roman",serif', fm: '"Courier New",monospace' },
    cr7: { bg: "#0a0a0a", ink: "#f7f5ef", muted: "#999", accent: "#e23b3b", fd: '"Inter","Segoe UI",system-ui,sans-serif', fm: '"JetBrains Mono","Fira Code",monospace' },
    cosmos: { bg: "#050510", ink: "#f8fafc", muted: "#94a3b8", accent: "#3b82f6", fd: '"Inter","Segoe UI",system-ui,sans-serif', fm: '"JetBrains Mono","Fira Code",monospace' },
    nodeflow: { bg: "#0a0e1a", ink: "#f7f5ef", muted: "#9aa0b5", accent: "#e23b3b", fd: '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif', fm: '"Be Vietnam Pro","Segoe UI",system-ui,sans-serif' },
  };
  return themes[template] ?? themes.nodeflow;
}

// ─── Main Composer ───────────────────────────────────────────────────────────

export type ComposerProps = {
  project: ComposerProject;
  onProjectChange: (p: ComposerProject) => void;
  onOpenStudio?: () => void;
};

export const Composer: React.FC<ComposerProps> = ({
  project,
  onProjectChange,
  onOpenStudio,
}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    project.scenes[0]?.id ?? null
  );

  const selectedScene = project.scenes.find((s) => s.id === selectedId) ?? null;

  return (
    <AbsoluteFill style={{ background: THEME.bg, fontFamily: THEME.font }}>
      {/* Header */}
      <div
        style={{
          height: 48,
          background: THEME.bg2,
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 16,
        }}
      >
        <input
          type="text"
          value={project.name}
          onChange={(e) => onProjectChange({ ...project, name: e.target.value, updatedAt: Date.now() })}
          style={{
            background: "transparent",
            border: "none",
            color: THEME.ink,
            fontSize: 16,
            fontWeight: 600,
            fontFamily: THEME.font,
            outline: "none",
            width: 300,
          }}
        />
        <span style={{ fontSize: 12, color: THEME.muted }}>{project.template}</span>
        <span style={{ fontSize: 12, color: THEME.muted }}>{project.format}</span>
        <div style={{ flex: 1 }} />
        {onOpenStudio && (
          <button
            onClick={onOpenStudio}
            style={{
              background: THEME.accent,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: THEME.font,
            }}
          >
            Open in Studio
          </button>
        )}
      </div>

      {/* 3-panel layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SceneList
          project={project}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onProjectChange={onProjectChange}
        />
        <Inspector
          project={project}
          scene={selectedScene}
          onProjectChange={onProjectChange}
        />
        <Preview project={project} selectedId={selectedId} />
      </div>
    </AbsoluteFill>
  );
};

export default Composer;
