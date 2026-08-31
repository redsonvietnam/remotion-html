const { useState, useEffect, useRef, useCallback, useMemo } = React;
const FPS = 30;
const clamp = v => Math.max(0, Math.min(1, v));
const fp = (f, d) => d > 0 ? clamp(f / (d - 1)) : 1;
const stf = s => Math.ceil(s * FPS);
const fmt = f => { const t = f / FPS; return Math.floor(t/60) + ":" + String(Math.floor(t%60)).padStart(2,"0") + "." + String(Math.floor((t%1)*100)).padStart(2,"0"); };

const CANVAS = { "16:9": { w: 1920, h: 1080 }, "9:16": { w: 1080, h: 1920 } };
const TEMPLATE_FORMATS = { cr7: ["16:9","9:16"], nodeflow: ["16:9"], nq57: ["16:9"], stoiclove: ["9:16"], blueprint: ["16:9"], cosmos: ["16:9","9:16"], scrapbook: ["16:9"], terminal: ["9:16"], kineticStatement: ["9:16"], bentoGrid: ["9:16"] };

const PRODUCTIONS = [
  {
    id: "nq57", name: "NQ57", template: "nq57", format: "16:9",
    theme: { bg:"#0a0e1a",bg2:"#0f1525",card:"rgba(255,255,255,0.045)",line:"rgba(245,245,255,0.12)",a1:"#e23b3b",a1s:"#ff6b5e",a2:"#f3c969",a2s:"#ffe6a3",a3:"#5eead4",ink:"#f7f5ef",muted:"#9aa0b5",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    scenes: [
      { id:"s1",dur:20.232,kind:"title" },{ id:"s2",dur:10.704,kind:"quote" },{ id:"s3",dur:14.616,kind:"roles" },
      { id:"s4",dur:13.944,kind:"pillars" },{ id:"s5",dur:18.408,kind:"stats" },{ id:"s6",dur:17.088,kind:"vision" },
      { id:"s7",dur:15.624,kind:"end" },
    ],
    content: {
      s1:{kind:"title",lawCode:"NQ 57-NQ/TW",title:"Nghị quyết 57-NQ/TW",subtitle:"Đổi mới tổ chức và hoạt động của cơ quan nhà nước",tagline:"BỘ CHÍNH TRỊ",nodes:[{label:"BỘ CHÍNH TRỊ",role:"Ban hành"},{label:"CHÍNH PHỦ",role:"Chỉ đạo"},{label:"BỘ, NGÀNH",role:"Thực hiện"}]},
      s2:{kind:"quote",text:"Nghị quyết 57-NQ/TW ngày 25/12/2024"},
      s3:{kind:"roles",sectionTitle:"Tổ chức thực hiện",roles:[{title:"Bộ Chính trị",subtitle:"Ban hành"},{title:"Thủ tướng",subtitle:"Chỉ đạo"},{title:"Các bộ, ngành",subtitle:"Tổ chức thực hiện"}]},
      s4:{kind:"pillars",title:"3 trụ cột chính",subtitle:"Cải cách toàn diện",pillars:[{title:"Tổ chức",body:"Sáp nhập, sắp xếp"},{title:"Hoạt động",body:"Số hóa, chuyển đổi"},{title:"Nhân sự",body:"Cải cách tiền lương"}]},
      s5:{kind:"stats",title:"Số liệu cụ thể",chartData:[{label:"Cơ quan",value:30},{label:"Đơn vị",value:50}],gauges:[{value:30,max:100,label:"Cắt giảm",unit:"%"}]},
      s6:{kind:"vision",label:"Mục tiêu",targetValue:"2030",subtitle:"Phủ数字化 toàn bộ",description:"Hình thành nền tảng số quốc gia"},
      s7:{kind:"end",title:"Nghị quyết 57-NQ/TW",subtitle:"Đổi mới tổ chức và hoạt động của cơ quan nhà nước",reference:"Bộ Chính trị — 25/12/2024"},
    },
  },
  {
    id: "dean06", name: "Đề án 06", template: "nq57", format: "16:9",
    theme: { bg:"#061220",bg2:"#0a1a34",card:"rgba(255,255,255,0.04)",line:"rgba(160,200,255,0.1)",a1:"#00d4ff",a1s:"#66e0ff",a2:"#0099cc",a2s:"#33b5e5",a3:"#00ffcc",ink:"#f5faff",muted:"#7a9cc6",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    scenes: [
      { id:"s1",dur:16.68,kind:"title" },{ id:"s2",dur:11.064,kind:"quote" },{ id:"s3",dur:13.032,kind:"roles" },
      { id:"s4",dur:12.36,kind:"pillars" },{ id:"s5",dur:15.768,kind:"stats" },{ id:"s6",dur:14.424,kind:"vision" },
      { id:"s7",dur:13.32,kind:"end" },
    ],
    content: {
      s1:{kind:"title",lawCode:"Đề án 06",title:"Đề án 06",subtitle:"Định danh số — Căn cước công dân",tagline:"BỘ CÔNG AN",nodes:[{label:"BỘ CÔNG AN",role:"Chủ trì"},{label:"BỘ TT&TT",role:"Phối hợp"},{label:"UBND TỈNH",role:"Triển khai"}]},
      s2:{kind:"quote",text:"Đề án 06 về định danh và xác thực điện tử"},
      s3:{kind:"roles",sectionTitle:"Triển khai",roles:[{title:"Bộ Công An",subtitle:"Chủ trì"},{title:"Bộ TT&TT",subtitle:"Phối hợp"},{title:"UBND các tỉnh",subtitle:"Tổ chức thực hiện"}]},
      s4:{kind:"pillars",title:"3 mục tiêu chính",subtitle:"Định danh số quốc gia",pillars:[{title:"Định danh",body:"CCCD gắn chip"},{title:"Xác thực",body:"eKYC, sinh trắc học"},{title:"Dịch vụ",body:"VssID, DVConNT"}]},
      s5:{kind:"stats",title:"Tiến độ triển khai",chartData:[{label:"CCCD phát hành",value:80},{label:"Dịch vụ số",value:60}],gauges:[{value:80,max:100,label:"Tỷ lệ phủ",unit:"%"}]},
      s6:{kind:"vision",label:"Mục tiêu",targetValue:"2025",subtitle:"Phủ 100% CCCD chip",description:"Mọi công dân đều có định danh số"},
      s7:{kind:"end",title:"Đề án 06 — Định danh số",subtitle:"Căn cước công dân gắn chip — Nền tảng cho chính phủ số",reference:"Bộ Công An — Đề án 06"},
    },
  },
  {
    id: "nq79", name: "NQ79", template: "nq57", format: "16:9",
    theme: { bg:"#050d1a",bg2:"#0a1628",card:"rgba(255,255,255,0.035)",line:"rgba(210,180,120,0.12)",a1:"#d4a843",a1s:"#e8c56d",a2:"#b8860b",a2s:"#d4a017",a3:"#c0392b",ink:"#fdfbf7",muted:"#a89a7c",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    scenes: [
      { id:"s1",dur:18.024,kind:"title" },{ id:"s2",dur:12.48,kind:"quote" },{ id:"s3",dur:15.192,kind:"roles" },
      { id:"s4",dur:14.568,kind:"pillars" },{ id:"s5",dur:17.256,kind:"stats" },{ id:"s6",dur:16.032,kind:"vision" },
      { id:"s7",dur:14.856,kind:"end" },
    ],
    content: {
      s1:{kind:"title",lawCode:"NQ 79-NQ/TW",title:"Nghị quyết 79-NQ/TW",subtitle:"Đẩy mạnh ứng dụng CNTT trong hoạt động của cơ quan nhà nước",tagline:"BỘ CHÍNH TRỊ",nodes:[{label:"BỘ TT&TT",role:"Phối hợp"},{label:"CÁB BỘ, NGÀNH",role:"Thực hiện"},{label:"ĐỊA PHƯƠNG",role:"Triển khai"}]},
      s2:{kind:"quote",text:"Nghị quyết 79-NQ/TW ngày 06/6/2025"},
      s3:{kind:"roles",sectionTitle:"Tổ chức thực hiện",roles:[{title:"Bộ TT&TT",subtitle:"Phối hợp"},{title:"Các bộ, ngành",subtitle:"Tổ chức thực hiện"},{title:"Địa phương",subtitle:"Triển khai"}]},
      s4:{kind:"pillars",title:"3 nhiệm vụ trọng tâm",subtitle:"Ứng dụng CNTT",pillars:[{title:"Số hóa",body:"Hồ sơ, giấy tờ"},{title:"Kết nối",body:"Cơ sở dữ liệu"},{title:"Dịch vụ",body:"Công trực tuyến"}]},
      s5:{kind:"stats",title:"Mục tiêu cụ thể",chartData:[{label:"Dịch vụ trực tuyến",value:90},{label:"Hồ sơ số hóa",value:70}],gauges:[{value:90,max:100,label:"Phủ dịch vụ",unit:"%"}]},
      s6:{kind:"vision",label:"Mục tiêu",targetValue:"2030",subtitle:"Chính phủ số toàn diện",description:"100% dịch vụ công trực tuyến mức 4"},
      s7:{kind:"end",title:"NQ79 — Ứng dụng CNTT",subtitle:"Đẩy mạnh chuyển đổi số trong cơ quan nhà nước",reference:"Bộ Chính trị — 06/6/2025"},
    },
  },
  {
    id: "stoiclove", name: "Stoic Love", template: "stoiclove", format: "9:16",
    theme: { bg:"#0a0a0c",bg2:"#111114",card:"rgba(255,250,240,0.03)",line:"rgba(210,180,120,0.15)",a1:"#f5e6c8",a1s:"#faf0e0",a2:"#d4a843",a2s:"#e8c56d",a3:"#8b7355",ink:"#faf8f3",muted:"#9a8c7a",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    scenes: [
      { id:"s1",dur:5.64,kind:"hook" },{ id:"s2",dur:6.12,kind:"statement" },{ id:"s3",dur:14.88,kind:"split" },
      { id:"s4",dur:4.944,kind:"concept" },{ id:"s5",dur:10.176,kind:"concept" },{ id:"s6",dur:8.592,kind:"impermanence" },
      { id:"s7",dur:9.192,kind:"concept" },{ id:"s8",dur:7.896,kind:"concept" },{ id:"s9",dur:10.248,kind:"concept" },
      { id:"s10",dur:4.44,kind:"ending" },
    ],
    content: {
      s1:{kind:"hook",mainQuestion:"Tình yêu có phải là sở hữu?",subText:"Stoicism và tình yêu"},
      s2:{kind:"statement",lines:["Tình yêu không phải là sở hữu","Mà là sự trân trọng hiện tại"]},
      s3:{kind:"split",title:"Hai quan niệm",leftLabel:"THƯỜNG",leftItems:["Sở hữu","Kiểm soát","Lo lắng"],rightLabel:"STOIC",rightItems:["Tự do","Tin tưởng","Bình an"]},
      s4:{kind:"concept",headline:"Amor Fati",bodyLines:["Yêu lấy số phận","Chấp nhận mọi thứ"]},
      s5:{kind:"concept",headline:"Premeditatio Malorum",bodyLines:["Trước tưởng xấu","Để không sợ hãi"]},
      s6:{kind:"impermanence",observation:"Mọi thứ đều thay đổi",reframe:"Vì vậy hãy trân trọng hiện tại"},
      s7:{kind:"concept",headline:"Dichotomy of Control",bodyLines:["Phân biệt kiểm soát","Và buông bỏ"]},
      s8:{kind:"concept",headline:"Memento Mori",bodyLines:["Nhớ mình sẽ chết","Để sống trọn vẹn"]},
      s9:{kind:"concept",headline:"Sympatheia",bodyLines:["Mọi người liên kết","Là một phần của nhau"]},
      s10:{kind:"ending",closingThought:"Tình yêu chân thật là tự do",signature:"Marcus Aurelius",tagline:"Stoicism trong tình yêu"},
    },
  },
  {
    id: "canCuoc", name: "Căn Cước 2023", template: "nq57", format: "16:9",
    theme: { bg:"#081120",bg2:"#0d1a2e",card:"rgba(255,255,255,0.04)",line:"rgba(120,170,220,0.16)",a1:"#3b82f6",a1s:"#7cb0ff",a2:"#f4b740",a2s:"#ffd877",a3:"#2dd4bf",ink:"#f6f9ff",muted:"#9fb2c9",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    scenes: [
      { id:"s1",dur:17.424,kind:"title" },{ id:"s2",dur:11.544,kind:"quote" },{ id:"s3",dur:13.848,kind:"roles" },
      { id:"s4",dur:12.936,kind:"pillars" },{ id:"s5",dur:16.128,kind:"stats" },{ id:"s6",dur:14.712,kind:"vision" },
      { id:"s7",dur:13.584,kind:"end" },
    ],
    content: {
      s1:{kind:"title",lawCode:"Luật 26/2023/QH15",title:"Luật Căn cước công dân 2023",subtitle:"Định danh và quản lý cư trú",tagline:"QUỐC HỘI",nodes:[{label:"BỘ CÔNG AN",role:"Chủ trì"},{label:"UBND TỈNH",role:"Tổ chức"},{label:"CÔNG DÂN",role:"Đăng ký"}]},
      s2:{kind:"quote",text:"Luật Căn cước công dân số 26/2023/QH15"},
      s3:{kind:"roles",sectionTitle:"Triển khai",roles:[{title:"Bộ Công An",subtitle:"Chủ trì"},{title:"UBND các tỉnh",subtitle:"Tổ chức"},{title:"Công dân",subtitle:"Đăng ký"}]},
      s4:{kind:"pillars",title:"3 nội dung chính",subtitle:"Căn cước công dân",pillars:[{title:"Định danh",body:"CCCD gắn chip"},{title:"Quản lý",body:"Cơ sở dữ liệu"},{title:"Dịch vụ",body:"Công trực tuyến"}]},
      s5:{kind:"stats",title:"Tiến độ",chartData:[{label:"CCCD phát hành",value:75},{label:"Phủ chip",value:60}],gauges:[{value:75,max:100,label:"Tỷ lệ",unit:"%"}]},
      s6:{kind:"vision",label:"Mục tiêu",targetValue:"2025",subtitle:"Phủ 100% CCCD",description:"Mọi công dân từ 14 tuổi trở lên"},
      s7:{kind:"end",title:"Luật Căn cước 2023",subtitle:"Nền tảng định danh số quốc gia",reference:"Quốc hội — 2023"},
    },
  },
  {
    id: "luatGTDB", name: "Luật GTDB", template: "nq57", format: "16:9",
    theme: { bg:"#0a0f1e",bg2:"#0f1a30",card:"rgba(255,255,255,0.04)",line:"rgba(160,200,255,0.1)",a1:"#f59e0b",a1s:"#fbbf24",a2:"#3b82f6",a2s:"#60a5fa",a3:"#10b981",ink:"#f5faff",muted:"#7a9cc6",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    scenes: [
      { id:"s1",dur:19.152,kind:"title" },{ id:"s2",dur:12.096,kind:"quote" },{ id:"s3",dur:14.256,kind:"roles" },
      { id:"s4",dur:13.44,kind:"pillars" },{ id:"s5",dur:17.664,kind:"stats" },{ id:"s6",dur:16.416,kind:"vision" },
      { id:"s7",dur:15.216,kind:"end" },
    ],
    content: {
      s1:{kind:"title",lawCode:"Luật 36/2024/QH15",title:"Luật Trật tự, an toàn giao thông đường bộ",subtitle:"Luật số 36/2024/QH15",tagline:"QUỐC HỘI",nodes:[{label:"CÔNG AN",role:"Xử phạt"},{label:"GIAO THÔNG",role:"Tuân thủ"},{label:"ĐỊA PHƯƠNG",role:"Thực hiện"}]},
      s2:{kind:"quote",text:"Luật 36/2024/QH15 — Hiệu lực từ 01/01/2025"},
      s3:{kind:"roles",sectionTitle:"Áp dụng",roles:[{title:"Công an",subtitle:"Kiểm tra, xử phạt"},{title:"Giao thông",subtitle:"Tuân thủ"},{title:"Địa phương",subtitle:"Tổ chức thực hiện"}]},
      s4:{kind:"pillars",title:"3 nhóm quy định chính",subtitle:"An toàn giao thông",pillars:[{title:"PATH lights",body:"Phương tiện"},{title:"Hành vi",body:"Nghiêm cấm"},{title:"Xử phạt",body:"Mức phạt mới"}]},
      s5:{kind:"stats",title:"Thống kê",chartData:[{label:"Tai nạn/giảm",value:20},{label:"Ý thức%",value:70}],gauges:[{value:20,max:100,label:"Giảm TNGT",unit:"%"}]},
      s6:{kind:"vision",label:"Mục tiêu",targetValue:"2030",subtitle:"An toàn giao thông",description:"Giảm 50% tai nạn giao thông"},
      s7:{kind:"end",title:"Luật GTDB 2024",subtitle:"Trật tự, an toàn giao thông đường bộ",reference:"Quốc hội — Luật 36/2024"},
    },
  },
  {
    id: "baoHiem2024", name: "BHXH 2024", template: "nodeflow", format: "16:9",
    theme: { bg:"#0a0e1a",bg2:"#0f1423",card:"#141a2e",line:"rgba(255,255,255,0.08)",a1:"#00d4ff",a1s:"#00a3cc",a2:"#d4a843",a2s:"#b8922e",a3:"#34d399",ink:"#e8e6e1",muted:"#6b7280",fd:'"Inter","Segoe UI",system-ui,sans-serif',fm:'"JetBrains Mono","Fira Code",monospace' },
    scenes: [
      { id:"s1",dur:12.836,kind:"title" },{ id:"s2",dur:8.108,kind:"flow" },{ id:"s3",dur:12.404,kind:"contribution" },
      { id:"s4",dur:9.548,kind:"benefit" },{ id:"s5",dur:11.588,kind:"compare" },{ id:"s6",dur:9.308,kind:"end" },
    ],
    content: {
      s1:{kind:"title",lawCode:"LUAT 41/2024/QH15",title:"BAO HIEM XA HOI 2024",subtitle:"Nhung thay doi quan trong ban can biet",tagline:"Hieu luc tu 01.07.2025",nodes:[{label:"NHA NUOC",role:"Quan ly"},{label:"NGUOI LAO DONG",role:"Dong & Huong"},{label:"DOANH NGHIEP",role:"Dong & Phoi hop"}]},
      s2:{kind:"flow",title:"He thong BHXH hoat dong the nao?",description:["Ba ben cung dong gop vao quy BHXH.","Nguoi lao dong va doanh nghiep deu tham gia.","Nha nuoc dam bao tinh ben vung."],flowNodes:[{label:"NGUOI LAO DONG",sublabel:"NL",rate:"8%/thang"},{label:"DOANH NGHIEP",sublabel:"NSDL",rate:"17.5%/thang"},{label:"QUY BHXH",sublabel:"FUND",rate:"Tap trung"}],edges:[{from:0,to:2,label:"8%"},{from:1,to:2,label:"17.5%"},{from:2,to:0,label:"Luong huu"}]},
      s3:{kind:"contribution",title:"Ty le dong BHXH bat buoc",rows:[{party:"Doanh nghiep",type:"Huu tri + Tu tuat",pct:0.14,rateLabel:"14%"},{party:"Doanh nghiep",type:"Om dau + Thai san",pct:0.035,rateLabel:"3.5%"},{party:"Nguoi lao dong",type:"Huu tri + Tu tuat",pct:0.08,rateLabel:"8%"}],totalLabel:"Tong cong / thang",totalValue:"25.5%"},
      s4:{kind:"benefit",title:"6 che do BHXH bat buoc",description:"Nguoi lao dong duoc huong day du 6 che do.",benefits:[{icon:"health",label:"Om dau",value:"75% luong"},{icon:"maternity",label:"Thai san",value:"100% luong"},{icon:"work",label:"TNLĐ-BNN",value:"Toi da 100%"},{icon:"pension",label:"Huu tri",value:"Tu 15 nam"},{icon:"death",label:"Tu tuat",value:"60-100 thang"},{icon:"unemployment",label:"That nghiep",value:"60% luong"}]},
      s5:{kind:"compare",title:"Thay doi quan trong 2024",before:{items:[{label:"Dieu kien luong huu",value:"20 nam dong"},{label:"Rut BHXH 1 lan",value:"De dang"},{label:"Doi tuong tham gia",value:"Hop dong >= 3 thang"}]},after:{items:[{label:"Dieu kien luong huu",value:"15 nam dong",highlight:true},{label:"Rut BHXH 1 lan",value:"Han che",highlight:true},{label:"Doi tuong tham gia",value:"Mo rong",highlight:true}]},changeLabel:"THAY DOI"},
      s6:{kind:"end",closingTitle:"BAO HIEM BAO VE TUONG LAI",closingSubtitle:"Luat 41/2024 mo rong quyen loi, tang tinh cong bang.",stats:[{label:"Toi thieu",value:"15 NAM"},{label:"Ty le dong",value:"25.5%"},{label:"Che do",value:"6"}],reference:"Luat 41/2024/QH15 - Hieu luc: 01.07.2025"},
    },
  },
  {
    id: "luatBHXH", name: "Luật BHXH", template: "blueprint", format: "16:9",
    theme: { bg:"#0a1830",bg2:"#0f2145",card:"rgba(224,238,255,0.04)",line:"rgba(224,238,255,0.22)",a1:"#eaf4ff",a1s:"rgba(234,244,255,0.55)",a2:"#e8a33d",a2s:"#f2c27a",a3:"#5b84b8",ink:"#f2f6fb",muted:"#7d93b3",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    scenes: [
      { id:"s1",dur:17.204,kind:"title" },{ id:"s2",dur:11.132,kind:"pillars" },{ id:"s3",dur:10.292,kind:"measure" },
      { id:"s4",dur:14.036,kind:"detail" },{ id:"s5",dur:13.7,kind:"process" },{ id:"s6",dur:8.612,kind:"seal" },
    ],
    content: {
      s1:{kind:"title",code:"LUAT 41/2024/QH15",title:"Luật Bảo hiểm xã hội 2024",subtitle:"Thay thế Luật BHXH năm 2014",effectiveDate:"01/07/2025"},
      s2:{kind:"pillars",heading:"4 nhóm chính sách chính",pillars:[{title:"Mở rộng đối tượng",body:"Lao động linh hoạt"},{title:"Giảm điều kiện",body:"15 năm hưởng lương hưu"},{title:"Tăng quyền lợi",body:"BHXH một lần hạn chế"},{title:"Cải cách quản lý",body:"Số hóa, rút gọn"}]},
      s3:{kind:"measure",heading:"Thay đổi quan trọng",fromLabel:"Cũ",fromValue:"20 năm",toLabel:"Mới",toValue:"15 năm",unit:"đóng BHXH",note:"Điều kiện hưởng lương hưu"},
      s4:{kind:"detail",heading:"Chi tiết các nhóm chính sách",items:[{title:"Đối tượng tham gia",body:"Lao động hợp đồng,_square菲佣"},{title:"Thuế suất đóng",body:"25.5% lương cơ sở"},{title:"Hưởng chế độ",body:"6 chế độ BHXH bắt buộc"}]},
      s5:{kind:"process",heading:"Lộ trình triển khai",steps:[{date:"01/07/2025",label:"Luật có hiệu lực"},{date:"2025-2026",label:"Triển khai逐步"},{date:"2027",label:"Đánh giá, sửa đổi"}]},
      s6:{kind:"seal",heading:"Luật Bảo hiểm xã hội 2024",lines:["Luật số 41/2024/QH15","Ủy ban Thường vụ Quốc hội ban hành"],closingCode:"41/2024/QH15"},
    },
  },
  {
    id: "cr7Records", name: "CR7 Records", template: "cr7", format: "16:9",
    theme: { bg:"#0c0a09",bg2:"#1c1917",card:"#292524",line:"rgba(255,255,255,0.06)",a1:"#f59e0b",a1s:"#d97706",a2:"#ef4444",a2s:"#dc2626",a3:"#10b981",ink:"#fafaf9",muted:"#a8a29e",fd:'"Inter","Segoe UI",system-ui,sans-serif',fm:'"JetBrains Mono","Fira Code",monospace' },
    scenes: [
      { id:"s1",dur:8,kind:"hero" },{ id:"s2",dur:9,kind:"stat" },{ id:"s3",dur:9,kind:"stat" },
      { id:"s4",dur:8,kind:"stat" },{ id:"s5",dur:10,kind:"milestone" },{ id:"s6",dur:9,kind:"stat" },{ id:"s7",dur:8,kind:"closing" },
    ],
    content: {
      s1:{kind:"hero",name:"CRISTIANO RONALDO",tagline:"THE RECORDS",subtitle:"A career defined by numbers that speak for themselves"},
      s2:{kind:"stat",label:"CAREER GOALS",bigNumber:"900+",sub:"Official goals across all competitions",detail:"The first player in football history to score 900+ official career goals.",color:"a1"},
      s3:{kind:"stat",label:"CHAMPIONS LEAGUE",bigNumber:"140",sub:"All-time top scorer",detail:"More goals than any other player in the history of the competition.",color:"a2"},
      s4:{kind:"stat",label:"INTERNATIONAL GOALS",bigNumber:"136",sub:"All-time men's international top scorer",detail:"More goals for Portugal than any other male player in history.",color:"a3"},
      s5:{kind:"milestone",title:"MAJOR HONOURS",items:[{label:"Ballon d'Or",value:"5"},{label:"Champions League",value:"5"},{label:"European Championship",value:"1"},{label:"League Titles",value:"7"}]},
      s6:{kind:"stat",label:"CAREER SPAN",bigNumber:"20+",sub:"Years at the highest level",detail:"From Sporting CP (2002) to Al Nassr - two decades of elite performance.",color:"a1"},
      s7:{kind:"closing",title:"LEGACY",subtitle:"Records are made to be broken.\nSome records may never be broken.",reference:"Cristiano Ronaldo - The career in numbers"},
    },
  },
  {
    id: "cr7VsMessi", name: "CR7 vs Messi", template: "cr7", format: "16:9",
    theme: { bg:"#0c0a09",bg2:"#1c1917",card:"#292524",line:"rgba(255,255,255,0.06)",a1:"#f59e0b",a1s:"#d97706",a2:"#ef4444",a2s:"#dc2626",a3:"#10b981",ink:"#fafaf9",muted:"#a8a29e",fd:'"Inter","Segoe UI",system-ui,sans-serif',fm:'"JetBrains Mono","Fira Code",monospace' },
    scenes: [
      { id:"s1",dur:8,kind:"hero" },{ id:"s2",dur:9,kind:"stat" },{ id:"s3",dur:9,kind:"stat" },
      { id:"s4",dur:8,kind:"stat" },{ id:"s5",dur:10,kind:"milestone" },{ id:"s6",dur:9,kind:"stat" },{ id:"s7",dur:8,kind:"closing" },
    ],
    content: {
      s1:{kind:"hero",name:"RONALDO vs MESSI",tagline:"THE ETERNAL DEBATE",subtitle:"Two legends. One question. Numbers tell the story."},
      s2:{kind:"stat",label:"CAREER GOALS",bigNumber:"900+",sub:"Ronaldo leads - first to 900 official career goals",detail:"Ronaldo: 900+ goals. Messi: 800+ goals. Both all-time greats.",color:"a1"},
      s3:{kind:"stat",label:"CHAMPIONS LEAGUE",bigNumber:"140",sub:"Ronaldo - all-time top scorer",detail:"Ronaldo: 140 CL goals. Messi: 129 CL goals. Both dominated Europe.",color:"a2"},
      s4:{kind:"stat",label:"BALLON D'OR",bigNumber:"8",sub:"Messi - most in history",detail:"Messi: 8 Ballon d'Or. Ronaldo: 5. Individual brilliance defined an era.",color:"a3"},
      s5:{kind:"milestone",title:"HEAD TO HEAD",items:[{label:"Ronaldo Goals",value:"900+"},{label:"Messi Goals",value:"800+"},{label:"Ronaldo Ballon d'Or",value:"5"},{label:"Messi Ballon d'Or",value:"8"}]},
      s6:{kind:"stat",label:"INTERNATIONAL",bigNumber:"136",sub:"Ronaldo - all-time men's international top scorer",detail:"Ronaldo: 136 for Portugal. Messi: 108 for Argentina. Both won major tournaments.",color:"a1"},
      s7:{kind:"closing",title:"LEGACY",subtitle:"There is no winner. Only two legends\nwho pushed each other to greatness.",reference:"Ronaldo vs Messi - The numbers speak"},
    },
  },
  {
    id: "solarSystem", name: "Solar System", template: "cosmos", format: "16:9",
    theme: { bg:"#050510",bg2:"#0a0a2e",card:"#111133",line:"rgba(255,255,255,0.06)",a1:"#3b82f6",a1s:"#2563eb",a2:"#a855f7",a2s:"#9333ea",a3:"#f8fafc",ink:"#f8fafc",muted:"#94a3b8",fd:'"Inter","Segoe UI",system-ui,sans-serif',fm:'"JetBrains Mono","Fira Code",monospace' },
    scenes: [
      { id:"s1",dur:6.672,kind:"title" },{ id:"s2",dur:9.72,kind:"fact" },{ id:"s3",dur:8.856,kind:"compare" },
      { id:"s4",dur:7.536,kind:"fact" },{ id:"s5",dur:6.648,kind:"diagram" },{ id:"s6",dur:8.784,kind:"timeline" },
      { id:"s7",dur:7.464,kind:"fact" },{ id:"s8",dur:6.0,kind:"compare" },{ id:"s9",dur:7.368,kind:"closing" },
    ],
    content: {
      s1:{kind:"title",title:"HỆ MẶT TRỜI",subtitle:"8 hành tinh, hàng trăm vệ tinh, và vô số bí ẩn",tagline:"KHÁM PHÁ VŨ TRỤ"},
      s2:{kind:"fact",label:"SAO THỦY",bigValue:"88",unit:"ngày Trái Đất",description:"Thời gian quay quanh mặt trời",detail:"Hành tinh nhỏ nhất và gần mặt trời nhất. Bề mặt có nhiệt độ cực đoan: -180°C ban đêm, 430°C ban ngày."},
      s3:{kind:"compare",title:"SAO KIM vs TRÁI ĐẤT",left:{label:"SAO KIM",value:"462°C",color:"#ef4444"},right:{label:"TRÁI ĐẤT",value:"15°C",color:"#3b82f6"},insight:"Sao Kim nóng hơn Trái Đất 347°C do hiệu ứng nhà kính cực mạnh"},
      s4:{kind:"fact",label:"TRÁI ĐẤT",bigValue:"365.25",unit:"ngày",description:"Thời gian quay quanh mặt trời",detail:"Hành tinh duy nhất được biết có sự sống. Bao phủ 71% bởi nước lỏng."},
      s5:{kind:"diagram",title:"HỆ THỐNG SAO HỎA",nodes:[{label:"SAO HỎA",sublabel:"Hành tinh đỏ",orbit:100},{label:"PHOBOS",sublabel:"Vệ tinh lớn",orbit:200},{label:"DEIMOS",sublabel:"Vệ tinh nhỏ",orbit:280}],edges:[{from:0,to:1,label:"9,376 km"},{from:0,to:2,label:"23,460 km"}]},
      s6:{kind:"timeline",title:"CÁC VỆ TINH CỦA SAO MỘC",items:[{label:"Io",value:"Núi lửa",year:"1610"},{label:"Europa",value:"Băng giá",year:"1610"},{label:"Ganymede",value:"Lớn nhất",year:"1610"},{label:"Callisto",value:"Cũ nhất",year:"1610"}]},
      s7:{kind:"fact",label:"SAO THỔ",bigValue:"29.5",unit:"năm Trái Đất",description:"Thời gian quay quanh mặt trời",detail:"Hành tinh có vành đai đẹp nhất. Bao gồm chủ yếu là băng và đá."},
      s8:{kind:"compare",title:"SAO THIÊN VƯƠNG vs SAO HẢI VƯƠNG",left:{label:"SAO THIÊN VƯƠNG",value:"-224°C",color:"#06b6d4"},right:{label:"SAO HẢI VƯƠNG",value:"-214°C",color:"#3b82f6"},insight:"Cả hai đều là hành tinh băng giá xa nhất trong hệ mặt trời"},
      s9:{kind:"closing",title:"HỆ MẶT TRỜI TUYỆT ĐẸP",subtitle:"Từ Sao Thủy nhỏ bé đến Sao Mộc khổng lồ,\nmỗi hành tinh đều có câu chuyện riêng.",stats:[{label:"Hành tinh",value:"8"},{label:"Vệ tinh",value:"200+"},{label:"Tuổi",value:"4.6 tỷ năm"}],reference:"Hệ Mặt Trời — Khám phá vũ trụ"},
    },
  },
  {
    id: "championsLeague", name: "Champions League", template: "scrapbook", format: "16:9",
    theme: { bg:"#f5f0e8",bg2:"#e8e0d0",card:"#ffffff",line:"#d0c8b8",a1:"#c0392b",a1s:"#e74c3c",a2:"#d4a017",a2s:"#f7dc6f",a3:"#1a1a1a",ink:"#1a1a1a",muted:"#666666",fd:'"Georgia","Times New Roman",serif',fm:'"Courier New","Fira Code",monospace' },
    scenes: [
      { id:"hero",dur:5,kind:"hero" },{ id:"match-1999",dur:6,kind:"match" },{ id:"history-2002",dur:6,kind:"history" },
      { id:"photos",dur:5,kind:"photo" },{ id:"timeline",dur:7,kind:"timeline" },{ id:"closing",dur:5,kind:"closing" },
    ],
    content: {
      hero:{kind:"hero",title:"Champions League",subtitle:"The greatest club competition in world football",tagline:"1997 — 2005"},
      "match-1999":{kind:"match",homeTeam:"Manchester United",awayTeam:"Bayern Munich",score:"2 — 1",competition:"UEFA Champions League Final 1999",highlight:"Two goals in injury time — the greatest final ever"},
      "history-2002":{kind:"history",year:"2002",fact:"Zidane's volley",detail:"One of the greatest goals in Champions League history. A left-footed volley from the edge of the box into the top corner.",annotation:"Hampden Park, Glasgow — 22 May 2002"},
      photos:{kind:"photo",caption:"Iconic Moments",annotation:"The moments that defined an era",Polaroid:[{label:"United '99",sublabel:"Treble winners"},{label:"Real Madrid",sublabel:"La Decima era"},{label:"Milan '03",sublabel:"All-Italian final"}]},
      timeline:{kind:"timeline",title:"Champions League Timeline",items:[{label:"1997",value:"Dortmund wins first title",year:"1997"},{label:"1999",value:"United's dramatic comeback",year:"1999"},{label:"2002",value:"Zidane's legendary volley",year:"2002"},{label:"2005",value:"Istanbul — the miracle final",year:"2005"}]},
      closing:{kind:"closing",title:"The Beautiful Game",subtitle:"Moments that live forever in football history",stats:[{label:"Years",value:"1997–2005"},{label:"Goals",value:"847"},{label:"Matches",value:"326"}],reference:"UEFA Champions League Archives"},
    },
  },
  {
    id: "kineticStatement", name: "Kinetic Statement", template: "kineticStatement", format: "9:16",
    theme: { bg:"#0b0d14",bg2:"#1a0b2e",card:"rgba(255,255,255,0.05)",line:"rgba(255,255,255,0.08)",a1:"#ffd166",a1s:"rgba(255,209,102,0.25)",a2:"#3a0ca3",a2s:"rgba(58,12,163,0.25)",a3:"#1c1c1e",ink:"#ffffff",muted:"#9a9aad",fd:"'Inter','Segoe UI',sans-serif",fm:"'JetBrains Mono','Fira Code',monospace" },
    scenes: [
      { id:"s1",dur:3.0,kind:"hook" },{ id:"s2",dur:3.5,kind:"stat" },{ id:"s3",dur:4.0,kind:"quote" },{ id:"s4",dur:2.5,kind:"outro" },
    ],
    content: {
      s1:{kind:"hook",words:["3","GIÂY","ĐẦU","QUYẾT ĐỊNH","TẤT CẢ"]},
      s2:{kind:"stat",value:73,suffix:"%",label:"người xem sẽ lướt qua video của bạn nếu 3 giây đầu không đủ cuốn"},
      s3:{kind:"quote",text:"Một video tốt không cần dài, chỉ cần đúng nhịp và đúng lúc."},
      s4:{kind:"outro",brand:"REMOTION-HTML",tagline:"VIDEO TEMPLATE ENGINE",cta:"Xem thêm mẫu →"},
    },
  },
  {
    id: "bentoGridDemo", name: "AURA Product Showcase", template: "bentoGrid", format: "9:16",
    theme: { bg:"#06050a",bg2:"#0c0a14",card:"rgba(255,255,255,0.055)",line:"rgba(255,255,255,0.13)",a1:"#7c5cff",a1s:"rgba(124,92,255,0.25)",a2:"#ff6bd6",a2s:"rgba(255,107,214,0.25)",a3:"#3ddcff",ink:"#f5f4fa",muted:"rgba(245,244,250,0.65)",fd:"'Inter','Segoe UI',sans-serif",fm:"'Inter','Segoe UI',sans-serif" },
    scenes: [
      { id:"s1",dur:3.0,kind:"hook" },{ id:"s2",dur:5.0,kind:"bento" },{ id:"s3",dur:2.5,kind:"outro" },
    ],
    content: {
      s1:{kind:"hook",line1:"INTRODUCING",line2:"AURA"},
      s2:{kind:"bento",title:"Design System",stat:"2026",feature1:"Glassmorphism",feature2:"Aurora BG",chart:[30,45,60,80,95],quote:"Beyond pixels.",palette:["#7c5cff","#ff6bd6","#3ddcff","#ffb84d"]},
      s3:{kind:"outro",brand:"AURA",tagline:"DESIGN SYSTEM",cta:"Get Started →"},
    },
  },
];

// ─── Composer Project Routing ────────────────────────────────────────────────
// When ?project=<id> is present, load the project from localStorage and
// inject it into PRODUCTIONS as a virtual production. This does NOT
// mutate existing manifest productions.
const COMPOSER_STORAGE_KEY = "composer_projects";
const EDITOR_STORAGE_KEY = "nf_editor_projects";
const STUDIO_STORAGE_KEY = "nf_studio_project";
function loadComposerProjects() {
  try { const r = localStorage.getItem(COMPOSER_STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function loadEditorProjects() {
  try { const r = localStorage.getItem(EDITOR_STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function loadStudioProject() {
  try { const r = localStorage.getItem(STUDIO_STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function composerProjectToProduction(cp) {
  const theme = {
    scrapbook: { bg:"#f5f0e8",bg2:"#e8e0d0",card:"#ffffff",line:"#d0c8b8",a1:"#c0392b",a1s:"#e74c3c",a2:"#d4a017",a2s:"#f7dc6f",a3:"#1a1a1a",ink:"#1a1a1a",muted:"#666666",fd:'"Georgia","Times New Roman",serif',fm:'"Courier New","Fira Code",monospace' },
    cr7: { bg:"#0a0a0a",bg2:"#111111",card:"rgba(255,255,255,0.04)",line:"rgba(255,255,255,0.08)",a1:"#e23b3b",a1s:"#ff6b5e",a2:"#f3c969",a2s:"#ffe6a3",a3:"#5eead4",ink:"#f7f5ef",muted:"#999",fd:'"Inter","Segoe UI",system-ui,sans-serif',fm:'"JetBrains Mono","Fira Code",monospace' },
    cosmos: { bg:"#050510",bg2:"#0a0a2e",card:"#111133",line:"rgba(255,255,255,0.06)",a1:"#3b82f6",a1s:"#2563eb",a2:"#a855f7",a2s:"#9333ea",a3:"#f8fafc",ink:"#f8fafc",muted:"#94a3b8",fd:'"Inter","Segoe UI",system-ui,sans-serif',fm:'"JetBrains Mono","Fira Code",monospace' },
    nodeflow: { bg:"#0a0e1a",bg2:"#0f1525",card:"rgba(255,255,255,0.045)",line:"rgba(245,245,255,0.12)",a1:"#e23b3b",a1s:"#ff6b5e",a2:"#f3c969",a2s:"#ffe6a3",a3:"#5eead4",ink:"#f7f5ef",muted:"#9aa0b5",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    stoiclove: { bg:"#0a0a0c",bg2:"#111114",card:"rgba(255,250,240,0.03)",line:"rgba(210,180,120,0.15)",a1:"#f5e6c8",a1s:"#faf0e0",a2:"#d4a843",a2s:"#e8c56d",a3:"#8b7355",ink:"#faf8f3",muted:"#9a8c7a",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    blueprint: { bg:"#0a1830",bg2:"#0f2145",card:"rgba(224,238,255,0.04)",line:"rgba(224,238,255,0.22)",a1:"#eaf4ff",a1s:"rgba(234,244,255,0.55)",a2:"#e8a33d",a2s:"#f2c27a",a3:"#5b84b8",ink:"#f2f6fb",muted:"#7d93b3",fd:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif",fm:"'Be Vietnam Pro','Segoe UI',system-ui,sans-serif" },
    terminal: { bg:"#000000",bg2:"#0a0a0a",card:"#0d1117",line:"rgba(255,255,255,0.08)",a1:"#00ff66",a1s:"#33ff88",a2:"#00cc55",a2s:"#33ff88",a3:"#ff79c6",ink:"#e6e6e6",muted:"#6272a4",fd:"'Barlow Condensed','Segoe UI',sans-serif",fm:"'JetBrains Mono','Fira Code',monospace" },
    kineticStatement: { bg:"#0b0d14",bg2:"#1a0b2e",card:"rgba(255,255,255,0.05)",line:"rgba(255,255,255,0.08)",a1:"#ffd166",a1s:"rgba(255,209,102,0.25)",a2:"#3a0ca3",a2s:"rgba(58,12,163,0.25)",a3:"#1c1c1e",ink:"#ffffff",muted:"#9a9aad",fd:"'Inter','Segoe UI',sans-serif",fm:"'JetBrains Mono','Fira Code',monospace" },
    bentoGrid: { bg:"#06050a",bg2:"#0c0a14",card:"rgba(255,255,255,0.055)",line:"rgba(255,255,255,0.13)",a1:"#7c5cff",a1s:"rgba(124,92,255,0.25)",a2:"#ff6bd6",a2s:"rgba(255,107,214,0.25)",a3:"#3ddcff",ink:"#f5f4fa",muted:"rgba(245,244,250,0.65)",fd:"'Inter','Segoe UI',sans-serif",fm:"'Inter','Segoe UI',sans-serif" },
  };
  return {
    id: "__composer__" + cp.id,
    name: cp.name + " (Composer)",
    template: cp.template || cp.templateId,
    format: cp.format,
    theme: theme[cp.template || cp.templateId] || theme.nodeflow,
    scenes: cp.scenes.map(s => ({ id: s.id, dur: s.dur || s.duration, kind: s.kind })),
    content: Object.fromEntries(cp.scenes.map(s => [s.id, s.content || {}])),
    _composerProject: true,
  };
}

const urlParams = new URLSearchParams(window.location.search);
const composerProjectId = urlParams.get("project");
let composerProjectIndex;
if (composerProjectId) {
  let cp = loadComposerProjects().find(p => p.id === composerProjectId);
  if (!cp) {
    const editorProjects = loadEditorProjects();
    cp = editorProjects[composerProjectId];
  }
  if (!cp) {
    const studioProj = loadStudioProject();
    if (studioProj && studioProj.id === composerProjectId) cp = studioProj;
  }
  if (cp) {
    const virtualProd = composerProjectToProduction(cp);
    PRODUCTIONS.push(virtualProd);
    composerProjectIndex = PRODUCTIONS.length - 1;
  }
}

function springV(f, fps, cfg = {}) {
  const { damping: z = 18, mass: m = 0.6 } = cfg;
  const x = Math.max(0, f);
  const w = Math.sqrt(z * z / (m * m) + 100);
  const zr = z / (2 * w);
  if (zr < 1) { const wd = w * Math.sqrt(1 - zr * zr); return 1 - Math.exp(-zr * w * x / fps) * (Math.cos(wd * x / fps) + (zr * w / wd) * Math.sin(wd * x / fps)); }
  return 1 - Math.exp(-w * x / fps) * (1 + w * x / fps);
}
function textIn(f, d, fps, dist = 30) { const t = springV(f - d, fps, { damping: 22, mass: 0.4 }); return { opacity: clamp(t), transform: "translateY(" + ((1 - clamp(t)) * dist) + "px)" }; }
function rev(f, d, dur) { return clamp((f - d) / dur); }
function edgeD(f, d, dur = 20) { return rev(f, d, dur); }

function NF_Grid({ frame, W, H, cs = 60, me = 5, color, majorColor }) {
  const lc = color || "rgba(255,255,255,0.08)", mc = majorColor || "#00d4ff";
  const ox = (frame * 0.04) % cs, oy = (frame * 0.02) % cs;
  const cols = Math.ceil(W / cs) + 2, rows = Math.ceil(H / cs) + 2;
  const ls = [];
  for (let i = 0; i < cols; i++) { const x = i * cs - ox; const m = i % me === 0; ls.push(<line key={"v"+i} x1={x} y1={0} x2={x} y2={H} stroke={m ? mc : lc} strokeWidth={m ? 0.5 : 0.25} opacity={m ? 0.2 : 0.12}/>); }
  for (let i = 0; i < rows; i++) { const y = i * cs - oy; const m = i % me === 0; ls.push(<line key={"h"+i} x1={0} y1={y} x2={W} y2={y} stroke={m ? mc : lc} strokeWidth={m ? 0.5 : 0.25} opacity={m ? 0.2 : 0.12}/>); }
  return <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.9}}>{ls}</svg>;
}
function NF_Bg({ frame, W, H, th }) {
  const a = rev(frame, 0, 200), x1 = 10 + Math.sin(frame / 180) * 5, y1 = 8 + Math.cos(frame / 240) * 4;
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(120% 120% at 50% -5%,"+th.bg2+" 0%,"+th.bg+" 55%,#020408 100%)"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(40% 40% at "+x1+"% "+y1+"%,"+th.a1+"18,transparent 70%)",opacity:a*0.7}}/>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(35% 35% at 88% 88%,"+th.a2+"12,transparent 70%)",opacity:a*0.5}}/>
    <NF_Grid frame={frame} W={W} H={H} color={th.line} majorColor={th.a1}/>
  </div>;
}
function NF_EL({ x1, y1, x2, y2, progress, color, sw = 1.5, ah = true }) {
  const c = color || "#00d4ff", p = clamp(progress), len = Math.sqrt((x2-x1)**2+(y2-y1)**2), ang = Math.atan2(y2-y1,x2-x1), ax = x1+Math.cos(ang)*len*p, ay = y1+Math.sin(ang)*len*p, as = 8;
  return <g opacity={0.9}><line x1={x1} y1={y1} x2={x1+(x2-x1)*p} y2={y1+(y2-y1)*p} stroke={c} strokeWidth={sw} strokeLinecap="round" opacity={0.8}/>{ah && p > 0.1 && <polygon points={ax+","+ay+" "+(ax-Math.cos(ang-0.4)*as)+","+(ay-Math.sin(ang-0.4)*as)+" "+(ax-Math.cos(ang+0.4)*as)+","+(ay-Math.sin(ang+0.4)*as)} fill={c} opacity={p}/>}</g>;
}
function NF_SP({ x1, y1, x2, y2, frame, period = 60, color, visible = true }) {
  if (!visible) return null;
  const c = color || "#00d4ff", t = (frame%period)/period, cx = x1+(x2-x1)*t, cy = y1+(y2-y1)*t, o = t<0.08?t/0.08:t>0.9?(1-t)/0.1:1;
  return <g opacity={o}><circle cx={cx} cy={cy} r={9} fill={c} opacity={0.15}/><circle cx={cx} cy={cy} r={3.5} fill={c} opacity={0.9}/></g>;
}
function NF_NB({ x, y, w, h, label, sublabel, active = false, activePct = 1, color, textSize = 14, th }) {
  const c = color || (active?"#00d4ff":"#6b7280"), rx = 8;
  return <g opacity={activePct}><rect x={x} y={y} width={w} height={h} rx={rx} fill={active?c+"14":c+"0a"} stroke={c} strokeWidth={active?1.5:0.8} strokeOpacity={active?0.7:0.25}/><text x={x+w/2} y={sublabel?y+h/2-6:y+h/2+1} textAnchor="middle" dominantBaseline="central" fill={active?th.ink:th.muted} fontSize={textSize} fontWeight={active?700:500} fontFamily={th.fd}>{label}</text>{sublabel && <text x={x+w/2} y={y+h/2+10} textAnchor="middle" dominantBaseline="central" fill={c} fontSize={textSize*0.78} fontWeight={600} fontFamily={th.fm}>{sublabel}</text>}</g>;
}
function NF_SYS({ frame, fps, cx, cy, r = 50, label, sublabel, active = false, activePct = 1, color, beat = false, th }) {
  const c = color || (active?"#00d4ff":"#6b7280"), bs = beat?1+Math.sin((frame/fps)*2.2)*0.025:1;
  return <g opacity={activePct} transform={"translate("+cx+","+cy+") scale("+bs+") translate("+(-cx)+","+(-cy)+")"}><circle cx={cx} cy={cy} r={r+8} fill="none" stroke={c} strokeWidth={0.6} strokeOpacity={0.2} strokeDasharray="3 6"/><circle cx={cx} cy={cy} r={r} fill={c+"30"} stroke={c} strokeWidth={active?2:1} strokeOpacity={active?0.8:0.3}/><circle cx={cx} cy={cy} r={4} fill={c} opacity={active?0.9:0.3}/><text x={cx} y={sublabel?cy-8:cy+1} textAnchor="middle" dominantBaseline="central" fill={active?th.ink:th.muted} fontSize={r*0.28} fontWeight={700} fontFamily={th.fd}>{label}</text>{sublabel && <text x={cx} y={cy+r*0.28+4} textAnchor="middle" dominantBaseline="central" fill={c} fontSize={r*0.2} fontWeight={600} fontFamily={th.fm}>{sublabel}</text>}</g>;
}
function NF_DB({ x, y, value, activePct = 1, color, th }) {
  const c = color || "#d4a843";
  return <g opacity={activePct}><rect x={x-2} y={y-14} width={value.length*11+16} height={22} rx={4} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={0.8} strokeOpacity={0.7}/><text x={x+6} y={y} fill={c} fontSize={13} fontWeight={700} fontFamily={th.fm} dominantBaseline="central">{value}</text></g>;
}
function NF_PB({ x, y, w, h = 24, pct, progress, label, valueLabel, color, th }) {
  const c = color || "#00d4ff", filled = w * pct * progress;
  return <g><rect x={x} y={y} width={w} height={h} rx={4} fill={c} fillOpacity={0.06} stroke={c} strokeWidth={0.8} strokeOpacity={0.25}/><rect x={x+1} y={y+1} width={Math.max(0,filled-2)} height={h-2} rx={3} fill={c} fillOpacity={0.7}/><text x={x+8} y={y+h/2} dominantBaseline="central" fill={th.ink} fontSize={12} fontWeight={600} fontFamily={th.fd}>{label}</text>{valueLabel && <text x={x+w+8} y={y+h/2} dominantBaseline="central" fill={c} fontSize={12} fontWeight={700} fontFamily={th.fm}>{valueLabel}</text>}</g>;
}

function NF_S1({ frame, fps, W, H, content: d, th }) {
  if (!d||!d.lawCode||!d.nodes) return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:th.fd,color:th.muted,fontSize:20}}>S1: {d?.title||"Missing content"}</div></div>;
  const ba = textIn(frame,0,fps), ta = textIn(frame,8,fps,40), sa = textIn(frame,20,fps,30), ta2 = textIn(frame,34,fps,20);
  const nd = [45,60,75].map(d2=>rev(frame,d2,20));
  const e1 = edgeD(frame,90,18), e2 = edgeD(frame,108,18);
  const sig = frame > 120;
  const NW=260,NH=70,NX=[240,W/2-NW/2,W-240-NW],NCX=NX.map(x=>x+NW/2);
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}><g style={ba}><rect x={100} y={80} width={d.lawCode.length*12+30} height={32} rx={4} fill={th.a1} fillOpacity={0.08} stroke={th.a1} strokeWidth={1} strokeOpacity={0.4}/><text x={115} y={100} fill={th.a1} fontSize={14} fontWeight={600} fontFamily={th.fm} letterSpacing={2}>{d.lawCode}</text></g><g style={ta}><text x={100} y={250} fill={th.ink} fontSize={110} fontWeight={900} fontFamily={th.fd} letterSpacing={-3}>{d.title}</text></g><g style={sa}><text x={100} y={310} fill={th.ink} fontSize={36} fontWeight={500} fontFamily={th.fd}>{d.subtitle}</text></g><g style={ta2}><text x={100} y={360} fill={th.muted} fontSize={18} fontWeight={600} fontFamily={th.fm} letterSpacing={4}>{d.tagline}</text></g><NF_EL x1={NCX[0]} y1={35} x2={NCX[1]} y2={35} progress={e1} color={th.line} sw={1.2} ah={false}/><NF_EL x1={NCX[1]} y1={35} x2={NCX[2]} y2={35} progress={e2} color={th.line} sw={1.2} ah={false}/><NF_SP x1={NCX[0]} y1={35} x2={NCX[1]} y2={35} frame={frame} period={55} color={th.a1} visible={sig}/><NF_SP x1={NCX[1]} y1={35} x2={NCX[2]} y2={35} frame={frame-20} period={55} color={th.a1} visible={sig}/>{d.nodes.map((n,i)=><NF_NB key={i} x={NX[i]} y={820} w={NW} h={NH} label={n.label} sublabel={n.role} active={nd[i]>0.5} activePct={nd[i]} color={[th.a3,th.a1,th.a2][i]} textSize={16} th={th}/>)}</svg></div>;
}
function NF_S2({ frame, fps, W, H, content: d, th }) {
  if (!d||!d.edges||!d.flowNodes) return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:th.fd,color:th.muted,fontSize:20}}>S2: {d?.title||"Missing content"}</div></div>;
  const ta = textIn(frame,0,fps,30), da = textIn(frame,12,fps,25);
  const nd = [15,28,42].map(d2=>rev(frame,d2,22));
  const et = d.edges.map((_,i)=>edgeD(frame,65+i*25,22));
  const np = [{cx:210,cy:160,r:88},{cx:670,cy:160,r:88},{cx:440,cy:500,r:98}];
  const nc = [th.a1,th.a2,th.a3];
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:0,left:0,bottom:0,width:820,display:"flex",flexDirection:"column",justifyContent:"center",paddingLeft:100,paddingRight:60,paddingTop:80,paddingBottom:80}}><div style={{fontFamily:th.fm,fontWeight:600,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Co che hoat dong</div><div style={ta}><div style={{fontFamily:th.fd,fontWeight:800,fontSize:56,lineHeight:1.15,color:th.ink,marginBottom:24}}>{d.title}</div></div><div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,"+th.a1+"80,transparent)",opacity:0.3,margin:"16px 0"}}/><div style={da}>{d.description.map((l,i)=><div key={i} style={{fontFamily:th.fd,fontSize:26,lineHeight:1.6,color:i===0?th.ink:th.muted,marginBottom:8}}>{l}</div>)}</div><div style={{marginTop:32,display:"flex",flexDirection:"column",gap:10}}>{d.flowNodes.map((n,i)=><div key={i} style={{opacity:nd[i],display:"flex",alignItems:"center",gap:12,fontFamily:th.fd,fontSize:20,color:nc[i],fontWeight:600}}><span style={{width:10,height:10,borderRadius:"50%",background:nc[i],display:"inline-block"}}/>{n.label}{n.rate && <span style={{fontFamily:th.fm,fontSize:15,color:th.muted}}> - {n.rate}</span>}</div>)}</div></div><svg width={880} height={680} viewBox="0 0 880 680" style={{position:"absolute",right:60,top:"50%",transform:"translateY(-50%)",overflow:"visible"}}>{d.edges.map((e,i)=>{const f=np[e.from],t=np[e.to];return <g key={i}><NF_EL x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy} progress={et[i]} color={nc[e.from]} sw={2}/>{et[i]>0.5 && <NF_DB x={(f.cx+t.cx)/2-10} y={(f.cy+t.cy)/2-10} value={e.label} activePct={et[i]} color={nc[e.from]} th={th}/>}</g>})}{d.flowNodes.map((n,i)=><NF_SYS key={i} frame={frame} fps={fps} cx={np[i].cx} cy={np[i].cy} r={np[i].r} label={n.label} sublabel={n.sublabel} active={nd[i]>0.5} activePct={nd[i]} color={nc[i]} th={th}/>)}</svg></div>;
}
function NF_S3({ frame, fps, W, H, content: d, th }) {
  if (!d||!d.rows) return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:th.fd,color:th.muted,fontSize:20}}>S3: {d?.title||"Missing content"}</div></div>;
  const ta = textIn(frame,0,fps,30);
  const rr = d.rows.map((_,i)=>rev(frame,15+i*20,18));
  const bf = d.rows.map((_,i)=>rev(frame,30+i*20,30));
  const tr = rev(frame,15+d.rows.length*20+10,25);
  const BX=100,BW=840,BH=48,RG=72,CY=160;
  const rc = [th.a2,th.a1,th.a3];
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:80,left:100,right:100}}><div style={ta}><div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Ty le dong gop</div><div style={{fontFamily:th.fd,fontWeight:800,fontSize:60,lineHeight:1.1,color:th.ink}}>{d.title}</div></div></div><svg width={1720} height={900} viewBox="0 0 1720 900" style={{position:"absolute",left:100,top:200,pointerEvents:"none"}}>{d.rows.map((row,i)=>{const y=CY-60+i*RG,c=rc[i%rc.length];return <g key={i} opacity={rr[i]}><text x={0} y={y-8} fill={c} fontSize={15} fontWeight={700} fontFamily={th.fm} letterSpacing={2}>{row.party.toUpperCase()}</text><NF_PB x={BX} y={y} w={BW} h={BH} pct={row.pct} progress={bf[i]} label={row.type} valueLabel={row.rateLabel} color={c} th={th}/><NF_DB x={BX+BW*row.pct*bf[i]+16} y={y+BH/2-6} value={row.rateLabel} activePct={bf[i]>0.4?(bf[i]-0.4)/0.6:0} color={c} th={th}/></g>})}<g opacity={tr}><rect x={BX} y={CY-60+d.rows.length*RG+20} width={BW+80} height={64} rx={6} fill={th.a2} fillOpacity={0.08} stroke={th.a2} strokeWidth={1} strokeOpacity={0.5}/><text x={BX+16} y={CY-60+d.rows.length*RG+54} fill={th.ink} fontSize={20} fontWeight={700} fontFamily={th.fd}>{d.totalLabel}</text><text x={BX+BW-20} y={CY-60+d.rows.length*RG+54} textAnchor="end" fill={th.a2} fontSize={28} fontWeight={900} fontFamily={th.fm}>{d.totalValue}</text></g></svg></div>;
}
function NF_S4({ frame, fps, W, H, content: d, th }) {
  if (!d||!d.benefits) return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:th.fd,color:th.muted,fontSize:20}}>S4: {d?.title||"Missing content"}</div></div>;
  const ta = textIn(frame,0,fps,30), da = textIn(frame,12,fps,25);
  const cr = d.benefits.map((_,i)=>rev(frame,20+i*22,25));
  const CW=760,CH=60,CG=76,CX=80,IS=44;
  const cc = [th.a3,th.a1,th.a2];
  const SH = d.benefits.length*CG+60;
  const IC={pension:"M8 4 L8 16 M4 8 L12 8 M4 12 L12 12",health:"M6 12 L10 12 M8 10 L8 14",maternity:"M8 4 A3 3 0 0 1 14 4 L14 10 A6 6 0 0 1 2 10 L2 4",work:"M2 14 L8 2 L14 14 Z",unemployment:"M2 10 L8 4 L14 10 L14 14 L2 14 Z",death:"M8 2 L8 14 M4 6 L12 6"};
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:0,left:0,bottom:0,width:700,display:"flex",flexDirection:"column",justifyContent:"center",paddingLeft:100,paddingRight:60,paddingTop:80,paddingBottom:80}}><div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Quyen loi nguoi lao dong</div><div style={ta}><div style={{fontFamily:th.fd,fontWeight:800,fontSize:52,lineHeight:1.15,color:th.ink,marginBottom:20}}>{d.title}</div></div><div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,"+th.a1+"80,transparent)",opacity:0.3,margin:"16px 0"}}/><div style={da}><div style={{fontFamily:th.fd,fontSize:24,lineHeight:1.6,color:th.muted}}>{d.description}</div></div></div><svg width={900} height={SH} viewBox={"0 0 900 "+SH} style={{position:"absolute",right:60,top:"50%",transform:"translateY(-"+SH/2+"px)",overflow:"visible"}}><NF_EL x1={60} y1={CH/2} x2={60} y2={(d.benefits.length-1)*CG+CH/2} progress={cr[Math.min(2,d.benefits.length-1)]} color={th.line} sw={1} ah={false}/>{d.benefits.map((b,i)=>{const y=i*CG,c=cc[i%cc.length];return <g key={i} opacity={cr[i]}><g transform={"translate(36 "+(y+(CH-IS)/2)+")"}><circle cx={IS/2} cy={IS/2} r={IS/2} fill={c} fillOpacity={0.1} stroke={c} strokeWidth={1} strokeOpacity={0.5}/><g transform={"translate("+(IS/2-8)+" "+(IS/2-8)+")"} stroke={c} strokeWidth={1.5} fill="none" strokeLinecap="round"><path d={IC[b.icon]||IC.work}/></g></g><text x={CX+IS+16} y={y+CH/2-8} fill={th.ink} fontSize={18} fontWeight={700} fontFamily={th.fd}>{b.label}</text>{b.value && <text x={CX+IS+16} y={y+CH/2+12} fill={c} fontSize={15} fontWeight={600} fontFamily={th.fm}>{b.value}</text>}</g>})}</svg></div>;
}
function NF_S5({ frame, fps, W, H, content: d, th }) {
  if (!d||!d.before||!d.after) return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:th.fd,color:th.muted,fontSize:20}}>S5: {d?.title||"Missing content"}</div></div>;
  const ta = textIn(frame,0,fps,30);
  const lr = rev(frame,10,25), rr = rev(frame,30,25), dr = edgeD(frame,20,20), br = rev(frame,60,20);
  const CW=700,CH=70,CG=90,LX=80,RX=940,SY=80;
  const mx = Math.max(d.before.items.length,d.after.items.length);
  const SH = mx*CG+160;
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:60,left:100,right:100,...ta}}><div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Thay doi quan trong</div><div style={{fontFamily:th.fd,fontWeight:800,fontSize:56,color:th.ink,lineHeight:1.1}}>{d.title}</div></div><svg width={1720} height={SH+40} viewBox={"0 0 1720 "+(SH+40)} style={{position:"absolute",left:100,top:200,overflow:"visible"}}><g opacity={lr}><text x={LX+CW/2} y={30} textAnchor="middle" fill={th.muted} fontSize={18} fontWeight={700} fontFamily={th.fm} letterSpacing={3}>LUAT CU</text><line x1={LX} y1={48} x2={LX+CW} y2={48} stroke={th.muted} strokeWidth={1} strokeOpacity={0.3}/></g><g opacity={rr}><text x={RX+CW/2} y={30} textAnchor="middle" fill={th.a1} fontSize={18} fontWeight={700} fontFamily={th.fm} letterSpacing={3}>LUAT MOI 2024</text><line x1={RX} y1={48} x2={RX+CW} y2={48} stroke={th.a1} strokeWidth={1.5} strokeOpacity={0.5}/></g><NF_EL x1={CW+LX+40} y1={0} x2={CW+LX+40} y2={SH} progress={dr} color={th.line} sw={1} ah={false}/>{d.before.items.map((it,i)=><g key={i} opacity={lr}><NF_NB x={LX} y={SY+i*CG} w={CW} h={CH} label={it.label} sublabel={it.value} active={false} activePct={1} color={th.muted} textSize={17} th={th}/></g>)}{d.after.items.map((it,i)=><g key={i} opacity={rr}><NF_NB x={RX} y={SY+i*CG} w={CW} h={CH} label={it.label} sublabel={it.value} active={true} activePct={1} color={it.highlight?th.a2:th.a1} textSize={17} th={th}/>{it.highlight && <NF_DB x={RX+CW+8} y={SY+i*CG+CH/2-8} value="MOI" activePct={br} color={th.a2} th={th}/>}</g>)}</svg></div>;
}
function NF_S6({ frame, fps, W, H, content: d, th }) {
  if (!d||!d.stats) return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:th.fd,color:th.muted,fontSize:20}}>S6: {d?.title||d?.closingTitle||"Missing content"}</div></div>;
  const ta = textIn(frame,5,fps,40), sa = textIn(frame,22,fps,30), ra = textIn(frame,80,fps,20);
  const sr = d.stats.map((_,i)=>rev(frame,40+i*18,22));
  const nr = rev(frame,0,25), er = rev(frame,20,20);
  const sig = frame > 35;
  const ncx=[W*0.12,W*0.88,W*0.5], ncy=[H*0.35,H*0.35,H*0.7];
  const nc = [th.a3,th.a2,th.a1];
  const SW=400,SH2=110,SY=H-230;
  const SXS=[W/2-SW*1.5-30,W/2-SW/2,W/2+SW/2+30];
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>{[[0,1],[1,2],[0,2]].map(([a,b],i)=><g key={i}><NF_EL x1={ncx[a]} y1={ncy[a]} x2={ncx[b]} y2={ncy[b]} progress={er} color={nc[a]} sw={1.5} ah={false}/><NF_SP x1={ncx[a]} y1={ncy[a]} x2={ncx[b]} y2={ncy[b]} frame={frame-i*18} period={80} color={nc[a]} visible={sig}/></g>)}{[0,1,2].map(i=><NF_SYS key={i} frame={frame} fps={fps} cx={ncx[i]} cy={ncy[i]} r={70} label={["NHA NUOC","DOANH NGHIEP","NGUOI LAO DONG"][i]} active={true} activePct={nr} color={nc[i]} beat={i===2} th={th}/>)}{d.stats.map((s,i)=><NF_NB key={i} x={SXS[i]} y={SY} w={SW} h={SH2} label={s.label} sublabel={s.value} active={true} activePct={sr[i]} color={nc[i]} textSize={17} th={th}/>)}</svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none",paddingTop:60,paddingBottom:280}}><div style={ta}><div style={{fontFamily:th.fd,fontWeight:900,fontSize:80,lineHeight:1.1,textAlign:"center",letterSpacing:-2,background:"linear-gradient(135deg,"+th.a1+","+th.a1s+" 40%,"+th.a2+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{d.closingTitle}</div></div><div style={sa}><div style={{fontFamily:th.fd,fontWeight:500,fontSize:32,color:th.muted,textAlign:"center",marginTop:16,maxWidth:900,lineHeight:1.4}}>{d.closingSubtitle}</div></div><div style={{...ra,marginTop:20}}><div style={{fontFamily:th.fm,fontWeight:600,fontSize:16,letterSpacing:3,color:th.muted}}>{d.reference}</div></div></div></div>;
}
const NF_SCENES = { title: NF_S1, flow: NF_S2, contribution: NF_S3, benefit: NF_S4, compare: NF_S5, end: NF_S6 };

