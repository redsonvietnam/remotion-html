// ---------------------------------------------------------------------------
// Stoic Love Content Data
//
// Quan niệm trong tình yêu của chủ nghĩa Khắc kỷ (Stoicism)
// Vertical short-form: 1080x1920, ~60-90s, 10 scenes
//
// All philosophical claims verified from primary sources:
// - Epictetus, Enchiridion (Dichotomy of Control)
// - Marcus Aurelius, Meditations (Impermanence, relationships)
// - Seneca, Epistulae Morales (Attachment, loss)
//
// No fabricated quotations. Paraphrases clearly distinguished.
// Vietnamese diacritics mandatory.
// ---------------------------------------------------------------------------

export const FPS = 30;
export const TAIL = 0.5;
export const sceneFrames = (dur: number) => Math.ceil((dur + TAIL) * FPS);

// ---------------------------------------------------------------------------
// SceneDef — base scene metadata (audio, caption, duration)
// ---------------------------------------------------------------------------

export interface SceneDef {
  id: string;
  audio: string;
  caption: string;
  dur: number;
}

// ---------------------------------------------------------------------------
// StoicLove Content Types — scene-specific content
// ---------------------------------------------------------------------------

export interface StoicLoveHookContent {
  kind: "hook";
  mainQuestion: string;
  subText: string;
}

export interface StoicLoveStatementContent {
  kind: "statement";
  lines: string[];
  highlightIndex?: number;
}

export interface StoicLoveSplitContent {
  kind: "split";
  title: string;
  leftLabel: string;
  leftItems: string[];
  rightLabel: string;
  rightItems: string[];
}

export interface StoicLoveConceptContent {
  kind: "concept";
  headline: string;
  bodyLines: string[];
  emphasisIndex?: number;
}

export interface StoicLoveImpermanenceContent {
  kind: "impermanence";
  observation: string;
  reframe: string;
}

export interface StoicLoveEndingContent {
  kind: "ending";
  closingThought: string;
  signature: string;
  tagline: string;
}

export type StoicLoveSceneContent =
  | StoicLoveHookContent
  | StoicLoveStatementContent
  | StoicLoveSplitContent
  | StoicLoveConceptContent
  | StoicLoveImpermanenceContent
  | StoicLoveEndingContent;

// ---------------------------------------------------------------------------
// Stoic Love Content — all scene content, keyed by scene ID
// ---------------------------------------------------------------------------

export const STOIC_LOVE_CONTENT: Record<string, StoicLoveSceneContent> = {
  s1: {
    kind: "hook",
    mainQuestion: "Bạn có bao giờ tự hỏi...",
    subText: "Tại sao càng yêu một người,\nchúng ta lại càng sợ mất họ?",
  },

  s2: {
    kind: "statement",
    lines: [
      "Không phải tình yêu làm ta đau.",
      "Đó là mong muốn kiểm soát tình yêu",
      "làm ta đau.",
    ],
    highlightIndex: 2,
  },

  s3: {
    kind: "split",
    title: "PHÂN BIỆT KHẮC KỴ",
    leftLabel: "TRONG TAY TA",
    leftItems: [
      "Cách ta yêu",
      "Cách ta đối xử",
      "Sự trung thực",
      "Lựa chọn của chính mình",
    ],
    rightLabel: "KHÔNG TRONG TAY TA",
    rightItems: [
      "Người ấy có ở lại không",
      "Họ có yêu ta như cũ không",
      "Tương lai của mối quan hệ",
    ],
  },

  s4: {
    kind: "concept",
    headline: "YÊU MÀ KHÔNG SỞ HỮU",
    bodyLines: [
      "Bạn có thể yêu một người sâu sắc",
      "mà không coi họ là tài sản của mình.",
    ],
    emphasisIndex: 0,
  },

  s5: {
    kind: "concept",
    headline: "BẠN KIỂM SOÁT ĐƯỢC GÌ?",
    bodyLines: [
      "Không kiểm soát được trái tim người khác.",
      "Nhưng kiểm soát được cách mình yêu:",
      "Tử tế · Trung thành · Thành thật",
      "Có trách nhiệm · Giữ phẩm giá",
    ],
    emphasisIndex: 2,
  },

  s6: {
    kind: "impermanence",
    observation: "Người mình yêu hôm nay\nkhông phải là lời hứa\nhọ sẽ ở bên ta mãi mãi.",
    reframe: "Chính vì không chắc chắn,\nmỗi khoảnh khắc bên nhau\nmới đáng được trân trọng.",
  },

  s7: {
    kind: "concept",
    headline: "KHI TÌNH YÊU KẾT THÚC",
    bodyLines: [
      "Nếu một ngày họ rời đi,",
      "điều đó không có nghĩa",
      "tình yêu trước đó là vô nghĩa.",
      "",
      "Bạn có thể đau.",
      "Nhưng không cần đánh mất chính mình.",
    ],
    emphasisIndex: 4,
  },

  s8: {
    kind: "concept",
    headline: "BẢN CHẤT KHẮC KỴ",
    bodyLines: [
      "Khắc kỷ không dạy ta yêu ít hơn.",
      "",
      "Nó dạy ta yêu",
      "mà không trao toàn bộ tự do",
      "của mình cho một người khác.",
    ],
    emphasisIndex: 2,
  },

  s9: {
    kind: "concept",
    headline: "SUY NGẬM CUỐI",
    bodyLines: [
      "Yêu sâu sắc.",
      "Trân trọng hiện tại.",
      "Và để người mình yêu",
      "được tự do.",
    ],
    emphasisIndex: 1,
  },

  s10: {
    kind: "ending",
    closingThought: "YÊU MÀ KHÔNG SỞ HỮU.",
    signature: "Stoicism × Love",
    tagline: "",
  },
};

