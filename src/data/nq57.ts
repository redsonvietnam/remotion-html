export const FPS = 30;

export interface SceneDef {
  id: string;
  audio: string;
  caption: string;
  dur: number;
}

export const SCENES: SceneDef[] = [
  {
    id: "s1",
    audio: "nq57/s1.mp3",
    caption: `MC: Chào bạn. Hôm nay chúng ta cùng giải mã một văn kiện đang làm thay đổi cuộc chơi: Nghị quyết 57 của Bộ Chính trị, ban hành ngày 22 tháng 12 năm 2024.
Chuyên gia: Đúng vậy. Đó là Nghị quyết về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia.`,
    dur: 20.232,
  },
  {
    id: "s2",
    audio: "nq57/s2.mp3",
    caption: `MC: Tại sao nó lại được gọi là đột phá?
Chuyên gia: Vì Nghị quyết xác định đây là đột phá quan trọng hàng đầu, là động lực chính để đưa đất nước bứt phá trong kỷ nguyên mới.`,
    dur: 10.704,
  },
  {
    id: "s3",
    audio: "nq57/s3.mp3",
    caption: `MC: Vậy ai là người làm nên cuộc cách mạng này?
Chuyên gia: Người dân và doanh nghiệp là trung tâm, là chủ thể và động lực chính. Nhà khoa học là nhân tố then chốt. Và Nhà nước giữ vai trò dẫn dắt.`,
    dur: 14.616,
  },
  {
    id: "s4",
    audio: "nq57/s4.mp3",
    caption: `MC: Có những trụ cột nào?
Chuyên gia: Năm trụ cột cốt lõi: Thể chế, Nhân lực, Hạ tầng, Dữ liệu và Công nghệ chiến lược. Trong đó, thể chế là điều kiện tiên quyết, đi trước một bước.`,
    dur: 13.944,
  },
  {
    id: "s5",
    audio: "nq57/s5.mp3",
    caption: `MC: Đích đến cụ thể là gì?
Chuyên gia: Đến năm 2030, quy mô kinh tế số đạt tối thiểu 30% GDP. Trên 80% giao dịch với cơ quan nhà nước thực hiện trực tuyến. Và Việt Nam nằm trong nhóm 3 nước dẫn đầu Đông Nam Á về trí tuệ nhân tạo.`,
    dur: 18.408,
  },
  {
    id: "s6",
    audio: "nq57/s6.mp3",
    caption: `MC: Còn xa hơn, năm 2045?
Chuyên gia: Đến 2045, Việt Nam trở thành nước phát triển, thu nhập cao. Kinh tế số đạt tối thiểu 50% GDP, thuộc nhóm 30 nước dẫn đầu thế giới về đổi mới sáng tạo.`,
    dur: 17.088,
  },
  {
    id: "s7",
    audio: "nq57/s7.mp3",
    caption: `MC: Một tầm nhìn tham vọng.
Chuyên gia: Và nó chỉ thành hiện thực nếu chúng ta hành động ngay hôm nay.
MC: Nghị quyết 57 — khởi động kỷ nguyên vươn mình của dân tộc. Hành động hôm nay, để Việt Nam hùng cường ngày mai.`,
    dur: 15.624,
  },
];

// moi scene cong them 0.5s de khong cat mat tieng cuoi
export const TAIL = 0.5;
export const sceneFrames = (dur: number) => Math.ceil((dur + TAIL) * FPS);
