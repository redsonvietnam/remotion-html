// ---------------------------------------------------------------------------
// Terminal Code Tip — Demo Production Data
//
// Sample production: "5 JavaScript Tips You Should Know"
// 9:16 vertical format, Matrix rain background.
// ---------------------------------------------------------------------------

import type { SceneDef, TerminalSceneContent } from "./contract";
import { sceneFrames } from "./contract";

export { sceneFrames as terminalSceneFrames };

export const TERMINAL_SCENES: SceneDef[] = [
  { id: "s1", audio: "", caption: "JavaScript tips for everyday coding", dur: 3.5 },
  { id: "s2", audio: "", caption: "Use optional chaining to avoid errors", dur: 5.0 },
  { id: "s3", audio: "", caption: "The nullish coalescing operator", dur: 5.0 },
  { id: "s4", audio: "", caption: "Array.at() for negative indexing", dur: 5.0 },
  { id: "s5", audio: "", caption: "Structured clone for deep copies", dur: 5.0 },
  { id: "s6", audio: "", caption: "Follow for more coding tips", dur: 3.5 },
];

export const TERMINAL_CONTENT: Record<string, TerminalSceneContent> = {
  s1: {
    kind: "intro",
    kicker: "DEV TIPS",
    title: "5 JavaScript Tips",
  },
  s2: {
    kind: "typing",
    language: "javascript",
    lines: [
      { text: "const user = data?.profile?.name;", tokens: [
        { start: 6, length: 4, kind: "keyword" },
        { start: 12, length: 4, kind: "variable" },
        { start: 18, length: 7, kind: "variable" },
        { start: 26, length: 4, kind: "variable" },
      ]},
      { text: "" },
      { text: "// No more TypeError crashes", tokens: [
        { start: 0, length: 2, kind: "comment" },
        { start: 3, length: 25, kind: "comment" },
      ]},
      { text: "if (user !== undefined) {" },
      { text: '  console.log(user.toUpperCase());' },
      { text: "}" },
    ],
    caption: "Optional chaining (?.) prevents crashes",
  },
  s3: {
    kind: "typing",
    language: "javascript",
    lines: [
      { text: 'const port = config.port ?? 3000;', tokens: [
        { start: 6, length: 4, kind: "keyword" },
        { start: 12, length: 4, kind: "variable" },
        { start: 20, length: 6, kind: "variable" },
        { start: 29, length: 4, kind: "number" },
      ]},
      { text: "" },
      { text: "// Only falls back on null/undefined", tokens: [
        { start: 0, length: 2, kind: "comment" },
        { start: 3, length: 33, kind: "comment" },
      ]},
      { text: 'const name = input ?? "Guest";' },
    ],
    caption: "?? only triggers on null/undefined, not 0 or ''",
  },
  s4: {
    kind: "typing",
    language: "javascript",
    lines: [
      { text: "const arr = [10, 20, 30, 40];", tokens: [
        { start: 6, length: 4, kind: "keyword" },
        { start: 12, length: 3, kind: "variable" },
        { start: 18, length: 2, kind: "number" },
        { start: 22, length: 2, kind: "number" },
        { start: 26, length: 2, kind: "number" },
        { start: 30, length: 2, kind: "number" },
      ]},
      { text: "" },
      { text: "arr.at(-1)  // 40", tokens: [
        { start: 0, length: 3, kind: "variable" },
        { start: 4, length: 2, kind: "function" },
        { start: 10, length: 2, kind: "number" },
      ]},
      { text: "arr.at(-2)  // 30" },
    ],
    caption: ".at() supports negative indexing natively",
  },
  s5: {
    kind: "typing",
    language: "javascript",
    lines: [
      { text: "const original = { a: 1, b: { c: 2 } };", tokens: [
        { start: 6, length: 4, kind: "keyword" },
        { start: 12, length: 8, kind: "variable" },
        { start: 24, length: 1, kind: "variable" },
        { start: 27, length: 1, kind: "number" },
        { start: 30, length: 1, kind: "variable" },
        { start: 34, length: 1, kind: "number" },
      ]},
      { text: "" },
      { text: "const copy = structuredClone(original);", tokens: [
        { start: 6, length: 4, kind: "keyword" },
        { start: 12, length: 4, kind: "variable" },
        { start: 19, length: 15, kind: "function" },
      ]},
      { text: "" },
      { text: "// Deep copy, no JSON tricks needed", tokens: [
        { start: 0, length: 2, kind: "comment" },
      ]},
    ],
    caption: "structuredClone() for true deep copies",
  },
  s6: {
    kind: "outro",
    kicker: "FOLLOW FOR MORE",
    title: "Happy Coding!",
    subtitle: "Like & share with your dev friends",
  },
};