function CR7_Hero({ frame, fps, W, H, content: d, th }) {
  const na = textIn(frame,0,fps,50), ta = textIn(frame,15,fps,40), sa = textIn(frame,30,fps,30);
  const pulse = 0.03 * Math.sin((frame/fps)*1.8);
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,"+th.bg2+" 0%,"+th.bg+" 60%,#050403 100%)"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(50% 50% at 50% 45%,"+th.a1+"10,transparent 70%)"}}/>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{...na,fontFamily:th.fm,fontSize:14,letterSpacing:8,textTransform:"uppercase",color:th.a1,marginBottom:24}}>{d.tagline}</div>
      <div style={{...ta,fontFamily:th.fd,fontWeight:900,fontSize:120,lineHeight:1.0,textAlign:"center",letterSpacing:-4,color:th.ink,transform:"scale("+(1+pulse)+")"}}>{d.name}</div>
      <div style={{width:120,height:2,background:"linear-gradient(90deg,transparent,"+th.a1+",transparent)",margin:"32px 0",opacity:0.6}}/>
      <div style={{...sa,fontFamily:th.fd,fontSize:26,color:th.muted,textAlign:"center",maxWidth:600,lineHeight:1.5}}>{d.subtitle}</div>
    </div>
  </div>;
}
function CR7_Stat({ frame, fps, W, H, content: d, th }) {
  const la = textIn(frame,0,fps,20), na = textIn(frame,8,fps,60), sa = textIn(frame,20,fps,25), da = textIn(frame,35,fps,20);
  const c = th[d.color] || th.a1;
  const scale = 1 + 0.02 * Math.sin((frame/fps)*2);
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,"+th.bg2+" 0%,"+th.bg+" 60%,#050403 100%)"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(40% 40% at 75% 40%,"+c+"08,transparent 70%)"}}/>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...la,fontFamily:th.fm,fontSize:14,letterSpacing:6,textTransform:"uppercase",color:c,marginBottom:16}}>{d.label}</div>
      <div style={{...na,fontFamily:th.fd,fontWeight:900,fontSize:200,lineHeight:1.0,color:th.ink,textAlign:"center",transform:"scale("+scale+")",textShadow:"0 0 80px "+c+"30"}}>{d.bigNumber}</div>
      <div style={{width:80,height:2,background:c,margin:"24px 0",opacity:0.5}}/>
      <div style={{...sa,fontFamily:th.fd,fontSize:28,color:th.muted,textAlign:"center",maxWidth:700,lineHeight:1.4}}>{d.sub}</div>
      <div style={{...da,fontFamily:th.fd,fontSize:20,color:th.muted+"99",textAlign:"center",maxWidth:600,lineHeight:1.5,marginTop:16}}>{d.detail}</div>
    </div>
  </div>;
}
function CR7_Milestone({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30);
  const items = d.items.map((_,i)=>textIn(frame,12+i*15,fps,40));
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,"+th.bg2+" 0%,"+th.bg+" 60%,#050403 100%)"}}>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...ta,fontFamily:th.fm,fontSize:14,letterSpacing:6,textTransform:"uppercase",color:th.a1,marginBottom:48}}>{d.title}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,maxWidth:800}}>
        {d.items.map((it,i)=><div key={i} style={{...items[i],display:"flex",flexDirection:"column",alignItems:"center",padding:32,background:th.card+"80",borderRadius:12,border:"1px solid "+th.line}}>
          <div style={{fontFamily:th.fd,fontWeight:900,fontSize:72,color:th.a1,lineHeight:1}}>{it.value}</div>
          <div style={{fontFamily:th.fd,fontSize:18,color:th.muted,marginTop:12,textAlign:"center"}}>{it.label}</div>
        </div>)}
      </div>
    </div>
  </div>;
}
function CR7_Closing({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,5,fps,40), sa = textIn(frame,20,fps,30), ra = textIn(frame,40,fps,20);
  const pulse = 0.015 * Math.sin((frame/fps)*1.5);
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,"+th.bg2+" 0%,"+th.bg+" 60%,#050403 100%)"}}>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{...ta,fontFamily:th.fd,fontWeight:900,fontSize:100,lineHeight:1.1,textAlign:"center",letterSpacing:-3,background:"linear-gradient(135deg,"+th.a1+","+th.a2+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",transform:"scale("+(1+pulse)+")"}}>{d.title}</div>
      <div style={{width:120,height:2,background:"linear-gradient(90deg,transparent,"+th.a1+",transparent)",margin:"32px 0",opacity:0.6}}/>
      <div style={{...sa,fontFamily:th.fd,fontSize:28,color:th.muted,textAlign:"center",maxWidth:700,lineHeight:1.6,whiteSpace:"pre-line"}}>{d.subtitle}</div>
      <div style={{...ra,fontFamily:th.fm,fontSize:16,letterSpacing:3,color:th.muted+"88",marginTop:24}}>{d.reference}</div>
    </div>
  </div>;
}
const CR7_SCENES = { hero: CR7_Hero, stat: CR7_Stat, milestone: CR7_Milestone, closing: CR7_Closing };

