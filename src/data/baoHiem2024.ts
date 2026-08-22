// ---------------------------------------------------------------------------
// BaoHiem2024 Content Data
//
// Luật Bảo hiểm Xã hội 2024 (Luật số 41/2024/QH15)
// YouTube 1920x1080, ~90-120s, 6 scenes
// NodeFlow template — network/diagram visual grammar
//
// All facts verified from:
//   - Luật BHXH số 41/2024/QH15 (Quốc hội Việt Nam, ngày 29/6/2024)
//   - Hiệu lực: 01/7/2025
//   - Nguồn: https://moj.gov.vn (Bộ Tư pháp)
//   - Nguồn: https://baohiemxahoi.gov.vn (BHXH Việt Nam)
//
// Thay đổi chính so với Luật BHXH 2014:
//   - Mở rộng đối tượng tham gia BHXH bắt buộc
//   - Giảm thời gian đóng BHXH tối thiểu để hưởng lương hưu (từ 20 → 15 năm)
//   - Thêm tầng BHXH tự nguyện
//   - Quyền hưởng trợ cấp hàng tháng khi không đủ điều kiện hưởng lương hưu
// ---------------------------------------------------------------------------

import { FPS, TAIL, sceneFrames } from "./nq57";
import type { SceneDef } from "./nq57";
import type { NodeFlowSceneContent } from "../templates/nodeflow/types";

export { FPS, TAIL, sceneFrames };
export type { SceneDef };
export type { NodeFlowSceneContent };

// ---------------------------------------------------------------------------
// BaoHiem2024 Scene Content — keyed by scene ID
// ---------------------------------------------------------------------------

export const BAO_HIEM_CONTENT: Record<string, NodeFlowSceneContent> = {
  s1: {
    kind: "title",
    lawCode: "LUẬT 41/2024/QH15",
    title: "BẢO HIỂM XÃ HỘI 2024",
    subtitle: "Những thay đổi quan trọng bạn cần biết",
    tagline: "Hiệu lực từ 01.07.2025",
    nodes: [
      { label: "NHÀ NƯỚC", role: "Quản lý & Hỗ trợ" },
      { label: "NGƯỜI LAO ĐỘNG", role: "Đóng & Hưởng" },
      { label: "DOANH NGHIỆP", role: "Đóng & Phối hợp" },
    ],
  },

  s2: {
    kind: "flow",
    title: "Hệ thống BHXH\nhoạt động thế nào?",
    description: [
      "Ba bên cùng đóng góp vào quỹ BHXH.",
      "Người lao động và doanh nghiệp đều tham gia.",
      "Nhà nước đảm bảo tính bền vững của hệ thống.",
    ],
    flowNodes: [
      { label: "NGƯỜI LAO ĐỘNG", sublabel: "NLĐ", rate: "8%/tháng" },
      { label: "DOANH NGHIỆP", sublabel: "NSDLĐ", rate: "17.5%/tháng" },
      { label: "QUỸ BHXH", sublabel: "FUND", rate: "Tập trung" },
    ],
    edges: [
      { from: 0, to: 2, label: "8%" },
      { from: 1, to: 2, label: "17.5%" },
      { from: 2, to: 0, label: "Lương hưu / Trợ cấp" },
    ],
  },

  s3: {
    kind: "contribution",
    title: "Tỷ lệ đóng BHXH bắt buộc",
    rows: [
      { party: "Doanh nghiệp", type: "Hưu trí + Tử tuất", pct: 0.14, rateLabel: "14%" },
      { party: "Doanh nghiệp", type: "Ốm đau + Thai sản + TNLĐ-BNN", pct: 0.035, rateLabel: "3.5%" },
      { party: "Người lao động", type: "Hưu trí + Tử tuất", pct: 0.08, rateLabel: "8%" },
    ],
    totalLabel: "Tổng cộng / tháng",
    totalValue: "25.5%",
    note: "Tính trên mức lương làm căn cứ đóng BHXH. Nguồn: Luật 41/2024/QH15.",
  },

  s4: {
    kind: "benefit",
    title: "6 chế độ BHXH\nbắt buộc",
    description: "Người lao động được hưởng đầy đủ 6 chế độ khi đáp ứng điều kiện.",
    benefits: [
      { icon: "health", label: "Chế độ ốm đau", value: "75% lương đóng BHXH" },
      { icon: "maternity", label: "Chế độ thai sản", value: "100% lương, 6 tháng" },
      { icon: "work", label: "Tai nạn lao động — Bệnh nghề nghiệp", value: "Tối đa 100% lương" },
      { icon: "pension", label: "Chế độ hưu trí", value: "Từ 15 năm đóng (mới)" },
      { icon: "death", label: "Chế độ tử tuất", value: "60–100 tháng lương" },
      { icon: "unemployment", label: "Bảo hiểm thất nghiệp", value: "60% lương, tối đa 12 tháng" },
    ],
  },

  s5: {
    kind: "compare",
    title: "Thay đổi quan trọng năm 2024",
    before: {
      items: [
        { label: "Điều kiện lương hưu", value: "20 năm đóng BHXH" },
        { label: "Rút BHXH 1 lần", value: "Dễ dàng sau 1 năm" },
        { label: "Đối tượng tham gia", value: "Lao động có hợp đồng ≥3 tháng" },
        { label: "Trợ cấp hàng tháng", value: "Chưa có quy định" },
      ],
    },
    after: {
      items: [
        { label: "Điều kiện lương hưu", value: "15 năm đóng BHXH", highlight: true },
        { label: "Rút BHXH 1 lần", value: "Hạn chế, quy định chặt chẽ", highlight: true },
        { label: "Đối tượng tham gia", value: "Mở rộng thêm nhiều nhóm", highlight: true },
        { label: "Trợ cấp hàng tháng", value: "Hưởng nếu đủ điều kiện", highlight: true },
      ],
    },
    changeLabel: "THAY ĐỔI",
  },

  s6: {
    kind: "end",
    closingTitle: "BHXH BẢO VỆ TƯƠNG LAI CỦA BẠN",
    closingSubtitle:
      "Luật Bảo hiểm Xã hội 2024 mở rộng quyền lợi, tăng tính công bằng và tạo lưới an sinh vững chắc cho toàn dân.",
    stats: [
      { label: "Thời gian đóng tối thiểu", value: "15 NĂM" },
      { label: "Tổng tỷ lệ đóng", value: "25.5%" },
      { label: "Số chế độ được bảo đảm", value: "6 CHẾ ĐỘ" },
    ],
    reference: "Luật 41/2024/QH15 — Hiệu lực: 01.07.2025",
  },
};

