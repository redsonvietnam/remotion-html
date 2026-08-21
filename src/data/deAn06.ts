// ---------------------------------------------------------------------------
// De An 06 Content Data
//
// De An 06 — Phat trien ung dung du lieu ve dan cu, dinh danh va xac thuc
// dien tu phuc vu chuyen doi so quoc gia (QD-TTg 06/2022).
//
// All facts verified from official sources:
// - QD-TTg 06/QD-TTg ngay 06/01/2022
// - Bo Cong an reports (2024-2025)
// - Cong thong tin Chinh phu
// - thuvienphapluat.vn
//
// No colors, no fonts, no positions, no presentation.
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
    tagline: "Giai doan 2022 - 2025, tam nhin den nam 2030",
  },

  s2: {
    kind: "quote",
    text:
      "Ung dung co so du lieu quoc gia ve dan cu, he thong dinh danh va xac thuc dien tu, the can cuoc cong dan ghep chip dien tu trong cong cuoc chuyen doi so quoc gia.",
    keyPhrases: ["dinh danh va xac thuc dien tu", "chuyen doi so quoc gia"],
  },

  s3: {
    kind: "roles",
    sectionTitle: "CHU TRI THUC HIEN",
    roles: [
      {
        title: "Bo Cong an",
        subtitle: "Chu nhiem — CSDL dan cu, dinh danh va xac thuc",
      },
      {
        title: "Bo TT&TT",
        subtitle: "Phoi hop — Cong dich vu cong quoc gia",
      },
      {
        title: "Bo, nganh, dia phuong",
        subtitle: "Ket noi — Tich hop chia se du lieu",
      },
    ],
  },

  s4: {
    kind: "pillars",
    title: "5 nhom tien ich cot loi",
    subtitle: "Phuc vu chuyen doi so quoc gia",
    pillars: [
      "Giai quyet TTHC",
      "Phat trien KT-XH",
      "Cong dan so",
      "Ket noi du lieu",
      "Chi dao dieu hanh",
    ],
  },

  s5: {
    kind: "stats",
    title: "Ket qua dat duoc",
    chartData: [
      { label: "2022", value: 20 },
      { label: "2023", value: 35 },
      { label: "2024", value: 58 },
      { label: "2025", value: 67 },
    ],
    gauges: [
      {
        value: 87,
        max: 100,
        label: "The CCCD gan chip da cap (trieu)",
        unit: "M",
      },
      {
        value: 67,
        max: 100,
        label: "Tai khoan VNeID kich hoat (trieu)",
        unit: "M",
      },
      {
        value: 50,
        max: 100,
        label: "Tien ich tren VNeID",
        unit: "",
      },
    ],
  },

  s6: {
    kind: "vision",
    label: "TAM NHIN 2030",
    targetValue: 100,
    subtitle: "100% cong dan so hoa — Dinh danh toan dan",
    description:
      "Mo nguoi dan mot tai khoan dinh danh dien tu — VNeID",
  },

  s7: {
    kind: "end",
    title: "Dinh danh so quoc gia",
    subtitle: "De An 06 — nen tang so cho moi nguoi dan",
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
      "Chao ban. Hom nay chung ta cung tim hieu ve De An 06 — Phat trien ung dung du lieu ve dan cu, dinh danh va xac thuc dien tu phuc vu chuyen doi so quoc gia.",
    dur: 18.0,
  },
  {
    id: "s2",
    audio: "nq57/s2.mp3",
    caption:
      "De an quy dinh viec ung dung co so du lieu quoc gia ve dan cu, he thong dinh danh va xac thuc dien tu, the can cuoc cong dan ghep chip trong cong cuoc chuyen doi so quoc gia.",
    dur: 10.0,
  },
  {
    id: "s3",
    audio: "nq57/s3.mp3",
    caption:
      "Bo Cong an chu nhiem quan ly co so du lieu dan cu va he thong dinh danh. Bo TT&TT phoi hop xay dung cong dich vu cong quoc gia. Cac bo, nganh va dia phuong ket noi, tich hop chia se du lieu.",
    dur: 13.0,
  },
  {
    id: "s4",
    audio: "nq57/s4.mp3",
    caption:
      "Nam nhom tien ich cot loi: Giai quyet thu tuc hanh chinh, Phat trien kinh te xa hoi, Cong dan so, Ket noi du lieu dan cu, Chi dao dieu hanh cua lanh dao cac cap.",
    dur: 12.0,
  },
  {
    id: "s5",
    audio: "nq57/s5.mp3",
    caption:
      "Ket qua: 87 trieu the can cuo cong dan gan chip da cap. 67 trieu tai khoan VNeID da kich hoat. 50 tien ich dien tu tren VNeID, trung binh 3 trieu luot truy cap moi ngay.",
    dur: 16.0,
  },
  {
    id: "s6",
    audio: "nq57/s6.mp3",
    caption:
      "Tam nhin 2030: Mo nguoi dan co mot tai khoan dinh danh dien tu VNeID. Dinh danh toan dan, phuc vu chuyen doi so toan dien.",
    dur: 14.0,
  },
  {
    id: "s7",
    audio: "nq57/s7.mp3",
    caption:
      "De An 06 — nen tang so cho moi nguoi dan. Dinh danh dien tu, chia se mot lan, su dung o moi noi.",
    dur: 12.0,
  },
];
