"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

/* ── TYPES ── */
interface User { name: string; email: string; loggedIn: boolean; }

/* ── DATA ── */
const FEATURES = [
  { icon: "📚", title: "Question Bank (QBank)", desc: "4,000+ EMLE-level clinical vignettes across all major subjects, with detailed explanations, ECGs, X-rays and images.", tag: "4,000+ Questions", color: "rgba(0,87,255,.08)" },
  { icon: "🎓", title: "Tutor & Timed Modes", desc: "Tutor Mode shows instant explanations after each answer. Timed Mode simulates the real 100-question, 3-hour EMLE exam.", tag: "Real Simulation", color: "rgba(0,201,167,.08)" },
  { icon: "🤖", title: "AI Question Generator", desc: "Upload your own PDF notes or images — our AI creates custom EMLE-level questions targeting your exact weak areas.", tag: "AI-Powered", color: "rgba(245,158,11,.08)" },
  { icon: "🃏", title: "Smart Flashcards", desc: "Anki-style spaced repetition with 2,000+ expert-made ReadyDecks. Build your own cards or let AI generate them.", tag: "Spaced Repetition", color: "rgba(16,185,129,.08)" },
  { icon: "📊", title: "Performance Analytics", desc: "Heatmaps, subject mastery levels (1–5 stars), national average comparison, and AI-predicted EMLE score.", tag: "AI Predictions", color: "rgba(239,68,68,.08)" },
  { icon: "📝", title: "Realistic Mock Exams", desc: "Up to 3 full-length EMLE simulations — exact subject distribution, 100 questions, 3-hour timer — with score prediction.", tag: "EMLE-Realistic", color: "rgba(139,92,246,.08)" },
];

const SUBJECTS = [
  { icon: "❤️", name: "Internal Medicine",       qs: "1,200+", pct: 85, color: "#EF4444", exam: "25–30% of EMLE" },
  { icon: "🔬", name: "General Surgery",          qs: "1,000+", pct: 75, color: "#3B82F6", exam: "20–30% of EMLE" },
  { icon: "👶", name: "Pediatrics",               qs: "800+",   pct: 65, color: "#10B981", exam: "15–25% of EMLE" },
  { icon: "🤰", name: "Obstetrics & Gynecology",  qs: "750+",   pct: 60, color: "#A855F7", exam: "15–25% of EMLE" },
  { icon: "🚑", name: "Emergency Medicine",       qs: "300+",   pct: 42, color: "#F59E0B", exam: "Integrated topics" },
  { icon: "🧪", name: "Psychiatry + Public Health + Basic Sciences", qs: "400+", pct: 45, color: "#64748B", exam: "Integrated topics" },
];

const PLANS = [
  { dur: "30 Days",  price: 499,  ai: "50 AI Generations",       popular: false, features: ["Full QBank (4,000+ Qs)", "ReadyDecks (2,000+ cards)", "SmartCards", "Medical Library", "Performance Analytics"], missing: ["Mock Exams", "Smart Study Planner"] },
  { dur: "90 Days",  price: 999,  ai: "150 AI Generations",      popular: true,  features: ["Full QBank (4,000+ Qs)", "ReadyDecks (2,000+ cards)", "SmartCards + AI Coach", "Medical Library", "Performance Analytics", "1 Full Mock Exam", "AI Study Coach"], missing: [] },
  { dur: "180 Days", price: 1499, ai: "300 AI Generations",      popular: false, features: ["Full QBank (4,000+ Qs)", "ReadyDecks (2,000+ cards)", "SmartCards + AI Coach", "Medical Library", "Performance Analytics", "2 Full Mock Exams", "Smart Study Planner"], missing: [] },
  { dur: "360 Days", price: 2299, ai: "Unlimited AI ♾️",         popular: false, features: ["Full QBank (4,000+ Qs)", "ReadyDecks (2,000+ cards)", "Unlimited AI Coach ♾️", "Medical Library", "Advanced Analytics", "3 Full Mock Exams", "Everything included"], missing: [] },
];

