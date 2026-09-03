export const EXPECTED_PRODUCTIONS: string[];

export interface RoutingEntry {
  topic: string;
  expect: string;
}

export const ROUTING_CONTRACT: RoutingEntry[];

export function loadManifest(): { productions: Record<string, unknown> };

export function checkManifestCompleteness(manifest: {
  productions?: Record<string, unknown>;
}): { ids: string[]; missing: string[] };

export function parseRoutedComposition(text: string): string | null;

export function verifyAll(): { failures: string[]; ids: string[] };
