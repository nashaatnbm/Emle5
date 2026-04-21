"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const SAMPLE_QS = [
  { subj:"Internal Medicine", topic:"Cardiology", q:"A 65-year-old woman with hypertension presents with dyspnea on exertion and bilateral ankle edema. Echo shows EF 35%. What is the FIRST-LINE treatment combination?", opts:["Furosemide alone","ACE inhibitor + Beta-blocker + MRA + Diuretic","Calcium channel blocker only","Digoxin only","Aspirin and observation"], correct:1, exp:"HFrEF (EF<40%): Gold standard = ACEI/ARB + Beta-blocker + MRA + Loop diuretic. SGLT2 inhibitors are now added per latest guidelines.", hy:"LVEF <40% = HFrEF · LVEF 40-50% = HFmrEF · LVEF >50% = HFpEF · S3 gallop = Volume overload" },
  { subj:"Pediatrics", topic:"Hematology", q:"An 8-year-old presents with pallor, fatigue, and splenomegaly. Hb 7.5 g/dL, MCV 65, HbA₂ elevated. Both parents are carriers. What is the definitive treatment?", opts:["Iron supplements","Regular blood transfusion + Chelation + Bone Marrow Transplant","Hydroxyurea alone","G-CSF","Splenectomy"], correct:1, exp:"Beta-Thalassemia Major: HbA₂ elevated + Microcytic + carrier parents + Splenomegaly. Treatment: Transfusions every 3-4 weeks + Desferrioxamine (chelation) + BMT = curative.", hy:"Thalassemia Minor: Asymptomatic, slightly elevated HbA₂. Major needs transfusions. Iron overload → Cardiac failure. Hydroxyurea = Sickle Cell, not Thalassemia." },
  { subj:"OB/GYN", topic:"Gynecologic Oncology", q:"A 55-year-old post-menopausal woman presents with vaginal bleeding. Ultrasound shows endometrial thickness of 14mm. What is the MOST important next step?", opts:["Repeat US in 3 months","Hysteroscopy + Directed Endometrial Biopsy","Pap smear only","Laparoscopy","CA-125 alone"], correct:1, exp:"Postmenopausal bleeding + endometrial thickness >4mm = must rule out endometrial cancer. Gold standard: Hysteroscopy + Directed Biopsy (superior to blind sampling).", hy:"Endometrial thickness: <4mm postmenopausal = reassuring. >4mm = Biopsy needed. Risk factors: Obesity, PCOS, Tamoxifen, Unopposed estrogen." },
];