// ---------------------------------------------------------------------------
// Scene definitions — ordered scene list with audio + timing
//
// Audio: generated by gen_tts_stoicLove.py → public/stoicLove/s{N}.mp3
// ---------------------------------------------------------------------------

export const STOIC_LOVE_SCENES: SceneDef[] = [
  {
    id: "s1",
    audio: "stoicLove/s1.mp3",
    caption: "Bạn có bao giờ tự hỏi... tại sao càng yêu một người, chúng ta lại càng sợ mất họ?",
    dur: 5.64,
  },
  {
    id: "s2",
    audio: "stoicLove/s2.mp3",
    caption: "Không phải tình yêu làm ta đau. Đó là mong muốn kiểm soát tình yêu làm ta đau.",
    dur: 6.12,
  },
  {
    id: "s3",
    audio: "stoicLove/s3.mp3",
    caption: "Phân biệt Khắc kỷ: Điều gì trong tay ta? Cách ta yêu, cách ta đối xử, sự trung thực. Điều gì không? Người ấy có ở lại, họ có yêu ta, tương lai quan hệ.",
    dur: 14.88,
  },
  {
    id: "s4",
    audio: "stoicLove/s4.mp3",
    caption: "Bạn có thể yêu một người sâu sắc mà không coi họ là tài sản của mình.",
    dur: 4.944,
  },
  {
    id: "s5",
    audio: "stoicLove/s5.mp3",
    caption: "Không kiểm soát được trái tim người khác. Nhưng kiểm soát được cách mình yêu: tử tế, trung thành, thành thật, có trách nhiệm, giữ phẩm giá.",
    dur: 10.176,
  },
  {
    id: "s6",
    audio: "stoicLove/s6.mp3",
    caption: "Người mình yêu hôm nay không phải lời hứa họ ở bên mãi. Chính vì không chắc chắn, mỗi khoảnh khắc bên nhau mới đáng trân trọng.",
    dur: 8.592,
  },
  {
    id: "s7",
    audio: "stoicLove/s7.mp3",
    caption: "Nếu một ngày họ rời đi, tình yêu trước đó không vô nghĩa. Bạn có thể đau. Nhưng không cần đánh mất chính mình.",
    dur: 9.192,
  },
  {
    id: "s8",
    audio: "stoicLove/s8.mp3",
    caption: "Khắc kỷ không dạy ta yêu ít hơn. Nó dạy ta yêu mà không trao toàn bộ tự do của mình cho một người khác.",
    dur: 7.896,
  },
  {
    id: "s9",
    audio: "stoicLove/s9.mp3",
    caption: "Yêu sâu sắc. Trân trọng hiện tại. Và để người mình yêu được tự do. Đó có thể là một cách rất Khắc kỷ để yêu.",
    dur: 10.248,
  },
  {
    id: "s10",
    audio: "stoicLove/s10.mp3",
    caption: "YÊU MÀ KHÔNG SỞ HỮU. Stoicism × Love",
    dur: 4.44,
  },
];