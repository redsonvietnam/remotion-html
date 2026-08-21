// ---------------------------------------------------------------------------
// De An 06 Content Data
//
// De An 06 — Phat trien ung dung du lieu ve dan cu, dinh danh va xac thuc
// dien tu phuc vu chuyen doi so quoc gia (QD-TTg 06/2022).
//
// Uses NQ57 content types. No colors, no fonts, no positions.
// ---------------------------------------------------------------------------

import { FPS, TAIL, sceneFrames } from "./nq57";
import type { SceneDef, NQ57SceneContent } from "./nq57";

export { FPS, TAIL, sceneFrames };

// ---------------------------------------------------------------------------
// De An 06 Content -- scene-specific content
// ---------------------------------------------------------------------------

export const DE_AN06_CONTENT: Record<string, NQ57SceneContent> = {
  s1: {
    kind: "title",
    badge: "THU TUONG CHINH PHU · 06/01/2022",
    title: "DE AN 06",
    subtitle:
      "Phat trien ung dung du lieu ve dan cu, dinh danh va xac thuc dien tu phuc vu chuyen doi so quoc gia",
    tagline: "Du lieu dan cu — Nen tang so quoc gia",
  },

  s2: {
    kind: "quote",
    text:
      "De an nguyen phat trien ung dung du lieu ve dan cu, dinh danh va xac thuc dien tu, gop phan thuc hien chuyen doi so quoc gia.",
    keyPhrases: ["dinh danh va xac thuc dien tu", "chuyen doi so quoc gia"],
  },

  s3: {
    kind: "roles",
    sectionTitle: "CHU TRI THUC HIEN",
    roles: [
      {
        title: "Bo Cong an",
        subtitle: "Chu nhiem — Quan ly CSDL dan cu",
      },
      {
        title: "Bo TT&TT",
        subtitle: "Phoi hop — Nen tang so",
      },
      {
        title: "Nguoi dan",
        subtitle: "Chu the — Su dung dich vu",
      },
    ],
  },

  s4: {
    kind: "pillars",
    title: "Nhom van de cot loi",
    subtitle: "5 nhom van de hanh dong chinh",
    pillars: [
      "Phap ly",
      "Ha tang",
      "Du lieu",
      "An ninh",
      "Nguon luc",
    ],
  },

  s5: {
    kind: "stats",
    title: "Chi so dot pha",
    chartData: [
      { label: "2022", value: 15 },
      { label: "2023", value: 30 },
      { label: "2024", value: 52 },
      { label: "2025", value: 70 },
      { label: "2026", value: 85 },
    ],
    gauges: [
      { value: 70, max: 100, label: "Ho so cong truc tuyen", unit: "%" },
      { value: 50, max: 100, label: "Ket noi CSDL dan cu", unit: "%" },
      {
        value: 80,
        max: 100,
        label: "Xac thuc VNeID",
        unit: "%",
      },
    ],
  },

  s6: {
    kind: "vision",
    label: "TAM NHIN 2030",
    targetValue: 100,
    subtitle: "100% TTHC truc tuyen — 80% ho so xu ly online",
    description:
      "Dinh danh so toan dan — Chuyen doi so toan dien",
  },

  s7: {
    kind: "end",
    title: "Dinh danh so quoc gia",
    subtitle: "Moi nguoi dan la mot nut ket noi trong he thong so",
    reference: "QD-TTg 06/2022",
  },
};

// ---------------------------------------------------------------------------
// Scene definitions -- ordered scene list with audio + timing
// ---------------------------------------------------------------------------

export const DE_AN06_SCENES: SceneDef[] = [
  {
    id: "s1",
    audio: "nq57/s1.mp3",
    caption:
      "Chao ban. Hom nay chung ta cung tim hieu ve De An 06 — Phat trien ung dung du lieu ve dan cu, dinh danh va xac thuc dien tu.",
    dur: 18.0,
  },
  {
    id: "s2",
    audio: "nq57/s2.mp3",
    caption:
      "De an nguyen phat trien ung dung du lieu ve dan cu, dinh danh va xac thuc dien tu, gop phan thuc hien chuyen doi so quoc gia.",
    dur: 10.0,
  },
  {
    id: "s3",
    audio: "nq57/s3.mp3",
    caption:
      "Bo Cong an chu nhiem quan ly CSDL dan cu. Bo TT&TT phoi hop xay dung nen tang so. Nguoi dan la chu the su dung dich vu.",
    dur: 13.0,
  },
  {
    id: "s4",
    audio: "nq57/s4.mp3",
    caption:
      "Nam nhom van de cot loi: Phap ly, Ha tang, Du lieu, An ninh va Nguon luc. Dieu kien tien quyet la khung phap ly va ha tang so.",
    dur: 12.0,
  },
  {
    id: "s5",
    audio: "nq57/s5.mp3",
    caption:
      "Chi so dot pha: Ho so cong truc tuyen dat 70%. Ket noi CSDL dan cu dat 50%. Xac thuc VNeID dat 80%.",
    dur: 16.0,
  },
  {
    id: "s6",
    audio: "nq57/s6.mp3",
    caption:
      "Tam nhin 2030: 100% thu tuc hanh chinh truc tuyen. 80% ho so xu ly truc tuyen. Dinh danh so toan dan.",
    dur: 14.0,
  },
  {
    id: "s7",
    audio: "nq57/s7.mp3",
    caption:
      "Dinh danh so quoc gia — moi nguoi dan la mot nut ket noi trong he thong so. De An 06 — nen tang cho chuyen doi so toan dan.",
    dur: 12.0,
  },
];