const TESTIMONIALS = [
  { name: "Dr. Mohamed Hassan",  role: "Kasr Al-Ainy · 2024", avatar: "M", color: "#0057FF", result: "Passed on first attempt",    quote: "The platform completely changed how I study. Clinical vignettes forced me to think, not just memorize. Passed EMLE on my first attempt!" },
  { name: "Dr. Sara Ibrahim",    role: "Ain Shams · 2024",    avatar: "S", color: "#A855F7", result: "Excellent EMLE score",        quote: "The spaced repetition flashcards are incredible. Two weeks of SmartCards and the material actually stuck. The AI Coach explains everything clearly." },
  { name: "Dr. Ahmed Farouk",    role: "Alexandria · 2024",   avatar: "A", color: "#10B981", result: "'Very High' pass probability", quote: "The analytics showed me exactly what to focus on in the final two weeks. The mock exams are so realistic that the actual EMLE felt familiar." },
];

const HIW_STEPS = [
  { num: "1", title: "Register & Start Free",     desc: "7-day free trial with 100 questions and 10 AI generations. No credit card required." },
  { num: "2", title: "Take a Diagnostic Quiz",    desc: "AI identifies your weak areas and builds a personalized study plan automatically." },
  { num: "3", title: "Study Smart",               desc: "QBank + explanations + SmartCards + Medical Library — fully integrated for maximum retention." },
  { num: "4", title: "Simulate & Track Progress", desc: "Take full EMLE mock exams and see your predicted score before the real exam day." },
];

const PROMOS: Record<string, number> = { EMLE2025: 20, WELCOME: 10, DOCTOR: 15, SAVE30: 30 };

/* ── COUNTER HOOK ── */
function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const step = target / 60;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(Math.floor(cur));
      if (cur >= target) clearInterval(t);
    }, 24);
    return () => clearInterval(t);
  }, [active, target]);
  return val;
}

/* ── MOCKUP TIMER ── */
function MockupTimer() {
  const [secs, setSecs] = useState(9808);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  const fmt = (n: number) => String(n).padStart(2, "0");
  return <span className="font-mono font-bold text-white text-sm">{fmt(h)}:{fmt(m)}:{fmt(s)}</span>;
}