// ─── Cosmos Scene Renderers ──────────────────────────────────────────────────

function Cosmos_Title({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,50), sa = textIn(frame,15,fps,40), na = textIn(frame,30,fps,30);
  const pulse = 0.02 * Math.sin((frame/fps)*1.5);
  const stars = Array.from({length:50},(_,i)=>({x:(i*137.508)%100,y:(i*73.137)%100,size:1+(i%3),twinkle:0.4+0.6*Math.abs(Math.sin((frame/fps)*(0.5+(i%3)*0.3)*2))}));
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,#0a0a2e 0%,#050510 60%,#000005 100%)"}}>
    {stars.map((s,i)=><div key={i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",width:s.size,height:s.size,borderRadius:"50%",background:"#fff",opacity:s.twinkle}}/>)}
    <div style={{position:"absolute",inset:0,background:"radial-gradient(50% 50% at 50% 45%,"+th.a1+"15,transparent 70%)"}}/>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{...na,fontFamily:th.fm,fontSize:14,letterSpacing:8,textTransform:"uppercase",color:th.a1,marginBottom:24}}>{d.tagline}</div>
      <div style={{...ta,fontFamily:th.fd,fontWeight:900,fontSize:100,lineHeight:1.0,textAlign:"center",letterSpacing:-3,color:th.ink,transform:"scale("+(1+pulse)+")"}}>{d.title}</div>
      <div style={{width:120,height:2,background:"linear-gradient(90deg,transparent,"+th.a1+",transparent)",margin:"32px 0",opacity:0.6}}/>
      <div style={{...sa,fontFamily:th.fd,fontSize:26,color:th.muted,textAlign:"center",maxWidth:600,lineHeight:1.5}}>{d.subtitle}</div>
    </div>
  </div>;
}
function Cosmos_Fact({ frame, fps, W, H, content: d, th }) {
  const la = textIn(frame,0,fps,20), va = textIn(frame,8,fps,60), ua = textIn(frame,15,fps,30), da = textIn(frame,25,fps,25), ra = textIn(frame,35,fps,20);
  const pulse = 0.015 * Math.sin((frame/fps)*2);
  const o1x = Math.cos(((frame/fps)/8)*Math.PI*2)*180, o1y = Math.sin(((frame/fps)/8)*Math.PI*2)*180;
  const o2x = Math.cos(((frame/fps)/12)*Math.PI*2+Math.PI/3)*220, o2y = Math.sin(((frame/fps)/12)*Math.PI*2+Math.PI/3)*220;
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,#0a0a2e 0%,#050510 60%,#000005 100%)"}}>
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>
      <circle cx={W/2} cy={H/2} r={180} fill="none" stroke={th.a1} strokeWidth="0.5" strokeOpacity="0.3"/>
      <circle cx={W/2} cy={H/2} r={220} fill="none" stroke={th.a2} strokeWidth="0.5" strokeOpacity="0.2"/>
      <circle cx={W/2+o1x} cy={H/2+o1y} r="4" fill={th.a1} opacity="0.8"/>
      <circle cx={W/2+o2x} cy={H/2+o2y} r="3" fill={th.a2} opacity="0.6"/>
    </svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...la,fontFamily:th.fm,fontSize:14,letterSpacing:6,textTransform:"uppercase",color:th.a1,marginBottom:16}}>{d.label}</div>
      <div style={{...va,fontFamily:th.fd,fontWeight:900,fontSize:180,lineHeight:1.0,color:th.ink,textAlign:"center",transform:"scale("+(1+pulse)+")",textShadow:"0 0 80px "+th.a1+"30"}}>{d.bigValue}</div>
      <div style={{...ua,fontFamily:th.fm,fontSize:24,color:th.a1,marginBottom:24}}>{d.unit}</div>
      <div style={{width:80,height:2,background:th.a1,margin:"0 0 24px 0",opacity:0.5}}/>
      <div style={{...da,fontFamily:th.fd,fontSize:28,color:th.muted,textAlign:"center",maxWidth:700,lineHeight:1.4}}>{d.description}</div>
      <div style={{...ra,fontFamily:th.fd,fontSize:20,color:th.muted+"99",textAlign:"center",maxWidth:600,lineHeight:1.5,marginTop:16}}>{d.detail}</div>
    </div>
  </div>;
}
function Cosmos_Compare({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30), la = textIn(frame,15,fps,40), ra = textIn(frame,25,fps,40), ia = textIn(frame,45,fps,25);
  const lp = rev(frame,20,30);
  const lc = d.left.color||th.a1, rc = d.right.color||th.a2;
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,#0a0a2e 0%,#050510 60%,#000005 100%)"}}>
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>
      <line x1="480" y1={H/2} x2={480+(W-960)*lp} y2={H/2} stroke={th.line} strokeWidth="1" strokeDasharray="4 8" opacity="0.4"/>
      <circle cx={W/2} cy={H/2} r={6*lp} fill={th.a3} opacity={lp*0.8}/>
    </svg>
    <div style={{position:"absolute",top:80,left:100,right:100,...ta}}>
      <div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>So sánh</div>
      <div style={{fontFamily:th.fd,fontWeight:800,fontSize:56,color:th.ink,lineHeight:1.1}}>{d.title}</div>
    </div>
    <div style={{position:"absolute",left:100,top:300,width:700,...la}}>
      <div style={{fontFamily:th.fm,fontSize:14,letterSpacing:4,textTransform:"uppercase",color:lc,marginBottom:12}}>{d.left.label}</div>
      <div style={{fontFamily:th.fd,fontWeight:900,fontSize:72,color:th.ink,lineHeight:1.0}}>{d.left.value}</div>
    </div>
    <div style={{position:"absolute",right:100,top:300,width:700,textAlign:"right",...ra}}>
      <div style={{fontFamily:th.fm,fontSize:14,letterSpacing:4,textTransform:"uppercase",color:rc,marginBottom:12}}>{d.right.label}</div>
      <div style={{fontFamily:th.fd,fontWeight:900,fontSize:72,color:th.ink,lineHeight:1.0}}>{d.right.value}</div>
    </div>
    <div style={{position:"absolute",bottom:120,left:100,right:100,textAlign:"center",...ia}}>
      <div style={{fontFamily:th.fd,fontSize:24,color:th.muted,lineHeight:1.5}}>{d.insight}</div>
    </div>
  </div>;
}
function Cosmos_Timeline({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30);
  const tw=1400,tx=260,ty=H/2,ns=tw/(d.items.length+1);
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,#0a0a2e 0%,#050510 60%,#000005 100%)"}}>
    <div style={{position:"absolute",top:80,left:100,right:100,...ta}}>
      <div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Dòng thời gian</div>
      <div style={{fontFamily:th.fd,fontWeight:800,fontSize:56,color:th.ink,lineHeight:1.1}}>{d.title}</div>
    </div>
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>
      <line x1={tx} y1={ty} x2={tx+tw} y2={ty} stroke={th.line} strokeWidth="2" opacity="0.4"/>
      <line x1={tx} y1={ty} x2={tx+tw*rev(frame,10,60)} y2={ty} stroke={th.a1} strokeWidth="2" opacity="0.8"/>
      {d.items.map((it,i)=>{const nx=tx+ns*(i+1),nd=15+i*12,np=rev(frame,nd,15),ac=frame>=nd;return <g key={i} opacity={np}>
        <circle cx={nx} cy={ty} r={ac?12:8} fill={ac?th.a1:th.card} stroke={th.a1} strokeWidth="2"/>
        <text x={nx} y={ty-40} textAnchor="middle" fill={th.ink} fontSize="16" fontWeight="700" fontFamily={th.fd}>{it.label}</text>
        <text x={nx} y={ty+50} textAnchor="middle" fill={th.a1} fontSize="20" fontWeight="700" fontFamily={th.fm}>{it.value}</text>
        {it.year&&<text x={nx} y={ty+80} textAnchor="middle" fill={th.muted} fontSize="14" fontFamily={th.fm}>{it.year}</text>}
      </g>})}
    </svg>
  </div>;
}
function Cosmos_Diagram({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30);
  const cx=W/2,cy=H/2;
  const np=d.nodes.map((n,i)=>{const o=n.orbit||200,a=(i/d.nodes.length)*Math.PI*2-Math.PI/2;return{x:cx+Math.cos(a)*o,y:cy+Math.sin(a)*o,o}});
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,#0a0a2e 0%,#050510 60%,#000005 100%)"}}>
    <div style={{position:"absolute",top:80,left:100,right:100,...ta}}>
      <div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Sơ đồ hệ thống</div>
      <div style={{fontFamily:th.fd,fontWeight:800,fontSize:56,color:th.ink,lineHeight:1.1}}>{d.title}</div>
    </div>
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>
      {d.edges.map((e,i)=>{const f=np[e.from],t=np[e.to];if(!f||!t)return null;const p=rev(frame,20+i*10,20);return <g key={i}>
        <line x1={f.x} y1={f.y} x2={f.x+(t.x-f.x)*p} y2={f.y+(t.y-f.y)*p} stroke={th.a1} strokeWidth="1.5" strokeOpacity="0.6"/>
        {p>0.5&&<text x={(f.x+t.x)/2} y={(f.y+t.y)/2-10} textAnchor="middle" fill={th.muted} fontSize="12" fontFamily={th.fm}>{e.label}</text>}
      </g>})}
      {d.nodes.map((n,i)=>{const p=np[i],pr=rev(frame,10+i*8,15),ac=frame>=10+i*8;return <g key={i} opacity={pr}>
        <circle cx={cx} cy={cy} r={p.o} fill="none" stroke={th.line} strokeWidth="0.5" strokeDasharray="4 8" opacity="0.2"/>
        <circle cx={p.x} cy={p.y} r={ac?40:30} fill={ac?th.a1+"20":th.card} stroke={th.a1} strokeWidth="1.5" strokeOpacity={ac?0.8:0.3}/>
        <text x={p.x} y={p.y-6} textAnchor="middle" fill={ac?th.ink:th.muted} fontSize="14" fontWeight="700" fontFamily={th.fd}>{n.label}</text>
        {n.sublabel&&<text x={p.x} y={p.y+12} textAnchor="middle" fill={th.a1} fontSize="11" fontWeight="600" fontFamily={th.fm}>{n.sublabel}</text>}
      </g>})}
      <circle cx={cx} cy={cy} r="8" fill={th.a1} opacity="0.8"/>
    </svg>
  </div>;
}
function Cosmos_Closing({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,5,fps,40), sa = textIn(frame,20,fps,30), ra = textIn(frame,40,fps,20);
  const pulse = 0.015 * Math.sin((frame/fps)*1.5);
  const cp = rev(frame,10,40);
  const stars = Array.from({length:30},(_,i)=>({x:(i*137.508)%100,y:(i*73.137)%100,size:1+(i%2),twinkle:0.4+0.6*Math.abs(Math.sin((frame/fps)*(0.5+(i%3)*0.3)*2))}));
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,#0a0a2e 0%,#050510 60%,#000005 100%)"}}>
    {stars.map((s,i)=><div key={i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",width:s.size,height:s.size,borderRadius:"50%",background:"#fff",opacity:s.twinkle}}/>)}
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}>
      <line x1="200" y1="200" x2={200+300*cp} y2={200+100*cp} stroke={th.a1} strokeWidth="0.5" strokeOpacity="0.3"/>
      <line x1={W-200} y1="200" x2={W-200-300*cp} y2={200+100*cp} stroke={th.a2} strokeWidth="0.5" strokeOpacity="0.3"/>
      <line x1="200" y1={H-200} x2={200+300*cp} y2={H-200-100*cp} stroke={th.a3} strokeWidth="0.5" strokeOpacity="0.3"/>
      <line x1={W-200} y1={H-200} x2={W-200-300*cp} y2={H-200-100*cp} stroke={th.a1} strokeWidth="0.5" strokeOpacity="0.3"/>
    </svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      {d.stats.length>0&&<div style={{display:"flex",gap:48,marginBottom:48}}>
        {d.stats.map((s,i)=>{const sa2=textIn(frame,15+i*10,fps,30);return <div key={i} style={{...sa2,display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 32px",background:th.card+"80",borderRadius:12,border:"1px solid "+th.line}}>
          <div style={{fontFamily:th.fd,fontWeight:900,fontSize:48,color:th.a1,lineHeight:1}}>{s.value}</div>
          <div style={{fontFamily:th.fd,fontSize:16,color:th.muted,marginTop:8}}>{s.label}</div>
        </div>})}
      </div>}
      <div style={{...ta,fontFamily:th.fd,fontWeight:900,fontSize:80,lineHeight:1.1,textAlign:"center",letterSpacing:-2,background:"linear-gradient(135deg,"+th.a1+","+th.a2+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",transform:"scale("+(1+pulse)+")"}}>{d.title}</div>
      <div style={{width:120,height:2,background:"linear-gradient(90deg,transparent,"+th.a1+",transparent)",margin:"32px 0",opacity:0.6}}/>
      <div style={{...sa,fontFamily:th.fd,fontSize:28,color:th.muted,textAlign:"center",maxWidth:700,lineHeight:1.6,whiteSpace:"pre-line"}}>{d.subtitle}</div>
      <div style={{...ra,fontFamily:th.fm,fontSize:16,letterSpacing:3,color:th.muted+"88",marginTop:24}}>{d.reference}</div>
    </div>
  </div>;
}
const COSMOS_SCENES = { title: Cosmos_Title, fact: Cosmos_Fact, compare: Cosmos_Compare, timeline: Cosmos_Timeline, diagram: Cosmos_Diagram, closing: Cosmos_Closing };

// ─── Scrapbook Scene Renderers ───────────────────────────────────────────────

function Scrapbook_Hero({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,40), sa = textIn(frame,15,fps,30), tag = textIn(frame,30,fps,20);
  const hw = highlightSwipe(frame,10,30);
  const hr = handwrittenReveal(frame,20,40);
  return <div style={{position:"absolute",inset:0,background:"#f5f0e8"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 20%,rgba(200,180,150,0.15) 0%,transparent 50%)"}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"rgba(0,0,0,0.05)",display:"flex"}}>
      {Array.from({length:6},(_,i)=><div key={i} style={{flex:1,height:"100%",background:i<=0?"#c0392b":"transparent"}}/>)}
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...tag,fontFamily:"Courier New, monospace",fontSize:14,letterSpacing:6,textTransform:"uppercase",color:"#c0392b",marginBottom:24}}>{d.tagline}</div>
      <div style={{...ta,fontFamily:"Georgia, serif",fontWeight:900,fontSize:96,lineHeight:1.0,textAlign:"center",letterSpacing:-2,color:"#1a1a1a",position:"relative"}}>
        {d.title}
        <div style={{position:"absolute",bottom:-8,left:0,width:hw+"%",height:12,background:"#f7dc6f",opacity:0.7}}/>
      </div>
      <div style={{width:120,height:2,background:"linear-gradient(90deg,transparent,#1a1a1a,transparent)",margin:"32px 0",opacity:0.3}}/>
      <div style={{...sa,fontFamily:"Georgia, serif",fontSize:24,color:"#666666",textAlign:"center",maxWidth:600,lineHeight:1.5}}>{d.subtitle}</div>
      <div style={{...hr,fontFamily:"Segoe Script, cursive",fontSize:18,color:"#c0392b",marginTop:24,transform:"rotate(-2deg)"}}>{d.tagline}</div>
    </div>
  </div>;
}
function Scrapbook_Match({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30), sa = textIn(frame,15,fps,20);
  const hw = highlightSwipe(frame,20,25);
  const hr = handwrittenReveal(frame,25,35);
  return <div style={{position:"absolute",inset:0,background:"#f5f0e8"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 80%,rgba(180,160,130,0.1) 0%,transparent 50%)"}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"rgba(0,0,0,0.05)",display:"flex"}}>
      {Array.from({length:6},(_,i)=><div key={i} style={{flex:1,height:"100%",background:i<=1?"#c0392b":"transparent"}}/>)}
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...ta,fontFamily:"Courier New, monospace",fontSize:14,letterSpacing:6,textTransform:"uppercase",color:"#c0392b",marginBottom:32}}>{d.competition}</div>
      <div style={{display:"flex",alignItems:"center",gap:60,...sa}}>
        <div style={{textAlign:"center"}}><div style={{fontFamily:"Georgia, serif",fontWeight:900,fontSize:48,color:"#1a1a1a"}}>{d.homeTeam}</div></div>
        <div style={{fontFamily:"Georgia, serif",fontWeight:900,fontSize:72,color:"#c0392b",position:"relative"}}>
          {d.score}
          <div style={{position:"absolute",bottom:-4,left:0,width:hw+"%",height:8,background:"#f7dc6f",opacity:0.7}}/>
        </div>
        <div style={{textAlign:"center"}}><div style={{fontFamily:"Georgia, serif",fontWeight:900,fontSize:48,color:"#1a1a1a"}}>{d.awayTeam}</div></div>
      </div>
      <div style={{...hr,fontFamily:"Segoe Script, cursive",fontSize:20,color:"#c0392b",marginTop:48,transform:"rotate(-1deg)"}}>{d.highlight}</div>
    </div>
  </div>;
}
function Scrapbook_History({ frame, fps, W, H, content: d, th }) {
  const ya = textIn(frame,0,fps,40), fa = textIn(frame,15,fps,30), da = textIn(frame,30,fps,20);
  const hw = highlightSwipe(frame,10,35);
  const hr = handwrittenReveal(frame,25,40);
  return <div style={{position:"absolute",inset:0,background:"#f5f0e8"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 20%,rgba(200,180,150,0.15) 0%,transparent 50%)"}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"rgba(0,0,0,0.05)",display:"flex"}}>
      {Array.from({length:6},(_,i)=><div key={i} style={{flex:1,height:"100%",background:i<=2?"#c0392b":"transparent"}}/>)}
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...ya,fontFamily:"Courier New, monospace",fontSize:120,fontWeight:900,color:"#1a1a1a",opacity:0.15,position:"absolute",top:80,right:100}}>{d.year}</div>
      <div style={{...fa,fontFamily:"Georgia, serif",fontWeight:900,fontSize:64,color:"#1a1a1a",textAlign:"center",maxWidth:800,lineHeight:1.2,position:"relative"}}>
        {d.fact}
        <div style={{position:"absolute",bottom:-4,left:0,width:hw+"%",height:10,background:"#f7dc6f",opacity:0.7}}/>
      </div>
      <div style={{...da,fontFamily:"Georgia, serif",fontSize:24,color:"#666666",textAlign:"center",maxWidth:600,lineHeight:1.5,marginTop:32}}>{d.detail}</div>
      <div style={{...hr,fontFamily:"Segoe Script, cursive",fontSize:18,color:"#c0392b",marginTop:32,transform:"rotate(-2deg)"}}>{d.annotation}</div>
    </div>
  </div>;
}
function Scrapbook_Photo({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30);
  return <div style={{position:"absolute",inset:0,background:"#f5f0e8"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 80%,rgba(180,160,130,0.1) 0%,transparent 50%)"}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"rgba(0,0,0,0.05)",display:"flex"}}>
      {Array.from({length:6},(_,i)=><div key={i} style={{flex:1,height:"100%",background:i<=3?"#c0392b":"transparent"}}/>)}
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...ta,fontFamily:"Georgia, serif",fontWeight:900,fontSize:48,color:"#1a1a1a",textAlign:"center",marginBottom:48}}>{d.caption}</div>
      <div style={{display:"flex",gap:40,justifyContent:"center",flexWrap:"wrap"}}>
        {(d.Polaroid||d.polaroid||[]).map((p,i)=>{
          const pa = polaroidIn(frame,10+i*12,fps,i%2===0?-3:3);
          const tapeA = tapeIn(frame,15+i*12,fps);
          return <div key={i} style={{...pa,width:220,background:"#ffffff",padding:"12px 12px 40px 12px",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",position:"relative"}}>
            <div style={{...tapeA,position:"absolute",top:-10,left:"50%",transform:"translateX(-50%) rotate(-2deg)",width:60,height:20,background:"rgba(200,184,150,0.7)",borderRadius:2}}/>
            <div style={{width:"100%",height:160,background:"linear-gradient(135deg,#d0c8b8,#e8e0d0)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontFamily:"Courier New, monospace",fontSize:12,color:"#666666",textTransform:"uppercase",letterSpacing:2}}>{p.label}</div>
            </div>
            <div style={{fontFamily:"Segoe Script, cursive",fontSize:14,color:"#1a1a1a",textAlign:"center",marginTop:12}}>{p.label}</div>
            {p.sublabel && <div style={{fontFamily:"Courier New, monospace",fontSize:10,color:"#666666",textAlign:"center",marginTop:4}}>{p.sublabel}</div>}
          </div>;
        })}
      </div>
      <div style={{fontFamily:"Segoe Script, cursive",fontSize:18,color:"#c0392b",marginTop:32,transform:"rotate(-1deg)"}}>{d.annotation}</div>
    </div>
  </div>;
}
function Scrapbook_Timeline({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30);
  return <div style={{position:"absolute",inset:0,background:"#f5f0e8"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 20%,rgba(200,180,150,0.15) 0%,transparent 50%)"}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"rgba(0,0,0,0.05)",display:"flex"}}>
      {Array.from({length:6},(_,i)=><div key={i} style={{flex:1,height:"100%",background:i<=4?"#c0392b":"transparent"}}/>)}
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:80,paddingTop:120}}>
      <div style={{...ta,fontFamily:"Georgia, serif",fontWeight:900,fontSize:48,color:"#1a1a1a",textAlign:"center",marginBottom:48}}>{d.title}</div>
      <div style={{position:"relative",width:"100%",maxWidth:800}}>
        <div style={{position:"absolute",left:40,top:0,bottom:0,width:3,background:"linear-gradient(180deg,#c0392b,#d4a017)"}}/>
        {(d.items||[]).map((it,i)=>{
          const ia = textIn(frame,15+i*10,fps,20);
          const hw = highlightSwipe(frame,20+i*10,20);
          return <div key={i} style={{...ia,display:"flex",alignItems:"flex-start",marginBottom:32,position:"relative"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:"#c0392b",border:"3px solid #f5f0e8",flexShrink:0,marginTop:4,marginLeft:30,zIndex:1}}/>
            <div style={{marginLeft:24,flex:1}}>
              <div style={{fontFamily:"Courier New, monospace",fontSize:14,color:"#c0392b",marginBottom:4}}>{it.year||it.label}</div>
              <div style={{fontFamily:"Georgia, serif",fontWeight:700,fontSize:24,color:"#1a1a1a",position:"relative"}}>
                {it.value}
                <div style={{position:"absolute",bottom:-2,left:0,width:hw+"%",height:6,background:"#f7dc6f",opacity:0.6}}/>
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}
function Scrapbook_Closing({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30), sa = textIn(frame,15,fps,20);
  const tr = trophyBounce(frame,10,fps);
  const hr = handwrittenReveal(frame,30,35);
  return <div style={{position:"absolute",inset:0,background:"#f5f0e8"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 20%,rgba(200,180,150,0.15) 0%,transparent 50%)"}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:"rgba(0,0,0,0.05)",display:"flex"}}>
      {Array.from({length:6},(_,i)=><div key={i} style={{flex:1,height:"100%",background:i<=5?"#c0392b":"transparent"}}/>)}
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...tr,marginBottom:32}}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M20 15 h40 v5 c0 15 -8 25 -20 30 c-12-5-20-15-20-30 z" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2"/>
          <path d="M20 20 h-8 c-4 0-6 4-6 8 s2 8 6 8 h8" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
          <path d="M60 20 h8 c4 0 6 4 6 8 s-2 8-6 8 h-8" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
          <rect x="32" y="50" width="16" height="8" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2"/>
          <rect x="26" y="58" width="28" height="6" rx="2" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2"/>
          <polygon points="40,22 43,30 52,30 45,35 48,44 40,39 32,44 35,35 28,30 37,30" fill="#f5f0e8" stroke="#1a1a1a" strokeWidth="1"/>
        </svg>
      </div>
      <div style={{...ta,fontFamily:"Georgia, serif",fontWeight:900,fontSize:64,color:"#1a1a1a",textAlign:"center",maxWidth:800,lineHeight:1.2}}>{d.title}</div>
      <div style={{width:120,height:2,background:"linear-gradient(90deg,transparent,#1a1a1a,transparent)",margin:"32px 0",opacity:0.3}}/>
      <div style={{...sa,fontFamily:"Georgia, serif",fontSize:24,color:"#666666",textAlign:"center",maxWidth:600,lineHeight:1.5}}>{d.subtitle}</div>
      {(d.stats||[]).length>0 && <div style={{display:"flex",gap:48,marginTop:40}}>
        {d.stats.map((st,i)=>{
          const sta = textIn(frame,25+i*8,fps,15);
          return <div key={i} style={{...sta,textAlign:"center"}}>
            <div style={{fontFamily:"Georgia, serif",fontWeight:900,fontSize:36,color:"#c0392b"}}>{st.value}</div>
            <div style={{fontFamily:"Courier New, monospace",fontSize:12,color:"#666666",textTransform:"uppercase",letterSpacing:2,marginTop:4}}>{st.label}</div>
          </div>;
        })}
      </div>}
      <div style={{...hr,fontFamily:"Segoe Script, cursive",fontSize:16,color:"#c0392b",marginTop:32,transform:"rotate(-1deg)"}}>{d.reference}</div>
    </div>
  </div>;
}
const SCRAPBOOK_SCENES = { hero: Scrapbook_Hero, match: Scrapbook_Match, history: Scrapbook_History, photo: Scrapbook_Photo, timeline: Scrapbook_Timeline, closing: Scrapbook_Closing };

// ─── Terminal Scene Renderers ───────────────────────────────────────────────

function seededRandom(seed) { const x = Math.sin(seed * 9301 + 49297) * 49297; return x - Math.floor(x); }
const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF";

function Terminal_Bg({ frame, W, H, th }) {
  const charH = 18, charW = 14;
  const cols = Math.ceil(W / charW), rows = Math.ceil(H / charH);
  const drops = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < Math.floor(cols * 0.4); i++) {
      const seed = i * 137 + 42;
      const col = Math.floor(seededRandom(seed) * cols);
      const len = 6 + Math.floor(seededRandom(seed + 1) * 10);
      const chars = [];
      for (let j = 0; j < len; j++) chars.push(MATRIX_CHARS[Math.floor(seededRandom(seed + j * 3 + 2) * MATRIX_CHARS.length)]);
      arr.push({ x: col * charW, speed: 1.2 + seededRandom(seed + 3) * 2, startFrame: Math.floor(seededRandom(seed + 4) * 90), chars });
    }
    return arr;
  }, [cols]);
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}>
    {drops.map((drop, i) => {
      const elapsed = frame - drop.startFrame;
      if (elapsed < 0) return null;
      const headY = Math.floor(elapsed * drop.speed);
      return drop.chars.map((ch, j) => {
        const y = headY - j;
        if (y < 0 || y >= rows) return null;
        const isHead = j === 0;
        const alpha = isHead ? 1 : Math.max(0, 1 - j / drop.chars.length) * 0.4;
        return <span key={i + "-" + j} style={{ position: "absolute", left: drop.x, top: y * charH, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: charH + "px", color: isHead ? "#fff" : "#00ff66", opacity: alpha, textShadow: isHead ? "0 0 6px #00ff66" : "none" }}>{ch}</span>;
      });
    })}
  </div>;
}

function Terminal_Card({ W, H, language, children }) {
  const cardW = Math.min(W - 60, 920), cardH = H * 0.52;
  return <div style={{ position: "absolute", left: (W - cardW) / 2, top: H * 0.2, width: cardW, height: cardH, background: "rgba(13,17,23,0.85)", borderRadius: 12, border: "1px solid rgba(0,255,102,0.12)", overflow: "hidden", boxShadow: "0 0 40px rgba(0,255,102,0.08)" }}>
    <div style={{ display: "flex", alignItems: "center", height: 40, padding: "0 14px", background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(0,255,102,0.12)", gap: 8 }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
      <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#6a7a8a", letterSpacing: 0.5 }}>{language}</span>
    </div>
    <div style={{ padding: "16px 20px", overflow: "hidden", height: cardH - 40 }}>{children}</div>
  </div>;
}

const SYNTAX_COLORS = { keyword: "#ff79c6", string: "#50fa7b", function: "#8be9fd", number: "#bd93f9", comment: "#6272a4", variable: "#f1fa8c", type: "#8be9fd" };

function renderCodeLines(lines, visibleChars, highlightLine) {
  let charCount = 0;
  return lines.map((line, li) => {
    const lineStart = charCount;
    let rendered = null;
    if (visibleChars !== undefined && visibleChars <= lineStart) {
      rendered = null;
    } else if (visibleChars !== undefined && line.tokens && line.tokens.length > 0) {
      const avail = visibleChars - lineStart;
      const parts = [];
      let cur = 0;
      for (const tok of line.tokens) {
        if (tok.start > cur) parts.push(<span key={"p" + cur}>{line.text.slice(cur, Math.min(tok.start, cur + avail))}</span>);
        cur = tok.start;
        if (cur >= lineStart + avail) break;
        const end = Math.min(tok.start + tok.length, lineStart + avail);
        parts.push(<span key={"t" + tok.start} style={{ color: SYNTAX_COLORS[tok.kind] || "#e6e6e6" }}>{line.text.slice(cur, end)}</span>);
        cur = end;
      }
      if (cur < lineStart + avail) parts.push(<span key={"e" + cur}>{line.text.slice(cur, lineStart + avail)}</span>);
      rendered = parts;
    } else if (visibleChars !== undefined) {
      rendered = line.text.slice(0, Math.max(0, visibleChars - lineStart));
    } else {
      rendered = line.tokens && line.tokens.length > 0 ? line.tokens.reduce((acc, tok, ti) => {
        const before = ti === 0 ? line.text.slice(0, tok.start) : line.text.slice(line.tokens[ti - 1].start + line.tokens[ti - 1].length, tok.start);
        return [...acc, <span key={"b" + ti}>{before}</span>, <span key={"t" + ti} style={{ color: SYNTAX_COLORS[tok.kind] || "#e6e6e6" }}>{line.text.slice(tok.start, tok.start + tok.length)}</span>];
      }, []).concat([<span key="last">{line.text.slice(line.tokens[line.tokens.length - 1].start + line.tokens[line.tokens.length - 1].length)}</span>]) : line.text;
    }
    charCount += line.text.length + 1;
    const isHL = highlightLine === li;
    return <div key={li} style={{ background: isHL ? "rgba(0,255,102,0.08)" : "transparent", borderLeft: isHL ? "2px solid #00ff66" : "2px solid transparent", paddingLeft: 8, margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 18, lineHeight: 1.7, color: "#e6e6e6", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{rendered || "\u00A0"}</div>;
  });
}

function terminalLines(d) {
  if (Array.isArray(d.lines) && d.lines.length > 0) return d.lines;
  const caption = (d.caption || d.title || "console.log('hello world');").split("\n");
  return caption.map((t) => ({ text: t || " ", tokens: [] }));
}

function Terminal_Intro({ frame, fps, W, H, content: d, th }) {
  const ka = textIn(frame, 0, fps, 20), ta = textIn(frame, 10, fps, 25);
  return <div style={{ position: "absolute", inset: 0 }}>
    <Terminal_Bg frame={frame} W={W} H={H} th={th} />
    <div style={{ position: "absolute", top: H * 0.25, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={ka}><span style={{ fontFamily: th.fd, fontWeight: 600, fontSize: 24, color: "#00ff66", textTransform: "uppercase", letterSpacing: 4 }}>{d.kicker}</span></div>
      <div style={ta}><span style={{ fontFamily: th.fd, fontWeight: 700, fontSize: 52, color: th.ink, textShadow: "0 2px 30px rgba(0,255,102,0.25)", textAlign: "center", lineHeight: 1.2, maxWidth: W * 0.8, display: "inline-block" }}>{d.title}</span></div>
    </div>
    <div style={{ position: "absolute", bottom: H * 0.1, left: 0, right: 0, textAlign: "center", padding: "0 40px", opacity: textIn(frame, 15, fps, 15).opacity }}>
      <span style={{ fontFamily: th.fd, fontWeight: 600, fontSize: 34, color: th.ink, textShadow: "0 2px 20px rgba(0,255,102,0.3)" }}>{d.kicker + " — " + d.title}</span>
    </div>
  </div>;
}

function Terminal_Typing({ frame, fps, W, H, content: d, th }) {
  const lines = terminalLines(d);
  const totalChars = lines.reduce((s, l) => s + l.text.length + 1, 0);
  const typingFrames = Math.max(1, Math.round((d.dur || 5) * fps * 0.85));
  const charsVisible = Math.floor(Math.min(1, Math.max(0, (frame - 8) / typingFrames)) * totalChars);
  return <div style={{ position: "absolute", inset: 0 }}>
    <Terminal_Bg frame={frame} W={W} H={H} th={th} />
    <Terminal_Card W={W} H={H} language={d.language}>{renderCodeLines(lines, charsVisible)}</Terminal_Card>
    <div style={{ position: "absolute", bottom: H * 0.1, left: 0, right: 0, textAlign: "center", padding: "0 40px" }}>
      <span style={{ fontFamily: th.fd, fontWeight: 600, fontSize: 34, color: th.ink, textShadow: "0 2px 20px rgba(0,255,102,0.3)" }}>{d.caption}</span>
    </div>
  </div>;
}

function Terminal_Reveal({ frame, fps, W, H, content: d, th }) {
  const lines = terminalLines(d);
  return <div style={{ position: "absolute", inset: 0 }}>
    <Terminal_Bg frame={frame} W={W} H={H} th={th} />
    <Terminal_Card W={W} H={H} language={d.language}>{renderCodeLines(lines, undefined, d.highlightLine)}</Terminal_Card>
    <div style={{ position: "absolute", bottom: H * 0.1, left: 0, right: 0, textAlign: "center", padding: "0 40px" }}>
      <span style={{ fontFamily: th.fd, fontWeight: 600, fontSize: 34, color: th.ink, textShadow: "0 2px 20px rgba(0,255,102,0.3)" }}>{d.caption}</span>
    </div>
  </div>;
}

function Terminal_Outro({ frame, fps, W, H, content: d, th }) {
  const ka = textIn(frame, 0, fps, 20), ta = textIn(frame, 10, fps, 25), sa = textIn(frame, 20, fps, 20);
  return <div style={{ position: "absolute", inset: 0 }}>
    <Terminal_Bg frame={frame} W={W} H={H} th={th} />
    <div style={{ position: "absolute", top: H * 0.28, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={ka}><span style={{ fontFamily: th.fd, fontWeight: 600, fontSize: 22, color: "#00ff66", textTransform: "uppercase", letterSpacing: 3 }}>{d.kicker}</span></div>
      <div style={ta}><span style={{ fontFamily: th.fd, fontWeight: 700, fontSize: 56, color: th.ink, textShadow: "0 2px 30px rgba(0,255,102,0.3)", textAlign: "center", lineHeight: 1.2, maxWidth: W * 0.8, display: "inline-block" }}>{d.title}</span></div>
      <div style={sa}><span style={{ fontFamily: th.fd, fontWeight: 500, fontSize: 28, color: th.muted, textAlign: "center", maxWidth: W * 0.7, display: "inline-block" }}>{d.subtitle}</span></div>
    </div>
  </div>;
}

const TERMINAL_SCENES = { intro: Terminal_Intro, typing: Terminal_Typing, reveal: Terminal_Reveal, outro: Terminal_Outro };

// ─── Kinetic Statement Scene Renderers ──────────────────────────────────────

function kineticInterp(frame, i0, i1, o0, o1) {
  const t = Math.max(0, Math.min(1, (frame - i0) / (i1 - i0)));
  return o0 + (o1 - o0) * t;
}
function kineticEaseOut(t) { return 1 - Math.pow(1 - t, 3); }
function kineticSceneOpacity(frame, dur) {
  return kineticInterp(frame, 0, 15, 0, 1) * kineticInterp(frame, dur - 15, dur, 1, 0);
}

function Kinetic_Hook({ frame, fps, W, H, content: d, th }) {
  const opacity = kineticSceneOpacity(frame, d?.words ? 90 : 90);
  const words = d?.words || [];
  return <div style={{ position: "absolute", inset: 0, background: th.bg, display: "flex", alignItems: "center", justifyContent: "center", opacity }}>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, padding: "0 34px" }}>
      {words.map((w, i) => {
        const delay = i * 8;
        const o = kineticInterp(frame, delay, delay + 15, 0, 1);
        const y = kineticInterp(frame, delay, delay + 15, 26, 0);
        const blur = kineticInterp(frame, delay, delay + 15, 10, 0);
        return <span key={i} style={{ fontWeight: 900, fontSize: 30, color: th.ink, letterSpacing: 0.5, opacity: o, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` }}>{w}</span>;
      })}
    </div>
  </div>;
}

function Kinetic_Stat({ frame, fps, W, H, content: d, th }) {
  const opacity = kineticSceneOpacity(frame, 105);
  const progress = kineticInterp(frame, 10, 55, 0, d?.value || 0);
  const scale = kineticInterp(frame, 10, 26, 0.7, 1);
  const c1 = 1.70158;
  const back = 1 + (c1 + 1) * Math.pow(Math.min(1, Math.max(0, scale)) - 1, 3) + c1 * Math.pow(Math.min(1, Math.max(0, scale)) - 1, 2);
  const numOp = kineticInterp(frame, 8, 18, 0, 1);
  const labelOp = kineticInterp(frame, 58, 74, 0, 1);
  const labelY = kineticInterp(frame, 58, 74, 10, 0);
  return <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${th.bg2}, ${th.a2})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity }}>
    <div style={{ fontWeight: 900, fontSize: 92, color: th.a1, textAlign: "center", lineHeight: 1, opacity: numOp, transform: `scale(${Math.max(0, back)})` }}>{Math.round(progress)}{d?.suffix || ""}</div>
    <div style={{ marginTop: 16, fontSize: 15, color: th.muted, textAlign: "center", padding: "0 46px", lineHeight: 1.5, opacity: labelOp, transform: `translateY(${labelY}px)` }}>{d?.label || ""}</div>
  </div>;
}

function Kinetic_Quote({ frame, fps, W, H, content: d, th }) {
  const opacity = kineticSceneOpacity(frame, 120);
  const words = (d?.text || "").split(" ");
  const activeFloat = kineticInterp(frame, 8, 120 - 34, 0, words.length);
  const activeIdx = Math.floor(activeFloat);
  return <div style={{ position: "absolute", inset: 0, background: "#f5f1e8", display: "flex", alignItems: "center", justifyContent: "center", opacity }}>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 8px", padding: "0 40px" }}>
      {words.map((w, i) => {
        const revealed = i < activeIdx;
        const active = i === activeIdx;
        return <span key={i} style={{ fontWeight: 800, fontSize: 23, color: revealed || active ? "#1c1c1e" : "#d8d0bf", lineHeight: 1.5, padding: "2px 3px", borderRadius: 4, background: active ? "#e0a72e" : "transparent" }}>{w}</span>;
      })}
    </div>
  </div>;
}

function Kinetic_Outro({ frame, fps, W, H, content: d, th }) {
  const opacity = kineticSceneOpacity(frame, 75);
  const brandOp = kineticInterp(frame, 0, 14, 0, 1);
  const brandScale = kineticInterp(frame, 0, 18, 0.6, 1);
  const c1 = 1.70158;
  const back = 1 + (c1 + 1) * Math.pow(Math.min(1, Math.max(0, brandScale)) - 1, 3) + c1 * Math.pow(Math.min(1, Math.max(0, brandScale)) - 1, 2);
  const tagOp = kineticInterp(frame, 18, 30, 0, 1);
  const ctaOp = kineticInterp(frame, 36, 50, 0, 1);
  const ctaPulse = frame > 50 ? 1 + 0.035 * Math.sin(frame * 0.18) : 1;
  return <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #05060a, #12131c)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity }}>
    <div style={{ fontWeight: 900, fontSize: 26, color: th.a1, letterSpacing: 2, opacity: brandOp, transform: `scale(${Math.max(0, back)})` }}>{d?.brand || ""}</div>
    <div style={{ marginTop: 8, fontSize: 13, color: th.muted, letterSpacing: 1, opacity: tagOp }}>{d?.tagline || ""}</div>
    <div style={{ marginTop: 26, fontSize: 15, fontWeight: 700, color: th.ink, border: `1.5px solid ${th.a1}`, borderRadius: 24, padding: "9px 22px", opacity: ctaOp, transform: `scale(${ctaPulse})` }}>{d?.cta || ""}</div>
  </div>;
}

const KINETIC_SCENES = { hook: Kinetic_Hook, stat: Kinetic_Stat, quote: Kinetic_Quote, outro: Kinetic_Outro };

// ─── Bento Grid Scene Renderers ──────────────────────────────────────────────
function bentoInterp(frame, i0, i1, o0, o1) {
  const t = Math.max(0, Math.min(1, (frame - i0) / (i1 - i0)));
  return o0 + (o1 - o0) * t;
}
function bentoSceneOpacity(frame, dur) {
  return bentoInterp(frame, 0, 15, 0, 1) * bentoInterp(frame, dur - 12, dur, 1, 0);
}

function Bento_Hook({ frame, fps, W, H, content: d, th }) {
  const dur = 90;
  const opacity = bentoSceneOpacity(frame, dur);
  const maskW = bentoInterp(frame, 5, 35, 0, 100);
  const l1Op = bentoInterp(frame, 8, 20, 0, 1);
  const l1Y = bentoInterp(frame, 8, 20, 20, 0);
  const l2Op = bentoInterp(frame, 18, 32, 0, 1);
  const l2Y = bentoInterp(frame, 18, 32, 20, 0);
  return <div style={{ position:"absolute",inset:0,background:th.bg,display:"flex",alignItems:"center",justifyContent:"center",opacity }}>
    <div style={{ clipPath:`inset(0 ${100-maskW}% 0 0)`,display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"0 40px" }}>
      <div style={{ fontSize:14,fontWeight:700,letterSpacing:6,color:th.muted,opacity:l1Op,transform:`translateY(${l1Y}px)` }}>{d?.line1||""}</div>
      <div style={{ fontSize:72,fontWeight:900,color:th.ink,letterSpacing:2,opacity:l2Op,transform:`translateY(${l2Y}px)` }}>{d?.line2||""}</div>
    </div>
  </div>;
}

function Bento_Bento({ frame, fps, W, H, content: d, th }) {
  const dur = 150;
  const opacity = bentoSceneOpacity(frame, dur);
  const titleOp = bentoInterp(frame, 5, 18, 0, 1);
  const statOp = bentoInterp(frame, 12, 25, 0, 1);
  const gridOp = bentoInterp(frame, 20, 35, 0, 1);
  const chartOp = bentoInterp(frame, 50, 65, 0, 1);
  const quoteOp = bentoInterp(frame, 70, 85, 0, 1);
  const chartData = d?.chart || [30,50,70,85,95];
  const maxVal = Math.max(...chartData, 1);
  const barW = 36;
  const gap = 12;
  const totalW = chartData.length * (barW + gap) - gap;
  const chartH = 80;
  return <div style={{ position:"absolute",inset:0,background:`linear-gradient(160deg,${th.bg},${th.bg2})`,opacity,padding:"60px 32px",display:"flex",flexDirection:"column",gap:20 }}>
    <div style={{ fontSize:13,fontWeight:700,letterSpacing:4,color:th.muted,opacity:titleOp }}>AURA</div>
    <div style={{ fontSize:34,fontWeight:900,color:th.ink,opacity:titleOp }}>{d?.title||""}</div>
    <div style={{ fontSize:48,fontWeight:900,color:th.a1,opacity:statOp }}>{d?.stat||""}</div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,opacity:gridOp }}>
      <div style={{ background:th.card,border:`1px solid ${th.line}`,borderRadius:14,padding:"18px 16px" }}>
        <div style={{ fontSize:11,color:th.muted,marginBottom:4 }}>Feature 1</div>
        <div style={{ fontSize:16,fontWeight:700,color:th.ink }}>{d?.feature1||""}</div>
      </div>
      <div style={{ background:th.card,border:`1px solid ${th.line}`,borderRadius:14,padding:"18px 16px" }}>
        <div style={{ fontSize:11,color:th.muted,marginBottom:4 }}>Feature 2</div>
        <div style={{ fontSize:16,fontWeight:700,color:th.ink }}>{d?.feature2||""}</div>
      </div>
    </div>
    <div style={{ background:th.card,border:`1px solid ${th.line}`,borderRadius:14,padding:"18px 16px",display:"flex",alignItems:"flex-end",gap:gap,height:chartH+30,opacity:chartOp }}>
      {chartData.map((v,i)=>{
        const barH = (v/maxVal)*chartH;
        const barDelay = 50 + i*6;
        const barScale = bentoInterp(frame,barDelay,barDelay+12,0,1);
        return <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1 }}>
          <div style={{ width:barW,height:barH*Math.max(0,barScale),background:`linear-gradient(180deg,${th.a1},${th.a2})`,borderRadius:6 }}/>
          <div style={{ fontSize:10,color:th.muted }}>{v}%</div>
        </div>;
      })}
    </div>
    <div style={{ background:th.card,border:`1px solid ${th.line}`,borderRadius:14,padding:"16px 18px",opacity:quoteOp }}>
      <div style={{ fontSize:15,fontWeight:600,color:th.ink,fontStyle:"italic" }}>"{d?.quote||""}"</div>
    </div>
    <div style={{ display:"flex",gap:8,opacity:gridOp }}>
      {(d?.palette||[]).map((c,i)=><div key={i} style={{ width:28,height:28,borderRadius:8,background:c }}/>)}
    </div>
  </div>;
}

function Bento_Outro({ frame, fps, W, H, content: d, th }) {
  const dur = 75;
  const opacity = bentoSceneOpacity(frame, dur);
  const brandOp = bentoInterp(frame, 0, 14, 0, 1);
  const brandScale = bentoInterp(frame, 0, 18, 0.6, 1);
  const c1 = 1.70158;
  const back = 1 + (c1 + 1) * Math.pow(Math.min(1, Math.max(0, brandScale)) - 1, 3) + c1 * Math.pow(Math.min(1, Math.max(0, brandScale)) - 1, 2);
  const tagOp = bentoInterp(frame, 18, 30, 0, 1);
  const ctaOp = bentoInterp(frame, 36, 50, 0, 1);
  const ctaPulse = frame > 50 ? 1 + 0.035 * Math.sin(frame * 0.18) : 1;
  return <div style={{ position:"absolute",inset:0,background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity }}>
    <div style={{ fontSize:42,fontWeight:900,color:th.a1,letterSpacing:3,opacity:brandOp,transform:`scale(${Math.max(0,back)})` }}>{d?.brand||""}</div>
    <div style={{ marginTop:10,fontSize:13,color:th.muted,letterSpacing:2,opacity:tagOp }}>{d?.tagline||""}</div>
    <div style={{ marginTop:28,fontSize:15,fontWeight:700,color:th.ink,background:th.a1,borderRadius:24,padding:"10px 26px",opacity:ctaOp,transform:`scale(${ctaPulse})` }}>{d?.cta||""}</div>
  </div>;
}

const BENTO_SCENES = { hook: Bento_Hook, bento: Bento_Bento, outro: Bento_Outro };

// ─── Fallback renderer for unsupported templates ─────────────────────────────
function Fallback_Scene({ frame, fps, W, H, content: d, th, kind }) {
  if (!d) return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:th.fd,color:th.muted,fontSize:20}}>No content</div></div>;
  const ta = textIn(frame,0,fps,30), ca = textIn(frame,15,fps,25);
  const pulse = 0.01 * Math.sin((frame/fps)*1.5);
  const title = d?.title || d?.name || d?.heading || d?.mainQuestion || d?.badge || d?.lawCode || (kind||"").toUpperCase() || "Scene";
  const subtitle = d?.subtitle || d?.subText || d?.tagline || "";
  const body = d?.description || d?.bodyLines?.join(" ") || d?.text || d?.caption || "";
  return <div style={{position:"absolute",inset:0,background:"radial-gradient(130% 130% at 50% 50%,"+(th.bg2||"#111")+" 0%,"+(th.bg||"#0a0a0a")+" 60%,#050505 100%)"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(40% 40% at 50% 45%,"+(th.a1||"#666")+"08,transparent 70%)"}}/>
    <div style={{position:"absolute",top:24,left:24,right:24,bottom:24,border:"1px dashed "+(th.line||"rgba(255,255,255,0.1)"),borderRadius:12,pointerEvents:"none"}}/>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:80}}>
      <div style={{...ta,fontFamily:th.fm||th.fd,fontSize:12,letterSpacing:6,textTransform:"uppercase",color:th.muted||"#888",marginBottom:24}}>
        {kind} · preview fallback
      </div>
      <div style={{...ta,fontFamily:th.fd,fontWeight:900,fontSize:72,lineHeight:1.1,textAlign:"center",color:th.ink||"#fff",transform:"scale("+(1+pulse)+")",maxWidth:900}}>
        {title}
      </div>
      {subtitle && <>
        <div style={{width:80,height:2,background:th.a1||"#666",margin:"24px 0",opacity:0.5}}/>
        <div style={{...ca,fontFamily:th.fd,fontSize:28,color:th.muted||"#999",textAlign:"center",maxWidth:700,lineHeight:1.5}}>
          {subtitle}
        </div>
      </>}
      {body && <div style={{...ca,fontFamily:th.fd,fontSize:20,color:(th.muted||"#999")+"99",textAlign:"center",maxWidth:600,lineHeight:1.5,marginTop:16}}>{body}</div>}
    </div>
  </div>;
}

// ─── Error boundary for scene rendering ──────────────────────────────────────
class SceneErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("[Preview Studio] Scene render error:", error, info?.componentStack); }
  render() {
    if (this.state.error) {
      const th = this.props.th || {};
      return <div style={{position:"absolute",inset:0,background:"#1a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{fontSize:14,letterSpacing:4,textTransform:"uppercase",color:"#ef4444",marginBottom:16}}>Scene Error</div>
        <div style={{fontSize:24,fontWeight:700,color:"#fafaf9",textAlign:"center",marginBottom:12}}>{this.props.sceneId || "Unknown"}</div>
        <div style={{fontSize:16,color:"#9aa0b5",textAlign:"center",maxWidth:600,fontFamily:"monospace"}}>{this.state.error.message}</div>
      </div>;
    }
    return this.props.children;
  }
}

const prodSelect = document.getElementById("prod-select");
const fmtBtns = document.getElementById("format-btns");
const resChip = document.getElementById("res-chip");
const tplBadge = document.getElementById("template-badge");
const safeToggle = document.getElementById("safe-toggle");

PRODUCTIONS.forEach((p,i)=>{const opt=document.createElement("option");opt.value=i;opt.textContent=p.name;prodSelect.appendChild(opt);});
if (typeof composerProjectIndex !== "undefined") { prodSelect.value = composerProjectIndex; currentFmt = PRODUCTIONS[composerProjectIndex].format || "16:9"; }

let currentFmt="16:9",currentPi=0,onFormatChange=null,onSafeToggle=null;
if (typeof composerProjectIndex !== "undefined") currentPi = composerProjectIndex;
function renderFmtBtns(){const tpl=PRODUCTIONS[currentPi].template;const supported=TEMPLATE_FORMATS[tpl]||["16:9"];fmtBtns.innerHTML="";["16:9","9:16"].forEach(f=>{const btn=document.createElement("button");const isSupported=supported.includes(f);btn.className="format-btn "+(f===currentFmt?"active":"")+(!isSupported?" disabled":"");btn.textContent=f;if(!isSupported)btn.title=PRODUCTIONS[currentPi].template+" does not support "+f;btn.onclick=()=>{if(!isSupported)return;currentFmt=f;renderFmtBtns();updateRes();onFormatChange&&onFormatChange(f);};fmtBtns.appendChild(btn);});}
function updateRes(){const c=CANVAS[currentFmt];resChip.textContent=c.w+" x "+c.h;}
function updateTplBadge(){tplBadge.textContent=PRODUCTIONS[currentPi].template;}
renderFmtBtns();updateTplBadge();
let safeOn=false;
safeToggle.onclick=()=>{safeOn=!safeOn;safeToggle.classList.toggle("active",safeOn);onSafeToggle&&onSafeToggle(safeOn);};

const root = ReactDOM.createRoot(document.getElementById("root"));
function AppWrapper(){
  const [format,setFmt]=useState(typeof composerProjectIndex !== "undefined" ? (PRODUCTIONS[composerProjectIndex].format || "16:9") : "16:9");
  const [pi,setPi]=useState(typeof composerProjectIndex !== "undefined" ? composerProjectIndex : 0);
  const [showSafe,setShowSafe]=useState(false);
  onFormatChange=setFmt;onSafeToggle=setShowSafe;
  useEffect(()=>{prodSelect.onchange=(e)=>{const newPi=parseInt(e.target.value);setPi(newPi);currentPi=newPi;const tpl=PRODUCTIONS[newPi].template;const supported=TEMPLATE_FORMATS[tpl]||["16:9"];if(!supported.includes(currentFmt)){currentFmt=supported[0];setFmt(currentFmt);updateRes();}renderFmtBtns();updateTplBadge();};},[]);
  return <AppInner format={format} pi={pi} showSafe={showSafe}/>;
}
function AppInner({format,pi,showSafe}){
  const [as,setAs]=useState(null);
  const [frame,setFrame]=useState(0);
  const [playing,setPlaying]=useState(false);
  const raf=useRef(null),lt=useRef(null);
  const prod=PRODUCTIONS[pi];
  const scenes=prod.scenes;
  const SF=useMemo(()=>scenes.map(s=>({...s,frames:stf(s.dur+0.5)})),[scenes]);
  useEffect(()=>{setAs(scenes[0]?.id||null);setFrame(0);setPlaying(false);},[pi]);
  const si=SF.findIndex(s=>s.id===as);
  const sd=SF[si]?.frames||300;
  const pause=useCallback(()=>{setPlaying(false);if(raf.current)cancelAnimationFrame(raf.current);},[]);
  const play=useCallback(()=>{setPlaying(true);lt.current=performance.now();},[]);
  useEffect(()=>{if(!playing)return;const tick=now=>{const dt=now-(lt.current||now);lt.current=now;setFrame(p=>{const n=p+Math.round(dt/1000*FPS);if(n>=sd){const ni=si+1;if(ni<SF.length){setAs(SF[ni].id);return 0;}setPlaying(false);return sd-1;}return n;});raf.current=requestAnimationFrame(tick);};raf.current=requestAnimationFrame(tick);return()=>{if(raf.current)cancelAnimationFrame(raf.current);};},[playing,sd,si,SF.length]);
  useEffect(()=>{setFrame(0);},[as]);
  const stepFrame=useCallback((delta)=>{pause();setFrame(p=>Math.max(0,Math.min(sd-1,p+delta)));},[pause,sd]);
  const jumpScene=useCallback((delta)=>{pause();const ni=si+delta;if(ni>=0&&ni<SF.length)setAs(SF[ni].id);},[pause,si,SF.length]);
  useEffect(()=>{const handler=(e)=>{if(e.target.tagName==="INPUT"||e.target.tagName==="SELECT")return;switch(e.key){case " ":e.preventDefault();playing?pause():play();break;case "ArrowLeft":e.preventDefault();stepFrame(-1);break;case "ArrowRight":e.preventDefault();stepFrame(1);break;case "ArrowUp":e.preventDefault();jumpScene(-1);break;case "ArrowDown":e.preventDefault();jumpScene(1);break;case "Home":e.preventDefault();pause();setFrame(0);break;case "End":e.preventDefault();pause();setFrame(sd-1);break;}};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[playing,pause,play,stepFrame,jumpScene,sd]);
  const sel=id=>{pause();setAs(id);};
  const scrub=e=>{pause();setFrame(Math.round(parseFloat(e.target.value)/100*(sd-1)));};
  const totF=SF.reduce((a,s)=>a+s.frames,0);
  const elF=SF.slice(0,si).reduce((a,s)=>a+s.frames,0)+frame;
  const sceneProgress=sd>1?frame/(sd-1):0;
  const canvas=CANVAS[format];
  const maxW=960;
  const scale=format==="9:16"?Math.min(maxW/canvas.w,(maxW*1.5)/canvas.h):maxW/canvas.w;
  const cw=Math.round(canvas.w*scale),ch=Math.round(canvas.h*scale);
  const renderersMap = { cr7: CR7_SCENES, cosmos: COSMOS_SCENES, scrapbook: SCRAPBOOK_SCENES, nodeflow: NF_SCENES, nq57: NF_SCENES, stoiclove: NF_SCENES, blueprint: NF_SCENES, terminal: TERMINAL_SCENES, kineticStatement: KINETIC_SCENES, bentoGrid: BENTO_SCENES };
  const renderers = renderersMap[prod.template] || NF_SCENES;
  const sceneData=si>=0?scenes[si]:null;
  const content=sceneData?prod.content[sceneData.id]:null;
  const contentKind=(content&&content.kind)||(sceneData&&sceneData.kind);
  const SceneComp=content?(renderers[contentKind]||null):null;
  const th=prod.theme;
  return <React.Fragment>
    <div className="main">
      <div className="sidebar">
        <div className="sidebar-section"><div className="sidebar-label">Scenes ({SF.length})</div></div>
        <div className="scene-list">
          {SF.map((s,i)=><button key={s.id} className={"scene-btn "+(as===s.id?"active":"")} onClick={()=>sel(s.id)}>
            <span>{s.id.toUpperCase()}</span>
            <div className="scene-meta"><span className="scene-kind">{s.kind}</span><span className="scene-dur">{s.dur.toFixed(1)}s</span></div>
            {as===s.id && <div className="scene-progress"><div className="scene-progress-fill" style={{width:sceneProgress*100+"%"}}/></div>}
          </button>)}
        </div>
      </div>
      <div className="canvas-area">
        <div className="canvas-info"><span className="chip">{canvas.w} x {canvas.h}</span><span className="fps-badge">30 FPS</span></div>
        <div className="canvas-frame" style={{width:cw,height:ch}}>
          <div className="scene-root" style={{width:canvas.w,height:canvas.h,transform:"scale("+scale+")",transformOrigin:"top left"}}>
            <SceneErrorBoundary sceneId={sceneData?.id} th={th}>
              {SceneComp
                ? <SceneComp frame={frame} fps={FPS} W={canvas.w} H={canvas.h} content={content} th={th}/>
                : content && <Fallback_Scene frame={frame} fps={FPS} W={canvas.w} H={canvas.h} content={content} th={th} kind={content.kind}/>
              }
            </SceneErrorBoundary>
          </div>
          {showSafe && <div className="safe-area" style={{left:0,right:0,top:0,bottom:0}}><div className="safe-area-inner"/></div>}
        </div>
      </div>
    </div>
    <div className="transport">
      <button className="transport-btn" onClick={()=>jumpScene(-1)} disabled={si<=0} title="Previous scene (Up)">&#9664;</button>
      <button className="transport-btn" onClick={()=>stepFrame(-1)} title="Previous frame (Left)">&#8249;</button>
      <button className="transport-btn play-btn" onClick={()=>playing?pause():play()} title="Play/Pause (Space)">{playing?"&#x23F8;":"&#x25B6;"}</button>
      <button className="transport-btn" onClick={()=>stepFrame(1)} title="Next frame (Right)">&#8250;</button>
      <button className="transport-btn" onClick={()=>jumpScene(1)} disabled={si>=SF.length-1} title="Next scene (Down)">&#9654;</button>
      <div className="scrub-container">
        <input type="range" className="scrub-track" min="0" max="100" step="0.1" value={fp(frame,sd)*100} onChange={scrub}/>
        <div className="scrub-labels"><span>Scene {si+1} / {SF.length}</span><span>frame {frame} / {sd-1}</span></div>
      </div>
      <span className="frame-badge">F:{frame}</span>
      <span className="progress-badge">{(sceneProgress*100).toFixed(0)}%</span>
      <span className="time-display">{fmt(elF)} / {fmt(totF)}</span>
    </div>
  </React.Fragment>;
}
root.render(<AppWrapper/>);