// ---------------------------------------------------------------------------
// BaoHiem2024 Scene List
//
// Audio: public/baoHiem2024/s{N}.mp3
// Durations are placeholders — replace with actual measured values after TTS.
// ---------------------------------------------------------------------------

export const BAO_HIEM_SCENES: SceneDef[] = [
  {
    id: "s1",
    audio: "baoHiem2024/s1.mp3",
    caption:
      "Luật Bảo hiểm Xã hội số 41 năm 2024 — những điểm mới quan trọng mà người lao động và doanh nghiệp cần nắm rõ.",
    dur: 12.836,
  },
  {
    id: "s2",
    audio: "baoHiem2024/s2.mp3",
    caption:
      "Hệ thống BHXH hoạt động theo cơ chế đóng góp ba bên: người lao động, doanh nghiệp và Nhà nước cùng xây dựng quỹ chung.",
    dur: 8.108,
  },
  {
    id: "s3",
    audio: "baoHiem2024/s3.mp3",
    caption:
      "Tỷ lệ đóng BHXH bắt buộc: doanh nghiệp đóng 17,5% — người lao động đóng 8% — tổng cộng 25,5% mức lương làm căn cứ.",
    dur: 12.404,
  },
  {
    id: "s4",
    audio: "baoHiem2024/s4.mp3",
    caption:
      "Người lao động tham gia BHXH bắt buộc được hưởng 6 chế độ: ốm đau, thai sản, tai nạn lao động, hưu trí, tử tuất và thất nghiệp.",
    dur: 9.548,
  },
  {
    id: "s5",
    audio: "baoHiem2024/s5.mp3",
    caption:
      "Điểm mới nổi bật: giảm điều kiện hưởng lương hưu từ 20 xuống còn 15 năm đóng; hạn chế rút BHXH một lần; mở rộng đối tượng tham gia.",
    dur: 11.588,
  },
  {
    id: "s6",
    audio: "baoHiem2024/s6.mp3",
    caption:
      "BHXH bảo vệ tương lai của bạn. Luật 41/2024 hiệu lực từ 01 tháng 7 năm 2025.",
    dur: 9.308,
  },
];
