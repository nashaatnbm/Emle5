"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User { name: string; email: string; loggedIn: boolean; }

const SUBJECTS = [
  { icon:"❤️", name:"Internal Medicine", pct:80, color:"#EF4444", stars:4 },
  { icon:"🔬", name:"General Surgery",   pct:72, color:"#3B82F6", stars:3 },
  { icon:"👶", name:"Pediatrics",        pct:88, color:"#10B981", stars:4 },
  { icon:"🤰", name:"OB/GYN",           pct:64, color:"#A855F7", stars:3 },
  { icon:"🚑", name:"Emergency Med.",    pct:77, color:"#F59E0B", stars:4 },
];

const WEEKLY = [18,32,25,41,15,38,28];
const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DONUT  = [
  { label:"Internal Medicine", pct:34, color:"#EF4444" },
  { label:"General Surgery",   pct:26, color:"#3B82F6" },
  { label:"Pediatrics",        pct:19, color:"#10B981" },
  { label:"OB/GYN",           pct:13, color:"#A855F7" },
  { label:"Emergency",         pct:8,  color:"#F59E0B" },
];
const HEATMAP_INTENSITY = [
  0,0,1,2,3,2,1, 0,1,2,3,3,2,0,
  1,2,3,2,1,0,0, 0,1,3,3,2,1,0,
  1,2,2,3,2,1,0
];
const HM_COLORS = ["var(--border)","rgba(0,87,255,.2)","rgba(0,87,255,.48)","var(--blue)"];

