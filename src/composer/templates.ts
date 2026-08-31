// ---------------------------------------------------------------------------
// Template Capability Registry
//
// Defines valid scene kinds and their field schemas for each template.
// Used by inspectors and validation.
// ---------------------------------------------------------------------------

export interface SceneFieldSchema {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface SceneKindSchema {
  kind: string;
  label: string;
  fields: SceneFieldSchema[];
}

export interface TemplateCapability {
  template: string;
  label: string;
  formats: ("16:9" | "9:16")[];
  sceneKinds: SceneKindSchema[];
  defaultSceneKind: string;
}

export const TEMPLATE_CAPABILITIES: Record<string, TemplateCapability> = {
  scrapbook: {
    template: "scrapbook",
    label: "Scrapbook Editorial",
    formats: ["16:9"],
    defaultSceneKind: "hero",
    sceneKinds: [
      {
        kind: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "tagline", label: "Tagline", type: "text" },
        ],
      },
      {
        kind: "match",
        label: "Match",
        fields: [
          { key: "homeTeam", label: "Home Team", type: "text", required: true },
          { key: "awayTeam", label: "Away Team", type: "text" },
          { key: "score", label: "Score", type: "text" },
          { key: "competition", label: "Competition", type: "text" },
          { key: "highlight", label: "Highlight", type: "textarea" },
        ],
      },
      {
        kind: "history",
        label: "History",
        fields: [
          { key: "year", label: "Year", type: "text" },
          { key: "fact", label: "Fact", type: "text", required: true },
          { key: "detail", label: "Detail", type: "textarea" },
          { key: "annotation", label: "Annotation", type: "text" },
        ],
      },
      {
        kind: "photo",
        label: "Photo",
        fields: [
          { key: "caption", label: "Caption", type: "text", required: true },
          { key: "annotation", label: "Annotation", type: "text" },
        ],
      },
      {
        kind: "timeline",
        label: "Timeline",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
        ],
      },
      {
        kind: "closing",
        label: "Closing",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "reference", label: "Reference", type: "text" },
        ],
      },
    ],
  },
  cr7: {
    template: "cr7",
    label: "CR7 Typography",
    formats: ["16:9", "9:16"],
    defaultSceneKind: "hero",
    sceneKinds: [
      {
        kind: "hero",
        label: "Hero",
        fields: [
          { key: "name", label: "Name", type: "text", required: true },
          { key: "tagline", label: "Tagline", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
        ],
      },
      {
        kind: "stat",
        label: "Stat",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "bigNumber", label: "Big Number", type: "text", required: true },
          { key: "sub", label: "Sub", type: "text" },
          { key: "detail", label: "Detail", type: "textarea" },
          {
            key: "color",
            label: "Color",
            type: "select",
            options: ["accent1", "accent2", "accent3"],
          },
        ],
      },
      {
        kind: "milestone",
        label: "Milestone",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
        ],
      },
      {
        kind: "closing",
        label: "Closing",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "reference", label: "Reference", type: "text" },
        ],
      },
    ],
  },
  cosmos: {
    template: "cosmos",
    label: "Cosmos Space",
    formats: ["16:9", "9:16"],
    defaultSceneKind: "title",
    sceneKinds: [
      {
        kind: "title",
        label: "Title",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "tagline", label: "Tagline", type: "text" },
        ],
      },
      {
        kind: "fact",
        label: "Fact",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "bigValue", label: "Big Value", type: "text", required: true },
          { key: "unit", label: "Unit", type: "text" },
          { key: "description", label: "Description", type: "text" },
          { key: "detail", label: "Detail", type: "textarea" },
        ],
      },
      {
        kind: "compare",
        label: "Compare",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "insight", label: "Insight", type: "textarea" },
        ],
      },
      {
        kind: "diagram",
        label: "Diagram",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
        ],
      },
      {
        kind: "timeline",
        label: "Timeline",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
        ],
      },
      {
        kind: "closing",
        label: "Closing",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "reference", label: "Reference", type: "text" },
        ],
      },
    ],
  },
  nodeflow: {
    template: "nodeflow",
    label: "NodeFlow",
    formats: ["16:9"],
    defaultSceneKind: "title",
    sceneKinds: [
      {
        kind: "title",
        label: "Title",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "tagline", label: "Tagline", type: "text" },
        ],
      },
      {
        kind: "flow",
        label: "Flow",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
        ],
      },
      {
        kind: "contribution",
        label: "Contribution",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
        ],
      },
      {
        kind: "benefit",
        label: "Benefit",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
        ],
      },
      {
        kind: "compare",
        label: "Compare",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
        ],
      },
      {
        kind: "end",
        label: "End",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "reference", label: "Reference", type: "text" },
        ],
      },
    ],
  },
  kineticStatement: {
    template: "kineticStatement",
    label: "Kinetic Statement",
    formats: ["9:16"],
    defaultSceneKind: "hook",
    sceneKinds: [
      {
        kind: "hook",
        label: "Hook",
        fields: [
          { key: "words", label: "Words (comma-separated)", type: "text", required: true },
        ],
      },
      {
        kind: "stat",
        label: "Stat",
        fields: [
          { key: "value", label: "Value", type: "number", required: true },
          { key: "suffix", label: "Suffix", type: "text" },
          { key: "label", label: "Label", type: "text", required: true },
        ],
      },
      {
        kind: "quote",
        label: "Quote",
        fields: [
          { key: "text", label: "Text", type: "textarea", required: true },
        ],
      },
      {
        kind: "outro",
        label: "Outro",
        fields: [
          { key: "brand", label: "Brand", type: "text", required: true },
          { key: "tagline", label: "Tagline", type: "text" },
          { key: "cta", label: "CTA", type: "text" },
        ],
      },
    ],
  },
  bentoGrid: {
    template: "bentoGrid",
    label: "Bento Grid",
    formats: ["9:16"],
    defaultSceneKind: "hook",
    sceneKinds: [
      {
        kind: "hook",
        label: "Hook",
        fields: [
          { key: "line1", label: "Line 1", type: "text", required: true },
          { key: "line2", label: "Line 2", type: "text", required: true },
        ],
      },
      {
        kind: "bento",
        label: "Bento",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "stat", label: "Stat", type: "text" },
          { key: "feature1", label: "Feature 1", type: "text" },
          { key: "feature2", label: "Feature 2", type: "text" },
          { key: "quote", label: "Quote", type: "textarea" },
        ],
      },
      {
        kind: "outro",
        label: "Outro",
        fields: [
          { key: "brand", label: "Brand", type: "text", required: true },
          { key: "tagline", label: "Tagline", type: "text" },
          { key: "cta", label: "CTA", type: "text" },
        ],
      },
    ],
  },
  featureDrop: {
    template: "featureDrop",
    label: "Feature Drop",
    formats: ["9:16"],
    defaultSceneKind: "hook",
    sceneKinds: [
      {
        kind: "hook",
        label: "Hook",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", required: true },
          { key: "title", label: "Title", type: "text", required: true },
        ],
      },
      {
        kind: "features",
        label: "Features",
        fields: [
          { key: "items", label: "Features", type: "textarea", required: true },
        ],
      },
      {
        kind: "outro",
        label: "Outro",
        fields: [
          { key: "brand", label: "Brand", type: "text", required: true },
          { key: "cta", label: "CTA", type: "text" },
        ],
      },
    ],
  },
};

/** Get capability for a template, or null if unknown. */
export function getTemplateCapability(template: string): TemplateCapability | null {
  return TEMPLATE_CAPABILITIES[template] ?? null;
}

/** Get valid kinds for a template. */
export function getValidKinds(template: string): string[] {
  const cap = getTemplateCapability(template);
  return cap ? cap.sceneKinds.map((k) => k.kind) : [];
}

/** Get default content for a scene kind. */
export function getDefaultContent(template: string, kind: string): Record<string, unknown> {
  const cap = getTemplateCapability(template);
  if (!cap) return { kind };
  const sk = cap.sceneKinds.find((k) => k.kind === kind);
  if (!sk) return { kind };
  const content: Record<string, unknown> = { kind };
  for (const f of sk.fields) {
    content[f.key] = "";
  }
  return content;
}