/* ══════════════════════════════════
   HOMEPAGE COMPONENT
══════════════════════════════════ */
export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const c1 = useCounter(4000, statsVisible);
  const c2 = useCounter(92, statsVisible);
  const c3 = useCounter(12000, statsVisible);

  // Init
  useEffect(() => {
    const saved = localStorage.getItem("emle_theme") || "light";
    if (saved === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
    const u = localStorage.getItem("emle_user");
    if (u) { try { setUser(JSON.parse(u)); } catch {} }
  }, []);

  // IntersectionObserver for stats
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.4 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("emle_theme", next ? "dark" : "light");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogout = () => {
    localStorage.removeItem("emle_user");
    setUser(null);
    showToast("Logged out successfully.");
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) { setPromoMsg({ text: "Please enter a promo code.", ok: false }); return; }
    const disc = PROMOS[code];
    if (disc) {
      setPromoMsg({ text: `✅ Code applied! ${disc}% discount activated.`, ok: true });
      showToast(`🎉 ${disc}% discount applied!`);
    } else {
      setPromoMsg({ text: "❌ Invalid or expired promo code.", ok: false });
    }
  };

  const addToCart = (plan: typeof PLANS[0]) => {
    localStorage.setItem("emle_cart", JSON.stringify({ name: plan.dur + " Plan", price: plan.price }));
    showToast(`✅ "${plan.dur} Plan" added to cart!`);
    setTimeout(() => window.location.href = "/pricing", 900);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="max-w-[1180px] mx-auto px-6 h-full flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[17px] flex-shrink-0" style={{ color: "var(--text)" }}>
            <div className="logo-mark w-[34px] h-[34px] rounded-[9px] flex items-center justify-center" style={{ background: "var(--blue)", boxShadow: "0 4px 12px rgba(0,87,255,.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color: "var(--blue)" }}>QBank</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1 mx-5">
            {[["Home","/#"],["QBank","/qbank"],["AI Generator","/ai-generator"],["Pricing","/pricing"],["Dashboard","/dashboard"]].map(([label, href]) => (
              <Link key={href} href={href} className="px-3 py-[7px] rounded-lg text-sm font-semibold transition-all" style={{ color: "var(--text-mid)" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.cssText="color:var(--blue);background:var(--blue-soft)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.cssText="color:var(--text-mid);background:transparent"; }}>
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-110" style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}>
              {dark ? "☀️" : "🌙"}
            </button>
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold" style={{ background: "var(--blue-glow)", color: "var(--blue)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: "var(--blue)" }}>{user.name[0]}</div>
                  Dr. {user.name.split(" ")[0]}
                </div>
                <button onClick={handleLogout} className="btn-danger btn text-xs px-3 py-[7px]">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block px-4 py-2 rounded-lg text-sm font-bold transition-all" style={{ color: "var(--blue)", background: "var(--blue-soft)" }}>Log In</Link>
                <Link href="/register" className="btn btn-primary text-sm px-4 py-2">Start Free Trial</Link>
              </>
            )}
            <button className="md:hidden text-2xl" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)" }} onClick={() => setMobileOpen(o => !o)}>☰</button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 py-3 px-4 flex flex-col gap-1" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            {[["Home","/#"],["QBank","/qbank"],["AI Generator","/ai-generator"],["Pricing","/pricing"],["Dashboard","/dashboard"]].map(([l,h]) => (
              <Link key={h} href={h} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold" style={{ color: "var(--text-mid)" }}>{l}</Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="flex-1 py-2 text-center rounded-lg text-sm font-bold" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>Log In</Link>
              <Link href="/register" className="flex-1 py-2 text-center rounded-lg text-sm font-bold text-white" style={{ background: "var(--blue)" }}>Start Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0" style={{ background: dark ? "linear-gradient(145deg,#0A1628 0%,#0D1B35 55%,#0A1F3A 100%)" : "linear-gradient(145deg,#EEF4FF 0%,#F5F7FA 55%,#E8F5FF 100%)" }}/>
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)`, backgroundSize: "48px 48px", opacity: .4 }}/>
        <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(0,87,255,.08) 0%,transparent 65%)" }}/>

        <div className="max-w-[1180px] mx-auto px-6 py-20 w-full grid md:grid-cols-2 gap-16 items-center relative z-10">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full mb-6 text-sm font-semibold animate-fade-up delay-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-mid)", boxShadow: "var(--shadow)" }}>
              <span className="w-2 h-2 rounded-full animate-blink" style={{ background: "var(--green)" }}/>
              Egypt&apos;s #1 EMLE Preparation Platform
            </div>

            <h1 className="font-extrabold leading-tight tracking-tight mb-3 animate-fade-up delay-2" style={{ fontSize: "clamp(36px,4.5vw,60px)", letterSpacing: "-.025em" }}>
              Pass the <span style={{ color: "var(--blue)" }}>EMLE</span><br/>on Your First Try
            </h1>
            <p className="mb-4 animate-fade-up delay-2" style={{ fontSize: "clamp(18px,2vw,26px)", fontStyle: "italic", color: "var(--text-muted)", fontFamily: "Georgia, serif" }}>
              &ldquo;Master the exam, not just the content.&rdquo;
            </p>
            <p className="mb-8 leading-relaxed animate-fade-up delay-3" style={{ fontSize: "16px", color: "var(--text-mid)", maxWidth: "480px" }}>
              4,000+ high-yield clinical vignette questions, AI-powered question generation, spaced-repetition flashcards, and analytics that reveal exactly where you need to focus.
            </p>

            <div className="flex gap-3 flex-wrap mb-10 animate-fade-up delay-4">
              <Link href="/register" className="btn btn-primary btn-xl">🚀 Start Free – 7 Days</Link>
              <Link href="/qbank"    className="btn btn-outline btn-xl">▶ Try a Free Exam</Link>
            </div>

            <div className="flex gap-8 animate-fade-up delay-5">
              {[["4,000+","EMLE Questions"],["92%","Pass Rate"],["12K+","Enrolled Doctors"]].map(([n,l]) => (
                <div key={l}>
                  <div className="text-2xl font-black" style={{ color: "var(--blue)" }}>{n}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – MOCKUP */}
          <div className="hidden md:flex justify-center relative">
            {/* Float cards */}
            <div className="absolute top-[-18px] left-[-24px] px-4 py-3 rounded-2xl flex items-center gap-3 z-10 animate-float" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
              <span className="text-xl">🧠</span>
              <div><div className="text-xs" style={{ color: "var(--text-muted)" }}>AI Pass Prediction</div><div className="text-sm font-black" style={{ color: "var(--green)" }}>Very High ✓</div></div>
            </div>

            <div className="rounded-3xl overflow-hidden animate-float" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(13,27,42,.12)", maxWidth: "440px", width: "100%", animationDelay: ".5s" }}>
              {/* Header */}
              <div className="px-5 py-[13px] flex items-center justify-between" style={{ background: "var(--blue)" }}>
                <span className="text-white text-sm font-bold flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
                  EMLE QBank
                </span>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,.2)" }}>
                  <MockupTimer/>
                </div>
              </div>
              {/* Body */}
              <div className="p-5">
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="badge text-[10px]" style={{ background: "rgba(239,68,68,.1)", color: "#DC2626" }}>Internal Medicine</span>
                  <span className="badge text-[10px]" style={{ background: "rgba(139,92,246,.1)", color: "#7C3AED" }}>Pulmonology</span>
                  <span className="ml-auto text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Q 37 / 100</span>
                </div>
                <p className="text-sm font-semibold leading-relaxed mb-4" style={{ color: "var(--text)" }}>
                  A 55-year-old man presents with sudden-onset dyspnea and right pleuritic chest pain. He returned from a long-haul flight 3 days ago. SpO₂ is 91%, HR 112 bpm. D-dimer is markedly elevated.
                </p>
                <div className="flex flex-col gap-[6px] mb-3">
                  {["Start IV antibiotics immediately","Start heparin + CT pulmonary angiography ✓","Immediate thrombolysis with tPA","Bedside echocardiography and wait","Oral aspirin and observation"].map((opt, i) => (
                    <div key={i} className={`flex items-start gap-2 p-[9px] rounded-lg text-xs border-[1.5px] ${i===1?"border-green-400 bg-green-50 text-green-700 font-bold":i===0?"border-red-400 bg-red-50 text-red-600":"text-[var(--text-mid)]"}`} style={{ borderColor: i===1?"#10B981":i===0?"#EF4444":"var(--border)", background: i===1?"rgba(16,185,129,.07)":i===0?"rgba(239,68,68,.06)":"var(--bg-card)" }}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${i===1?"bg-green-500 text-white":i===0?"bg-red-500 text-white":""}`} style={{ background: i===1?"#10B981":i===0?"#EF4444":"var(--border)", color: i<=1?"#fff":"var(--text-muted)" }}>
                        {"ABCDE"[i]}
                      </div>
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg text-xs" style={{ background: "var(--blue-soft)", borderRight: "3px solid var(--blue)" }}>
                  <div className="font-bold mb-1" style={{ color: "var(--blue)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px" }}>💡 Tutor Mode</div>
                  <p style={{ color: "var(--text-mid)", lineHeight: 1.65 }}>DVT + sudden dyspnea + long flight = classic PE. Hemodynamically stable → start Heparin immediately, confirm with CTPA (Gold Standard).</p>
                </div>
              </div>
              {/* Footer progress */}
              <div className="px-5 py-3 flex items-center gap-3" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>37%</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full" style={{ width: "37%", background: "var(--blue)" }}/>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 right-[-20px] px-4 py-3 rounded-2xl flex items-center gap-3 z-10" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", animation: "float 5s ease-in-out infinite 1.2s" }}>
              <span className="text-xl">📈</span>
              <div><div className="text-xs" style={{ color: "var(--text-muted)" }}>Internal Medicine Mastery</div><div className="text-sm font-black" style={{ color: "var(--blue)" }}>⭐⭐⭐⭐☆ 4.2</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="py-5 overflow-x-auto" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[1180px] mx-auto px-6 flex items-center gap-6 whitespace-nowrap min-w-max">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Trusted by graduates of</span>
          <div className="w-px h-6" style={{ background: "var(--border)" }}/>
          {["🏥 Kasr Al-Ainy","🏥 Ain Shams","🏥 Alexandria","🏥 Assiut","🏥 Mansoura","🏥 Zagazig","🏥 Tanta","🏥 Banha"].map(s => (
            <span key={s} className="text-sm font-bold transition-all cursor-default hover:text-blue-600" style={{ color: "var(--text-muted)", opacity: .7 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-black uppercase tracking-[1.8px] block mb-3" style={{ color: "var(--blue-light)" }}>Platform Features</span>
            <h2 className="font-extrabold mb-3" style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.01em" }}>Everything You Need to Pass EMLE</h2>
            <p className="text-base mx-auto" style={{ color: "var(--text-mid)", maxWidth: "540px", lineHeight: 1.75 }}>From question banks to AI generation, flashcards, and analytics — all in one place.</p>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="card p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group cursor-default" style={{ borderColor: "var(--border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5" style={{ background: f.color }}>{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-mid)" }}>{f.desc}</p>
                <span className="badge badge-blue text-[11px]">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section ref={statsRef} className="py-16 relative overflow-hidden" style={{ background: "var(--navy)" }}>
        <div className="absolute inset-0" style={{ background: "url(\"data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='1.5' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/svg%3E\")" }}/>
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[[c1,"","EMLE-Level Questions"],[c2,"%","User Pass Rate"],[c3,"","Enrolled Doctors"],["4.9","★","Average Rating"]].map(([v,s,l], i) => (
            <div key={i}>
              <div className="font-black text-white mb-2" style={{ fontSize: "48px", lineHeight: 1, letterSpacing: "-.03em" }}>
                <span style={{ color: "#00C9A7" }}>{v}</span>{s}
              </div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,.6)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[1.8px] block mb-3" style={{ color: "var(--blue-light)" }}>How It Works</span>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.01em" }}>Four Steps to EMLE Success</h2>
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 relative">
            <div className="hidden md:block absolute top-9 left-[14%] right-[14%] h-0.5" style={{ background: "linear-gradient(to right,var(--border),var(--blue-light),var(--border))" }}/>
            {HIW_STEPS.map((s, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-5" style={{ background: "var(--blue)", boxShadow: "var(--shadow-blue)", border: "4px solid var(--bg)" }}>{s.num}</div>
                <h3 className="font-bold text-base mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section className="py-16" style={{ paddingTop: 0 }}>
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-black uppercase tracking-[1.8px] block mb-3" style={{ color: "var(--blue-light)" }}>Subject Coverage</span>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.01em" }}>Full EMLE Curriculum</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Distributed exactly as the official EMLE exam specifications.</p>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
            {SUBJECTS.map((s, i) => (
              <div key={i} className="card p-5 flex items-center gap-4 transition-all hover:border-blue-400 hover:-translate-x-1 cursor-default" style={{ borderColor: "var(--border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${s.color}18` }}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm mb-1 truncate">{s.name}</div>
                  <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{s.qs} questions</div>
                  <div className="h-1 rounded-full overflow-hidden mb-1" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }}/>
                  </div>
                  <div className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>{s.exam}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20" style={{ background: "var(--bg-card)" }}>
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-[1.8px] block mb-3" style={{ color: "var(--blue-light)" }}>Pricing</span>
            <h2 className="font-extrabold mb-2" style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.01em" }}>Choose Your Plan</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>All plans include a 7-day free trial. Prices in Egyptian Pounds (EGP).</p>
          </div>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
            {PLANS.map((plan, i) => (
              <div key={i} className={`rounded-2xl border-2 p-6 flex flex-col transition-all duration-200 relative overflow-hidden ${plan.popular ? "scale-[1.04] shadow-2xl" : "hover:-translate-y-1 hover:shadow-xl"}`}
                style={{ background: plan.popular ? "var(--blue)" : "var(--bg)", borderColor: plan.popular ? "var(--blue)" : "var(--border)" }}>
                {plan.popular && <div className="absolute top-3 right-3 text-[10px] font-black px-3 py-1 rounded-full" style={{ background: "#FFD166", color: "#000" }}>⭐ Most Popular</div>}
                <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: plan.popular ? "rgba(255,255,255,.65)" : "var(--text-muted)" }}>{plan.dur}</div>
                <div className="font-black mb-1 leading-none" style={{ fontSize: "38px", color: plan.popular ? "#fff" : "var(--text)", letterSpacing: "-.02em" }}>
                  <span className="text-sm font-bold" style={{ verticalAlign: "top", marginTop: "8px", display: "inline-block" }}>EGP </span>{plan.price.toLocaleString()}
                </div>
                <div className="text-xs mb-3" style={{ color: plan.popular ? "rgba(255,255,255,.6)" : "var(--text-muted)" }}>{plan.price === 499 ? "One month" : plan.price === 999 ? "3 months" : plan.price === 1499 ? "6 months" : "Full year"}</div>
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold mb-4 w-fit" style={{ background: plan.popular ? "rgba(255,255,255,.15)" : "var(--blue-soft)", color: plan.popular ? "#fff" : "var(--blue)" }}>🤖 {plan.ai}</div>
                <div className="h-px mb-4" style={{ background: plan.popular ? "rgba(255,255,255,.2)" : "var(--border)" }}/>
                <div className="flex flex-col gap-2 flex-1 mb-5">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2 text-[13px]" style={{ color: plan.popular ? "rgba(255,255,255,.85)" : "var(--text-mid)" }}>
                      <span className="flex-shrink-0 font-black" style={{ color: plan.popular ? "#4ADE80" : "var(--green)" }}>✓</span>{f}
                    </div>
                  ))}
                  {plan.missing.map((f, j) => (
                    <div key={j} className="flex items-start gap-2 text-[13px] opacity-40" style={{ color: "var(--text-muted)" }}>
                      <span className="flex-shrink-0">✗</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={() => addToCart(plan)} className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer transition-all" style={{ background: plan.popular ? "#fff" : "var(--blue)", color: plan.popular ? "var(--blue)" : "#fff", border: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.background = plan.popular ? "#FFD166" : "var(--blue-dark)"; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = plan.popular ? "#fff" : "var(--blue)"; }}>
                  Subscribe Now
                </button>
                <div className="text-center mt-2 text-[11px]" style={{ color: plan.popular ? "rgba(255,255,255,.5)" : "var(--text-muted)" }}>7-day free trial ✓</div>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div className="max-w-sm mx-auto mt-10 text-center">
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>🏷️ Have a promo code?</p>
            <div className="flex gap-2">
              <input value={promoCode} onChange={e => setPromoCode(e.target.value)} onKeyDown={e => e.key === "Enter" && applyPromo()} placeholder="Enter promo code" className="flex-1 input-field" style={{ padding: "10px 14px" }}/>
              <button onClick={applyPromo} className="px-5 py-2 rounded-lg text-sm font-bold text-white" style={{ background: "var(--blue)", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Apply</button>
            </div>
            {promoMsg && <p className="mt-2 text-xs font-bold" style={{ color: promoMsg.ok ? "var(--green)" : "var(--red)" }}>{promoMsg.text}</p>}
          </div>

          {/* Payment methods */}
          <div className="text-center mt-8">
            <p className="text-xs uppercase tracking-wider font-bold mb-4" style={{ color: "var(--text-muted)" }}>Accepted Payment Methods</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {["💳 Visa / Mastercard","🏧 Fawry","📱 Vodafone Cash","🏦 InstaPay"].map(m => (
                <div key={m} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{m}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-black uppercase tracking-[1.8px] block mb-3" style={{ color: "var(--blue-light)" }}>Success Stories</span>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(26px,3.5vw,42px)", letterSpacing: "-.01em" }}>Doctors Who Passed EMLE With Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-7 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="text-base mb-4" style={{ color: "#FBBF24", letterSpacing: "2px" }}>★★★★★</div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "var(--text-mid)" }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-black text-white flex-shrink-0" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{t.role}</div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1" style={{ background: "rgba(16,185,129,.1)", color: "var(--green)" }}>✓ {t.result}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg,var(--navy) 0%,#0D2050 100%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%,rgba(0,87,255,.18),transparent 60%)" }}/>
        <div className="max-w-[700px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold mb-6" style={{ background: "rgba(0,201,167,.15)", color: "var(--teal)", border: "1px solid rgba(0,201,167,.25)" }}>🎯 Free Trial · No Credit Card Required</div>
          <h2 className="font-extrabold text-white mb-4" style={{ fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-.02em" }}>Ready to Pass EMLE?</h2>
          <p className="text-base mb-10" style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.75 }}>Join 12,000+ Egyptian doctors preparing smarter with EMLE QBank.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/register" className="btn btn-white btn-xl">🚀 Start Your Free Trial</Link>
            <Link href="/pricing" className="btn btn-ghost-white btn-xl">📋 View All Plans</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pt-14 pb-7" style={{ background: "#060F1D", color: "rgba(255,255,255,.75)" }}>
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-4 sm:grid-cols-2 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg text-white mb-3">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: "var(--blue)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              </div>
              EMLE QBank
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.5)", maxWidth: "240px" }}>Egypt&apos;s most advanced EMLE preparation platform. Built for Egyptian doctors, by Egyptian doctors.</p>
          </div>
          {[["Platform",[["QBank","/qbank"],["AI Generator","/ai-generator"],["Pricing","/pricing"],["Dashboard","/dashboard"]]],
            ["Resources",[["Medical Library","#"],["SmartCards","#"],["Mock Exams","#"],["Blog","#"]]],
            ["Support",[["Help Center","#"],["Contact Us","#"],["Privacy Policy","#"],["Terms","#"]]]].map(([title, links]) => (
            <div key={title as string}>
              <h4 className="text-[11px] font-bold uppercase tracking-[1.2px] mb-4" style={{ color: "rgba(255,255,255,.3)" }}>{title as string}</h4>
              {(links as [string,string][]).map(([l,h]) => (
                <Link key={l} href={h} className="block text-sm mb-2 transition-colors hover:text-teal-400" style={{ color: "rgba(255,255,255,.55)" }}>{l}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="max-w-[1180px] mx-auto px-6 pt-5 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <span className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>© 2025 EMLE QBank. All rights reserved. Made with ❤️ in Egypt.</span>
          <div className="flex gap-2">
            {["SSL 🔒","HIPAA","PCI DSS"].map(b => (
              <span key={b} className="px-2 py-1 rounded text-[11px] font-bold" style={{ border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.3)" }}>{b}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{ opacity: 1, transform: "translateY(0)" }}>{toast}</div>
      )}
    </div>
  );
}
