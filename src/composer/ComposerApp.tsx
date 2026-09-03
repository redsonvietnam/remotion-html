// ---------------------------------------------------------------------------
// ComposerApp — persistence layer + project lifecycle
//
// Wraps Composer with localStorage persistence, autosave, and URL routing.
// No Remotion hooks. No production data mutation.
// ---------------------------------------------------------------------------

import React from "react";
import { Composer } from "./index";
import type { ComposerProject } from "./types";
import {
  loadProjects,
  saveProject,
  loadProject,
  loadCurrentProjectId,
  saveCurrentProjectId,
  createProject,
  generateId,
} from "./store";
import { validateProject } from "./validation";
import { getDefaultContent } from "./templates";
import { generateSceneId } from "./store";

const AUTOSAVE_DELAY = 1000;

export const ComposerApp: React.FC = () => {
  const [project, setProject] = React.useState<ComposerProject | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const autosaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load project from URL or localStorage on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");

    if (projectId) {
      const loaded = loadProject(projectId);
      if (loaded) {
        setProject(loaded);
        saveCurrentProjectId(projectId);
      } else {
        setError(`Project "${projectId}" not found.`);
      }
    } else {
      const currentId = loadCurrentProjectId();
      if (currentId) {
        const loaded = loadProject(currentId);
        if (loaded) {
          setProject(loaded);
        } else {
          // Current project missing — create new
          createDefaultProject();
        }
      } else {
        createDefaultProject();
      }
    }
  }, []);

  const createDefaultProject = () => {
    const p = createProject("New Project", "scrapbook", "16:9");
    const scene = {
      id: generateSceneId(),
      kind: "hero",
      content: getDefaultContent("scrapbook", "hero"),
      duration: 5,
    };
    p.scenes = [scene];
    saveProject(p);
    saveCurrentProjectId(p.id);
    setProject(p);
  };

  // Autosave on project change
  const handleProjectChange = React.useCallback((p: ComposerProject) => {
    setProject(p);
    setError(null);

    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }
    autosaveTimer.current = setTimeout(() => {
      const errors = validateProject(p);
      if (errors.length === 0) {
        saveProject(p);
        saveCurrentProjectId(p.id);
      }
    }, AUTOSAVE_DELAY);
  }, []);

  // Manual save
  const handleSave = React.useCallback(() => {
    if (!project) return;
    const errors = validateProject(project);
    if (errors.length > 0) {
      setError(errors.map((e) => e.message).join(", "));
      return;
    }
    saveProject(project);
    saveCurrentProjectId(project.id);
    setError(null);
  }, [project]);

  // Open in Studio
  const handleOpenStudio = React.useCallback(() => {
    if (!project) return;
    // Save before navigating
    saveProject(project);
    saveCurrentProjectId(project.id);
    window.open(`studio.html?project=${project.id}`, "_blank");
  }, [project]);

  if (error && !project) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0f1117",
          color: "#f0f0f0",
          fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600 }}>Composer</div>
        <div style={{ color: "#e74c3c", fontSize: 14 }}>{error}</div>
        <button
          onClick={() => {
            setError(null);
            createDefaultProject();
          }}
          style={{
            background: "#4f8ff7",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Create New Project
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0f1117",
          color: "#888",
          fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Composer
        project={project}
        onProjectChange={handleProjectChange}
        onOpenStudio={handleOpenStudio}
      />
      {error && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#e74c3c",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 13,
            fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ComposerApp;
