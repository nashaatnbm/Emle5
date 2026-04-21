"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function QBankPage() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const t = localStorage.getItem("emle_theme") || "light";
    if (t === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
  }, []);

  return (
    <div style={{ background:"var(--bg)", color:"var(--text)", minHeight:"100vh" }}>
      <nav className="navbar">
        <div className="max-w-[1180px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[17px]" style={{ color:"var(--text)" }}>
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center" style={{ background:"var(--blue)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color:"var(--blue)" }}>QBank</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={()=>{const n=!dark;setDark(n);document.documentElement.classList.toggle("dark",n);localStorage.setItem("emle_theme",n?"dark":"light");}} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border:"1px solid var(--border)", background:"var(--bg-card)", cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
            <Link href="/" className="text-sm font-bold" style={{ color:"var(--blue)" }}>← Home</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[900px] mx-auto px-6 pt-[100px] pb-20 text-center">
        <div className="text-6xl mb-6">📚</div>
        <h1 className="font-extrabold text-4xl mb-4" style={{ letterSpacing:"-.02em" }}>QBank</h1>
        <p className="text-lg mb-10" style={{ color:"var(--text-mid)" }}>4,000+ EMLE-level clinical vignette questions with detailed explanations.</p>
        
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl mb-10" style={{ background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.25)", color:"var(--amber)" }}>
          🚧 Full QBank interface is included in the complete project ZIP. Download to access all features.
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { icon:"⏱", title:"Timed Mode", desc:"100 questions · 3-hour timer · Real EMLE simulation" },
            { icon:"🎓", title:"Tutor Mode", desc:"Instant detailed explanations after each answer" },
            { icon:"🎯", title:"Custom Quiz", desc:"Filter by subject, topic, difficulty, and status" },
          ].map((c,i)=>(
            <div key={i} className="card p-6 text-left">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-base mb-2">{c.title}</h3>
              <p className="text-sm" style={{ color:"var(--text-muted)" }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/" className="btn btn-primary btn-xl">← Back to Home</Link>
      </div>
    </div>
  );
}
