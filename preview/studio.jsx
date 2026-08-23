const { useState, useEffect, useRef, useCallback, useMemo } = React;
const FPS = 30;
const clamp = v => Math.max(0, Math.min(1, v));
const fp = (f, d) => d > 0 ? clamp(f / (d - 1)) : 1;
const stf = s => Math.ceil(s * FPS);
const fmt = f => { const t = f / FPS; return Math.floor(t/60) + ":" + String(Math.floor(t%60)).padStart(2,"0") + "." + String(Math.floor((t%1)*100)).padStart(2,"0"); };

const CANVAS = { "16:9": { w: 1920, h: 1080 }, "9:16": { w: 1080, h: 1920 } };
const TEMPLATE_FORMATS = { cr7: ["16:9","9:16"], nodeflow: ["16:9"], nq57: ["16:9"], stoiclove: ["9:16"], blueprint: ["16:9"] };

const PRODUCTIONS = [
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
];

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
  const ba = textIn(frame,0,fps), ta = textIn(frame,8,fps,40), sa = textIn(frame,20,fps,30), ta2 = textIn(frame,34,fps,20);
  const nd = [45,60,75].map(d2=>rev(frame,d2,20));
  const e1 = edgeD(frame,90,18), e2 = edgeD(frame,108,18);
  const sig = frame > 120;
  const NW=260,NH=70,NX=[240,W/2-NW/2,W-240-NW],NCX=NX.map(x=>x+NW/2);
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0,pointerEvents:"none"}}><g style={ba}><rect x={100} y={80} width={d.lawCode.length*12+30} height={32} rx={4} fill={th.a1} fillOpacity={0.08} stroke={th.a1} strokeWidth={1} strokeOpacity={0.4}/><text x={115} y={100} fill={th.a1} fontSize={14} fontWeight={600} fontFamily={th.fm} letterSpacing={2}>{d.lawCode}</text></g><g style={ta}><text x={100} y={250} fill={th.ink} fontSize={110} fontWeight={900} fontFamily={th.fd} letterSpacing={-3}>{d.title}</text></g><g style={sa}><text x={100} y={310} fill={th.ink} fontSize={36} fontWeight={500} fontFamily={th.fd}>{d.subtitle}</text></g><g style={ta2}><text x={100} y={360} fill={th.muted} fontSize={18} fontWeight={600} fontFamily={th.fm} letterSpacing={4}>{d.tagline}</text></g><NF_EL x1={NCX[0]} y1={35} x2={NCX[1]} y2={35} progress={e1} color={th.line} sw={1.2} ah={false}/><NF_EL x1={NCX[1]} y1={35} x2={NCX[2]} y2={35} progress={e2} color={th.line} sw={1.2} ah={false}/><NF_SP x1={NCX[0]} y1={35} x2={NCX[1]} y2={35} frame={frame} period={55} color={th.a1} visible={sig}/><NF_SP x1={NCX[1]} y1={35} x2={NCX[2]} y2={35} frame={frame-20} period={55} color={th.a1} visible={sig}/>{d.nodes.map((n,i)=><NF_NB key={i} x={NX[i]} y={820} w={NW} h={NH} label={n.label} sublabel={n.role} active={nd[i]>0.5} activePct={nd[i]} color={[th.a3,th.a1,th.a2][i]} textSize={16} th={th}/>)}</svg></div>;
}
function NF_S2({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30), da = textIn(frame,12,fps,25);
  const nd = [15,28,42].map(d2=>rev(frame,d2,22));
  const et = d.edges.map((_,i)=>edgeD(frame,65+i*25,22));
  const np = [{cx:210,cy:160,r:88},{cx:670,cy:160,r:88},{cx:440,cy:500,r:98}];
  const nc = [th.a1,th.a2,th.a3];
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:0,left:0,bottom:0,width:820,display:"flex",flexDirection:"column",justifyContent:"center",paddingLeft:100,paddingRight:60,paddingTop:80,paddingBottom:80}}><div style={{fontFamily:th.fm,fontWeight:600,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Co che hoat dong</div><div style={ta}><div style={{fontFamily:th.fd,fontWeight:800,fontSize:56,lineHeight:1.15,color:th.ink,marginBottom:24}}>{d.title}</div></div><div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,"+th.a1+"80,transparent)",opacity:0.3,margin:"16px 0"}}/><div style={da}>{d.description.map((l,i)=><div key={i} style={{fontFamily:th.fd,fontSize:26,lineHeight:1.6,color:i===0?th.ink:th.muted,marginBottom:8}}>{l}</div>)}</div><div style={{marginTop:32,display:"flex",flexDirection:"column",gap:10}}>{d.flowNodes.map((n,i)=><div key={i} style={{opacity:nd[i],display:"flex",alignItems:"center",gap:12,fontFamily:th.fd,fontSize:20,color:nc[i],fontWeight:600}}><span style={{width:10,height:10,borderRadius:"50%",background:nc[i],display:"inline-block"}}/>{n.label}{n.rate && <span style={{fontFamily:th.fm,fontSize:15,color:th.muted}}> - {n.rate}</span>}</div>)}</div></div><svg width={880} height={680} viewBox="0 0 880 680" style={{position:"absolute",right:60,top:"50%",transform:"translateY(-50%)",overflow:"visible"}}>{d.edges.map((e,i)=>{const f=np[e.from],t=np[e.to];return <g key={i}><NF_EL x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy} progress={et[i]} color={nc[e.from]} sw={2}/>{et[i]>0.5 && <NF_DB x={(f.cx+t.cx)/2-10} y={(f.cy+t.cy)/2-10} value={e.label} activePct={et[i]} color={nc[e.from]} th={th}/>}</g>)}{d.flowNodes.map((n,i)=><NF_SYS key={i} frame={frame} fps={fps} cx={np[i].cx} cy={np[i].cy} r={np[i].r} label={n.label} sublabel={n.sublabel} active={nd[i]>0.5} activePct={nd[i]} color={nc[i]} th={th}/>)}</svg></div>;
}
function NF_S3({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30);
  const rr = d.rows.map((_,i)=>rev(frame,15+i*20,18));
  const bf = d.rows.map((_,i)=>rev(frame,30+i*20,30));
  const tr = rev(frame,15+d.rows.length*20+10,25);
  const BX=100,BW=840,BH=48,RG=72,CY=160;
  const rc = [th.a2,th.a1,th.a3];
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:80,left:100,right:100}}><div style={ta}><div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Ty le dong gop</div><div style={{fontFamily:th.fd,fontWeight:800,fontSize:60,lineHeight:1.1,color:th.ink}}>{d.title}</div></div></div><svg width={1720} height={900} viewBox="0 0 1720 900" style={{position:"absolute",left:100,top:200,pointerEvents:"none"}}>{d.rows.map((row,i)=>{const y=CY-60+i*RG,c=rc[i%rc.length];return <g key={i} opacity={rr[i]}><text x={0} y={y-8} fill={c} fontSize={15} fontWeight={700} fontFamily={th.fm} letterSpacing={2}>{row.party.toUpperCase()}</text><NF_PB x={BX} y={y} w={BW} h={BH} pct={row.pct} progress={bf[i]} label={row.type} valueLabel={row.rateLabel} color={c} th={th}/><NF_DB x={BX+BW*row.pct*bf[i]+16} y={y+BH/2-6} value={row.rateLabel} activePct={bf[i]>0.4?(bf[i]-0.4)/0.6:0} color={c} th={th}/></g>})}<g opacity={tr}><rect x={BX} y={CY-60+d.rows.length*RG+20} width={BW+80} height={64} rx={6} fill={th.a2} fillOpacity={0.08} stroke={th.a2} strokeWidth={1} strokeOpacity={0.5}/><text x={BX+16} y={CY-60+d.rows.length*RG+54} fill={th.ink} fontSize={20} fontWeight={700} fontFamily={th.fd}>{d.totalLabel}</text><text x={BX+BW-20} y={CY-60+d.rows.length*RG+54} textAnchor="end" fill={th.a2} fontSize={28} fontWeight={900} fontFamily={th.fm}>{d.totalValue}</text></g></svg></div>;
}
function NF_S4({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30), da = textIn(frame,12,fps,25);
  const cr = d.benefits.map((_,i)=>rev(frame,20+i*22,25));
  const CW=760,CH=60,CG=76,CX=80,IS=44;
  const cc = [th.a3,th.a1,th.a2];
  const SH = d.benefits.length*CG+60;
  const IC={pension:"M8 4 L8 16 M4 8 L12 8 M4 12 L12 12",health:"M6 12 L10 12 M8 10 L8 14",maternity:"M8 4 A3 3 0 0 1 14 4 L14 10 A6 6 0 0 1 2 10 L2 4",work:"M2 14 L8 2 L14 14 Z",unemployment:"M2 10 L8 4 L14 10 L14 14 L2 14 Z",death:"M8 2 L8 14 M4 6 L12 6"};
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:0,left:0,bottom:0,width:700,display:"flex",flexDirection:"column",justifyContent:"center",paddingLeft:100,paddingRight:60,paddingTop:80,paddingBottom:80}}><div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Quyen loi nguoi lao dong</div><div style={ta}><div style={{fontFamily:th.fd,fontWeight:800,fontSize:52,lineHeight:1.15,color:th.ink,marginBottom:20}}>{d.title}</div></div><div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,"+th.a1+"80,transparent)",opacity:0.3,margin:"16px 0"}}/><div style={da}><div style={{fontFamily:th.fd,fontSize:24,lineHeight:1.6,color:th.muted}}>{d.description}</div></div></div><svg width={900} height={SH} viewBox={"0 0 900 "+SH} style={{position:"absolute",right:60,top:"50%",transform:"translateY(-"+SH/2+"px)",overflow:"visible"}}><NF_EL x1={60} y1={CH/2} x2={60} y2={(d.benefits.length-1)*CG+CH/2} progress={cr[Math.min(2,d.benefits.length-1)]} color={th.line} sw={1} ah={false}/>{d.benefits.map((b,i)=>{const y=i*CG,c=cc[i%cc.length];return <g key={i} opacity={cr[i]}><g transform={"translate(36 "+(y+(CH-IS)/2)+")"}><circle cx={IS/2} cy={IS/2} r={IS/2} fill={c} fillOpacity={0.1} stroke={c} strokeWidth={1} strokeOpacity={0.5}/><g transform={"translate("+(IS/2-8)+" "+(IS/2-8)+")"} stroke={c} strokeWidth={1.5} fill="none" strokeLinecap="round"><path d={IC[b.icon]||IC.work}/></g></g><text x={CX+IS+16} y={y+CH/2-8} fill={th.ink} fontSize={18} fontWeight={700} fontFamily={th.fd}>{b.label}</text>{b.value && <text x={CX+IS+16} y={y+CH/2+12} fill={c} fontSize={15} fontWeight={600} fontFamily={th.fm}>{b.value}</text>}</g>})}</svg></div>;
}
function NF_S5({ frame, fps, W, H, content: d, th }) {
  const ta = textIn(frame,0,fps,30);
  const lr = rev(frame,10,25), rr = rev(frame,30,25), dr = edgeD(frame,20,20), br = rev(frame,60,20);
  const CW=700,CH=70,CG=90,LX=80,RX=940,SY=80;
  const mx = Math.max(d.before.items.length,d.after.items.length);
  const SH = mx*CG+160;
  return <div style={{position:"absolute",inset:0}}><NF_Bg frame={frame} W={W} H={H} th={th}/><div style={{position:"absolute",top:60,left:100,right:100,...ta}}><div style={{fontFamily:th.fm,fontSize:15,letterSpacing:4,textTransform:"uppercase",color:th.muted,marginBottom:12}}>Thay doi quan trong</div><div style={{fontFamily:th.fd,fontWeight:800,fontSize:56,color:th.ink,lineHeight:1.1}}>{d.title}</div></div><svg width={1720} height={SH+40} viewBox={"0 0 1720 "+(SH+40)} style={{position:"absolute",left:100,top:200,overflow:"visible"}}><g opacity={lr}><text x={LX+CW/2} y={30} textAnchor="middle" fill={th.muted} fontSize={18} fontWeight={700} fontFamily={th.fm} letterSpacing={3}>LUAT CU</text><line x1={LX} y1={48} x2={LX+CW} y2={48} stroke={th.muted} strokeWidth={1} strokeOpacity={0.3}/></g><g opacity={rr}><text x={RX+CW/2} y={30} textAnchor="middle" fill={th.a1} fontSize={18} fontWeight={700} fontFamily={th.fm} letterSpacing={3}>LUAT MOI 2024</text><line x1={RX} y1={48} x2={RX+CW} y2={48} stroke={th.a1} strokeWidth={1.5} strokeOpacity={0.5}/></g><NF_EL x1={CW+LX+40} y1={0} x2={CW+LX+40} y2={SH} progress={dr} color={th.line} sw={1} ah={false}/>{d.before.items.map((it,i)=><g key={i} opacity={lr}><NF_NB x={LX} y={SY+i*CG} w={CW} h={CH} label={it.label} sublabel={it.value} active={false} activePct={1} color={th.muted} textSize={17} th={th}/></g>)}{d.after.items.map((it,i)=><g key={i} opacity={rr}><NF_NB x={RX} y={SY+i*CG} w={CW} h={CH} label={it.label} sublabel={it.value} active={true} activePct={1} color={it.highlight?th.a2:th.a1} textSize={17} th={th}/>{it.highlight && <NF_DB x={RX+CW+8} y={SY+i*CG+CH/2-8} value="MOI" activePct={br} color={th.a2} th={th}/>}</g>)}</svg></div>;
}
function NF_S6({ frame, fps, W, H, content: d, th }) {
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

const prodSelect = document.getElementById("prod-select");
const fmtBtns = document.getElementById("format-btns");
const resChip = document.getElementById("res-chip");
const tplBadge = document.getElementById("template-badge");
const safeToggle = document.getElementById("safe-toggle");

PRODUCTIONS.forEach((p,i)=>{const opt=document.createElement("option");opt.value=i;opt.textContent=p.name;prodSelect.appendChild(opt);});

let currentFmt="16:9",currentPi=0,onFormatChange=null,onSafeToggle=null;
function renderFmtBtns(){const tpl=PRODUCTIONS[currentPi].template;const supported=TEMPLATE_FORMATS[tpl]||["16:9"];fmtBtns.innerHTML="";["16:9","9:16"].forEach(f=>{const btn=document.createElement("button");const isSupported=supported.includes(f);btn.className="format-btn "+(f===currentFmt?"active":"")+(!isSupported?" disabled":"");btn.textContent=f;if(!isSupported)btn.title=PRODUCTIONS[currentPi].template+" does not support "+f;btn.onclick=()=>{if(!isSupported)return;currentFmt=f;renderFmtBtns();updateRes();onFormatChange&&onFormatChange(f);};fmtBtns.appendChild(btn);});}
function updateRes(){const c=CANVAS[currentFmt];resChip.textContent=c.w+" x "+c.h;}
function updateTplBadge(){tplBadge.textContent=PRODUCTIONS[currentPi].template;}
renderFmtBtns();updateTplBadge();
let safeOn=false;
safeToggle.onclick=()=>{safeOn=!safeOn;safeToggle.classList.toggle("active",safeOn);onSafeToggle&&onSafeToggle(safeOn);};

const root = ReactDOM.createRoot(document.getElementById("root"));
function AppWrapper(){
  const [fmt,setFmt]=useState("16:9");
  const [pi,setPi]=useState(0);
  const [showSafe,setShowSafe]=useState(false);
  onFormatChange=setFmt;onSafeToggle=setShowSafe;
  useEffect(()=>{prodSelect.onchange=(e)=>{const newPi=parseInt(e.target.value);setPi(newPi);currentPi=newPi;const tpl=PRODUCTIONS[newPi].template;const supported=TEMPLATE_FORMATS[tpl]||["16:9"];if(!supported.includes(currentFmt)){currentFmt=supported[0];setFmt(currentFmt);updateRes();}renderFmtBtns();updateTplBadge();};},[]);
  return <AppInner fmt={fmt} pi={pi} showSafe={showSafe}/>;
}
function AppInner({fmt,pi,showSafe}){
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
  const canvas=CANVAS[fmt];
  const maxW=960;
  const scale=fmt==="9:16"?Math.min(maxW/canvas.w,(maxW*1.5)/canvas.h):maxW/canvas.w;
  const cw=Math.round(canvas.w*scale),ch=Math.round(canvas.h*scale);
  const renderers=prod.template==="cr7"?CR7_SCENES:NF_SCENES;
  const sceneData=si>=0?scenes[si]:null;
  const content=sceneData?prod.content[sceneData.id]:null;
  const SceneComp=content?renderers[content.kind]:null;
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
            {SceneComp && <SceneComp frame={frame} fps={FPS} W={canvas.w} H={canvas.h} content={content} th={th}/>}
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