export default function AIGeneratorPage() {
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<typeof SAMPLE_QS>([]);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string|null>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string|null>(null);
  const [credits] = useState(43);

  const [form, setForm] = useState({ subject:"im", topic:"", difficulty:"EMLE-Level", count:"5", weakTarget:false });

  useEffect(() => {
    const t = localStorage.getItem("emle_theme") || "light";
    if (t==="dark") { setDark(true); document.documentElement.classList.add("dark"); }
  }, []);

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),2800); };

  const STEPS = ["Analyzing your request...","Reviewing EMLE medical database...","Generating clinical vignettes...","Crafting options and distractors...","Writing explanations and high-yield points...","Performing quality review..."];

  const generate = async () => {
    if (credits <= 0) { showToast("AI Generations exhausted! Please upgrade your plan."); return; }
    setGenerated([]); setLoading(true); setProgress(0);
    for (let i=0;i<=100;i+=14) { await new Promise(r=>setTimeout(r,300+(Math.random()*200))); setProgress(Math.min(i,100)); }
    await new Promise(r=>setTimeout(r,400));
    const count = parseInt(form.count);
    const shuffled = [...SAMPLE_QS].sort(()=>Math.random()-.5);
    setGenerated(shuffled.slice(0,Math.min(count,shuffled.length)));
    setLoading(false);
    showToast(`✅ Generated ${Math.min(count,SAMPLE_QS.length)} EMLE-level questions successfully!`);
  };

  const addToQBank = (i:number) => { setAdded(s=>new Set(s).add(i)); showToast("📚 Question added to QBank!"); };

  return (
    <div className="min-h-screen" style={{ background:"var(--bg)", color:"var(--text)" }}>
      <nav className="navbar">
        <div className="max-w-[1180px] mx-auto px-6 h-full flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[17px]" style={{ color:"var(--text)" }}>
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center" style={{ background:"var(--blue)", boxShadow:"0 4px 12px rgba(0,87,255,.4)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color:"var(--blue)" }}>QBank</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {[["Home","/"],["QBank","/qbank"],["AI Generator","/ai-generator"],["Pricing","/pricing"],["Dashboard","/dashboard"]].map(([l,h])=>(
              <Link key={h} href={h} className="px-3 py-[7px] rounded-lg text-sm font-semibold" style={{ color:h==="/ai-generator"?"var(--blue)":"var(--text-mid)", background:h==="/ai-generator"?"var(--blue-glow)":"transparent" }}>{l}</Link>
            ))}
          </div>
          <button onClick={()=>{const n=!dark;setDark(n);document.documentElement.classList.toggle("dark",n);localStorage.setItem("emle_theme",n?"dark":"light");}} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border:"1px solid var(--border)", background:"var(--bg-card)", cursor:"pointer" }}>{dark?"☀️":"🌙"}</button>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 pt-[100px] pb-20">
        <div className="mb-8">
          <h1 className="font-extrabold text-3xl mb-2" style={{ letterSpacing:"-.02em" }}>🤖 AI Question Generator</h1>
          <p className="text-base" style={{ color:"var(--text-mid)" }}>Generate custom EMLE-level questions on demand, or upload your notes and let AI create questions from them instantly.</p>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.2)", color:"var(--amber)" }}>🤖 {credits} AI Generations Remaining</div>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* FORM */}
          <div className="card p-6 h-fit sticky top-[84px]">
            <h2 className="text-base font-extrabold mb-5">⚙️ Generation Settings</h2>
            <div className="mb-4"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Subject</label>
              <select value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} className="input-field">
                <option value="im">Internal Medicine</option><option value="surg">General Surgery</option>
                <option value="peds">Pediatrics</option><option value="obg">OB/GYN</option>
                <option value="em">Emergency Medicine</option><option value="mixed">Mixed (All Subjects)</option>
              </select>
            </div>
            <div className="mb-4"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Topic</label>
              <select value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} className="input-field">
                <option value="">All Topics</option>
                {["Cardiology","Pulmonology","Nephrology","Endocrinology","Gastroenterology","Hematology","Neurology","Acute Abdomen","Trauma","Neonatology","Obstetric Emergencies","Toxicology","Resuscitation"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-4"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Difficulty</label>
              <select value={form.difficulty} onChange={e=>setForm(f=>({...f,difficulty:e.target.value}))} className="input-field">
                <option>EMLE-Level (Recommended)</option><option>Hard</option><option>Medium</option><option>Easy</option>
              </select>
            </div>
            <div className="mb-5"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Number of Questions</label>
              <select value={form.count} onChange={e=>setForm(f=>({...f,count:e.target.value}))} className="input-field">
                <option value="3">3 Questions</option><option value="5">5 Questions</option><option value="10">10 Questions</option><option value="20">20 Questions</option>
              </select>
            </div>
            <div className="mb-5"><label className="block text-xs font-bold mb-2" style={{ color:"var(--text-muted)" }}>Upload Notes (PDF / Image / TXT)</label>
              <div className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all" style={{ borderColor:uploadedFile?"var(--green)":"var(--border)", background:uploadedFile?"rgba(16,185,129,.04)":"var(--bg)" }}
                onClick={()=>document.getElementById("file-inp")?.click()}>
                <input id="file-inp" type="file" className="hidden" accept=".pdf,.txt,.jpg,.png" onChange={e=>{if(e.target.files?.[0]){setUploadedFile(e.target.files[0].name);showToast(`📎 "${e.target.files[0].name}" uploaded! AI will generate questions from it.`);}}}/>
                {uploadedFile?<><div className="text-2xl mb-2">✅</div><div className="text-sm font-bold" style={{ color:"var(--green)" }}>{uploadedFile}</div><button onClick={e=>{e.stopPropagation();setUploadedFile(null);}} className="text-xs mt-2" style={{ color:"var(--red)",background:"none",border:"none",cursor:"pointer" }}>Remove</button></>:<><div className="text-3xl mb-2">📄</div><div className="text-sm font-bold" style={{ color:"var(--text-mid)" }}>Drag & drop or click to browse</div><div className="text-xs mt-1" style={{ color:"var(--text-muted)" }}>PDF, TXT, JPG, PNG – Max 10MB</div></>}
              </div>
            </div>
            <label className="flex items-start gap-2 mb-5 p-3 rounded-xl cursor-pointer" style={{ background:"var(--blue-soft)", border:"1px solid rgba(0,87,255,.12)" }}>
              <input type="checkbox" checked={form.weakTarget} onChange={e=>setForm(f=>({...f,weakTarget:e.target.checked}))} style={{ accentColor:"var(--blue)", width:"15px", height:"15px", marginTop:"2px", flexShrink:0 }}/>
              <div><div className="text-sm font-bold">🎯 Target My Weak Areas</div><div className="text-xs" style={{ color:"var(--text-muted)" }}>AI prioritizes your weakest topics</div></div>
            </label>
            <button onClick={generate} disabled={loading} className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2" style={{ background:"linear-gradient(135deg,var(--blue),var(--blue-dark))", border:"none", cursor:loading?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 6px 18px rgba(0,87,255,.35)", opacity:loading?.7:1 }}>
              {loading?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Generating...</>:"✨ Generate Questions Now"}
            </button>
          </div>

          {/* RESULTS */}
          <div>
            {!loading && generated.length===0 && (
              <div className="card p-16 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="font-extrabold text-xl mb-3">AI Ready to Generate</h3>
                <p className="text-sm leading-relaxed" style={{ color:"var(--text-mid)" }}>Choose the subject, topic, and difficulty, then click &quot;Generate Questions&quot;.<br/>You can also upload your notes to generate questions from your own content.</p>
              </div>
            )}

            {loading && (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="font-extrabold text-lg mb-2">AI is working...</h3>
                <p className="text-sm mb-6" style={{ color:"var(--text-muted)" }}>Generating custom EMLE-level questions for you</p>
                <div className="h-1 rounded-full overflow-hidden mx-auto max-w-xs mb-4" style={{ background:"var(--border)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width:`${progress}%`, background:"var(--blue)" }}/>
                </div>
                <div className="text-xs" style={{ color:"var(--text-muted)" }}>{STEPS[Math.floor(progress/17)%STEPS.length]}</div>
              </div>
            )}

            {generated.length>0 && (
              <div>
                <div className="card p-4 flex items-center gap-4 mb-5 flex-wrap">
                  <div className="text-center"><div className="text-2xl font-extrabold" style={{ color:"var(--blue)" }}>{generated.length}</div><div className="text-xs" style={{ color:"var(--text-muted)" }}>Generated</div></div>
                  <div className="w-px h-9" style={{ background:"var(--border)" }}/>
                  <div className="text-center"><div className="text-2xl font-extrabold" style={{ color:"var(--green)" }}>100%</div><div className="text-xs" style={{ color:"var(--text-muted)" }}>EMLE-Level</div></div>
                  <div className="ml-auto flex gap-2">
                    <button onClick={()=>{generated.forEach((_,i)=>addToQBank(i));showToast(`📚 All ${generated.length} questions added to QBank!`);}} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background:"var(--blue)",border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>📚 Add All to QBank</button>
                  </div>
                </div>

                {generated.map((q,i)=>(
                  <div key={i} className="card mb-4 overflow-hidden">
                    <div className="px-5 py-4 flex items-center gap-3 flex-wrap" style={{ background:"var(--bg)", borderBottom:"1px solid var(--border)" }}>
                      <span className="text-xs font-bold" style={{ color:"var(--text-muted)" }}>Question {i+1}</span>
                      <span className="badge badge-blue">{q.subj}</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background:"rgba(245,158,11,.1)", color:"var(--amber)" }}>EMLE-Level</span>
                      <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full" style={{ background:"rgba(139,92,246,.1)", color:"var(--purple)" }}>🤖 AI-Generated</span>
                    </div>
                    <div className="p-5">
                      <p className="text-sm font-semibold leading-relaxed mb-5 p-4 rounded-xl" style={{ borderRight:"3px solid var(--blue)", background:"var(--blue-soft)" }}>{q.q}</p>
                      <div className="flex flex-col gap-2 mb-4">
                        {q.opts.map((opt,j)=>(
                          <div key={j} className="flex items-start gap-2 p-3 rounded-lg border-[1.5px] text-sm" style={{ borderColor:j===q.correct?"var(--green)":"var(--border)", background:j===q.correct?"rgba(16,185,129,.07)":"var(--bg-card)", color:j===q.correct?"var(--green)":"var(--text-mid)", fontWeight:j===q.correct?"700":"400" }}>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ background:j===q.correct?"var(--green)":"var(--border)", color:j===q.correct?"#fff":"var(--text-muted)" }}>{"ABCDE"[j]}</div>
                            {opt}{j===q.correct&&" ✓"}
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl" style={{ background:"var(--blue-soft)", border:"1px solid rgba(0,87,255,.1)" }}>
                        <div className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color:"var(--blue)" }}>💡 Explanation</div>
                        <p className="text-sm leading-relaxed" style={{ color:"var(--text-mid)" }}>{q.exp}</p>
                        <div className="mt-3 p-3 rounded-lg" style={{ background:"rgba(245,158,11,.07)", border:"1px solid rgba(245,158,11,.2)" }}>
                          <div className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color:"var(--amber)" }}>⭐ High-Yield</div>
                          <p className="text-xs leading-relaxed" style={{ color:"var(--text-mid)" }}>{q.hy}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-3 flex gap-2 flex-wrap" style={{ borderTop:"1px solid var(--border)" }}>
                      <button onClick={()=>addToQBank(i)} disabled={added.has(i)} className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-all" style={{ background:added.has(i)?"var(--green)":"var(--blue)", border:"none", cursor:added.has(i)?"default":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{added.has(i)?"✅ Added":"📚 Add to QBank"}</button>
                      <button onClick={()=>showToast("💾 Saved as SmartCard!")} className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background:"var(--bg)", border:"1.5px solid var(--border)", color:"var(--text-mid)", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>🃏 Save as SmartCard</button>
                      <button onClick={()=>showToast("⚑ Reported. Thank you!")} className="px-4 py-2 rounded-lg text-xs font-bold ml-auto" style={{ background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>⚑ Report</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="toast" style={{ opacity:1, transform:"translateY(0)" }}>{toast}</div>}
    </div>
  );
}
