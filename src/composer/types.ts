// ---------------------------------------------------------------------------
// Composer Types — Project, Scene, and Audio types
//
// ComposerProject = editable user/project state (separate from production)
// ComposerScene = individual scene with content and optional audio
// ---------------------------------------------------------------------------

export type ComposerFormat = "16:9" | "9:16";

export interface ComposerAudio {
  path?: string;
  present?: boolean;
}

export interface ComposerScene {
  id: string;
  kind: string;
  content: Record<string, unknown>;
  duration: number;
  audio?: ComposerAudio;
}

export interface ComposerProject {
  id: string;
  name: string;
  template: string;
  format: ComposerFormat;
  scenes: ComposerScene[];
  createdAt: number;
  updatedAt: number;
}

export type SceneOperation =
  | { type: "add"; scene: ComposerScene; index?: number }
  | { type: "duplicate"; sceneId: string }
  | { type: "delete"; sceneId: string }
  | { type: "moveUp"; sceneId: string }
  | { type: "moveDown"; sceneId: string }
  | { type: "select"; sceneId: string | null }
  | { type: "updateContent"; sceneId: string; content: Record<string, unknown> }
  | { type: "updateDuration"; sceneId: string; duration: number }
  | { type: "changeKind"; sceneId: string; kind: string }
  | { type: "updateAudio"; sceneId: string; audio?: ComposerAudio };
