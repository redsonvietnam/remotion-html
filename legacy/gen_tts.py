import os, json
from gtts import gTTS
from mutagen.mp3 import MP3

OUT_DIR = "public/nq57"
os.makedirs(OUT_DIR, exist_ok=True)

SCENES = {
    "s1": "Nghị quyết số 57 của Bộ Chính trị, ban hành ngày 22 tháng 12 năm 2024. Đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia.",
    "s2": "Khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số là đột phá quan trọng hàng đầu, là động lực chính để đưa đất nước bứt phá trong kỷ nguyên mới.",
    "s3": "Người dân và doanh nghiệp là trung tâm, là chủ thể và động lực chính. Nhà khoa học là nhân tố then chốt. Nhà nước giữ vai trò dẫn dắt.",
    "s4": "Năm trụ cột cốt lõi: Thể chế, Nhân lực, Hạ tầng, Dữ liệu và Công nghệ chiến lược. Trong đó, thể chế là điều kiện tiên quyết, đi trước một bước.",
    "s5": "Mục tiêu đến năm 2030: quy mô kinh tế số đạt tối thiểu 30% GDP. Trên 80% giao dịch với cơ quan nhà nước thực hiện trực tuyến. Việt Nam nằm trong nhóm 3 nước dẫn đầu Đông Nam Á về trí tuệ nhân tạo.",
    "s6": "Tầm nhìn 2045: Việt Nam trở thành nước phát triển, thu nhập cao. Kinh tế số đạt tối thiểu 50% GDP, thuộc nhóm 30 nước dẫn đầu thế giới về đổi mới sáng tạo.",
    "s7": "Nghị quyết 57, khởi động kỷ nguyên vươn mình của dân tộc. Hành động hôm nay, để Việt Nam hùng cường ngày mai.",
}

results = {}
total = 0.0
for key, text in SCENES.items():
    path = os.path.join(OUT_DIR, f"{key}.mp3")
    gTTS(text, lang="vi").save(path)
    d = MP3(path).info.length
    results[key] = {"file": path, "duration_sec": round(d, 3)}
    total += d
    print(f"{key}: {d:.2f}s")

with open(os.path.join(OUT_DIR, "durations.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print(f"TOTAL: {total:.2f}s")
