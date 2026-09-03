// ---------------------------------------------------------------------------
// Terminal Code Tip — Content Types
//
// 9:16 vertical video: Matrix rain background, dark terminal window,
// syntax-highlighted code, character-by-character typing animation,
// caption, progress dots.
// ---------------------------------------------------------------------------

/** A single line of code with optional syntax token spans. */
export interface CodeLine {
  /** Raw text for the line. */
  text: string;
  /** Optional token spans for syntax highlighting. */
  tokens?: CodeToken[];
}

/** A syntax-highlighted token within a line. */
export interface CodeToken {
  /** Start index (0-based, inclusive) in line.text. */
  start: number;
  /** Length of the token in characters. */
  length: number;
  /** Syntax kind: keyword, string, function, number, comment, variable, type. */
  kind: "keyword" | "string" | "function" | "number" | "comment" | "variable" | "type";
}

// ─── Scene Kinds ───────────────────────────────────────────────────────────

/** Intro scene: shows a kicker/caption text above the terminal. */
export interface TerminalIntroContent {
  kind: "intro";
  kicker: string;
  title: string;
}

/** Typing scene: code appears character-by-character in the terminal. */
export interface TerminalTypingContent {
  kind: "typing";
  /** Language label shown in the terminal title bar. */
  language: string;
  /** Lines of code to type out. */
  lines: CodeLine[];
  /** Caption shown below the terminal. */
  caption: string;
}

/** Reveal scene: full code is visible, a highlight line blinks. */
export interface TerminalRevealContent {
  kind: "reveal";
  language: string;
  lines: CodeLine[];
  /** Index of the highlighted line (0-based). */
  highlightLine: number;
  caption: string;
}

/** Outro scene: branding / call to action. */
export interface TerminalOutroContent {
  kind: "outro";
  kicker: string;
  title: string;
  subtitle: string;
}

export type TerminalSceneContent =
  | TerminalIntroContent
  | TerminalTypingContent
  | TerminalRevealContent
  | TerminalOutroContent;