export default function DashboardPage() {
  const [user, setUser] = useState<User>({ name:"Mohamed Hassan", email:"demo@emleqbank.com", loggedIn:true });
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [barsReady, setBarsReady] = useState(false);
  const [toast, setToast] = useState<string|null>(null);

  useEffect(() => {
    // Auth — auto-create demo session if none
    let u: User|null = null;
    try { u = JSON.parse(localStorage.getItem("emle_user") || "null"); } catch {}
    if (!u || !u.loggedIn) {
      u = { name:"Mohamed Hassan", email:"demo@emleqbank.com", loggedIn:true };
      localStorage.setItem("emle_user", JSON.stringify(u));
    }
    setUser(u);

    // Theme
    const t = localStorage.getItem("emle_theme") || "light";
    if (t === "dark") { setDark(true); document.documentElement.classList.add("dark"); }

    // Trigger bar animations
    setTimeout(() => setBarsReady(true), 380);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("emle_theme", next ? "dark" : "light");
  };
  const handleLogout = () => { localStorage.removeItem("emle_user"); window.location.href = "/"; };
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const first = user.name.split(" ")[0];
  const maxWeekly = Math.max(...WEEKLY);

  // Donut arc helper
  const buildDonut = () => {
    const CX=55, CY=55, R=38, SW=14;
    const CIRC = 2*Math.PI*R;
    let offset = 0;
    return DONUT.map(d => {
      const dash = (d.pct/100)*CIRC;
      const gap  = CIRC - dash;
      const rotate = (offset/100)*360 - 90;
      offset += d.pct;
      return { ...d, dash, gap, rotate };
    });
  };

  const s = { background:"var(--bg)", color:"var(--text)" };

  return (
    <div className="min-h-screen" style={s}>

      {/* NAVBAR */}
      <nav className="navbar" style={{ background:"rgba(240,244,248,.95)" }}>
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[17px] flex-shrink-0" style={{ color:"var(--text)" }}>
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center" style={{ background:"var(--blue)", boxShadow:"0 4px 12px rgba(0,87,255,.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color:"var(--blue)" }}>QBank</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1 mx-5">
            {[["Home","/"],["QBank","/qbank"],["AI Generator","/ai-generator"],["Pricing","/pricing"],["Dashboard","/dashboard"]].map(([l,h]) => (
              <Link key={h} href={h} className="px-3 py-[7px] rounded-lg text-sm font-semibold transition-all" style={{ color: h==="/dashboard"?"var(--blue)":"var(--text-mid)", background: h==="/dashboard"?"var(--blue-glow)":"transparent" }}>{l}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center text-sm" style={{ border:"1px solid var(--border)", background:"var(--bg-card)", cursor:"pointer" }}>
              {dark?"☀️":"🌙"}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold" style={{ background:"var(--blue-glow)", color:"var(--blue)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background:"var(--blue)" }}>{first[0]}</div>
              Dr. {first}
            </div>
            <button onClick={handleLogout} className="btn-danger btn text-xs px-3 py-[7px]" style={{ padding:"7px 14px" }}>Log Out</button>
            <button className="md:hidden text-2xl" style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text)" }} onClick={() => setMobileOpen(o=>!o)}>☰</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 py-3 px-4 flex flex-col gap-1 z-50" style={{ background:"var(--bg-card)", borderBottom:"1px solid var(--border)" }}>
            {[["Home","/"],["QBank","/qbank"],["AI Generator","/ai-generator"],["Pricing","/pricing"],["Dashboard","/dashboard"]].map(([l,h]) => (
              <Link key={h} href={h} onClick={()=>setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold" style={{ color:"var(--text-mid)" }}>{l}</Link>
            ))}
          </div>
        )}
      </nav>

      {/* PAGE */}
      <div className="max-w-[1280px] mx-auto px-6 pt-[88px] pb-16">

        {/* WELCOME */}
        <div className="rounded-2xl p-7 mb-6 flex items-center justify-between gap-6 relative overflow-hidden" style={{ background:"linear-gradient(135deg,#0A1628 0%,#0D2357 55%,#0A3080 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.2' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")" }}/>
          <div className="absolute top-[-100px] right-[-60px] w-[340px] h-[340px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(0,87,255,.22),transparent 65%)" }}/>
          <div className="relative z-10 text-white">
            <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color:"rgba(255,255,255,.55)" }}>🌟 Welcome back</div>
            <div className="text-2xl font-extrabold tracking-tight mb-2">Dr. {user.name}</div>
            <div className="text-sm" style={{ color:"rgba(255,255,255,.6)" }}>Last session: Yesterday, 9:00 PM &nbsp;·&nbsp; 3 tasks suggested today 📋</div>
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background:"rgba(0,201,167,.18)", border:"1px solid rgba(0,201,167,.3)", color:"#4ADE80" }}>🎯 Free Trial: 5 days remaining</div>
          </div>
          <div className="flex gap-3 flex-shrink-0 relative z-10 flex-wrap">
            <Link href="/qbank" className="px-5 py-[10px] rounded-xl text-sm font-bold" style={{ background:"#fff", color:"var(--blue)", border:"none", cursor:"pointer" }}>🚀 Start Studying</Link>
            <Link href="/ai-generator" className="px-5 py-[10px] rounded-xl text-sm font-bold" style={{ background:"rgba(255,255,255,.1)", color:"#fff", border:"1.5px solid rgba(255,255,255,.2)", cursor:"pointer" }}>🤖 AI Generator</Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon:"📚", num:"247",  label:"Questions Answered",    pct:"24.7%", color:"var(--blue)",   pill:"pill-g", pillTxt:"+12 today"  },
            { icon:"✅", num:"80%",  label:"Overall Accuracy",      pct:"80%",   color:"var(--green)",  pill:"pill-g", pillTxt:"↑ from 78%" },
            { icon:"🏆", num:"73",   label:"Predicted EMLE Score",  pct:"73%",   color:"var(--amber)",  pill:"pill-a", pillTxt:"AI Prediction" },
            { icon:"🔥", num:"18",   label:"Day Study Streak",      pct:null,    color:"var(--purple)", pill:"pill-p", pillTxt:"12 sessions" },
          ].map((c, i) => (
            <div key={i} className="card p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background:`${c.color}18` }}>{c.icon}</div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.pill==="pill-g"?"pill-g":c.pill==="pill-a"?"":"pill-p"}`} style={{ background:`${c.color}18`, color:c.color }}>{c.pillTxt}</span>
              </div>
              <div className="text-3xl font-black mb-1" style={{ color:c.color, letterSpacing:"-.02em" }}>{c.num}</div>
              <div className="text-xs font-medium" style={{ color:"var(--text-muted)" }}>{c.label}</div>
              {c.pct && <div className="h-1 rounded-full overflow-hidden mt-3" style={{ background:"var(--border)" }}><div className="h-full rounded-full transition-all duration-1000" style={{ width:barsReady?c.pct:"0%", background:c.color }}/></div>}
              {!c.pct && (
                <div className="flex gap-[3px] flex-wrap mt-3">
                  {Array.from({length:21},(_,j)=>(
                    <div key={j} className="w-[10px] h-[10px] rounded-sm" style={{ background:j<18?`rgba(139,92,246,${(0.3+j/17*0.7).toFixed(2)})` :"var(--border)" }}/>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid xl:grid-cols-[1fr_360px] gap-5">

          {/* LEFT */}
          <div className="space-y-5">

            {/* QUICK ACTIONS */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-extrabold">⚡ Quick Actions</h2>
                <Link href="/qbank" className="text-xs font-bold" style={{ color:"var(--blue)" }}>View All →</Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                {[
                  {icon:"📝",label:"QBank",sub:"New quiz",href:"/qbank"},
                  {icon:"🎓",label:"Tutor Mode",sub:"With explanations",href:"/qbank"},
                  {icon:"⏱",label:"Full Mock",sub:"100 Qs · 3H",href:"/qbank"},
                  {icon:"🤖",label:"AI Generator",sub:"From your notes",href:"/ai-generator"},
                  {icon:"🃏",label:"SmartCards",sub:"47 due",href:"#"},
                  {icon:"🏆",label:"Upgrade",sub:"Unlock all",href:"/pricing"},
                ].map((t,i)=>(
                  <Link key={i} href={t.href} onClick={t.href==="#"?e=>{e.preventDefault();showToast("SmartCards — Coming Soon! 🃏");}:undefined}
                    className="flex flex-col items-center gap-2 p-5 rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-md"
                    style={{ border:"1.5px solid var(--border)", background:"var(--bg)", textDecoration:"none" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.cssText+="border-color:var(--blue);background:var(--blue-soft)"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.cssText+="border-color:var(--border);background:var(--bg)"}}>
                    <div className="text-3xl">{t.icon}</div>
                    <div className="text-xs font-bold" style={{ color:"var(--text-mid)" }}>{t.label}</div>
                    <div className="text-[10px]" style={{ color:"var(--text-muted)" }}>{t.sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SUBJECT PERFORMANCE */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-extrabold">📊 Performance by Subject</h2>
                <button onClick={()=>showToast("Full report coming soon!")} className="text-xs font-bold" style={{ color:"var(--blue)", background:"none", border:"none", cursor:"pointer" }}>Full Report →</button>
              </div>
              <div>
                {SUBJECTS.map((s,i)=>(
                  <div key={i} className="flex items-center gap-3 py-[11px]" style={{ borderBottom:i<SUBJECTS.length-1?"1px solid var(--border)":"none" }}>
                    <span className="text-lg flex-shrink-0">{s.icon}</span>
                    <span className="text-sm font-bold min-w-[130px]">{s.name}</span>
                    <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background:"var(--border)" }}>
                      <div className="h-full rounded-full transition-all duration-[1200ms]" style={{ width:barsReady?`${s.pct}%`:"0%", background:s.color }}/>
                    </div>
                    <span className="text-xs font-black min-w-[38px] text-right" style={{ color:s.color }}>{s.pct}%</span>
                    <span className="text-xs min-w-[60px] text-right" style={{ color:"#FBBF24" }}>{"⭐".repeat(s.stars)}{"☆".repeat(5-s.stars)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WEEKLY CHART */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold">📈 Questions This Week</h2>
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color:"var(--blue-light)" }}>Last 7 Days</span>
              </div>
              <div className="h-[120px] flex items-end gap-[5px]">
                {WEEKLY.map((v,i)=>(
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full rounded-t-[4px] transition-all duration-1000 cursor-pointer hover:opacity-75 min-h-[4px]"
                      style={{ height:barsReady?`${(v/maxWeekly*88).toFixed(1)}%`:"0%", background:["#0057FF","#3B82F6","#0057FF","#10B981","#EF4444","#0057FF","#F59E0B"][i], opacity:.82 }}
                      title={`${v} questions on ${DAYS[i]}`}/>
                    <div className="text-[9px] font-semibold" style={{ color:"var(--text-muted)" }}>{DAYS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DONUT */}
            <div className="card p-6">
              <h2 className="text-base font-extrabold mb-4">🥧 Questions by Subject</h2>
              <div className="flex items-center gap-5">
                <svg width="110" height="110" viewBox="0 0 110 110" className="flex-shrink-0">
                  {buildDonut().map((d,i)=>(
                    <circle key={i} cx="55" cy="55" r="38" fill="none" stroke={d.color} strokeWidth="14"
                      strokeDasharray={`${d.dash} ${2*Math.PI*38-d.dash}`}
                      transform={`rotate(${d.rotate} 55 55)`}/>
                  ))}
                  <circle cx="55" cy="55" r="28" fill="var(--bg-card)"/>
                  <text x="55" y="51" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text)" fontFamily="'Plus Jakarta Sans',sans-serif">247</text>
                  <text x="55" y="63" textAnchor="middle" fontSize="9" fill="var(--text-muted)" fontFamily="'Plus Jakarta Sans',sans-serif">total</text>
                </svg>
                <div className="flex flex-col gap-2 flex-1">
                  {DONUT.map((d,i)=>(
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-mid)" }}>
                      <div className="w-[10px] h-[10px] rounded-sm flex-shrink-0" style={{ background:d.color }}/>
                      <span>{d.label}</span>
                      <span className="font-extrabold ml-auto">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* UPGRADE BANNER */}
            <div className="rounded-2xl p-5 flex items-center gap-5" style={{ background:"linear-gradient(135deg,rgba(0,87,255,.07),rgba(0,201,167,.05))", border:"1px solid rgba(0,87,255,.16)" }}>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">🚀 Unlock Full Access</h4>
                <p className="text-xs" style={{ color:"var(--text-muted)" }}>You&apos;re on a free trial. Upgrade to access 4,000+ questions, mock exams, and unlimited AI generations.</p>
              </div>
              <Link href="/pricing" className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-bold text-white whitespace-nowrap" style={{ background:"var(--blue)", boxShadow:"0 4px 12px rgba(0,87,255,.3)" }}>View Plans →</Link>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">

            {/* SCORE CARD */}
            <div className="rounded-2xl p-6 text-center text-white relative overflow-hidden" style={{ background:"linear-gradient(135deg,var(--blue) 0%,var(--blue-dark) 100%)" }}>
              <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(255,255,255,.1),transparent 65%)" }}/>
              <div className="text-[10px] font-bold uppercase tracking-[1.2px] mb-3 opacity-65">Predicted EMLE Score</div>
              <div className="font-black leading-none mb-1" style={{ fontSize:"56px", letterSpacing:"-.04em" }}>73</div>
              <div className="text-sm opacity-60 mb-4">out of 100</div>
              <div className="h-[5px] rounded-full overflow-hidden mb-4" style={{ background:"rgba(255,255,255,.2)" }}>
                <div className="h-full rounded-full transition-all duration-[1200ms]" style={{ width:barsReady?"73%":"0%", background:"#4ADE80" }}/>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold" style={{ background:"rgba(255,255,255,.15)" }}>
                <span className="w-2 h-2 rounded-full animate-blink" style={{ background:"#4ADE80" }}/>
                Pass Probability: High
              </div>
            </div>

            {/* TODAY'S PLAN */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold">📋 Today&apos;s Study Plan</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--blue-light)" }}>3 tasks</span>
              </div>
              {[
                {icon:"❤️",bg:"rgba(239,68,68,.08)",name:"Internal Medicine",meta:"20 Cardiology questions",badge:"Weak",badgeClr:"rgba(239,68,68,.1)",badgeTxt:"var(--red)",href:"/qbank"},
                {icon:"👶",bg:"rgba(16,185,129,.08)",name:"Pediatrics",meta:"15 review questions",badge:"Strong",badgeClr:"rgba(16,185,129,.1)",badgeTxt:"var(--green)",href:"/qbank"},
                {icon:"🤖",bg:"rgba(245,158,11,.08)",name:"AI Generator",meta:"Surgery from notes",badge:"Suggested",badgeClr:"rgba(245,158,11,.1)",badgeTxt:"var(--amber)",href:"/ai-generator"},
                {icon:"🃏",bg:"rgba(139,92,246,.08)",name:"SmartCards",meta:"47 cards due today",badge:"Daily",badgeClr:"rgba(139,92,246,.1)",badgeTxt:"var(--purple)",href:"#"},
              ].map((t,i)=>(
                <Link key={i} href={t.href} onClick={t.href==="#"?e=>{e.preventDefault();showToast("SmartCards — Coming Soon! 🃏");}:undefined}
                  className="flex items-center gap-3 p-[11px] rounded-xl mb-1 transition-all" style={{ textDecoration:"none" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--blue-soft)"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"}}>
                  <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background:t.bg }}>{t.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{t.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color:"var(--text-muted)" }}>{t.meta}</div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-full whitespace-nowrap" style={{ background:t.badgeClr, color:t.badgeTxt }}>{t.badge}</span>
                </Link>
              ))}
            </div>

            {/* HEATMAP */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-extrabold">🗓️ Study Activity</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--blue-light)" }}>5 Weeks</span>
              </div>
              <div className="grid grid-cols-7 gap-[3px]">
                {HEATMAP_INTENSITY.map((v,i)=>(
                  <div key={i} className="rounded-[3px] cursor-pointer transition-transform hover:scale-125" style={{ background:HM_COLORS[v]||HM_COLORS[0], aspectRatio:"1" }}/>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-2 justify-end">
                <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>Less</span>
                {HM_COLORS.map((c,i)=><div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ background:c }}/>)}
                <span className="text-[10px]" style={{ color:"var(--text-muted)" }}>More</span>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="card p-6">
              <h2 className="text-base font-extrabold mb-4">🕐 Recent Activity</h2>
              {[
                { dot:"var(--green)",  text:"Solved 25 Internal Medicine questions — 88% accuracy", time:"2 hours ago" },
                { dot:"var(--blue)",   text:"Generated 10 AI questions on Pulmonology",             time:"Yesterday 11 PM" },
                { dot:"var(--amber)",  text:"Reviewed 32 Pediatrics SmartCards",                    time:"Yesterday 9 PM" },
                { dot:"var(--purple)", text:"Completed Full Mock Exam — Score: 72 / 100",           time:"3 days ago" },
                { dot:"var(--teal)",   text:"Added 15 AI-generated questions to QBank",             time:"4 days ago" },
              ].map((a,i,arr)=>(
                <div key={i} className="flex gap-3 py-[11px]" style={{ borderBottom:i<arr.length-1?"1px solid var(--border)":"none" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background:a.dot }}/>
                  <div>
                    <div className="text-sm leading-snug" style={{ color:"var(--text-mid)" }}>{a.text}</div>
                    <div className="text-[11px] mt-1" style={{ color:"var(--text-muted)" }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && <div className="toast" style={{ opacity:1, transform:"translateY(0)" }}>{toast}</div>}
    </div>
  );
}
