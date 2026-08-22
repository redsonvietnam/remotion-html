// ---------------------------------------------------------------------------
// NodeFlow Content Types — Template-level content contract
//
// These types define the NodeFlow template's scene content structure.
// They are shared between the template and any production using it.
// ---------------------------------------------------------------------------

export interface NodeFlowTitleContent {
  kind: "title";
  lawCode: string;
  title: string;
  subtitle: string;
  tagline: string;
  nodes: { label: string; role?: string }[];
}

export interface NodeFlowFlowContent {
  kind: "flow";
  title: string;
  description: string[];
  flowNodes: { label: string; sublabel?: string; rate?: string }[];
  edges: { from: number; to: number; label: string }[];
}

export interface NodeFlowContributionContent {
  kind: "contribution";
  title: string;
  rows: { party: string; type: string; pct: number; rateLabel: string }[];
  totalLabel: string;
  totalValue: string;
  note?: string;
}

export interface NodeFlowBenefitContent {
  kind: "benefit";
  title: string;
  description: string;
  benefits: { icon: string; label: string; value?: string }[];
}

export interface NodeFlowCompareContent {
  kind: "compare";
  title: string;
  before: { items: { label: string; value?: string }[] };
  after: { items: { label: string; value?: string; highlight?: boolean }[] };
  changeLabel?: string;
}

export interface NodeFlowEndContent {
  kind: "end";
  closingTitle: string;
  closingSubtitle: string;
  stats: { label: string; value: string }[];
  reference: string;
}

export type NodeFlowSceneContent =
  | NodeFlowTitleContent
  | NodeFlowFlowContent
  | NodeFlowContributionContent
  | NodeFlowBenefitContent
  | NodeFlowCompareContent
  | NodeFlowEndContent;

// Re-export SceneDef from contract for convenience
export type { SceneDef } from "../../data/contract";